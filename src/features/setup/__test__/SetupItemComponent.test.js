import React from 'react'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import * as SetupItem from '../SetupItem'
import { useDispatch } from 'react-redux';
import {updateRouteData} from '../Setup';
import { setSetupData } from '../setupSlice'

/* jest.mock('../SetupItem', () => {
    const originalModule = jest.requireActual('../SetupItem');

    return {
        __esModule: true, // Use it when dealing with esModules
        ...originalModule,
        handleNameChange: jest.fn()
    };
}) */

jest.mock('../Setup', () => {
    const originalModule = jest.requireActual('../Setup');

    return {
        __esModule: true, // Use it when dealing with esModules
        ...originalModule,
        updateRouteData: jest.fn()
    };
})

jest.mock('../setupSlice', () => {
    const originalModule = jest.requireActual('../setupSlice');

    return {
        __esModule: true, // Use it when dealing with esModules
        ...originalModule,
        setSetupData: jest.fn()
    };
})

jest.mock('react-redux', () => {
    const originalModule = jest.requireActual('react-redux');

    return {
        __esModule: true, // Use it when dealing with esModules
        ...originalModule,
        useDispatch: jest.fn()
    };
})

describe('SetupItem', () => {

    const dispatch = jest.fn()
    useDispatch.mockReturnValue(dispatch)

    const props = {
        setup: {
            displayName: "Foo",
            engineType: "PFP 8/8",
            route: "route1",
            volume: 800/* ,
            flow: 800,
            pressureSystem: 8 */

        },
        engineOptions: [
            <option key={0} value='PFP 8/8'>PFP 8/8</option>,
            <option key={1} value='PFP 16/8'>PFP 16/8</option>
        ],
        hoselineOptions: [
            <option key={0} value='B'>B</option>
        ],
        hoselineCountOptions: [
            <option key={0} value={1}>Einfachleitung</option>,
            <option key={1} value={2}>Doppelleitung</option>
        ],
        hoselineSystemOptions: [
            <option key={0} value='closedSystem'>geschlossene Schaltreihe</option>,
            <option key={1} value='openSystem'>offene Schaltreihe</option>
        ],
        destinationVolume: 800,
        prevSetup: {
            volume: 800,
            count: 1,
            hoselineCount: 1
        }
    }

    afterEach(() => {
        cleanup()
        dispatch.mockReset()
        updateRouteData.mockReset()
        setSetupData.mockReset()
        //useDispatch.mockReset()
    })

    it('can render', () => {
        
        render(<SetupItem.SetupItem {...props} />)
        fireEvent.change(screen.getByDisplayValue('Foo'), {target: {value: "Bar"}})
        //expect(SetupItem.handleNameChange).toHaveBeenCalled()
        //expect(useDispatch).toHaveBeenCalledTimes(1)
        expect(dispatch).toHaveBeenCalledTimes(1)
        /* expect(dispatch).toHaveBeenCalledWith({
            type: 'setup/setSetupData',
            payload: {name: 'route1', displayName: 'Bar', customName: true}
        }) */
        expect(setSetupData).toHaveBeenCalledTimes(1)
        expect(setSetupData).toHaveBeenCalledWith({
            ...props.setup,
            route: 'route1', displayName: 'Bar', customName: true
        })
    })
    it('engine change', async() => {
        render(<SetupItem.SetupItem {...props} />)
        expect(screen.getByRole('option', {name: 'PFP 8/8'}).selected).toBe(true)
        await userEvent.selectOptions(screen.getByLabelText('Pumpentyp'), 'PFP 16/8')
        expect(dispatch).toHaveBeenCalledTimes(2)
        expect(setSetupData).toHaveBeenCalledTimes(1)
        expect(setSetupData).toHaveBeenCalledWith({
            ...props.setup,
            engineType: 'PFP 16/8',
            volume: 800,
            maxVolume: 1600,
            count: 1,
            pressureSystem: 8,
            flow: '',
            hoselineCount: '',
            hoselineSize: ''

        })
        expect(updateRouteData).toHaveBeenCalledTimes(1)
        expect(updateRouteData).toHaveBeenCalledWith('route1')
    })
    it('hoselinesize change', async() => {
        render(<SetupItem.SetupItem {...props} />)
        expect(screen.getByRole('option', {name: 'B'}).selected).toBe(false)
        await userEvent.selectOptions(screen.getByLabelText('Schlauchtyp'), 'B')
        expect(dispatch).toHaveBeenCalledTimes(2)
        expect(setSetupData).toHaveBeenCalledTimes(1)
        expect(setSetupData).toHaveBeenCalledWith({
            ...props.setup,
            hoselineSize: 'B'
        })
        expect(updateRouteData).toHaveBeenCalledTimes(1)
        expect(updateRouteData).toHaveBeenCalledWith('route1')
    })
    it('hoselinesize change', async() => {
        render(<SetupItem.SetupItem {...props} />)
        expect(screen.getByRole('option', {name: 'Einfachleitung'}).selected).toBe(false)
        expect(screen.getByRole('option', {name: 'Doppelleitung'}).selected).toBe(false)
        await userEvent.selectOptions(screen.getByLabelText('Anzahl Schlauchleitungen'), 'Einfachleitung')
        expect(dispatch).toHaveBeenCalledTimes(2)
        expect(setSetupData).toHaveBeenCalledTimes(1)
        expect(setSetupData).toHaveBeenCalledWith({
            ...props.setup,
            hoselineCount: 1,
            flow: 800
        })
        expect(updateRouteData).toHaveBeenCalledTimes(1)
        expect(updateRouteData).toHaveBeenCalledWith('route1')
    })
    it('hoselinesystem change', async() => {
        render(<SetupItem.SetupItem {...props} />)
        expect(screen.getByRole('option', {name: 'geschlossene Schaltreihe'}).selected).toBe(false)
        expect(screen.getByRole('option', {name: 'offene Schaltreihe'}).selected).toBe(false)
        await userEvent.selectOptions(screen.getByLabelText('Schaltreihe'), 'geschlossene Schaltreihe')
        expect(dispatch).toHaveBeenCalledTimes(2)
        expect(setSetupData).toHaveBeenCalledTimes(1)
        expect(setSetupData).toHaveBeenCalledWith({
            ...props.setup,
            hoselineSystem: 'closedSystem'
        })
        expect(updateRouteData).toHaveBeenCalledTimes(1)
        expect(updateRouteData).toHaveBeenCalledWith('route1')
    })
})