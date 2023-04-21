import React from 'react'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import Setup, { updateSetup, updateRoute } from '../Setup'
import { useDispatch, useSelector } from 'react-redux';
import { setDestinationVolume, setSetupData } from '../setupSlice';
//import { setDestinationVolume, setSetupData } from '../setupSlice';
import { setData } from '../../map/mapSlice';

jest.mock('react-redux', () => {
    const originalModule = jest.requireActual('react-redux');

    return {
        __esModule: true, // Use it when dealing with esModules
        ...originalModule,
        useDispatch: jest.fn(),
        useSelector: jest.fn()
    };
})

jest.mock('../Setup', () => ({
    __esModule: true,
    ...jest.requireActual('../Setup'),
    updateSetup: jest.fn(),
    updateRoute: jest.fn()
}))

/* jest.mock('../setupSlice', () => ({
    ...jest.requireActual('../setupSlice'),

}))

jest.mock('../../map/mapSlice', () => ({
    ...jest.requireActual('../../map/mapSlice'),
    setData: jest.fn()
}))
 */
describe('Setup', () => {
    const setupState = { setups: [] }
    useSelector.mockImplementation(() => setupState)

    afterEach(() => {
        useDispatch.mockReset()
        useSelector.mockReset()
        cleanup()
    })

    it('can render', () => {
        render(<Setup />)
    })
    it('can render with setups', () => {
        useSelector.mockImplementation(() => ({
            setups: [
                { route: "Foo" },
                { route: "Bar" }
            ]
        }))
        render(<Setup />)
    })
    it('change destinationVolume NaN', async () => {
        useSelector.mockImplementation(() => ({
            setups: [
                { route: "Foo" },
                { route: "Bar" }
            ]
        }))
        render(<Setup />)
        await userEvent.selectOptions(await screen.findByLabelText('Förderstrom'), "")
    })
    it('change destinationVolume', async () => {
        useSelector.mockImplementation(callback => callback({
            present: {
                setup: {
                    setups: [
                        { route: "Foo" },
                        { route: "Bar" }
                    ]
                }
            }
        }))

        updateRoute.mockImplementation(() => ({ name: 'foo', coordinates: [], index: 0 }))
        updateSetup.mockImplementation(() => ({ route: 'foo' }))

        const dispatch = jest.fn()
        dispatch
            .mockImplementationOnce(() => setDestinationVolume(1000))
            .mockImplementationOnce(() => updateSetup('foo'))
            .mockImplementationOnce(() => setSetupData({ route: 'foo' }))
            .mockImplementationOnce(() => updateRoute('foo'))
            .mockImplementationOnce(() => setData())
            .mockImplementationOnce(() => updateSetup('bar'))
            .mockImplementationOnce(() => setSetupData({ route: 'bar' }))
            .mockImplementationOnce(() => updateRoute('bar'))
        /* .mockImplementationOnce(() => setData({''})) */
        useDispatch.mockImplementation(() => dispatch)

        render(<Setup />)
        await userEvent.selectOptions(await screen.findByLabelText('Förderstrom'), "1000")
        expect(dispatch).toHaveBeenCalledWith({
            type: 'setup/setDestinationVolume',
            payload: 1000
        })
    })
})