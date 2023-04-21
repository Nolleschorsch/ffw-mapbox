import React from 'react'
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Button from 'react-bootstrap/Button'

/* export const CustomToggle = ({ children, eventKey, disabled, color, complete }) => {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
        console.log('totally custom!'),
    );

    return (
        <Button  disabled={disabled} variant={ complete ? "success" : "danger" } onClick={decoratedOnClick}>{children}</Button>
    )
} */

export const CustomToggle = ({ children, eventKey, disabled, color, complete }) => {

    const decoratedOnClick = useAccordionButton(eventKey)

    return (
        <Button  disabled={disabled} variant={ complete ? "success" : "danger" }
            onClick={decoratedOnClick}>{children}</Button>
    )
}

export default CustomToggle