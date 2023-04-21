import * as polyline from '@mapbox/polyline'
import * as turf from '@turf/turf'
import * as effectfunctions from '../effectfunctions'
import * as mapfunctions from '../mapfunctions'
import * as colors from '../../../common/colors'
import * as mapSlice from '../../../features/map/mapSlice'

jest.mock('../../../common/colors', () => {
    const originalModule = jest.requireActual('../../../common/colors');
    return {
        __esModule: true,
        ...originalModule,
        getRouteColor: jest.fn()
    };
});
jest.mock('../../../features/map/mapSlice', () => {
    const originalModule = jest.requireActual('../../../features/map/mapSlice');
    return {
        __esModule: true,
        ...originalModule,
        setShowSidebar: jest.fn()
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

jest.mock('@turf/turf', () => {
    const originalModule = jest.requireActual('@turf/turf');
    return {
        __esModule: true,
        ...originalModule,
        lineString: jest.fn(),
        bbox: jest.fn()
    };
});

describe('someRouteFunction', () => {
    const dispatch = jest.fn()
    const getState = jest.fn()
    const map = {
        fitBounds: jest.fn(() => Promise.resolve("bla")),
        once: jest.fn(() => Promise.resolve("bla")),
        queryTerrainElevation: jest.fn(() => 10)
    }
    const directions = {
        removeRoutes: jest.fn()
    }
    polyline.decode = jest.fn(() => [[1, 1], [2, 2], [3, 3]])
    mapfunctions.extendRouteWithOffRoad = jest.fn(() => 'mockLineString')
    mapfunctions.getRouteDataWithDistance = jest.fn(() => [
        {lng: 1, lat: 1, distance: 0, distanceReversed: 0, distancePartial: 0, distanceReversedPartial: 0}
    ])
    //turf.lineString = jest.fn()
    //turf.bbox = jest.fn()
    it('', async () => {
        turf.bbox.mockImplementation(() => [1, 1, 3.1, 3.2])
        getState.mockImplementation(() => {
            return {
                present: {
                    mapbox: {
                        originOffRoad: [1.1, 1.2],
                        destinationOffRoad: [3.1, 3.2]
                    }
                }
            }
        })
        const event = { route: [{ geometry: '' }] }
        effectfunctions.someRouteFunction(event, { directions, map })(dispatch, getState)
        expect(polyline.decode).toHaveBeenCalledWith('')
        //expect(turf.lineString).toHaveBeenCalledWith([[1,1], [2,2], [3,3]])
        expect(mapfunctions.extendRouteWithOffRoad).toHaveBeenCalledWith(
            [1.1, 1.2],
            [[1, 1], [2, 2], [3, 3]],
            [3.1, 3.2]
        )
        expect(turf.bbox).toHaveBeenCalledWith('mockLineString')
        /* expect(map.fitBounds).resolves.toHaveBeenCalledWith([[1, 1], [3.1, 3.2]])
        expect(map.once).resolves.toHaveBeenCalledWith('idle') */
        expect(map.fitBounds).toHaveBeenCalledWith([[1, 1], [3.1, 3.2]])
        //() => expect(map.fitBounds).resolves.toEqual('bla')
        expect(await map.fitBounds()).toEqual('bla')
        //await expect(map.fitBounds).resolves.toEqual("bla")
        expect(map.once).toHaveBeenCalledWith('idle')
        expect(await map.once()).toEqual('bla')
        expect(mapfunctions.getRouteDataWithDistance).toHaveBeenCalled()
    })
})

describe('renderMarkers', () => {
    const dispatch = jest.fn()
    const getState = jest.fn(() => {
        return {
            present: {
                mapbox: {
                    /* routes: [
                        {
                            name: "foo",
                            coordinates: [{lat: "4", lng: "2"}]
                        },
                        {
                            name: "bar",
                            coordinates: []
                        }
                    ] */
                },
                setup: {
                    /* setups: [
                        {route: "foo"},
                        {route: "bar"}
                    ] */
                }
            }
        }
    })
    jest.spyOn(mapfunctions, 'getEnginePositions')
    it('', () => {
        mapfunctions.getEnginePositions.mockImplementation(() => {
            return {
                "42": {
                    lat: 4,
                    lng: 2
                },
                "69": {
                    lat: 6,
                    lng: 9
                }
            }
        })
        const markerMock = { remove: jest.fn() }
        const refs = {
            map: undefined,
            engineMarkers: [markerMock],
            setEngineMarkers: jest.fn()
        }
        effectfunctions.renderMarkers(refs)(dispatch, getState)
        expect(markerMock.remove).toHaveBeenCalled()
    })
})

describe('removeSourceAndLayer', () => {
    const map = {
        getLayer: jest.fn(),
        getSource: jest.fn(),
        removeLayer: jest.fn(),
        removeSource: jest.fn()
    }

    afterEach(() => {
        map.getLayer.mockReset()
        map.getSource.mockReset()
        map.removeLayer.mockReset()
        map.removeSource.mockReset()
    })

    it('removes source and layer if they exist', () => {
        map.getLayer.mockImplementation(() => true)
        map.getSource.mockImplementation(() => true)
        effectfunctions.removeSourceAndLayer(map, "foobar")
        expect(map.removeLayer).toHaveBeenCalledWith("foobar")
        expect(map.removeSource).toHaveBeenCalledWith("foobar")
    })
    it('doesnt remove source and layer if source doesnt exist', () => {
        map.getLayer.mockImplementation(() => true)
        map.getSource.mockImplementation(() => false)
        effectfunctions.removeSourceAndLayer(map, "foobar")
        expect(map.removeLayer).not.toHaveBeenCalled()
        expect(map.removeSource).not.toHaveBeenCalled()
    })
    it('doesnt remove source and layer if layer doesnt exist', () => {
        map.getLayer.mockImplementation(() => false)
        map.getSource.mockImplementation(() => true)
        effectfunctions.removeSourceAndLayer(map, "foobar")
        expect(map.removeLayer).not.toHaveBeenCalled()
        expect(map.removeSource).not.toHaveBeenCalled()
    })
    it('doesnt remove source and layer if both dont exist', () => {
        map.getLayer.mockImplementation(() => false)
        map.getSource.mockImplementation(() => false)
        effectfunctions.removeSourceAndLayer(map, "foobar")
        expect(map.removeLayer).not.toHaveBeenCalled()
        expect(map.removeSource).not.toHaveBeenCalled()
    })
})

describe('createGeoJSONLineSource', () => {
    it('returns expected value', () => {
        const coordinates = [[1, 1], [2, 2], [3, 3]]
        const name = "foobar"
        expect(effectfunctions.createGeoJSONLineSource(coordinates, name)).toEqual({
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': coordinates
                }
            },
            'promoteId': name
        })
    })
})

describe('createLineLayer', () => {
    it('returns expected value', () => {
        const props = {
            routeLayerName: "foobarLayer",
            routeSourceName: "foobarSource",
            routeColor: '#0000ff',
            lineWidth: 8,
            lineGapeWidth: 0
        }
        expect(effectfunctions.createLineLayer(props)).toEqual({
            'id': props.routeLayerName,
            'type': 'line',
            'source': props.routeSourceName,
            'layout': {
                'visibility': 'visible',
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': props.routeColor,
                'line-width': props.lineWidth,
                'line-gap-width': props.lineGapWidth
            }
        })
    })
})

describe('updateSourcesAndLayers', () => {
    const dispatch = jest.fn()
    const getState = jest.fn()
    const map = {
        getSource: jest.fn(),
        getLayer: jest.fn(),
        addSource: jest.fn(),
        addLayer: jest.fn().mockReturnThis(),
        on: jest.fn(() => dispatch(mapSlice.setShowSidebar(true)))
    }
    //jest.spyOn(effectfunctions, "removeSourceAndLayer")
    it('', () => {
        getState.mockImplementation(() => {
            return {
                past: [{
                    mapbox: {
                        routes: [{ name: "foo" }]
                    }
                }],
                present: {
                    mapbox: {
                        routes: [
                            { name: "bar", coordinates: [{ lat: 4, lng: 2 }] },
                            { name: "bla", coordinates: [{ lat: 6, lng: 9 }] }
                        ]
                    },
                    setup: {
                        setups: [
                            { route: "bar" },
                            { route: "bla", hoselineCount: 2 }
                        ]
                    }
                },
                future: [{
                    mapbox: {
                        routes: [{ name: "baz" }]
                    }
                }]
            }
        })
        map.getSource
            .mockImplementationOnce(() => true)
            .mockImplementationOnce(() => false)
        effectfunctions.updateSourcesAndLayers(map)(dispatch, getState)
        expect(map.on).toHaveBeenCalled()
        expect(mapSlice.setShowSidebar).toHaveBeenCalled()
    })
})