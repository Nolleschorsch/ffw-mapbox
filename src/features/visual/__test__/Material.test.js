import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import Material, { getEngineCount, getHoseCount, getTankCount } from '../Material'

describe('getEngineCount', () => {
    it('returns expected value', () => {
        const data = [{ engine: true }, { engine: false }, { engine: true }, { engine: undefined }, { engine: null }]
        const count = 1
        expect(getEngineCount(data, count)).toEqual(2)
    })
})

describe('getHoseCount', () => {
    it('returns expected value', () => {
        const data = [1, 2, 3, 4, 5, 6]
        const amount = 1
        const count = 1
        expect(getHoseCount(data, amount, count)).toEqual(5)
    })
})

describe('getTankCount', () => {
    const cases = [
        { hoselineSystem: 'closedSystem', engineCount: 42, expected: 0 },
        { hoselineSystem: 'closedSystem', engineCount: 1, expected: 0 },
        { hoselineSystem: 'openSystem', engineCount: 42, expected: 40 },
        { hoselineSystem: 'openSystem', engineCount: 4, expected: 2 },
    ]
    it.each(cases)(
        '$hoselineSytem with $engineCount engine returns $expected',
        ({ hoselineSystem, engineCount, expected }) => {
            expect(getTankCount(hoselineSystem, engineCount)).toEqual(expected)
        })
})

describe('Material', () => {
    it('can render', () => {
        const props = {
            route: {
                coordinates: []
            },
            setup: {}
        }
        render(<Material {...props} />)
    })
    it.todo('')
})