import React from "react"
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
//import Accordion from 'react-bootstrap/Accordion'
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import CustomToggle from "../customtoggle";

jest.mock('react-bootstrap/AccordionButton', () => {
    const originalModule = jest.requireActual('react-bootstrap/AccordionButton');

    //Mock the default export and named export 'foo'
    return {
        __esModule: true,
        ...originalModule,
        useAccordionButton: jest.fn()
    };
});


describe('CustomToggle', () => {

    const props1 = {
        eventKey: 0,
        disabled: false,
        complete: false
    }

    const props2 = {
        eventKey: 42,
        disabled: false,
        complete: true
    }

    const props3 = {
        eventKey: 22,
        disabled: true,
        complete: false
    }

    afterEach(() => {
        useAccordionButton.mockReset()
        cleanup()
    })

    it('can render', () => {
        render(<CustomToggle {...props1} />)
    })
    it('button click', () => {
        render(<CustomToggle {...props1}>Click me</CustomToggle>)
        //fireEvent.click(screen.getByText('Click me'))
        expect(useAccordionButton).toHaveBeenCalledTimes(1)
        expect(useAccordionButton).toHaveBeenCalledWith(0)
    })
    it('button click', () => {
        render(<CustomToggle {...props2}>Click me</CustomToggle>)
        //fireEvent.click(screen.getByText('Click me'))
        expect(useAccordionButton).toHaveBeenCalledTimes(1)
        expect(useAccordionButton).toHaveBeenCalledWith(42)
    })
    it('button click', () => {
        render(<CustomToggle {...props3}>Click me</CustomToggle>)
        //fireEvent.click(screen.getByText('Click me'))
        expect(useAccordionButton).toHaveBeenCalledTimes(1)
        expect(useAccordionButton).toHaveBeenCalledWith(22)
    })
})