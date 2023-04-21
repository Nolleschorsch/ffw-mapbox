import * as polyline from '@mapbox/polyline'
import * as turf from '@turf/turf'
import * as mapfunctions from '../mapfunctions'
import { OFFROAD_THRESHOLD } from '../constants';

jest.mock('@turf/turf', () => {
    const originalModule = jest.requireActual('@turf/turf');
    return {
        __esModule: true,
        ...originalModule,
        along: jest.fn(),
        length: jest.fn(),
        lineString: jest.fn()
    };
});

jest.mock('@mapbox/polyline', () => {
    const originalModule = jest.requireActual('@mapbox/polyline');
    return {
        __esModule: true,
        ...originalModule,
        decode: jest.fn()
    };
})

describe('extendRouteWithOffRoad', () => {
    it('distanceOrigin and distanceDestination bigger than OFFROAD_THRESHOLD', () => {
        turf.length.mockImplementation(() => (OFFROAD_THRESHOLD + 1) / 1000)
        //turf.length()
        mapfunctions.extendRouteWithOffRoad([1, 1], [[2, 2], [3, 3]], [4, 4])
        expect(turf.lineString).toHaveBeenCalledWith([
            [1, 1], [2, 2], [3, 3], [4, 4]
        ])
    })
    it('distanceOrigin bigger, distanceDestination smaller than OFFROAD_THRESHOLD', () => {
        turf.length
            .mockImplementationOnce(() => (OFFROAD_THRESHOLD + 1) / 1000)
            .mockImplementationOnce(() => (OFFROAD_THRESHOLD - 1) / 1000)
        mapfunctions.extendRouteWithOffRoad([1, 1], [[2, 2], [3, 3]], [4, 4])
        expect(turf.lineString).toHaveBeenCalledWith([
            [1, 1], [2, 2], [3, 3]
        ])
    })
    it('distanceOrigin smaller, distanceDestination bigger than OFFROAD_THRESHOLD', () => {
        turf.length
            .mockImplementationOnce(() => (OFFROAD_THRESHOLD - 1) / 1000)
            .mockImplementationOnce(() => (OFFROAD_THRESHOLD + 1) / 1000)
        mapfunctions.extendRouteWithOffRoad([1, 1], [[2, 2], [3, 3]], [4, 4])
        expect(turf.lineString).toHaveBeenCalledWith([
            [2, 2], [3, 3], [4, 4]
        ])
    })
    it('distanceOrigin and distanceDestination smaller than OFFROAD_THRESHOLD', () => {
        turf.length
            .mockImplementationOnce(() => (OFFROAD_THRESHOLD - 1) / 1000)
            .mockImplementationOnce(() => (OFFROAD_THRESHOLD - 1) / 1000)
        mapfunctions.extendRouteWithOffRoad([1, 1], [[2, 2], [3, 3]], [4, 4])
        expect(turf.lineString).toHaveBeenCalledWith([
            [2, 2], [3, 3]
        ])
    })
})

describe('cutCustomRouteAndUpdateSetup', () => {
    let dispatch
    let getState
    it('route did cut', () => {
        dispatch = jest.fn()
        getState = jest.fn()
            .mockImplementationOnce(() => {
                return {
                    present: {
                        mapbox: {
                            routes: [{name: "foo"}]
                        }
                    }
                }
            })
            .mockImplementationOnce(() => {
                return {
                    present: {
                        mapbox: {
                            routes: [{name: "bar"}, {name: "baz"}]
                        }
                    }
                }
            })
            .mockImplementationOnce(() => {
                return {
                    present: {
                        setup: {
                            setups: [{route: "foo"}]
                        }
                    }
                }
            })
        const routeName = "foo", index = 0
        mapfunctions.cutCustomRouteAndUpdateSetup({ routeName, index })(dispatch, getState)
        expect(dispatch).toHaveBeenCalledWith({type: 'map/cutRoute', payload: {routeName, index}})
        expect(dispatch).toHaveBeenCalledWith({type: 'setup/removeSetup', payload: routeName})
        expect(dispatch).toHaveBeenCalledWith({
            type: 'setup/addSetup',
            payload: {routeName: "bar", index: 0, customName: false}
        })
        expect(dispatch).toHaveBeenCalledWith({
            type: 'setup/updateSetup',
            payload: {index: 0, data: {route: "bar"}}
        })
        expect(dispatch).toHaveBeenCalledWith({
            type: 'setup/addSetup',
            payload: {routeName: "baz", index: 1, customName: false}
        })
        dispatch.mockReset()
        getState.mockReset()
    })
    it('route didnt cut', () => {
        dispatch = jest.fn()
        getState = jest.fn(() => {return {present: {mapbox: {routes: [1]}}}})
        const routeName = "foo", index = 0
        mapfunctions.cutCustomRouteAndUpdateSetup({ routeName, index })(dispatch, getState)
        expect(dispatch).toHaveBeenCalledWith({type: 'map/cutRoute', payload: {routeName, index}})
        expect(dispatch).toHaveBeenCalledTimes(1)
    })
})

describe('getLngLatWaypointsFromGeometry', () => {
    polyline.decode.mockImplementation(() => [[1, 1], [1, 2]])
    const result = mapfunctions.getLngLatWaypointsFromGeometry('foobar')
    expect(polyline.decode).toHaveBeenCalledWith('foobar')
    expect(result).toEqual([[1, 1], [2, 1]])
})

describe('getTurfAlong', () => {
    turf.along.mockImplementation(() => {
        return {
            geometry: {
                coordinates: [1, 2]
            }
        }
    })
    const result = mapfunctions.getTurfAlong('line', 20)
    expect(turf.along).toHaveBeenCalledWith('line', 20)
    expect(result).toEqual([1, 2])
    turf.along.mockReset()
})

describe('getRouteDataWithDistance', () => {
    turf.length.mockImplementation(() => 0.04)
    turf.along
        .mockImplementationOnce(() => {
            return {
                geometry: {
                    coordinates: [1, 2]
                }
            }
        })
        .mockImplementationOnce(() => {
            return {
                geometry: {
                    coordinates: [2, 2]
                }
            }
        })
        .mockImplementationOnce(() => {
            return {
                geometry: {
                    coordinates: [3, 2]
                }
            }
        })
    const result = mapfunctions.getRouteDataWithDistance('line')
    expect(turf.length).toHaveBeenCalledWith('line')
    expect(turf.along).toHaveBeenCalledTimes(3)
    expect(result).toEqual([
        {
            distance: 0,
            distancePartial: 0,
            distanceReversed: 40,
            distanceReversedPartial: 40,
            lat: 2,
            lng: 1
        },
        {
            distance: 20,
            distancePartial: 20,
            distanceReversed: 20,
            distanceReversedPartial: 20,
            lat: 2,
            lng: 2
        },
        {
            distance: 40,
            distancePartial: 40,
            distanceReversed: 0,
            distanceReversedPartial: 0,
            lat: 2,
            lng: 3
        }
    ])
    turf.along.mockReset()
    turf.length.mockReset()
})

describe('getEnginePositions', () => {
    it('', () => {
        const routes = [
            {
                name: 'foo',
                coordinates: [
                    { lat: 1, lng: 1, engine: true },
                    { lat: 1, lng: 2, engine: false },
                    { lat: 2, lng: 2, engine: true }
                ]
            },
            {
                name: 'bar',
                coordinates: [
                    { lat: 2, lng: 2, engine: true },
                    { lat: 3, lng: 3, engine: true },
                    { lat: 4, lng: 4, engine: true },
                ]
            },
        ]
        const setupData = {
            setups: [
                { route: 'foo' },
                { route: 'bar' },
            ]
        }
        const result = mapfunctions.getEnginePositions(routes, setupData)
        expect(result).toEqual({
            "11": { cuttable: false, engine: true, index: 0, lat: 1, lng: 1, name: "foo", setup: { route: "foo" } },
            "22": { cuttable: false, engine: true, index: 0, lat: 2, lng: 2, name: "bar", setup: { route: "bar" } },
            "33": { cuttable: true, engine: true, index: 1, lat: 3, lng: 3, name: "bar", setup: { route: "bar" } },
            "44": { cuttable: false, engine: true, index: 2, lat: 4, lng: 4, name: "bar", setup: { route: "bar" } }
        })
    })
})