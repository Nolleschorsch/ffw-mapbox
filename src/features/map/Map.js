import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'
//import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
//import MapboxDirections from '@mapbox/mapbox-gl-directions'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min';
//import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import React, { useRef, useEffect, useState } from 'react';
/* import { createRoot } from 'react-dom/client'; */
import { useSelector, useDispatch } from 'react-redux'
import { ActionCreators } from 'redux-undo';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Collapse from 'react-bootstrap/Collapse';
import {
    setOffRoadMode,
    resetRoutes,
    setOriginOffRoad,
    setDestinationOffRoad,
    toggleRouteEdit,
    setShowSidebar,
    setRoute,
    resetToInitialStateMapbox
} from './mapSlice'
import './Map.css'
import { updateSourcesAndLayers, someRouteFunction, renderMarkers, renderMarkersGeoJSON } from './effectfunctions'
import { resetSetup, resetToInitialStateSetup, setSetup } from '../setup/setupSlice';
import Setup from '../setup/Setup'
import { getEnginePositions } from './mapfunctions';
import CustomPopup from './CustomPopup'
import MapControl from './MapControls';
import MapControlNew from './MapControlNew';
import { Visual } from '../visual/Visual';

export const OFFROAD_THRESHOLD = 2 // distance in meters

//mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_GL_ACCESS_TOKEN


const WEIER_LNG = 8.3916033
const WEIER_LAT = 48.9231337
const LFS_LNG = 8.58468
const LFS_LAT = 49.106011

export const Map = (props) => {
    mapboxgl.accessToken = props.accessToken
    const dispatch = useDispatch()
    const mapState = useSelector(state => state.present.mapbox)
    //const hasFuture = useSelector(state => state.future).length
    //const setupState = useSelector(state => state.present.setup)
    const [mapReady, setMapReady] = useState(false)
    const [showMarkers, setShowMarkers] = useState(true)
    const [engineMarkers, setEngineMarkers] = useState([])
    const [showSetup, setShowSetup] = useState(false)
    const [showChart, setShowChart] = useState(false)
    //const [showSidebar, setShowSideBar] = useState(false)


    const mapContainer = useRef(null);
    const map = useRef(null);
    const directions = useRef(null);
    const geocoder = useRef(null);
    const originOffRoadMarker = useRef(null)
    const destinationOffRoadMarker = useRef(null)

    const lng = WEIER_LNG
    const lat = WEIER_LAT
    const zoom = 14


    const addOriginMarker = (e) => {
        const { lng, lat } = e.lngLat
        dispatch(setOffRoadMode('destination'))
        dispatch(setOriginOffRoad([lng, lat]))
    }

    const addDestinationMarker = (e) => {
        const { lng, lat } = e.lngLat
        dispatch(setOffRoadMode(null))
        dispatch(setDestinationOffRoad([lng, lat]))
    }

    useEffect(() => {
        if (!mapReady) return;
        if (originOffRoadMarker.current) {
            originOffRoadMarker.current.remove()
        }
        if (mapState.originOffRoad) {

            const marker = new mapboxgl.Marker({ color: 'blue', draggable: true })
                .setLngLat(mapState.originOffRoad)
                .addTo(map.current)
                .on('dragend', (e) => {
                    const { lng, lat } = marker.getLngLat()
                    dispatch(setOriginOffRoad([lng, lat]))
                });

            originOffRoadMarker.current = marker
        }
    }, [mapState.originOffRoad])

    useEffect(() => {
        if (!mapReady) return;
        if (destinationOffRoadMarker.current) {
            destinationOffRoadMarker.current.remove()
        }
        if (mapState.destinationOffRoad) {
            const marker = new mapboxgl.Marker({ color: 'red', draggable: true })
                .setLngLat(mapState.destinationOffRoad)
                .addTo(map.current)
                .on('dragend', (e) => {
                    const { lng, lat } = marker.getLngLat()
                    dispatch(setDestinationOffRoad([lng, lat]))
                })
            destinationOffRoadMarker.current = marker
        }
    }, [mapState.destinationOffRoad])


    useEffect(() => {
        if (!mapReady) return;
        if (mapState.originOffRoad && mapState.destinationOffRoad) {
            directions.current.setOrigin(mapState.originOffRoad)
            directions.current.setDestination(mapState.destinationOffRoad)
        }
    }, [mapState.originOffRoad, mapState.destinationOffRoad])

    // initialize mapbox stuff
    useEffect(() => {
        if (map.current) return; // initialize map only once
        (async () => {
            map.current = new mapboxgl.Map({
                //accessToken: process.env.REACT_APP_MAPBOX_GL_ACCESS_TOKEN,
                accessToken: mapboxgl.accessToken,
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [lng, lat],
                zoom: zoom,
                //testMode: props.testMode ? true : false
                //testMode: true
            })

            directions.current = new MapboxDirections({
                accessToken: mapboxgl.accessToken,
                profile: 'mapbox/walking',
                unit: 'metric',
                interactive: false,
                flyTo: false
            })

            geocoder.current = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                marker: false,
                countries: 'DE'
                // countries?
            })

            map.current.addControl(
                geocoder.current,
                'bottom-left'
            )

            await map.current.once('idle')

            map.current.addSource('mapbox-dem', {
                'type': 'raster-dem',
                'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',//'mapbox://mapbox.terrain-rgb',
                'tileSize': 256,//512,//256,//512,
                'maxzoom': 15//14//15//14 // why 14? 512 14, 256 15
            });
            map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 }); // why the fuck 1.5?

            await map.current.once('idle')
            map.current.on('click', () => {
                dispatch(setShowSidebar(false))
            })

            setMapReady(true)
        })()

    });

    useEffect(() => {
        if (!mapReady || mapState.offRoadMode !== 'origin') { return; }
        map.current.once('click', addOriginMarker)
        return () => { map.current.off('click', addOriginMarker) }
    })

    useEffect(() => {
        if (!mapReady || mapState.offRoadMode !== 'destination') { return };
        map.current.once('click', addDestinationMarker)
        return () => { map.current.off('click', addDestinationMarker) }
    })

    // route stuff
    useEffect(() => {
        if (!mapReady) return;
        // below not work properly.
        //if(!mapReady || hasFuture) return;

        directions.current.on('route', async (e) => {
            const refs = {
                directions: directions.current,
                map: map.current
            }
            dispatch(someRouteFunction(e, refs))
        })

    }, [mapReady])

    // resize map
    useEffect(() => {
        //if (!map.current) return;
        if(!mapReady) return;
        map.current.resize()
    }, [mapState.showSidebar])

    // render markers
    useEffect(() => {
        //if (!map.current) return;
        if(!mapReady) return;
        //dispatch(renderMarkersGeoJSON({map: map.current, engineMarkers, setEngineMarkers}))
        dispatch(renderMarkers({ map: map.current, engineMarkers, setEngineMarkers }))
    }, [mapState.routes])

    // removes route sources & layers
    // adds route sources & layers.
    useEffect(() => {
        if (!mapReady) return;
        dispatch(updateSourcesAndLayers(map.current))
    }, [mapState.routes, mapReady])


    const resetMap = () => {
        mapState.routes.forEach(route => {
            map.current.removeLayer(route.name)
            map.current.removeSource(route.name)

        })

        map.current.addControl(directions.current)
        map.current.removeControl(directions.current)
        dispatch(resetToInitialStateMapbox())
        dispatch(resetToInitialStateSetup())
        /* dispatch(setOffRoadMode('origin'))
        dispatch(resetRoutes())
        dispatch(resetSetup()) */
    }


    const handleToggleRouteEdit = () => {
        mapState.routeEdit ? setShowSetup(true) : null
        dispatch(toggleRouteEdit(!mapState.routeEdit))
    }

    useEffect(() => {
        if (!mapReady || !originOffRoadMarker.current || !destinationOffRoadMarker.current) return;
        if (!mapState.routeEdit) {
            originOffRoadMarker.current.remove()
            destinationOffRoadMarker.current.remove()
        } else {
            originOffRoadMarker.current.addTo(map.current)
            destinationOffRoadMarker.current.addTo(map.current)
        }
    }, [mapState.routeEdit])


    const toggleRoutesAndEngineMarkers = () => {
        mapState.routes.forEach((route) => {
            showMarkers
                ? map.current.setLayoutProperty(route.name, 'visibility', 'none')
                : map.current.setLayoutProperty(route.name, 'visibility', 'visible')
        })
        engineMarkers.forEach(marker => {
            showMarkers
                ? marker.remove()
                : marker.addTo(map.current)
        })
        setShowMarkers(!showMarkers)
    }

    const mapControlProps = {
        setShowSetup,
        setShowChart,
        toggleRoutesAndEngineMarkers,
        handleToggleRouteEdit,
        resetMap,
        setShowSidebar,
        showMarkers,
        showSidebar: mapState.showSidebar
    }

    return (
        <div>
            <MapControlNew {...mapControlProps} />
            <Row style={{ height: "100%" }}>
                {mapState.showSidebar
                    ?
                    <>
                        <Col xs={6}>
                            <div ref={mapContainer} className="map-container" />
                        </Col>
                        <Col xs={6} style={{ height: '100vh', overflowY: 'auto' }}>
                            <div className="sidebar mt-5 pt-5">
                                <Button onClick={() => dispatch(setShowSidebar(false))}>CLOSE</Button>
                                <Setup />
                                <Visual />
                            </div>
                        </Col>
                    </>
                    :
                    <>
                        <Col xs={12}>
                            <div ref={mapContainer} className="map-container" />
                        </Col>
                    </>
                }

            </Row>
            <Modal show={showSetup} fullscreen onHide={() => setShowSetup(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Aufbau Förderstrecke</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: "center" }}>
                    <Setup />
                    <Button onClick={() => setShowSetup(false)}>Aufbau schließen</Button>
                </Modal.Body>
            </Modal>
            <Modal show={showChart} fullscreen onHide={() => setShowChart(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Verlauf Förderstrecke</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: "center" }}>
                    <Visual />
                    <Button onClick={() => setShowChart(false)}>Verlauf schließen</Button>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Map;
