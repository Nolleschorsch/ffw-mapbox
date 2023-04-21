import React from 'react'
import { createRoot } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
//import { lineString, bbox } from "@turf/turf"
import * as turf from "@turf/turf"
import * as polyline from '@mapbox/polyline';
import { getRouteDataWithDistance, extendRouteWithOffRoad, getEnginePositions } from "./mapfunctions"
import { getRouteColor } from "../../common/colors"
import { setRoute, setShowSidebar } from './mapSlice'
import { setSetup } from "../setup/setupSlice";
import { CustomPopup } from './CustomPopup'


export const someRouteFunction = (e, refs) => async (dispatch, getState) => {
    const { directions, map } = refs

    const mapState = getState().present.mapbox
    const originOffRoad = mapState.originOffRoad
    const destinationOffRoad = mapState.destinationOffRoad

    directions.removeRoutes()

    const route = polyline.decode(e.route[0].geometry).map(latLng => {
        let [lat, lng] = latLng
        return [lng, lat]
    })


    const myLineString = originOffRoad && destinationOffRoad
        ? extendRouteWithOffRoad(originOffRoad, route, destinationOffRoad)
        : turf.lineString(route)


    // use bbox to ensure that fitbounds always fits the entire route
    const myBbox = turf.bbox(myLineString)
    const [bboxLng1, bboxLat1, bboxLng2, bboxLat2] = myBbox

    let start = [bboxLng1, bboxLat1]
    let end = [bboxLng2, bboxLat2]
    let myBounds = [start, end]

    // In order to guarantee that the terrain data is loaded ensure
    // that the geographical location is visible and wait for the idle event to occur.
    await map.fitBounds(myBounds)
    await map.once('idle')

    let failure

    let explodedRouteWithDistance = getRouteDataWithDistance(myLineString).map((x) => {
        let { lng, lat, distance, distanceReversed, distancePartial, distanceReversedPartial } = x
        let elevation = Math.round(parseFloat(map.queryTerrainElevation([lng, lat], { exaggerated: false })))
        if (isNaN(elevation)) {
            console.log("FAILURE")
            failure = true
        }
        return { lng, lat, distance, distanceReversed, distancePartial, distanceReversedPartial, elevation }
    })
    if (failure) {
        alert("FAILURE")
    }

    let explodedGeometry = polyline.encode(explodedRouteWithDistance.map(x => [x.lat, x.lng]))

    let routeName = explodedGeometry

    await dispatch(setRoute({ name: routeName, coordinates: explodedRouteWithDistance }))
    await dispatch(setSetup(routeName))
}

export const renderMarkers = (refs) => (dispatch, getState) => {

    const { map, engineMarkers, setEngineMarkers } = refs

    let _engineMarkers = []

    const mapState = getState().present.mapbox
    const setupState = getState().present.setup


    const enginePositions = getEnginePositions(mapState.routes, setupState)


    Object.keys(enginePositions).map(async (key) => { // why the fuck async?
        const popupNode = document.createElement("div")
        const popupRoot = createRoot(popupNode)

        const popupData = Object.assign({}, enginePositions[key], { dispatch, map })
        const { lat, lng, data } = popupData

        popupRoot.render(<CustomPopup {...popupData} />)

        let p = new mapboxgl.Popup().setDOMContent(popupNode)

        // marker-symbol for engine count
        let m = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map)
            .setPopup(p)

        _engineMarkers.push(m)
    })
    engineMarkers.map((marker) => {
        marker.remove()
    })
    setEngineMarkers(_engineMarkers)
}

/* export const createGeoJSONEngines = (enginePositions) => {
    //console.log({enginePositions})
    const features = Object.keys(enginePositions).map(key => {
        //console.log(key)
        const enginePos = enginePositions[key]
        const coordinates = [enginePos.lng, enginePos.lat]
        return {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': coordinates
            },
            'properties': {
                'marker-symbol': enginePos.count.toString(),
                enginePos
                //'title': 'Mapbox',
                //'description': 'Washington, D.C.'

            },
            'promoteId': key
            //'generateId': true
        }
    })
    return {'type': 'FeatureCollection', 'features': features}
} */

/* export const renderMarkersGeoJSON = (refs) => (dispatch, getState) => {
    const { map, engineMarkers, setEngineMarkers } = refs

    let _engineMarkers = []

    const mapState = getState().present.mapbox
    const setupState = getState().present.setup

    const enginePositions = getEnginePositions(mapState.routes, setupState)

    const geojson = createGeoJSONEngines(enginePositions)

    for (const feature of geojson.features) {
        const popupNode = document.createElement("div")
        const popupRoot = createRoot(popupNode)

        //const popupData = Object.assign({}, enginePositions[key], { dispatch, map })
        const popupData = Object.assign({}, feature, { dispatch, map })
        const { lat, lng, data } = popupData

       // console.log({ popupData })

        popupRoot.render(<CustomPopup {...popupData} />)

        let p = new mapboxgl.Popup().setDOMContent(popupNode)

        // marker-symbol for engine count
        let m = new mapboxgl.Marker()
            .setLngLat(feature.geometry.coordinates)
            .addTo(map)
            .setPopup(p)

        _engineMarkers.push(m)
    }
    engineMarkers.map((marker) => {
        marker.remove()
    })
    setEngineMarkers(_engineMarkers)

} */

export const removeSourceAndLayer = (map, name) => {

    if (map.getLayer(name) && map.getSource(name)) {
        map.removeLayer(name)
        map.removeSource(name)
    }
}


export const createGeoJSONLineSource = (coordinates, name) => {
    return {
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
    }
}

export const createLineLayer = (props) => {
    const { routeLayerName, routeSourceName, routeColor, lineWidth, lineGapWidth } = props
    return {
        'id': routeLayerName,
        'type': 'line',
        'source': routeSourceName,
        'layout': {
            'visibility': 'visible',
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': routeColor,
            'line-width': lineWidth,
            'line-gap-width': lineGapWidth
        }
    }
}

export const updateSourcesAndLayers = (map) => (dispatch, getState) => {
    // TODO: make this clean!

    //const { map } = refs
    const setupData = getState().present.setup
    const mapState = getState().present.mapbox
    const future = getState().future
    const past = getState().past

    // this might be working but its ugly. try to make this more convenient
    past.forEach(p => p.mapbox.routes.forEach(route => removeSourceAndLayer(map, route.name)))
    future.forEach(f => f.mapbox.routes.forEach(route => removeSourceAndLayer(map, route.name)))

    mapState.routes.map((_route, i) => {

        removeSourceAndLayer(map, _route.name)

        let routeSourceName = _route.name
        let routeLayerName = _route.name

        const routeColor = getRouteColor(setupData.setups[i], i)

        let routeCoords = _route.coordinates.map(x => [x.lng, x.lat])
        let route = { coordinates: routeCoords }

        let routeSource = map.getSource(routeSourceName)

        const lineWidth = 8
        const lineGapWidth = setupData.setups[i] && setupData.setups[i].hoselineCount ? ((setupData.setups[i].hoselineCount - 1) * 5) : 0

        if (!routeSource) {
            const geoJSONLineStringObj = createGeoJSONLineSource(routeCoords, routeSourceName)
            map.addSource(routeSourceName, geoJSONLineStringObj)
            const lineLayer = createLineLayer({ routeLayerName, routeSourceName, routeColor, lineWidth, lineGapWidth })
            map.addLayer(lineLayer)
                .on('click', routeLayerName, (e) => {
                    dispatch(setShowSidebar(true))
                //console.log({e}, routeLayerName)
            })
        }
    })

}