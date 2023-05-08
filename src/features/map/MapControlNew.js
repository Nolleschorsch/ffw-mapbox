import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ActionCreators } from 'redux-undo';
import Navbar from 'react-bootstrap/Navbar'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import {
    ArrowBarLeft,
    ArrowBarRight,
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
        showSidebar,
        showMarkers
    } = props

    const dispatch = useDispatch()
    const { future, past, present: { setup: setupData, mapbox } } = useSelector(state => state)
    const hasFuture = future.length
    const hasPast = past.length

    return (
        <Navbar fixed="top" className="justify-content-between m-1">
            <ButtonGroup>
                <Button disabled={!hasPast}
                    onClick={() => dispatch(ActionCreators.undo())} size="lg"><ArrowCounterclockwise /></Button>

                {/* TODO: add popup e.g. modal an require confirmation (resets map) */}
                <Button onClick={() => resetMap()} size="lg"><XCircleFill /></Button>

                <Button disabled={!hasFuture}
                    onClick={() => dispatch(ActionCreators.redo())} size="lg"><ArrowClockwise /></Button>

            </ButtonGroup>
            <ButtonGroup>
                <Button onClick={() => toggleRoutesAndEngineMarkers()} size="lg">
                    { showMarkers ? <EyeFill /> : <EyeSlashFill /> }
                </Button>

                <Button onClick={() => handleToggleRouteEdit()} size="lg">
                    { mapbox.routeEdit ? <Pencil /> : <Pencil color="grey" />}</Button>
            </ButtonGroup>

            <ButtonGroup>
                <Button onClick={() => dispatch(setShowSidebar(!showSidebar))} size="lg">
                    {showSidebar ? <ArrowBarRight /> : <ArrowBarLeft /> }<LayoutTextSidebarReverse />
                </Button>
            </ButtonGroup>
        </Navbar>

    )

}

export default MapControl