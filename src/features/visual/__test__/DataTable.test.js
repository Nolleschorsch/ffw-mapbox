import React, { useState } from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DataTable from '../DataTable'

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn()
}))

describe('DataTable', () => {

    const setShowAll = jest.fn()

    afterEach(() => {
        cleanup()
        setShowAll.mockReset()
        useState.mockReset()
    })

    it('can render', () => {
        useState.mockImplementation(init => [init, setShowAll])
        const props = {
            setup: {},
            route: { coordinates: [] }
        }
        render(<DataTable {...props} />)
        expect(useState).toHaveBeenCalledWith(false)
    })
    it('showAll true button clicks', async () => {
        useState.mockImplementation(init => [init, setShowAll])
        const props = {
            setup: { displayName: 'Foo', hoselineSystem: 'closedSystem' },
            route: {
                coordinates: [
                    { distance: 0, elevation: 42, pressureIn: 0, pressureOut: 8, engine: true },
                    { distance: 20, elevation: 42, pressureIn: 0, pressureOut: 8, engine: false },
                    { distance: 40, elevation: 42, pressureIn: 0, pressureOut: 8, engine: true },
                ]
            }
        }
        render(<DataTable {...props} />)
        await userEvent.click(screen.getByRole('button', { name: 'zeige Alle' }))
        expect(setShowAll).toHaveBeenCalledWith(true)
    })
    it('showAll false button clicks', async () => {
        useState.mockImplementation(init => [true, setShowAll])
        const props = {
            setup: { displayName: 'Foo', hoselineSystem: 'closedSystem' },
            route: {
                coordinates: [
                    { distance: 0, elevation: 42, pressureIn: 0, pressureOut: 8, engine: true },
                    { distance: 20, elevation: 42, pressureIn: 0, pressureOut: 8, engine: false },
                    { distance: 40, elevation: 42, pressureIn: 0, pressureOut: 8, engine: true },
                ]
            }
        }
        render(<DataTable {...props} />)
        await userEvent.click(screen.getByRole('button', { name: 'zeige nur Pumpen' }))
        expect(setShowAll).toHaveBeenCalledWith(false)
    })
})