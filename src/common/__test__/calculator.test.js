import { getHoseLine } from '../../data/hoseline/hoseline'
import { addPressureData, getMinPressure, getNextCurrentPressure, setPressureAndEngine } from '../calculator'

describe('getMinPressure', () => {
    const cases = [
        { hoselineSystem: 'openSystem', fooFactor: 100, expected: 0.1 },
        { hoselineSystem: 'closedSystem', fooFactor: 100, expected: 1.5 },
        { hoselineSystem: 'openSystem', fooFactor: 200, expected: 0.2 },
        { hoselineSystem: 'closedSystem', fooFactor: 200, expected: 3.0 },
        { hoselineSystem: 'openSystem', fooFactor: 50, expected: 0.05 },
        { hoselineSystem: 'closedSystem', fooFactor: 50, expected: 0.75 },
        { hoselineSystem: 'openSystem', fooFactor: 110, expected: 0.11 },
        { hoselineSystem: 'closedSystem', fooFactor: 110, expected: 1.65 }

    ]
    it.each(cases)(
        '$hoselineSystem $fooFactor $expected',
        ({ hoselineSystem, fooFactor, expected }) => {
            expect(getMinPressure(hoselineSystem, fooFactor)).toEqual(expected)
        })
})

describe('getNextCurrentPressure', () => {
    const cases = [
        {
            hoseline: getHoseLine('B1', 400),
            previousPressure: 8,
            prev: { elevation: 100, distance: 0 },
            next: { elevation: 100, distance: 100 },
            expected: 7.7
        },
        {
            hoseline: getHoseLine('B1', 800),
            previousPressure: 8,
            prev: { elevation: 100, distance: 0 },
            next: { elevation: 100, distance: 100 },
            expected: 6.9
        }
    ]
    it.each(cases)('$hoseline.name', ({ hoseline, previousPressure, next, prev, expected }) => {
        expect(getNextCurrentPressure(hoseline, previousPressure, next, prev)).toEqual(expected)
    })
})

describe('setPressureAndEngine', () => {
    const cases = [
        {
            data: {
                nextCurrentPressure: 5.1,
                minPressure: 1.5,
                previousPressure: 5.3,
                pressureDiff: 0.1,
                previousIsEngine: false,
                pressureSystem: 8,
                currentPressure: 5.2
            },
            expected: {
                pressureIn: 5.2,
                pressureOut: 5.2,
                currentPressure: 5.2,
                previousIsEngine: false,
                engine: false
            }
        },
        {
            data: {
                nextCurrentPressure: 5.1,
                minPressure: 1.5,
                previousPressure: 5.3,
                pressureDiff: 0.1,
                previousIsEngine: true,
                pressureSystem: 8,
                currentPressure: 5.2
            },
            expected: {
                pressureIn: 7.9,
                pressureOut: 5.2,
                currentPressure: 5.2,
                previousIsEngine: false,
                engine: false
            }
        },
        {
            data: {
                nextCurrentPressure: 1.5,
                minPressure: 1.5,
                previousPressure: 5.3,
                pressureDiff: 0.1,
                previousIsEngine: false,
                pressureSystem: 8,
                currentPressure: 5.2
            },
            expected: {
                pressureIn: 5.2,
                pressureOut: 8,
                currentPressure: 8,
                previousIsEngine: true,
                engine: true
            }
        }
    ]
    it.each(cases)('', ({ data, expected }) => {
        expect(setPressureAndEngine(data)).toEqual(expected)
    })
})

describe('addPressureData', () => {

    let setupData
    let data
    let dataFar
    let previousSetupData

    beforeAll(() => {
        setupData = {
            volume: 800,
            flow: 800,
            pressureSystem: 8,
            hoselineSize: 'B',
            hoselineCount: 1,
            hoselineSystem: 'closedSystem',
            fooFactor: 100,
            count: 1
        }

        data = [
            { lat: 1, lng: 1, elevation: 100, distance: 0, distanceReversed: 40, distancePartial: 0, distanceReversedPartial: 40 },
            { lat: 2, lng: 2, elevation: 100, distance: 20, distanceReversed: 20, distancePartial: 20, distanceReversedPartial: 20 },
            { lat: 3, lng: 3, elevation: 100, distance: 40, distanceReversed: 0, distancePartial: 40, distanceReversedPartial: 0 }
        ]

        dataFar = [
            { lat: 1, lng: 1, elevation: 100, distance: 0, distanceReversed: 1000, distancePartial: 0, distanceReversedPartial: 1000 },
            { lat: 2, lng: 2, elevation: 100, distance: 600, distanceReversed: 400, distancePartial: 600, distanceReversedPartial: 400 },
            { lat: 3, lng: 3, elevation: 100, distance: 700, distanceReversed: 300, distancePartial: 700, distanceReversedPartial: 300 },
            { lat: 4, lng: 4, elevation: 100, distance: 1000, distanceReversed: 0, distancePartial: 1000, distanceReversedPartial: 0 },
        ]
        previousSetupData = {
            count: 1
        }
    })

    it('no extra engine', () => {
        const expected = [[
            {
                currentPressure: 8,
                distance: 0,
                distanceDiff: 0,
                distancePartial: 0,
                distanceReversed: 40,
                distanceReversedPartial: 40,
                elevation: 100,
                elevationDiff: 0,
                engine: true,
                lat: 1,
                lng: 1,
                pressureDiff: 0,
                pressureIn: 0,
                pressureLossTotal: 0,
                pressureOut: 8
            },
            {
                currentPressure: 7.8,
                distance: 20,
                distanceDiff: 20,
                distancePartial: 20,
                distanceReversed: 20,
                distanceReversedPartial: 20,
                elevation: 100,
                elevationDiff: 0,
                engine: false,
                lat: 2,
                lng: 2,
                pressureDiff: 0.2,
                pressureIn: 7.8,
                pressureLossTotal: 0.2,
                pressureOut: 7.8
            },
            {
                currentPressure: 8,
                distance: 40,
                distanceDiff: 20,
                distancePartial: 40,
                distanceReversed: 0,
                distanceReversedPartial: 0,
                elevation: 100,
                elevationDiff: 0,
                engine: true,
                lat: 3,
                lng: 3,
                pressureDiff: 0.2,
                pressureIn: 7.6,
                pressureLossTotal: 0.4,
                pressureOut: 8
            }
        ], 1]
        expect(addPressureData(data, setupData, 100, 0, previousSetupData)).toEqual(expected)
        //expect(addPressureDataOLD(data, setupData, 800, 0, previousSetupData)).toEqual(expected)
    })
    it('extra engine', () => {
        const expected = [[
            {
                currentPressure: 8,
                distance: 0,
                distanceDiff: 0,
                distancePartial: 0,
                distanceReversed: 1000,
                distanceReversedPartial: 1000,
                elevation: 100,
                elevationDiff: 0,
                engine: true,
                lat: 1,
                lng: 1,
                pressureDiff: 0,
                pressureIn: 0,
                pressureLossTotal: 0,
                pressureOut: 8
            },
            {
                currentPressure: 8,
                distance: 600,
                distanceDiff: 600,
                distancePartial: 600,
                distanceReversed: 400,
                distanceReversedPartial: 400,
                elevation: 100,
                elevationDiff: 0,
                engine: true,
                lat: 2,
                lng: 2,
                pressureDiff: 6,
                pressureIn: 2,
                pressureLossTotal: 6,
                pressureOut: 8
            },
            {
                currentPressure: 7,
                distance: 700,
                distanceDiff: 100,
                distancePartial: 700,
                distanceReversed: 300,
                distanceReversedPartial: 300,
                elevation: 100,
                elevationDiff: 0,
                engine: false,
                lat: 3,
                lng: 3,
                pressureDiff: 1,
                pressureIn: 7,
                pressureLossTotal: 7,
                pressureOut: 7
            },
            {
                currentPressure: 8,
                distance: 1000,
                distanceDiff: 300,
                distancePartial: 1000,
                distanceReversed: 0,
                distanceReversedPartial: 0,
                elevation: 100,
                elevationDiff: 0,
                engine: true,
                lat: 4,
                lng: 4,
                pressureDiff: 3,
                pressureIn: 4,
                pressureLossTotal: 10,
                pressureOut: 8
            }
        ], 1]
        expect(addPressureData(dataFar, setupData, 100, 0, previousSetupData)).toEqual(expected)
        //expect(addPressureDataOLD(dataFar, setupData, 800, 0, previousSetupData)).toEqual(expected)
    })
    it('no extra engine openSystem', () => {
        const setupDataOpen = Object.assign({}, setupData, { hoselineSystem: 'openSystem' })
        const expected = [[
            {
                currentPressure: 8,
                distance: 0,
                distanceDiff: 0,
                distancePartial: 0,
                distanceReversed: 40,
                distanceReversedPartial: 40,
                elevation: 100,
                elevationDiff: 0,
                engine: true,
                lat: 1,
                lng: 1,
                pressureDiff: 0,
                pressureIn: 0,
                pressureLossTotal: 0,
                pressureOut: 8
            },
            {
                currentPressure: 7.8,
                distance: 20,
                distanceDiff: 20,
                distancePartial: 20,
                distanceReversed: 20,
                distanceReversedPartial: 20,
                elevation: 100,
                elevationDiff: 0,
                engine: false,
                lat: 2,
                lng: 2,
                pressureDiff: 0.2,
                pressureIn: 7.8,
                pressureLossTotal: 0.2,
                pressureOut: 7.8
            },
            {
                currentPressure: 8,
                distance: 40,
                distanceDiff: 20,
                distancePartial: 40,
                distanceReversed: 0,
                distanceReversedPartial: 0,
                elevation: 100,
                elevationDiff: 0,
                engine: true,
                lat: 3,
                lng: 3,
                pressureDiff: 0.2,
                pressureIn: 7.6,
                pressureLossTotal: 0.4,
                pressureOut: 8
            }
        ], 1]
        expect(addPressureData(data, setupDataOpen, 800, 0, previousSetupData)).toEqual(expected)
        //expect(addPressureDataOLD(data, setupDataOpen, 800, 0, previousSetupData)).toEqual(expected)
    })
})