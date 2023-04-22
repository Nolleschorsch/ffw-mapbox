import * as polyline from '@mapbox/polyline';
import { along, length, lineString } from '@turf/turf';
import { OFFROAD_THRESHOLD } from './constants'
import { cutRoute } from './mapSlice'
import { addSetup, removeSetup, updateSetup } from '../setup/setupSlice';


export const extendRouteWithOffRoad = (originOffRoad, route, destinationOffRoad) => {

    const distanceOrigin = length(lineString([originOffRoad, route.slice(0, 1)[0]])) * 1000
    const distanceDestination = length(lineString([route.slice(-1)[0], destinationOffRoad])) * 1000

    const allCords = [originOffRoad, ...route, destinationOffRoad]

    // remove originOffRoad or destinatioNOffRoad if they are close enough and can be ignored
    if (distanceOrigin <= OFFROAD_THRESHOLD) {
        allCords.shift()
    }
    if (distanceDestination <= OFFROAD_THRESHOLD) {
        allCords.pop()
    }

    return lineString(allCords)
}

/* export const fuckPrecision = (number1, number2, precisionE) => {
    let _number1 = Math.round(number1 * precisionE) / precisionE
    let _number2 = Math.round(number2 * precisionE) / precisionE
    let diff = Math.round((number1 - number2) * precisionE) / precisionE

    return Math.abs(diff) <= 0.0001
} */

export const cutCustomRouteAndUpdateSetup = (params) => (dispatch, getState) => {

    let { routeName, index } = params

    const before = getState().present.mapbox
    dispatch(cutRoute({ routeName, index }))
    const after = getState().present.mapbox

    // maybe the if statement isnt needed at all.
    const didCut = before.routes.length != after.routes.length
    if (didCut) {
        const [route1, route2] = after.routes.filter(route =>
            before.routes.every(prevRoute => prevRoute.name != route.name)
        )
        const route1Index = after.routes.findIndex(r => r.name === route1.name)
        const route2Index = after.routes.findIndex(r => r.name === route2.name)
        const oldSetup = getState().present.setup.setups.find(s => s.route === params.routeName)
        const { route, ..._data } = oldSetup
        const data = Object.assign({}, _data, { route: route1.name })
        dispatch(removeSetup(params.routeName))
        dispatch(addSetup({ routeName: route1.name, index: route1Index, customName: false }))
        dispatch(updateSetup({ index: route1Index, data }))
        dispatch(addSetup({ routeName: route2.name, index: route2Index, customName: false }))
    }

}

export const getLngLatWaypointsFromGeometry = (geometry) => {
    // polyline works with latLng format but we need lngLat. swap lat and lng position
    return polyline.decode(geometry/* , precision */).map(latLng => {
        let [lat, lng] = latLng
        return [lng, lat]
    })
}

export const getTurfAlong = (line, distance) => {
    let myAlong = along(line, distance)

    return myAlong.geometry.coordinates.map(x => {
        let dafuq = Math.round(x * 1e5) / 1e5
        return dafuq
    })
}

export const getRouteDataWithDistance = (line) => {

    const hoseLength = 0.02 // TODO: make use of dynamic hoseline lengths => no need at all A & B Hoselines are both 20m length
    let index = 0
    let lineDistance = length(line)

    let totalDistanceRounded = parseFloat((lineDistance.toFixed(2)) * 1000)
    let augementedCoordinates = [] // {lat: <number>, lng: <number>, distance: <number>}[]
    let distance = 0

    while (distance <= lineDistance) {

        let myAlong = getTurfAlong(line, distance)
        let [lng, lat] = myAlong

        let distanceRounded = parseFloat(((distance) * 1000).toFixed(2))
        let distanceReversedRounded = totalDistanceRounded - distanceRounded
        augementedCoordinates.push({
            lat, lng,
            distance: distanceRounded,
            distanceReversed: distanceReversedRounded,
            distancePartial: distanceRounded,
            distanceReversedPartial: distanceReversedRounded
        })
        index++
        distance = hoseLength * index
    }

    return augementedCoordinates

}

export const getEnginePositions = (routes, setupData) => {

    const enginePositions = {}

    routes.forEach((route,i) => {
        const setup = setupData.setups.find(setup => setup.route === route.name)
        const hoselineCountIn = i === 0
            ? setup && setup.hoselineCount || ''
            : setupData.setups[i-1].hoselineCount * setupData.setups[i-1].count / setup.count

        route.coordinates.forEach((coord, index) => {
            let key = JSON.stringify(coord.lat) + JSON.stringify(coord.lng)
            if (coord.engine) {
                const { coordinates, ...engineData } = route
                const cuttable = index !== 0 && index !== route.coordinates.length - 1
                const customPopupProps = Object.assign(
                    {}, { ...coord }, { ...engineData }, { setup: setup, cuttable, index, hoselineCountIn }
                )
                enginePositions[key] = customPopupProps
            }

        })
    })

    return enginePositions
}