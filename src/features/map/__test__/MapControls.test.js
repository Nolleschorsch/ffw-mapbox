import React from 'react'
import { render, screen, cleanup, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
//import MapControl, { handleSetupItemClick, handleChartItemClick } from "../MapControls";
import * as MapControls from '../MapControls'
import { useSelector, useDispatch } from 'react-redux';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}))

describe('handleSetupItemClick', () => {
    it('', () => {
        const setShowSetup = jest.fn()
        const dispatch = jest.fn()
        const getState = jest.fn()
        MapControls.handleSetupItemClick(setShowSetup, 42)(dispatch, getState)
        expect(setShowSetup).toHaveBeenCalledWith(true)
        expect(dispatch).toHaveBeenCalledWith({
            type: 'setup/setOpenSetup',
            payload: 42
        })
    })
})

describe('handleChartItemClick', () => {
    it('', () => {
        const setShowChart = jest.fn()
        const dispatch = jest.fn()
        const getState = jest.fn()
        MapControls.handleChartItemClick(setShowChart, 42)(dispatch, getState)
        expect(setShowChart).toHaveBeenCalledWith(true)
        expect(dispatch).toHaveBeenCalledWith({
            type: 'setup/setOpenSetup',
            payload: 42
        })
    })
})

describe('MapControls', () => {

    const stateEmpty = {
        past: [],
        present: {
            setup: {
                setups: []
            }

        },
        future: []
    }

    const stateFilled = {
        past: [{}],
        present: {
            setup: {
                setups: [
                    { displayName: "Foo" }
                ]
            }
        },
        future: [{}]
    }

    beforeEach(() => {
        jest.spyOn(MapControls, 'handleSetupItemClick').mockReturnValue('called')
        jest.spyOn(MapControls, 'handleChartItemClick')
    })


    afterEach(() => {
        useSelector.mockReset()
        useDispatch.mockReset()
        MapControls.handleSetupItemClick.mockRestore()
        MapControls.handleChartItemClick.mockRestore()
        cleanup()
    })

    it('can render without props', () => {
        useSelector.mockImplementation(callback => callback(stateEmpty))
        render(<MapControls.MapControl />)
    })
    it('can render with props too', async () => {
        useSelector.mockImplementation(callback => callback(stateFilled))
        const dispatch = jest.fn()
        useDispatch.mockImplementation(() => dispatch)
        //MapControls.handleSetupItemClick.mockReturnValue('called')
        const props = {
            setShowSetup: jest.fn(),
            setShowChart: jest.fn(),
            toggleRoutesAndEngineMarkers: jest.fn(),
            handleToggleRouteEdit: jest.fn(),
            resetMap: jest.fn(),
            setShowSidebar: jest.fn(),
            showSidebar: true
        }
        render(<MapControls.MapControl {...props} />)
        await userEvent.click(await screen.findByRole('button', { name: 'Rückgängig' }))
        expect(dispatch).toHaveBeenCalledWith({ type: "@@redux-undo/UNDO" })
        await userEvent.click(await screen.findByRole('button', { name: 'Wiederholen' }))
        expect(dispatch).toHaveBeenCalledWith({ type: '@@redux-undo/REDO' })
        await userEvent.click(await screen.findByRole('button', { name: 'Toggle Routes/Markers' }))
        expect(props.toggleRoutesAndEngineMarkers).toHaveBeenCalled()
        await userEvent.click(await screen.findByRole('button', { name: 'Toggle Route Edit' }))
        expect(props.handleToggleRouteEdit).toHaveBeenCalled()
        await userEvent.click(await screen.findByRole('button', { name: 'Karte zurücksetzen' }))
        expect(props.resetMap).toHaveBeenCalled()
        await userEvent.click(await screen.findByRole('button', { name: 'Toggle Sidebar' }))
        expect(dispatch).toHaveBeenCalledWith(props.setShowSidebar(false))
        await userEvent.click(await screen.findByRole('button', { name: 'Aufbau' }))
        await userEvent.click(await screen.findByRole('button', { name: 'Aufbau Foo' }))
        //expect(dispatch).toHaveBeenCalledWith('called')
        //expect(MapControls.handleSetupItemClick).toHaveBeenCalled()
        await userEvent.click(await screen.findByRole('button', { name: 'Verlauf' }))
        await userEvent.click(await screen.findByRole('button', { name: 'Verlauf Foo' }))
        //expect(props.setShowSetup).toHaveBeenCalled()
        //expect(dispatch).toHaveBeenCalledWith(handleSetupItemClick(props.setShowSetup, 0))
        //await screen.findByRole('button', {name: 'Aufbau Foo'})
        //const bla = within(dropdownSetup).getByText('Foo')
        //await userEvent.click()
        //await userEvent.selectOptions(await screen.findByRole('combobox'))
    })
})