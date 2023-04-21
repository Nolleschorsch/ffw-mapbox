import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import Map from '../features/map/Map'
import Access from '../features/access/Access'

export const getAccessTokenLocalStorage = () => {
    return localStorage.getItem('mapboxAccessToken')
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


export const App = () => {

    console.log("Rerender App")
    const [accessToken, setAccessToken] = useState(getAccessTokenLocalStorage() || '')

    

    return (
        <Container fluid>
            {accessToken
                ? <Map accessToken={accessToken} />
                : <Access setAccessToken={setAccessToken} />
            }
        </Container>
    )

}

export default App