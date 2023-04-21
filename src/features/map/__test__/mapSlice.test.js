import * as polyline from '@mapbox/polyline'
import reducer, {
    initialState,
    setShowSidebar,
    toggleRouteEdit,
    setOffRoadMode,
    setOriginOffRoad,
    setDestinationOffRoad,
    setRoute,
    resetRoutes,
    setData,
    cutRoute,
    sortRoutesByDistance
} from '../mapSlice'

describe('sortRoutesByDistance', () => {
    const routeFoo = {
        name: 'Foo',
        displayName: 'Strecke 1',
        customName: false,
        coordinates: [
            { distance: 0 },
            { distance: 100 }
        ]
    }
    const routeBar = {
        name: 'Bar',
        displayName: 'BarRoute',
        customName: true,
        coordinates: [
            { distance: 100 },
            { distance: 200 }
        ]
    }
    const routeBaz = {
        name: 'Baz',
        displayName: 'Strecke 3',
        customName: false,
        coordinates: [
            { distance: 200 },
            { distance: 300 }
        ]
    }

    it('returns expected order with customnames', () => {
        
        const routes = [routeBaz, routeFoo, routeBar]
        expect(sortRoutesByDistance(routes)).toEqual([
            routeFoo, routeBar, routeBaz
        ])
    })
})

describe('routeSlice', () => {
    it('initialState has expected values', () => {
        expect(initialState).toEqual({
            originOffRoadMarker: null,
            destinationOffRoadMarker: null,
            offRoadMode: 'origin',
            originOffRoad: null,
            destinationOffRoad: null,
            routes: [],
            routeEdit: true,
            showSidebar: false
        })
    })
    it('should return initialState', () => {
        expect(reducer(undefined, {})).toEqual(initialState)
    })
    it('should handle setShowSidebar', () => {
        expect(reducer(initialState, setShowSidebar(true)).showSidebar).toBeTruthy()
        expect(reducer(initialState, setShowSidebar(false)).showSidebar).toBeFalsy()
    })
    it('should handle toggleRouteEdit', () => {
        expect(reducer(initialState, toggleRouteEdit(false)).routeEdit).toBeFalsy()
        expect(reducer(initialState, toggleRouteEdit(true)).routeEdit).toBeTruthy()
    })
    it('should handle setOffRoadMode', () => {
        expect(reducer(initialState, setOffRoadMode('destination')).offRoadMode).toEqual('destination')
        expect(reducer(initialState, setOffRoadMode(null)).offRoadMode).toEqual(null)
    })
    it('should handle setOriginOffRoad', () => {
        expect(reducer(initialState, setOriginOffRoad([1, 1])).originOffRoad).toEqual([1, 1])
    })
    it('should handle setDestinationOffRoad', () => {
        expect(reducer(initialState, setDestinationOffRoad([1, 1])).destinationOffRoad).toEqual([1, 1])
    })
    // TODO: rename setRoute into something more descriptive
    it('should handle setRoute', () => {
        const result = reducer(initialState, setRoute({ name: "foo", coordinates: [] }))
        expect(result.routes).toHaveLength(1)
        expect(result.routes[0].name).toEqual("foo")
        expect(result.routes[0].coordinates).toEqual([])
        expect(result.routes[0].displayName).toEqual("Strecke 1")
    })
    it('should handle resetRoutes', () => {
        const previousState = { routes: [{ name: "foo", coordinates: [{ lat: 1, lng: 1 }, { lat: 2, lng: 2 }] }] }
        expect(reducer(previousState, resetRoutes())).toEqual({ routes: [] })
    })
    it('cutRoute route doesnt exists', () => {
        const previousState = { routes: [{ name: "foo" }] }
        expect(reducer(previousState, cutRoute({ index: 1, routeName: "bar" }))).toEqual(previousState)
    })
    it('cutRoute route does exists but too short', () => {
        const previousState = { routes: [{ name: "foo", coordinates: [{ lat: 1, lng: 1 }, { lat: 2, lng: 2 }] }] }
        expect(reducer(previousState, cutRoute({ index: 1, routeName: "foo" }))).toEqual(previousState)
    })
    it('cutRoute route does exist', () => {
        const previousState = {
            routes: [
                {
                    name: "foo",
                    coordinates: [
                        { lat: 1, lng: 1, distance: 0, distanceReversed: 40, distancePartial: 0, distanceReversedPartial: 40, elevation: 42 },
                        { lat: 2, lng: 2, distance: 20, distanceReversed: 20, distancePartial: 20, distanceReversedPartial: 20, elevation: 42 },
                        { lat: 3, lng: 3, distance: 40, distanceReversed: 0, distancePartial: 40, distanceReversedPartial: 0, elevation: 42 }
                    ]
                }
            ]
        }
        const name1 = polyline.encode([[1, 1], [2, 2]])
        const name2 = polyline.encode([[2, 2], [3, 3]])
        expect(reducer(previousState, cutRoute({ index: 1, routeName: "foo" }))).toEqual({
            routes: [
                {
                    name: name1,
                    displayName: "Strecke 1",
                    coordinates: [
                        { lat: 1, lng: 1, distance: 0, distanceReversed: 40, distancePartial: 0, distanceReversedPartial: 20, elevation: 42 },
                        { lat: 2, lng: 2, distance: 20, distanceReversed: 20, distancePartial: 20, distanceReversedPartial: 0, elevation: 42, pressureOut: undefined, engine: true }
                    ],
                    count: undefined
                },
                {
                    name: name2,
                    displayName: "Strecke 2",
                    coordinates: [
                        { lat: 2, lng: 2, distance: 20, distanceReversed: 20, distancePartial: 0, distanceReversedPartial: 20, elevation: 42 },
                        { lat: 3, lng: 3, distance: 40, distanceReversed: 0, distancePartial: 20, distanceReversedPartial: 0, elevation: 42 }
                    ],
                    count: undefined
                }
            ]
        })
    })
    it('setData', () => {
        const previousState = { routes: [] }
        expect(reducer(previousState, setData({ index: 0, coordinates: [], route: "foo" }))).toEqual(
            { routes: [{ coordinates: [], name: "foo", count: undefined, displayName: "Strecke 1" }] }
        )

    })
})