import { createSlice, current } from '@reduxjs/toolkit'
import * as polyline from '@mapbox/polyline';
//import initialStateDebug from '../../debug/bla.json';
import initialStateDebug from '../../debug/stateRouteIsSet.json';
import { setSetupData } from '../setup/setupSlice';
import { setupIsComplete } from '../setup/Setup';

export const sortRoutesByDistance = (routes) => {
    return [...routes].sort((a, b) => {
        return a.coordinates.slice(-1)[0].distance - b.coordinates.slice(-1)[0].distance
    }).map((r, i) => {
        const route = r.customName ? r : Object.assign({}, r, { displayName: `Strecke ${i + 1}` })
        return route
    })
}

export const initialState = {
    originOffRoadMarker: null,
    destinationOffRoadMarker: null,
    offRoadMode: 'origin',
    originOffRoad: null,
    destinationOffRoad: null,
    routes: [],
    routeEdit: true,
    showSidebar: false
}

export const initialStateFuck = initialStateDebug.present.mapbox

export const mapSlice = createSlice({
    name: 'map',
    //initialState: initialStateDebug.present.mapbox,
    initialState: initialState,
    reducers: {
        resetToInitialStateMapbox(state, action) {
            return { ...initialState }
        },
        setShowSidebar(state, action) {
            return {
                ...state,
                showSidebar: action.payload
            }
        },
        toggleRouteEdit(state, action) {
            return {
                ...state,
                routeEdit: action.payload
            }
        },
        setOffRoadMode(state, action) {
            return {
                ...state,
                offRoadMode: action.payload
            }
        },
        setOriginOffRoad(state, action) {
            return {
                ...state,
                originOffRoad: action.payload
            }
        },
        setDestinationOffRoad(state, action) {
            return {
                ...state,
                destinationOffRoad: action.payload
            }
        },
        setRoute(state, action) {
            //if (state.routes.some(route => route.name === action.payload.name)) return // ?? is this realy needed?
            return {
                ...state,
                routes: [{ name: action.payload.name, coordinates: action.payload.coordinates, displayName: "Strecke 1" }]
            }
        },
        resetRoutes(state, action) {
            return {
                ...state,
                routes: []
            }
        },
        setData(state, action) {
            const index = action.payload.index
            const data = { name: action.payload.route, coordinates: action.payload.coordinates, count: action.payload.count, displayName: `Strecke ${index + 1}` }
            const newState = [...state.routes]
            newState.splice(index, 1, data)
            return {
                ...state,
                routes: sortRoutesByDistance([...newState])
            }

        },
        cutRoute(state, action) {

            const { index, routeName } = action.payload

            const routes = current(state.routes)
            const route = routes.filter(x => x.name === routeName)[0]

            // dont cut routes with coordinates smaller 3
            if (route && route.coordinates.length >= 3) {
                const oldRouteName = route.name
                //const oldRouteCoords = route.coordinates
                let routeCoordinates = [...route.coordinates]

                const route2Coords = routeCoordinates.splice(index)
                const route1Coords = routeCoordinates
                route1Coords.push(route2Coords[0])

                const distPartialStep = 20

                const distanceRoute1 = route1Coords.slice(-1)[0].distance

                const route1CoordsRecalculated = route1Coords.map((x, i) => {
                    let distancePartial = distPartialStep * i
                    let distanceReversedPartial = distanceRoute1 - (distPartialStep * i)
                    let oldRouteCoord = i + 1 === route1Coords.length
                        ? Object.assign({}, route.coordinates[i], { engine: true, pressureOut: route.coordinates[0].pressureOut })
                        : route.coordinates[i]

                    return Object.assign(
                        {},
                        // testing stuff
                        { ...oldRouteCoord },
                        {
                            lat: x.lat,
                            lng: x.lng,
                            distance: x.distance,
                            distanceReversed: x.distanceReversed,
                            elevation: x.elevation
                        },
                        {
                            distancePartial,
                            distanceReversedPartial
                        }
                    )
                })


                const distanceRoute2 = route2Coords.slice(-1)[0].distance - route2Coords[0].distance

                const route2CoordsRecalculated = route2Coords.map((x, i) => {
                    let distancePartial = distPartialStep * i
                    let distanceReversedPartial = distanceRoute2 - (distPartialStep * i)
                    return Object.assign(
                        {},
                        {
                            lat: x.lat,
                            lng: x.lng,
                            distance: x.distance,
                            distanceReversed: x.distanceReversed,
                            elevation: x.elevation
                        },
                        {
                            distancePartial,
                            distanceReversedPartial
                        }
                    )
                })

                const route1Name = polyline.encode(route1CoordsRecalculated.map(x => [x.lat, x.lng])/* , precision */)
                const route2Name = polyline.encode(route2CoordsRecalculated.map(x => [x.lat, x.lng])/* , precision */)
                const route1 = { name: route1Name, coordinates: route1CoordsRecalculated, count: route.count }
                const route2 = { name: route2Name, coordinates: route2CoordsRecalculated }

                const newRoutes = state.routes.filter(x => x.name != oldRouteName)

                return {
                    ...state,
                    routes: sortRoutesByDistance([...newRoutes, route1, route2])
                }
            }

            return state
        }
    }/* ,
    extraReducers: {
        [setSetupData]: (state, action) => {
            //console.log("AYE")
            //console.log(current(state), {action})
            //console.log(setupIsComplete(action.payload))
            //const index = state.routes.findIndex(route => route.name === action.payload.route)
        }
    } */
})

export const {
    resetToInitialStateMapbox,
    toggleRouteEdit,
    setShowSidebar,
    setOffRoadMode,
    setOriginOffRoad,
    setDestinationOffRoad,
    setRoute,
    resetRoutes,
    setData,
    cutRoute
} = mapSlice.actions

export default mapSlice.reducer