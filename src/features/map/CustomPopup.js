import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Speedometer } from 'react-bootstrap-icons'
import { cutCustomRouteAndUpdateSetup } from './mapfunctions';
import { ListGroup } from 'react-bootstrap';


export const CustomPopup = (props) => {


    const {
        lng,
        lat,
        distance,
        distanceReversed,
        distancePartial,
        distanceReversedPartial,
        elevation,
        currentPressure,
        pressureLossTotal,
        elevationDiff,
        distanceDiff,
        pressureDiff,
        engine,
        pressureIn,
        pressureOut,
        name,
        count,
        volume,
        flow,
        dispatch,
        index,
        routeRef,
        previousRouteRef,
        cuttable, setup, hoselineCountIn
    } = props


    return (



        <Card className="popup">
            {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
            <Card.Body>
                <Card.Title>{setup.count} x Pumpe {setup.engineType} ({pressureOut}bar {setup.volume}Liter/min)</Card.Title>
                <Card.Text>
                    <ListGroup>
                        <ListGroup.Item>Entfernung Start: {distance}m </ListGroup.Item>
                        <ListGroup.Item>Höhe über NN: {elevation}m </ListGroup.Item>
                        {/* <ListGroup.Item>Längengrad: {lat} </ListGroup.Item>
                        <ListGroup.Item>Breiengrad: {lng} </ListGroup.Item> */}
                        <ListGroup.Item>Zugänge: {hoselineCountIn}</ListGroup.Item>
                        <ListGroup.Item>Abgänge: {setup.hoselineCount}</ListGroup.Item>
                        {/* <ListGroup.Item>Flow: {setup.flow} x {setup.hoselineCount} x {setup.count} = {setup.flow * setup.hoselineCount * setup.count}</ListGroup.Item>
                        <ListGroup.Item>Volume: {setup.volume} x {setup.count} = {setup.volume * setup.count}</ListGroup.Item> */}
                        <ListGroup.Item><Speedometer />Eingangsdruck: {pressureIn}bar </ListGroup.Item>
                        <ListGroup.Item>Ausgangsdruck: {pressureOut}bar </ListGroup.Item>
                    </ListGroup>
                </Card.Text>
                {cuttable
                    ? <Button variant="primary" onClick={() => dispatch(cutCustomRouteAndUpdateSetup({
                        routeName: name, index, routeRef, previousRouteRef
                    }))}>Strecke teilen</Button>
                    : null}
            </Card.Body>
        </Card>

    )

}

export default CustomPopup