import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useSelector } from 'react-redux'
import Accordion from 'react-bootstrap/Accordion'
import CustomToggle from '../../common/customtoggle'
import { getRandomHexColorFromString } from '../../common/colors'


export const getEngineCount = (data, count) => {
    return data.filter(x => x.engine === true).length * count
}

export const getHoseCount = (data, amount, count) => {
    return (data.length - 1) * amount * count
}

export const getTankCount = (hoselineSystem, engineCount) => {
    return hoselineSystem === 'openSystem' ? engineCount - 2 : 0
} 

export const Material = (props) => {

    const { route, setup } = props

    //const pressureData = useSelector(state => state.present.mapbox.routes)
    //const setupData = useSelector(state => state.present.setup)
    //const destinationVolume = setupData.destinationVolume


    const pData = route.coordinates
    //const name = route.name
    //const color = getRandomHexColorFromString(name)
    const count = route.count
    const engineCount = getEngineCount(pData, count)
    const hoseCount = getHoseCount(pData, setup.hoselineCount, count)
    const hoseCountReserve = Math.ceil(hoseCount / 5)
    const engineCountReserve = Math.ceil(engineCount / 5)
    const hoseType = setup.hoselineSize
    const tankCount = getTankCount()//setup.hoselineSystem === 'openSystem' ? engineCount - 2 : 0

    return (
        <Row>
            <Col lg={12} xl={4}>
                <h5>Material Strecke & Reserve</h5>
                <ul>
                    <li>Pumpen: {engineCount + engineCountReserve}</li>
                    <li>Schläuche: {hoseCount + hoseCountReserve} x {hoseType}-Schlauch</li>
                    <li>Schlauchaufsicht {engineCount + engineCountReserve - 1}</li>
                    <li>Maschinisten {engineCount + engineCountReserve}</li>
                    <li>Füllbehälter {tankCount}</li>
                </ul>
            </Col>
            <Col lg={12} xl={4}>
                <h5>Material Strecke</h5>
                <ul>
                    <li>Pumpen: {engineCount}</li>
                    <li>Schläuche: {hoseCount} x {hoseType}-Schlauch</li>
                    <li>Schlauchaufsicht {engineCount - 1}</li>
                    <li>Maschinisten {engineCount}</li>
                    <li>Füllbehälter {tankCount}</li>
                </ul>
            </Col>
            <Col lg={12} xl={4}>
                <h5>Material Reserve</h5>
                <ul>
                    <li>Pumpen: {engineCountReserve}</li>
                    <li>Schläuche: {hoseCountReserve}</li>
                </ul>

            </Col>
        </Row>
    )

}

export default Material