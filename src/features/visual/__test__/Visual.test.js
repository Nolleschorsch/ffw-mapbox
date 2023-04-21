import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import { useSelector } from 'react-redux'
import Visual from '../Visual'

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}))

jest.mock('../Material', () => {
    return () => <h1>Hello MaterialMock</h1>
})
jest.mock('../DataTable', () => (() => <h1>Hello DataTableMock</h1>))
jest.mock('../LineChart', () => (() => <h1>Hello LineChartMock</h1>))

describe('Visual', () => {
    it('can render', () => {
        const mockAppState = {
            present: {
                mapbox: {
                    routes: [
                        {}
                    ]
                },
                setup: {
                    setups: [
                        {}
                    ]
                }
            }

        }
        useSelector.mockImplementation(
            callback => {
                return callback(mockAppState);
            }
        )
        render(<Visual />)
    })
})