import React from 'react'
import { useSelector } from 'react-redux'
import Accordion from 'react-bootstrap/Accordion'
import Badge from 'react-bootstrap/Badge'
import CustomToggle from '../../common/customtoggle'
import DataTable from './DataTable'
import Material from './Material'
import LineChart from './LineChart'
import { setupIsComplete } from '../setup/Setup'
import { getBadgeTextAndVariant } from '../../common/helpers'


export const Visual = () => {

    const { mapbox: mapState, setup: setupState } = useSelector(state => state.present)

    return (
        <>
            <div>
                blubb
            </div>
            <Accordion defaultActiveKey={setupState.openSetup}>
                {mapState.routes.map((route, key) => {
                    const setup = setupState.setups[key]
                    const complete = setupIsComplete(setup)
                    const [badgeText, badgeVariant] = getBadgeTextAndVariant(complete)
                    const distance = route.coordinates.slice(-1)[0].distancePartial
                    const elevation = route.coordinates.slice(-1)[0].elevation - route.coordinates[0].elevation
                    return (
                        <Accordion.Item eventKey={key} key={`visual-accordion-${key}`} className='mb-3'>
                            <CustomToggle complete={complete} eventKey={key}>Info {route.displayName}</CustomToggle>
                            <Badge pill bg={badgeVariant} className='float-end'>
                                {badgeText}
                            </Badge>
                            <Accordion.Body>
                                <div style={{ textAlign: "center" }}>
                                    Streckenlänge: {distance}m Höhenmeter: {elevation}m
                                    {setupIsComplete(setup) && <Material setup={setup} route={route} />}
                                    <LineChart name={route.displayName} pData={route.coordinates} />
                                    {setupIsComplete(setup) && <DataTable setup={setup} route={route} />}
                                    <CustomToggle complete={complete} eventKey={key}>Schließen</CustomToggle>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    )
                })}
            </Accordion>
        </>
    )
}

export default Visual