import React from 'react'
import { act, render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
//import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import {
    setOffRoadMode,
    setOriginOffRoad,
    setDestinationOffRoad,
    setRoute,
    resetToInitialStateMapbox
} from '../mapSlice'
import { someRouteFunction } from '../effectfunctions'
import Map from '../Map'
import store from '../../../app/store'
import { setSetup, resetToInitialStateSetup } from '../../setup/setupSlice'

const mockPerformanceMark = jest.fn();
window.performance.mark = mockPerformanceMark;


// below is working
jest.mock('mapbox-gl', () => ({
    Map: jest.fn(() => ({
        once: jest.fn(() => Promise.resolve),
        addLayer: jest.fn().mockReturnThis(),
        removeLayer: jest.fn().mockReturnThis(),
        addSource: jest.fn(),
        removeSource: jest.fn().mockReturnThis(),
        addControl: jest.fn(),
        removeControl: jest.fn(),
        getLayer: jest.fn(),
        getSource: jest.fn(),
        setTerrain: jest.fn(),
        setLayoutProperty: jest.fn(),
        //on: jest.fn(),
        //on: jest.fn((eventType, fn) => fn()),
        on: jest.fn(),
        off: jest.fn(),
        resize: jest.fn()
    })),
    Marker: jest.fn(() => ({
        setLngLat: jest.fn().mockReturnThis(),
        addTo: jest.fn().mockReturnThis(),
        on: jest.fn().mockReturnThis()
    }))
}))

/* // below is working
jest.mock('@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions', () => () => {
    return {
        on: jest.fn(),
    }
});
 */

jest.mock('@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions', () => jest.fn(
    () => ({
        on: jest.fn((evenType, fn) => fn()),
        removeRoutes: jest.fn()
    })
))

jest.mock('@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min', () => jest.fn())

/* jest.mock('../MapControls', () => {
    const ComponentToMock = () => <div data-testid="mapcontrols-mock" />;
    return ComponentToMock;
}) */

jest.mock('../effectfunctions', () => ({
    ...jest.requireActual('../effectfunctions'),
    someRouteFunction: jest.fn(() => ({ type: 'FUCK YOU' })),
    //renderMarkers: jest.fn(())
}))


describe('Map', () => {


    afterEach(() => {
        act(() => store.dispatch(resetToInitialStateMapbox()))
        act(() => store.dispatch(resetToInitialStateSetup()))
        cleanup()
    })
    it('can render without react-redux mock', async () => {
        await act(async () => render(<Provider store={store}><Map /></Provider>))
    })
    it('button clicks', async () => {
        store.dispatch(setRoute({ name: "foo", coordinates: [{}] }))
        store.dispatch(setSetup("foo"))

        await act(async () => render(<Provider store={store}><Map /></Provider>))
        await userEvent.click(await screen.findByRole('button', { name: 'Toggle Sidebar' }))
        await userEvent.click(await screen.findByRole('button', { name: 'Rückgängig' }))
        await userEvent.click(await screen.findByRole('button', { name: 'Wiederholen' }))
    })
    it('open and close Setup Modal', async () => {
        store.dispatch(setRoute({ name: "foo", coordinates: [] }))
        store.dispatch(setSetup("foo"))
        await act(async () => render(<Provider store={store}><Map /></Provider>))
        await userEvent.click(await screen.findByRole('button', { name: 'Aufbau' }))
        await userEvent.click(await screen.findByRole('button', { name: 'Aufbau Strecke 1' }))
        expect(await screen.findByRole('dialog')).toBeVisible()
        await userEvent.click(await screen.findByRole('button', { name: 'Aufbau schließen' }))
        expect(screen.queryByRole('dialog')).toBeNull()
        await userEvent.click(await screen.findByRole('button', { name: 'Aufbau' }))
        await userEvent.click(await screen.findByRole('button', { name: 'Aufbau Strecke 1' }))
        expect(await screen.findByRole('dialog')).toBeVisible()
        await userEvent.keyboard('{Escape}')
    })
    it('open and close Visual Modal', async () => {
        store.dispatch(setRoute({ name: "foo", coordinates: [{}] }))
        store.dispatch(setSetup("foo"))
        await act(async () => render(<Provider store={store}><Map /></Provider>))
        await userEvent.click(await screen.findByRole('button', { name: 'Verlauf' }))
        await userEvent.click(await screen.findByRole('button', { name: 'Verlauf Strecke 1' }))
        expect(await screen.findByRole('dialog')).toBeVisible()
        await userEvent.click(await screen.findByRole('button', { name: 'Verlauf schließen' }))
        expect(screen.queryByRole('dialog')).toBeNull()
        await userEvent.click(await screen.findByRole('button', { name: 'Verlauf' }))
        await userEvent.click(await screen.findByRole('button', { name: 'Verlauf Strecke 1' }))
        expect(await screen.findByRole('dialog')).toBeVisible()
        await userEvent.keyboard('{Escape}')
    })
    it('open and close sidebar', async () => {
        await act(async () => render(<Provider store={store}><Map /></Provider>))
        await userEvent.click(await screen.findByRole('button', { name: 'Toggle Sidebar' }))
        expect(await screen.findByLabelText('Förderstrom')).toBeVisible()
        await userEvent.click(await screen.findByRole('button', { name: 'Toggle Sidebar' }))
        expect(screen.queryByLabelText('Förderstrom')).toBeNull()
    })
    it('bla', async () => {
        store.dispatch(setOffRoadMode(null))
        store.dispatch(setRoute({ name: "foo", coordinates: [] }))
        store.dispatch(setSetup("foo"))
        await act(async () => render(<Provider store={store}><Map /></Provider>))
        await userEvent.click(await screen.findByRole('button', { name: 'Toggle Routes/Markers' }))
        await userEvent.click(await screen.findByRole('button', { name: 'Toggle Routes/Markers' }))
        await userEvent.click(await screen.findByRole('button', { name: 'Toggle Route Edit' }))
        await userEvent.click(await screen.findByRole('button', { name: 'Toggle Route Edit' }))
        await userEvent.click(await screen.findByRole('button', { name: 'Karte zurücksetzen' }))
    })
})