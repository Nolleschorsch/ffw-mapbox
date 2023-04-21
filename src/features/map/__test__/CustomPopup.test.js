import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomPopup from '../CustomPopup'

describe('CustomPopup', () => {

    afterEach(() => {
        cleanup()
    })

    it('can render', () => {
        const props = {
            setup: {
                count: 1,
                engineType: "Foo",
                volume: 400,
                flow: 400,
                hoselineCount: 1
            }
        }
        render(<CustomPopup {...props} />)
        expect(screen.queryByRole('button', {name: 'Strecke teilen'})).toBeFalsy()
    })
    it('render with button', async () => {
        const props = {
            setup: {
                count: 1,
                engineType: "Foo",
                volume: 400,
                flow: 400,
                hoselineCount: 1
            },
            cuttable: true,
            dispatch: jest.fn()
        }
        render(<CustomPopup {...props} />)
        expect(await screen.findByRole('button', {name: 'Strecke teilen'})).toBeTruthy()
        await userEvent.click(await screen.findByRole('button', {name: 'Strecke teilen'}))
        expect(props.dispatch).toHaveBeenCalled()

    })
})