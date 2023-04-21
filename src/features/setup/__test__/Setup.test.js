import React from 'react'
import * as Setup from '../Setup'
import * as SetupItem from '../SetupItem';
import * as calculator from '../../../common/calculator'
import * as engine from '../../../data/engine/engines'
import { getValidEngines } from '../../../data/engine/engines';
jest.mock('../SetupItem', () => {
    const originalModule = jest.requireActual('../SetupItem');

    return {
        __esModule: true, // Use it when dealing with esModules
        ...originalModule,
        updateEngine: jest.fn(),
        updateHoselineCount: jest.fn()
    };
})
jest.mock('../../../common/calculator', () => {
    const originalModule = jest.requireActual('../../../common/calculator');

    return {
        __esModule: true, // Use it when dealing with esModules
        ...originalModule,
        //addPressureData: jest.fn(() => [[], 0]),
        addPressureData: jest.fn(),
        default: jest.fn(() => [[], 0])
    };
})
jest.mock('../../../data/engine/engines', () => {
    const originalModule = jest.requireActual('../../../data/engine/engines');

    return {
        __esModule: true, // Use it when dealing with esModules
        ...originalModule,
        getValidEngines: jest.fn().mockImplementationOnce(() => [{ name: "PFP 8/8" }])
            .mockImplementationOnce(() => [])
    };
})



describe('availableTotalVolumes', () => {
    it('', () => {
        expect(Setup.availableTotalVolumes).toEqual([...Array(40).keys()].map(x => {
            let value = (x + 1) * 100
            let name = `${value} Liter/min`
            return { name, value }
        }))
        expect(Setup.availableTotalVolumes.length).toEqual(40)
    })
})

describe('availableHoselines', () => {
    it('', () => {
        expect(Setup.availableHoselines).toEqual([{ name: 'B-Schlauch 20m Einsatzleiter Wiki', value: 'B1', size: 'B' }])
    })
})

describe('availableHoselineCounts', () => {
    it('', () => {
        expect(Setup.availableHoselineCounts).toEqual([
            { name: 'Einfachleitung', value: 1 },
            { name: 'Doppelleitung', value: 2 },
            { name: 'Dreifachleitung', value: 3 },
            { name: 'Vierfachleitung', value: 4 }
        ])
    })
})

describe('availableHoselineSystems', () => {
    it('', () => {
        expect(Setup.availableHoselineSystems).toEqual([
            { name: 'geschlossene Schaltreihe', value: 'closedSystem' },
            { name: 'offene Schaltreihe', value: 'openSystem' }
        ])
    })
})

describe('generateSelectOptions', () => {
    it('returns expected array', () => {
        const arr = [{ value: 'foo', name: 'bar' }]
        expect(Setup.generateSelectOptions(arr)).toEqual([
            <option key={0} value={'foo'}>{'bar'}</option>
        ])
    })
})

describe('setupIsComplete', () => {
    it('returns false on undefined setup', () => {
        expect(Setup.setupIsComplete(undefined)).toBeFalsy()
    })
    it('returns false on incomplete setup', () => {
        const incompleteSetup = {}
        expect(Setup.setupIsComplete(incompleteSetup)).toBeFalsy()
    })
    it('returns true on complete setup', () => {
        /* 
        
            'engineType',
        'volume',
        'pressureSystem',
        'hoselineSize',
        'hoselineCount',
        'hoselineSystem',
        'fooFactor',
        'count',
        'flow',
        'route'
        */
        const completeSetup = {
            engineType: 'foo',
            volume: 42,
            pressureSystem: 8,
            hoselineSize: 'bar',
            hoselineCount: 3,
            hoselineSystem: 'moep',
            fooFactor: 1337,
            count: 1,
            flow: 14,
            route: 'route1'
        }
        expect(Setup.setupIsComplete(completeSetup)).toBeTruthy()
    })
})

/* describe('handleDestinationVolumeChange', () => {
    const dispatch = jest.fn()
    const getState = jest.fn()

    beforeAll(() => {
        //Setup.updateRouteData = jest.fn()
        jest.spyOn(Setup, 'updateRouteData')
    })

    afterAll(() => {
        Setup.updateRouteData.mockRestore()
    })

    it('NaN', () => {
        Setup.handleDestinationVolumeChange({ target: { value: "foo" } })(dispatch, getState)
        expect(dispatch).not.toHaveBeenCalled()
    })
    it('incomplete setups', () => {
        getState.mockImplementation(() => {
            return {
                present: {
                    setup: {
                        setups: [
                            { route: "foo" },
                            { route: "bar" }
                        ]
                    }
                }
            }
        })
        Setup.handleDestinationVolumeChange({ target: { value: "1000" } })(dispatch, getState)
        expect(dispatch).toHaveBeenCalledWith({
            type: 'setup/setDestinationVolume',
            payload: 1000
        })
    })
    it('complete setups', () => {
        getState.mockImplementation(() => {
            return {
                present: {
                    setup: {
                        setups: [
                            { name: "foo", engineType: "foo", volume: 100, pressureSystem: 8, hoselineSize: "B", hoselineCount: 1, hoselineSystem: "foo", fooFactor: 100, count: 1 },
                            { name: "bar", engineType: "baz", volume: 100, pressureSystem: 8, hoselineSize: "B", hoselineCount: 1, hoselineSystem: "bla", fooFactor: 100, count: 1 }
                        ]
                    }
                }
            }
        })
        
        dispatch.mockImplementationOnce(() => { })
            .mockImplementationOnce(() => Setup.updateRouteData())
            .mockImplementationOnce(() => Setup.updateRouteData())

        Setup.handleDestinationVolumeChange({ target: { value: "1000" } })(dispatch, getState)
        expect(Setup.updateRouteData).toHaveBeenCalledTimes(2)
        

    })
}) */

describe('updateRouteData', () => {
    const dispatch = jest.fn()
    const getState = jest.fn()
    //calculator.addPressureData = jest.fn(() => [[], 0])

    beforeEach(() => {
        calculator.addPressureData.mockImplementation(() => [[], 0])
    })

    afterEach(() => {
        calculator.addPressureData.mockReset()
    })

    it('single route, setup incomplete', () => {
        getState.mockImplementation(() => {
            return {
                present: {
                    setup: {
                        setups: [{ route: "foo" }]
                    },
                    mapbox: {
                        routes: [{ name: "foo" }]
                    }
                }
            }
        })
        Setup.updateRouteData("foo")(dispatch, getState)
        expect(dispatch).not.toHaveBeenCalled()
    })
    it('two routes, setups complete', () => {
        getState.mockImplementation(() => {
            return {
                present: {
                    setup: {
                        destinationVolume: 100,
                        setups: [
                            { route: "foo", engineType: "PFP 8/8", volume: 100, pressureSystem: 8, hoselineSize: "B", hoselineCount: 1, hoselineSystem: "foo", fooFactor: 100, count: 1, flow: 100 },
                            { route: "bar", engineType: "PFP 8/8", volume: 100, pressureSystem: 8, hoselineSize: "B", hoselineCount: 1, hoselineSystem: "bla", fooFactor: 100, count: 1, flow: 100 },
                            { route: "baz", engineType: "Nope", volume: 100, pressureSystem: 8, hoselineSize: "B", hoselineCount: 1, hoselineSystem: "bla", fooFactor: 100, count: 1, flow: 100 }
                        ]
                    },
                    mapbox: {
                        routes: [
                            { name: "foo", coordinates: [{ pressureIn: 4 }] },
                            { name: "bar", coordinates: [{ pressureIn: 4 }] },
                            { name: "baz", coordinates: [{ pressureIn: 4 }] },
                        ]
                    }
                }
            }
        })
        dispatch.mockImplementationOnce(() => SetupItem.updateEngine())
            .mockImplementationOnce(() => SetupItem.updateHoselineCount())
        //calculator.addPressureData.mockImplementation(() => [[], 0])
        //jest.spyOn(calculator, 'addPressureData')
        //calculator.addPressureData = jest.fn()
        Setup.updateRouteData("foo")(dispatch, getState)
        expect(calculator.addPressureData).toHaveBeenCalled()
    })
})

/* describe('updateRouteData', () => {
    let store
    let initialStateFn
    let initialState
    describe('single route, setup incomplete', () => {
        beforeEach(() => {
            initialStateFn = createState(initialStateSingleRouteEmptySetup)
            store = mockStore(initialStateFn)
        })
        it('shouldnt dispatch any actions', () => {
            store.dispatch(Setup.updateRouteData('yfriH}ldr@Ne@Ti@Vi@Vg@Vi@Vi@Vg@Ti@Vg@Vi@Vg@Vi@Vg@Vg@Vi@'))
            expect(store.getActions()).toHaveLength(0)
        })
    })
    describe('two routes, setups complete', () => {
        beforeEach(() => {
            initialStateFn = createState(initialStateTwoRoutesCompleteSetups)
            store = mockStore(initialStateFn)
        })
        it('should update both setups', () => {
            store.dispatch(Setup.updateRouteData('yfriH}ldr@Ne@Ti@Vi@Vg@Vi@Vi@Vg@Ti@'))
            expect(store.getActions()).toHaveLength(6)
        })
    })
}) */

describe('updateSetup', () => {
    const dispatch = jest.fn()
    const getState = jest.fn()

    afterEach(() => {
        getState.mockReset()
    })

    it('first setup complete', () => {
        getState.mockImplementation(() => ({
            present: {
                setup: {
                    destinationVolume: 800,
                    setups: [
                        {
                            route: "Foo",
                            engineType: "PFP 8/8",
                            hoselineSize: "B",
                            hoselineCount: 1
                        }
                    ]
                }
            }
        }))
        expect(Setup.updateSetup("Foo")(dispatch, getState)).toEqual({
            route: 'Foo',
            engineType: 'PFP 8/8',
            volume: 800,
            maxVolume: 800,
            count: 1,
            pressureSystem: 8,
            hoselineSize: 'B',
            hoselineCount: 1,
            flow: 800
        })
    })

    it('first setup incomplete', () => {
        getState.mockImplementation(() => ({
            present: {
                setup: {
                    destinationVolume: 800,
                    setups: [
                        {
                            route: "Foo",
                            engineType: "PFP 8/8",
                            hoselineSize: "",
                            hoselineCount: 1
                        }
                    ]
                }
            }
        }))
        expect(Setup.updateSetup("Foo")(dispatch, getState)).toEqual({
            route: 'Foo',
            engineType: 'PFP 8/8',
            volume: 800,
            maxVolume: 800,
            count: 1,
            pressureSystem: 8,
            hoselineSize: '',
            hoselineCount: '',
            flow: ''
        })
    })

    it('first setup no engine', () => {
        getState.mockImplementation(() => ({
            present: {
                setup: {
                    destinationVolume: 800,
                    setups: [
                        {
                            route: "Foo",
                            engineType: "",
                            hoselineSize: "",
                            hoselineCount: ""
                        }
                    ]
                }
            }
        }))
        expect(Setup.updateSetup("Foo")(dispatch, getState)).toEqual({
            route: 'Foo',
            engineType: '',
            volume: '',
            maxVolume: '',
            count: '',
            pressureSystem: '',
            hoselineSize: '',
            hoselineCount: '',
            flow: ''
        })
    })

    it('second setup', () => {
        getState.mockImplementation(() => ({
            present: {
                setup: {
                    destinationVolume: 800,
                    setups: [
                        {
                            route: "Foo",
                            engineType: "PFP 8/8",
                            hoselineSize: "B",
                            hoselineCount: 1
                        },
                        {
                            route: "Bar"
                        }
                    ]
                }
            }
        }))
        getValidEngines.mockImplementationOnce(() => [
            { name: "WOOP" }
        ])
        expect(Setup.updateSetup("Bar")(dispatch, getState)).toEqual({
            route: 'Bar',
            engineType: '',
            volume: '',
            maxVolume: '',
            count: '',
            pressureSystem: '',
            hoselineSize: '',
            hoselineCount: '',
            flow: ''
        })
    })
})

describe('updateRoute', () => {
    const dispatch = jest.fn()
    const getState = jest.fn()
    //Setup.setupIsComplete = jest.fn(() => true)    
    //calculator.addPressureData = jest.fn()
    beforeEach(() => {
        calculator.addPressureData.mockImplementation(() => [[], 0])
    })

    //calculator.addPressureData = jest.fn(() => [[], 0])
    afterEach(() => {
        calculator.addPressureData.mockReset()
    })


    it('first route complete setup', () => {
        getState.mockImplementation(() => ({
            present: {
                setup: {
                    destinationVolume: 800,
                    setups: [
                        {
                            route: "Foo",
                            engineType: 'PFP 8/8',
                            volume: 42,
                            pressureSystem: 8,
                            hoselineSize: 'B',
                            hoselineCount: 1,
                            hoselineSystem: 'closedSystem',
                            fooFactor: 100,
                            count: 1,
                            flow: 42
                        }
                    ]
                },
                mapbox: {
                    routes: [
                        {
                            name: "Foo",
                            coordinates: [
                                {}
                            ]
                        }
                    ]
                }
            }
        }))
        Setup.updateRoute("Foo")(dispatch, getState)
        expect(calculator.addPressureData).toHaveBeenCalled()
        //Setup.setupIsComplete.mockRestore()
    })
    it('second route complete setup', () => {
        getState.mockImplementation(() => ({
            present: {
                setup: {
                    destinationVolume: 800,
                    setups: [
                        {
                            route: "Foo"
                        },
                        {
                            route: "Bar",
                            engineType: 'PFP 8/8',
                            volume: 42,
                            pressureSystem: 8,
                            hoselineSize: 'B',
                            hoselineCount: 1,
                            hoselineSystem: 'closedSystem',
                            fooFactor: 100,
                            count: 1,
                            flow: 42
                        }
                    ]
                },
                mapbox: {
                    routes: [
                        {
                            name: "Foo",
                            coordinates: [
                                {}
                            ]
                        },
                        {
                            name: "Bar",
                            coordinates: [
                                {}
                            ]
                        }
                    ]
                }
            }
        }))
        Setup.updateRoute("Bar")(dispatch, getState)
        expect(calculator.addPressureData).toHaveBeenCalled()
        //Setup.setupIsComplete.mockRestore()
    })
    it('first route incomplete setup', () => {
        getState.mockImplementation(() => ({
            present: {
                setup: {
                    destinationVolume: 800,
                    setups: [
                        {
                            route: "Foo",
                        }
                    ]
                },
                mapbox: {
                    routes: [
                        {
                            name: "Foo",
                            coordinates: [
                                {}
                            ]
                        }
                    ]
                }
            }
        }))
        Setup.updateRoute("Foo")(dispatch, getState)
        expect(calculator.addPressureData).not.toHaveBeenCalled()
    })
})

describe('getEngineOptions', () => {
    it('returns expected array index == 0', () => {
        expect(Setup.getEngineOptions(0, {})).toHaveLength(14)
    })
    it('returns expected array index != 0', () => {
        getValidEngines.mockImplementation(() => [{name: "PFP 8/8"}])
        const setup = {
            setups: [
                {maxVolume: 800, flow: 800},
                {}
            ]
        }
        expect(Setup.getEngineOptions(1, setup)).toHaveLength(1)
    })
})

describe('getHoselineOptions', () => {
    it('returns expected array engine undefined', () => {
        expect(Setup.getHoselineOptions(undefined)).toEqual([])
    })
    it('returns expected array engine defined', () => {
        const engine = {sizes: ['B']}
        expect(Setup.getHoselineOptions(engine)).toHaveLength(1)
    })
})

describe('getHoselineCountOptions', () => {
    it('returns expected array engine or r.hoselineSize undefined', () => {
        expect(Setup.getHoselineCountOptions(undefined, {})).toEqual([])
        expect(Setup.getHoselineCountOptions(undefined, {hoselineSize: 'B'})).toEqual([])
        expect(Setup.getHoselineCountOptions({name: 'PFP 8/8'}, {})).toEqual([])
    })
    it('returns expected array engine and r.hoselineSize defined', () => {
        const engine = { exitPoints: {'B': 2} }
        const setup = {hoselineSize: 'B'}
        expect(Setup.getHoselineCountOptions(engine, setup)).toHaveLength(2)
    })
})