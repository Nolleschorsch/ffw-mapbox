import {
    HoseLine,
    BHoseLine100,
    BHoseLine100EinsatzleiterWiki,
    BHoseLine100GrossTwueltedt,
    AHoseLine100EinsatzleiterWiki,
    getHoseLine
} from './hoseline'

describe('HoseLine', () => {
    const h = new HoseLine()
    const properties = [
        'name',
        'display',
        'hoseLength',
        'flowFrictionData100Meter',
        'pressureDifferenceHeight10m',
        'flow',
        'friction'
    ]
    describe('has expected properties', () => {
        it.each(properties)('property %s exists', (property) => {
            expect(h[property]).toBeDefined()
        })
    })
})

describe('BHoseLine100', () => {
    const h = new BHoseLine100(800)
    const propertiesAndValues = [
        ['name', 'B'],
        ['display', 'B-Schlauch (LFS BW)'],
        ['hoseLength', 0.02],
        ['flowFrictionData100Meter', {
            200: 0.1,
            400: 0.3,
            600: 0.6,
            800: 1.0,
            1000: 1.4,
            1200: 2.0
        }],
        ['pressureDifferenceHeight10m', 1],
        ['flow', 800],
        ['friction', 1.0]
    ]
    describe('has expected properties', () => {
        it.each(propertiesAndValues)('property %s has expected value', (property, value) => {
            expect(h[property]).toEqual(value)
        })
    })
})

describe('BHoseLine100EinsatzleiterWiki', () => {
    const h = new BHoseLine100EinsatzleiterWiki(800)
    const propertiesAndValues = [
        ['name', 'B1'],
        ['display', 'B-Schlauch (Einsatzleiterwiki)'],
        ['hoseLength', 0.02],
        ['flowFrictionData100Meter', {
            200: 0.1,
            300: 0.2,
            400: 0.3,
            500: 0.5,
            600: 0.6,
            700: 0.9,
            800: 1.1,
            900: 1.5,
            1000: 1.7,
            1100: 1.9,
            1200: 2.5,
            1300: 2.9,
            1400: 3.45,
            1500: 4.0,
            1600: 4.6,
            1700: 5.2,
            1800: 5.8,
            1900: 6.4,
            2000: 7.0
        }],
        ['pressureDifferenceHeight10m', 1],
        ['flow', 800],
        ['friction', 1.1]
    ]
    describe('has expected properties', () => {
        it.each(propertiesAndValues)('property %s has expected value', (property, value) => {
            expect(h[property]).toEqual(value)
        })
    })
    it('', () => {
        h.setFlow(19999)
        //expect(h.flow).toEqual(2000)
        expect(h.friction).toEqual(7.0)
        h.setFlow(666)
        expect(h.friction).toEqual(0.9)
    })
    /* it.each(Object.keys(h.flowFrictionData100Meter).map(key => {
        return [parseInt(key), h.flowFrictionData100Meter[key]]
    }))('interpoly rules $val => $exp', (val, exp) => {
        expect(h.getFriction(val)).toEqual(exp)
    }) */
})

describe('BHoseLine100GrossTwueltedt', () => {
    const h = new BHoseLine100GrossTwueltedt(800)
    const propertiesAndValues = [
        ['name', 'B2'],
        ['display', 'B-Schlauch (feuerwehr-gross-twuelpstedt.de)'],
        ['hoseLength', 0.02],
        ['flowFrictionData100Meter', {
            200: 0.1,
            300: 0.2,
            400: 0.3,
            500: 0.5,
            600: 0.7,
            700: 0.9,
            800: 1.1,
            900: 1.4,
            1000: 1.7,
            1100: 2.1,
            1200: 2.5
        }],
        ['pressureDifferenceHeight10m', 1],
        ['flow', 800],
        ['friction', 1.1]
    ]
    describe('has expected properties', () => {
        it.each(propertiesAndValues)('property %s has expected value', (property, value) => {
            expect(h[property]).toEqual(value)
        })
    })
})

describe('AHoseLine100EinsatzleiterWiki', () => {
    const h = new AHoseLine100EinsatzleiterWiki(2000)
    const propertiesAndValues = [
        ['name', 'A'],
        ['display', 'A-Schlauch (Einsatzleiterwiki)'],
        ['hoseLength', 0.02],
        ['flowFrictionData100Meter', {
            1000: 0.3,
            1100: 0.35,
            1200: 0.4,
            1300: 0.45,
            1400: 0.5,
            1500: 0.6,
            1600: 0.65,
            1700: 0.75,
            1800: 0.8,
            1900: 0.9,
            2000: 1.0,
            2100: 1.1,
            2200: 1.2,
            2300: 1.3,
            2400: 1.45,
            2500: 1.6,
            2600: 1.75,
            2700: 1.9,
            2800: 2.0,
            2900: 2.15,
            3000: 2.3
        }],
        ['pressureDifferenceHeight10m', 1],
        ['flow', 2000],
        ['friction', 1.0]
    ]
    describe('has expected properties', () => {
        it.each(propertiesAndValues)('property %s has expected value', (property, value) => {
            expect(h[property]).toEqual(value)
        })
    })
})

describe('getHoseLine', () => {
    describe('returns expected hoseline', () => {
        const nameFlowList = [
            ['B', 800, BHoseLine100],
            ['B1', 1000, BHoseLine100EinsatzleiterWiki],
            ['B2', 600, BHoseLine100GrossTwueltedt],
            ['A', 2000, AHoseLine100EinsatzleiterWiki],
            ['Not existing', 800, BHoseLine100],
            [undefined, 1000, BHoseLine100]
        ]
        it.each(nameFlowList)('name %s flow %d returns expected hoseline', (name, flow, hoseline) => {
            const instance = new hoseline(flow)
            expect(getHoseLine(name, flow)).toEqual(instance)
        })
    })
})