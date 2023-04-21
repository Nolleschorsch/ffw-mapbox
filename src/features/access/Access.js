import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'


export const getAccessTokenLocalStorage = () => {
    return localStorage.getItem('mapboxAccessToken')
}

export const setAccessTokenLocalStorage = (token) => {
    localStorage.setItem('mapboxAccessToken', token)
}

export const isValidToken = async (token) => {

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token=${token}`

    const valid = await fetch(url).then((response) => {
        if (response.status >= 400 && response.status < 600) {
            return false
        }
        return true;
    }).catch((error) => {
        return false
    });

    return valid
}


export const Access = ({ setAccessToken }) => {

    // TODO move this to redux
    const [token, setToken] = useState(getAccessTokenLocalStorage() || '')
    const [valid, setValid] = useState(true)

    const handleChangeAccessToken = (event) => {
        const { target: { value } } = event
        setToken(value)
    }

    const handleSetAccessToken = async () => {
        if (await isValidToken(token)) {
            setAccessTokenLocalStorage(token)
            setAccessToken(token)
            setValid(true)
        } else {
            setValid(false)
        }

    }


    return (
        <Form.Group>
            <Form.Label htmlFor="accessToken" >MapboxGL AccessToken</Form.Label>
            <Form.Control id="accessToken" value={token} onChange={handleChangeAccessToken} isInvalid={!valid} />
            {!valid ? <Form.Text>Invalider AccessToken</Form.Text> : null}
            <Button onClick={handleSetAccessToken} >OK</Button>
        </Form.Group>
    )

}

export default Access