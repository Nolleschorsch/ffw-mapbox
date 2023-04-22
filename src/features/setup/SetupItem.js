import React from 'react'
import { useDispatch } from 'react-redux'
import Accordion from 'react-bootstrap/Accordion'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import { setSetupData } from './setupSlice'
import CustomToggle from '../../common/customtoggle'
import { availableEngines } from '../../data/engine/engines'
import { updateRouteData } from './Setup'
import { getBadgeTextAndVariant } from '../../common/helpers'


export const wtfBro = (engine, prevSetup) => {
    return prevSetup.flow * Math.floor(engine.volume / prevSetup.flow)
}

export const getHoselineSize = (sizes, hoselineSize) => {
    return sizes.includes(hoselineSize) ? hoselineSize : ''
}

export const getHoselineCount = (hoselineSize, exitPoints, hoselineCount) => {
    return hoselineSize && exitPoints[hoselineSize] >= hoselineCount
        ? hoselineCount
        : ''
}

export const getFlow = (hoselineCount, flow) => {
    return hoselineCount ? flow : ''
}

export const getEngineVolumeAndCount = ({ destinationVolume, engine, prevSetup, index }) => {

    let volume, count

    if (index === 0) {
        count = Math.ceil(destinationVolume / engine.volume)
        volume = destinationVolume / count
    } else {
        const prevCount = prevSetup.count
        const prevHoselineCount = prevSetup.hoselineCount * prevCount
        count = 1
        while (destinationVolume > engine.volume * count || (prevHoselineCount % count && count < prevHoselineCount)) {
            count++
        }
        volume = engine.volume <= prevSetup.volume ? (prevSetup.volume * prevCount) / count : prevSetup.volume
    }

    return [volume, count]
}

export const updateEngine = (route, index, value) => (dispatch, getState) => {

    const engine = availableEngines.find(e => e.name === value)

    if (!engine) return;

    const destinationVolume = getState().present.setup.destinationVolume
    const prevSetup = getState().present.setup.setups[index - 1]
    const [volume, count] = getEngineVolumeAndCount({ destinationVolume, engine, prevSetup, index })

    dispatch(setSetupData({ route, engineType: engine.name, volume, maxVolume: engine.volume, count, pressureSystem: engine.pressureSystem }))

}

export const updateHoselineCount = (route, value) => (dispatch, getState) => {
    const volume = getState().present.setup.setups.find(s => s.route === route).volume
    const flow = volume / value
    dispatch(setSetupData({ route, hoselineCount: value, flow }))
}



export const SetupItem = (props) => {

    const dispatch = useDispatch()

    const {
        eventKey,
        setup,
        engineOptions,
        hoselineOptions,
        hoselineCountOptions,
        hoselineSystemOptions,
        complete,
        color,
        disabled,
        destinationVolume,
        prevSetup
    } = props


    const handleNameChange = (event) => {
        const value = event.target.value
        const bla = Object.assign({}, { ...setup }, { displayName: value, customName: true })
        dispatch(setSetupData(bla))
    }

    const handleEngineChange = (event) => {
        const value = event.target.value
        const engine = availableEngines.find(e => e.name === value)
        const [volume, count] = getEngineVolumeAndCount({
            destinationVolume,
            engine,
            prevSetup,
            index: eventKey
        })

        const hoselineSize = getHoselineSize(engine.sizes, setup.hoselineSize)
        const hoselineCount = getHoselineCount(hoselineSize, engine.exitPoints, setup.hoselineCount)
        const flow = getFlow(hoselineCount, setup.flow)

        const bla = Object.assign({}, { ...setup }, {
            engineType: value,
            volume,
            maxVolume: engine.volume,
            count,
            pressureSystem: engine.pressureSystem,
            hoselineSize,
            hoselineCount,
            flow
        })

        dispatch(setSetupData(bla))
        dispatch(updateRouteData(setup.route))
    }

    const handleHoselineSizeChange = (event) => {
        const value = event.target.value
        const bla = Object.assign({}, { ...setup }, { hoselineSize: value })
        dispatch(setSetupData(bla))
        dispatch(updateRouteData(setup.route))
    }

    const handleHoselineCountChange = (event) => {
        const value = parseInt(event.target.value)
        const bla = Object.assign({}, { ...setup }, { hoselineCount: value, flow: setup.volume / value })
        dispatch(setSetupData(bla))
        dispatch(updateRouteData(setup.route))
    }

    const handleHoselineSystemChange = (event) => {
        const value = event.target.value
        const bla = Object.assign({}, { ...setup }, { hoselineSystem: value })
        dispatch(setSetupData(bla))
        dispatch(updateRouteData(setup.route))
    }

    const [badgeText, badgeVariant] = getBadgeTextAndVariant(complete)

    return (
        <Accordion.Item eventKey={eventKey} className="mb-3">
            <CustomToggle complete={complete} eventKey={eventKey} disabled={disabled}>
                Aufbau {setup.displayName}
            </CustomToggle>
            <Badge pill bg={badgeVariant} className='float-end'>
                {badgeText}
            </Badge>
            <Accordion.Body>
                <div style={{ textAlign: "center" }}>
                    <h1 style={{ color: color }}>{setup.displayName}</h1>
                    <Form.Group className="mb-3">
                        <Form.Label>Umbennen</Form.Label>
                        <Form.Control value={setup.displayName}
                            onChange={handleNameChange} />
                        <Form.Label htmlFor={`${setup.route}-enginetype`}>Pumpentyp</Form.Label>
                        <Form.Select id={`${setup.route}-enginetype`} size="lg" value={setup.engineType} isValid={setup.engineType} isInvalid={!setup.engineType}
                            onChange={handleEngineChange}>
                            <option value={''}>
                                {engineOptions.length ? 'Pumpentyp auswählen' : 'Vorheriger Pumpentyp zu stark oder nicht genug Zugänge'}
                            </option>
                            {engineOptions}
                        </Form.Select>
                        <Form.Label htmlFor={`${setup.route}-hoselinesize`}>Schlauchtyp</Form.Label>
                        <Form.Select id={`${setup.route}-hoselinesize`} size="lg" value={setup.hoselineSize} isValid={setup.hoselineSize} isInvalid={!setup.hoselineSize}
                            onChange={handleHoselineSizeChange}>
                            <option value={''}>Schlauchtyp auswählen</option>
                            {hoselineOptions}
                        </Form.Select>
                        <Form.Label htmlFor={`${setup.route}-hoselinecount`}>Anzahl Schlauchleitungen</Form.Label>
                        <Form.Select id={`${setup.route}-hoselinecount`} size="lg" value={setup.hoselineCount} isValid={setup.hoselineCount} isInvalid={!setup.hoselineCount}
                            onChange={handleHoselineCountChange}>
                            <option value={''}>Anzahl Schlauchleitungen auswählen</option>
                            {hoselineCountOptions}
                        </Form.Select>
                        <Form.Label htmlFor={`${setup.route}-hoselinesystem`}>Schaltreihe</Form.Label>
                        <Form.Select id={`${setup.route}-hoselinesystem`} size="lg" value={setup.hoselineSystem} isValid={setup.hoselineSystem} isInvalid={!setup.hoselineSystem}
                            onChange={handleHoselineSystemChange}>
                            <option value={''}>Schaltreihe auswählen</option>
                            {hoselineSystemOptions}
                        </Form.Select>
                    </Form.Group>
                    <CustomToggle complete={complete} eventKey={eventKey}>Schließen</CustomToggle>
                </div>
            </Accordion.Body>
        </Accordion.Item>
    )

}

export default SetupItem