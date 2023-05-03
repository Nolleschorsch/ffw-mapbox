import React, { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Accordion from 'react-bootstrap/Accordion'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import debounce from 'lodash/debounce';
import { setDestinationVolume, setMinPressureFactor, setSetupData } from './setupSlice'
import { getRouteColor } from '../../common/colors'
import { addPressureData } from '../../common/calculator'
import { setData } from '../map/mapSlice'
import { availableEngines, getEngine, getValidEngines } from '../../data/engine/engines'
import SetupItem, { updateEngine, updateHoselineCount } from './SetupItem'
import { getEngineVolumeAndCount } from './SetupItem'

export const availableTotalVolumes = [...Array(40).keys()].map(x => {
    let value = (x + 1) * 100
    let name = `${value} Liter/min`
    return { name, value }
})

export const availableHoselines = [
    //{ name: 'B-Schlauch 20m LFS BW', value: 'B', size: 'B' },
    { name: 'B-Schlauch 20m Einsatzleiter Wiki', value: 'B1', size: 'B' },
    //{ name: 'B-Schlauch 20m GrossTwuelpstedt', value: 'B2', size: 'B' },
    //{ name: 'A-Schlauch 20m Einsatzleiter Wiki', value: 'A', size: 'A' }
]

export const availableHoselineCounts = [
    { name: 'Einfachleitung', value: 1 },
    { name: 'Doppelleitung', value: 2 },
    { name: 'Dreifachleitung', value: 3 },
    { name: 'Vierfachleitung', value: 4 }
]

export const availableHoselineSystems = [
    { name: 'geschlossene Schaltreihe', value: 'closedSystem' },
    { name: 'offene Schaltreihe', value: 'openSystem' }
]

export const generateSelectOptions = (arr) => arr.map((item, key) => <option key={key} value={item.value}>{item.name}</option>)

export const volumeTotalOptions = generateSelectOptions(availableTotalVolumes)
export const hoselineOptions = generateSelectOptions(availableHoselines)
export const hoselineSystemOptions = generateSelectOptions(availableHoselineSystems)

export const setupIsComplete = (setup) => {
    if (!setup) {
        return false
    }
    const requiredKeys = [
        'engineType',
        'volume',
        'pressureSystem',
        'hoselineSize',
        'hoselineCount',
        'hoselineSystem',
        //'fooFactor',
        'count',
        'flow',
        'route'
    ]
    const existingKeys = Object.keys(setup)
    return requiredKeys.every(key => existingKeys.includes(key) && setup[key])
}


export const updateRouteData = (name) => (dispatch, getState) => {

    // TODO: split things. update setup then route

    const setupState = getState().present.setup
    const mapState = getState().present.mapbox

    let index = setupState.setups.findIndex(s => s.route === name)
    const destinationVolume = setupState.destinationVolume
    const minPressureFactor = setupState.minPressureFactor

    while (index < setupState.setups.length) {
        const setup = setupState.setups[index]
        const route = mapState.routes[index]

        // Idea: update any setup but only the engine related stuff
        if (!setupIsComplete(setup)) {
            index++
            continue
        }

        const validEngine = index === 0 ? true : getValidEngines(setupState.setups[index - 1]).find(engine => engine.name === setup.engineType)

        if (validEngine) {
            dispatch(updateEngine(setup.route, index, setup.engineType))
            dispatch(updateHoselineCount(setup.route, setup.hoselineCount))
            const pressureOutPreviousRoute = index === 0 ? 0 : getState().present.mapbox.routes[index - 1].coordinates.slice(-1)[0].pressureIn
            const previousSetup = index === 0 ? {} : getState().present.setup.setups[index - 1]
            const updatedSetup = getState().present.setup.setups[index]
            const [pData, count] = addPressureData([...route.coordinates], updatedSetup, minPressureFactor, pressureOutPreviousRoute, previousSetup)
            dispatch(setData({ route: route.name, coordinates: pData, index, count }))
        } else {
            const noPData = route.coordinates.map(x => {
                const { currentPressure,
                    pressureLossTotal,
                    elevationDiff,
                    distanceDiff,
                    pressureDiff,
                    engine,
                    pressureIn,
                    pressureOut,
                    volume,
                    flow,
                    hoselineCount, ...rest } = x
                return Object.assign({}, rest)
            })
            dispatch(setData({ route: route.name, coordinates: noPData, index, count: 42 }))
            const emptyData = { engineType: '', hoselineSystem: '' }
            const bla = {
                route: setup.route,
                displayName: setup.displayName,
                customName: setup.customName,
                //fooFactor: 100,
                hoselineSystem: setup.hoselineSystem
            }
            dispatch(setSetupData(bla))
        }

        index++

    }

}

export const updateSetup = (routeName) => (dispatch, getState) => {
    const setupData = getState().present.setup
    const setups = setupData.setups
    const destinationVolume = setupData.destinationVolume
    const index = setups.findIndex(s => s.route === routeName)
    const setup = setups[index]
    const prevSetup = index === 0 ? {} : setups[index - 1]

    const engine = index === 0
        ? getEngine(setup.engineType)
        : getValidEngines(prevSetup).find(engine => engine.name === setup.engineType)

    let updatedSetup

    if (engine) {
        const [volume, count] = getEngineVolumeAndCount({ destinationVolume, engine, prevSetup, index })
        const hoselineSize = engine.sizes.includes(setup.hoselineSize[0]) ? setup.hoselineSize : ''
        const hoselineCount = hoselineSize && engine.exitPoints[hoselineSize[0]] >= setup.hoselineCount
            ? setup.hoselineCount
            : ''
        const flow = hoselineCount ? volume / hoselineCount : ''

        updatedSetup = Object.assign({}, { ...setup }, {
            engineType: engine.name,
            volume,
            maxVolume: engine.volume,
            count,
            pressureSystem: engine.pressureSystem,
            hoselineSize,
            hoselineCount,
            flow
        })

    } else {
        updatedSetup = Object.assign({}, { ...setup }, {
            engineType: '',
            volume: '',
            maxVolume: '',
            count: '',
            pressureSystem: '',
            hoselineSize: '',
            hoselineCount: '',
            flow: ''
        })
    }

    return updatedSetup
}

export const updateRoute = (routeName) => (dispatch, getState) => {

    const setupData = getState().present.setup
    const routeData = getState().present.mapbox

    const setups = setupData.setups
    const routes = routeData.routes
    const destinationVolume = setupData.destinationVolume
    const minPressureFactor = setupData.minPressureFactor

    const index = setups.findIndex(s => s.route === routeName)
    const setup = setups[index]
    const route = { ...routes[index] }

    const pressureOutPreviousRoute = index === 0 ? 0 : routes[index - 1].coordinates.slice(-1)[0].pressureIn
    const previousSetup = index === 0 ? {} : setups[index - 1]

    let pData

    if (setupIsComplete(setup)) {
        const [data, count] = addPressureData([...route.coordinates], setup, minPressureFactor, pressureOutPreviousRoute, previousSetup)
        pData = data
    } else {
        const data = route.coordinates.map(x => {
            const { currentPressure,
                pressureLossTotal,
                elevationDiff,
                distanceDiff,
                pressureDiff,
                engine,
                pressureIn,
                pressureOut,
                volume,
                flow,
                hoselineCount, ...rest } = x
            return Object.assign({}, rest)
        })
        const count = 0
        pData = data
    }
    route.coordinates = pData
    return route
}

export const getEngineOptions = (i, setup) => {
    return i === 0
        ? availableEngines
            .map((engine, key) => <option key={key} value={engine.name}>{engine.name}</option>)
        : getValidEngines(setup.setups[i - 1])
            .map((engine, key) => <option key={key} value={engine.name}>{engine.name}</option>)
}

export const getHoselineOptions = (engine) => {
    return engine
        ? availableHoselines
            .filter(hoseline => engine.sizes.includes(hoseline.size))
            .map((hoseline, key) => <option key={key} value={hoseline.value}>{hoseline.name}</option>)
        : []
}

export const getHoselineCountOptions = (engine, r) => {
    return engine && r.hoselineSize
        ? availableHoselineCounts
            .filter(hoselineCount => hoselineCount.value <= engine.exitPoints[r.hoselineSize[0]])
            .map((h, i) => <option key={i} value={h.value}>{h.name}</option>)
        : []
}

export const Setup = () => {

    const dispatch = useDispatch()
    const setup = useSelector(state => state.present.setup)

    const handleDestinationVolumeChange = (event) => {
        const destinationVolume = parseInt(event.target.value)
        if (!isNaN(destinationVolume)) {
            dispatch(setDestinationVolume(destinationVolume))
            setup.setups.forEach((setup, index) => {
                const updatedSetup = dispatch(updateSetup(setup.route))
                dispatch(setSetupData(updatedSetup))
                const updatedRoute = dispatch(updateRoute(setup.route))
                dispatch(setData({ route: updatedRoute.name, coordinates: updatedRoute.coordinates, index }))
            })
        }
    }

    const handleMinPressureFactorChange = (event) => {
        console.log("AYEEEE", event)
        const { target: { value } } = event
        dispatch(setMinPressureFactor(parseInt(value) + 100))
        setup.setups.forEach((setup, index) => {
            const updatedSetup = dispatch(updateSetup(setup.route))
            dispatch(setSetupData(updatedSetup))
            const updatedRoute = dispatch(updateRoute(setup.route))
            dispatch(setData({ route: updatedRoute.name, coordinates: updatedRoute.coordinates, index }))
        })
    }

    const debounceMinPressureFactorChange = useMemo(() => { return debounce(handleMinPressureFactorChange, 100) }, [setup.minPressureFactor])

    const handleIncreaseMinPressureFactor = (event) => {
        if (setup.minPressureFactor < 200) {
            dispatch(setMinPressureFactor(setup.minPressureFactor + 5))
            setup.setups.forEach((setup, index) => {
                const updatedSetup = dispatch(updateSetup(setup.route))
                dispatch(setSetupData(updatedSetup))
                const updatedRoute = dispatch(updateRoute(setup.route))
                dispatch(setData({ route: updatedRoute.name, coordinates: updatedRoute.coordinates, index }))
            })
        }
    }

    const handleDecreaseMinPressureFactor = (event) => {
        if (setup.minPressureFactor > 100) {
            dispatch(setMinPressureFactor(setup.minPressureFactor - 5))
            setup.setups.forEach((setup, index) => {
                const updatedSetup = dispatch(updateSetup(setup.route))
                dispatch(setSetupData(updatedSetup))
                const updatedRoute = dispatch(updateRoute(setup.route))
                dispatch(setData({ route: updatedRoute.name, coordinates: updatedRoute.coordinates, index }))
            })
        }
    }

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>MinPressureFactor</Form.Label>
                <InputGroup>
                    <Button onClick={handleDecreaseMinPressureFactor}>-</Button>
                    <Form.Control value={setup.minPressureFactor - 100} disabled />
                    <Button onClick={handleIncreaseMinPressureFactor}>+</Button>
                </InputGroup>
                <InputGroup>
                    <InputGroup.Text>geschlossenes System</InputGroup.Text>
                    <Form.Control disabled value={Math.round((1.5 * setup.minPressureFactor / 100) * 100) / 100} />
                    <InputGroup.Text>offenes System</InputGroup.Text>
                    <Form.Control disabled value={Math.round((0.1 * setup.minPressureFactor / 100) * 100) / 100} />
                </InputGroup>

                <Form.Label htmlFor="destinationVolume">Förderstrom</Form.Label>
                <Form.Select id="destinationVolume" size="lg" value={setup.destinationVolume}
                    onChange={handleDestinationVolumeChange}>
                    <option value=''>Benötigte Wassermenge am Ziel eintragen</option>
                    {volumeTotalOptions}
                </Form.Select>
                <Form.Text className="text-muted">
                    Benötigte Wassermenge am Ziel auswählen
                </Form.Text>
            </Form.Group>
            <Accordion defaultActiveKey={setup.openSetup}>
                {setup.setups.map((r, i) => {

                    const engineOptions = getEngineOptions(i, setup)

                    const engine = getEngine(r.engineType)
                    const hoselineOptions = getHoselineOptions(engine)
                    const hoselineCountOptions = getHoselineCountOptions(engine, r)

                    const complete = setupIsComplete(r)
                    const color = getRouteColor(r, i)
                    const disabled = i === 0 ? !setup.destinationVolume : !setupIsComplete(setup.setups[i - 1])

                    const setupItemProps = {
                        eventKey: i,
                        setup: r,
                        engineOptions,
                        hoselineOptions,
                        hoselineCountOptions,
                        hoselineSystemOptions,
                        complete,
                        color,
                        disabled,
                        destinationVolume: setup.destinationVolume,
                        prevSetup: setup.setups[i - 1]
                    }

                    return <SetupItem key={i} {...setupItemProps} />

                })}
            </Accordion>
        </>
    )
}

export default Setup