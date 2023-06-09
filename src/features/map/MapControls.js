import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ActionCreators } from 'redux-undo';
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import {
    Pencil,
    LayoutTextSidebarReverse, 
    ArrowCounterclockwise,
    ArrowClockwise,
    EyeFill,
    EyeSlashFill,
    XCircleFill
} from 'react-bootstrap-icons';
import { setOpenSetup } from '../setup/setupSlice'

export const handleSetupItemClick = (setShowSetup, key) => (dispatch, getState) => {
    setShowSetup(true)
    dispatch(setOpenSetup(key))
}

export const handleChartItemClick = (setShowChart, key) => (dispatch, getState) => {
    setShowChart(true)
    dispatch(setOpenSetup(key))
}

export const MapControl = (props) => {

    const {
        setShowSetup,
        setShowChart,
        toggleRoutesAndEngineMarkers,
        handleToggleRouteEdit,
        resetMap,
        setShowSidebar,
        showSidebar
    } = props

    const dispatch = useDispatch()
    const { future, past, present: { setup: setupData } } = useSelector(state => state)
    const hasFuture = future.length
    const hasPast = past.length

    return (
        <Navbar fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container fluid>
                <Navbar.Brand href="#home">FFW-Mapbox</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto" variant="pills">
                        <Nav.Item>
                            <Button disabled={!hasPast}
                                onClick={() => dispatch(ActionCreators.undo())} size="lg"><ArrowCounterclockwise/></Button>
                        </Nav.Item>
                        <Nav.Item>
                            {/* TODO: add popup e.g. modal an require confirmation (resets map) */}
                            <Button onClick={() => resetMap()} size="lg"><XCircleFill /></Button>
                        </Nav.Item>
                        <Nav.Item>
                            <Button disabled={!hasFuture}
                                onClick={() => dispatch(ActionCreators.redo())} size="lg"><ArrowClockwise /></Button>
                        </Nav.Item>
                        <Nav.Item>
                            <Button onClick={() => toggleRoutesAndEngineMarkers()} size="lg">
                                <EyeFill />
                            </Button>
                        </Nav.Item>
                        <Nav.Item>
                            <Button onClick={() => handleToggleRouteEdit()} size="lg"><Pencil /></Button>
                        </Nav.Item>
                        
                        <Nav.Item>
                            <Button onClick={() => dispatch(setShowSidebar(!showSidebar))} size="lg"><LayoutTextSidebarReverse /></Button>
                        </Nav.Item>
                    </Nav>
                   {/*  <Nav>
                        <NavDropdown title="Aufbau">
                            {setupData.setups.map((setup, key) => {
                                return <NavDropdown.Item onClick={() => dispatch(handleSetupItemClick(setShowSetup, key))} key={key}>Aufbau {setup.displayName}</NavDropdown.Item>
                            })}
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <NavDropdown title="Verlauf">
                            {setupData.setups.map((setup, key) => {
                                return <NavDropdown.Item onClick={() => dispatch(handleChartItemClick(setShowChart, key))} key={key}>Verlauf {setup.displayName}</NavDropdown.Item>
                            })}
                        </NavDropdown>
                    </Nav> */}
                </Navbar.Collapse>
            </Container>
        </Navbar >
    )

}

export default MapControl