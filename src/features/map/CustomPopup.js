import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { cutCustomRouteAndUpdateSetup } from './mapfunctions';


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
        cuttable, setup
    } = props


    return (



        <Card>
            {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
            <Card.Body>
                <Card.Title>{setup.count} x Pumpe {setup.engineType} ({pressureOut}bar {setup.volume}Liter/min)</Card.Title>
                <Card.Text>
                    Entfernung Start: {distance}m <br />
                    Höhe über NN: {elevation}m <br />
                    Längengrad: {lat} <br />
                    Breiengrad: {lng} <br />
                    Flow: {setup.flow} x {setup.hoselineCount} x {setup.count} = {setup.flow * setup.hoselineCount * setup.count}<br />
                    Volume: {setup.volume} x {setup.count} = {setup.volume * setup.count}<br />
                    Eingangsdruck: {pressureIn}bar <br />
                    Ausgangsdruck: {pressureOut}bar <br />
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