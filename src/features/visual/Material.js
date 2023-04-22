import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'


export const getEngineCount = (data, count) => {
    console.log({data}, {count})
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
    const pData = route.coordinates

    //const count = route.count
    const count = setup.count
    const engineCount = getEngineCount(pData, count)
    const hoseCount = getHoseCount(pData, setup.hoselineCount, count)
    const hoseCountReserve = Math.ceil(hoseCount / 5)
    const engineCountReserve = Math.ceil(engineCount / 5) // 3?
    const hoseType = setup.hoselineSize
    const engineType = setup.engineType
    const tankCount = getTankCount(setup.hoselineSystem, engineCount)

    return (
        <Row>
            <Col lg={12} xl={4}>
                <h5>Material Strecke & Reserve</h5>
                <ListGroup>
                    <ListGroup.Item>Pumpen: {engineCount + engineCountReserve} x {engineType}</ListGroup.Item>
                    <ListGroup.Item>Schläuche: {hoseCount + hoseCountReserve} x {hoseType}-Schlauch</ListGroup.Item>
                    <ListGroup.Item>Füllbehälter {tankCount}</ListGroup.Item>
                </ListGroup>
            </Col>
            <Col lg={12} xl={4}>
                <h5>Material Strecke</h5>
                <ListGroup>
                    <ListGroup.Item>Pumpen: {engineCount} x {engineType}</ListGroup.Item>
                    <ListGroup.Item>Schläuche: {hoseCount} x {hoseType}-Schlauch</ListGroup.Item>
                    <ListGroup.Item>Füllbehälter {tankCount}</ListGroup.Item>
                </ListGroup>
            </Col>
            <Col lg={12} xl={4}>
                <h5>Material Reserve</h5>
                <ListGroup>
                    <ListGroup.Item>Pumpen: {engineCountReserve} x {engineType}</ListGroup.Item>
                    <ListGroup.Item>Schläuche: {hoseCountReserve}</ListGroup.Item>
                </ListGroup>

            </Col>
        </Row>
    )

}

export default Material