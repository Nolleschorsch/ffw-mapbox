//import React from 'react'
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { combineReducers } from 'redux';
import undoable from 'redux-undo';
import initialStateSingleRouteEmptySetup from '../../../debug/fixtureSingleRouteEmptySetup.json'
import initialStateTwoRoutesCompleteSetups from '../../../debug/fixtureTwoRoutesCompleteSetups.json'
import setupReducer, { initialState as initialStateSetup } from '../setupSlice'
import mapReducer, { initialState as initialStateMap } from '../../map/mapSlice'
import * as SetupItem from '../SetupItem'
import { updateRouteData } from '../Setup';


jest.mock('../Setup', () => {
    const originalModule = jest.requireActual('../Setup');

    return {
        __esModule: true, // Use it when dealing with esModules
        ...originalModule,
        updateRouteData: jest.fn()
    };
})

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const rootReducer = undoable(combineReducers({ setup: setupReducer, mapbox: mapReducer }), { limit: 10 })
const createState = initialState => actions => actions.reduce(rootReducer, initialState);

/* describe('SetupItem eventHandlers', () => {
    const dispatch = jest.fn()
    const getState = jest.fn()
    let event
    let obj

    afterEach(() => {
        dispatch.mockReset()
        getState.mockReset()
        updateRouteData.mockReset()
    })

    it('handleNameChange', () => {
        event = { target: { value: "foobar" } }
        obj = { name: "woot" }
        SetupItem.handleNameChange(event, obj)(dispatch, getState)
        expect(dispatch).toHaveBeenCalledWith({
            type: 'setup/setSetupData',
            payload: { name: "woot", displayName: "foobar", customName: true }
        })
        expect(dispatch).toHaveBeenCalledTimes(1)
    })
    it('handleEngineChange', () => {
        SetupItem.updateEngine = jest.fn((name, index, value) => { })
        SetupItem.updateRouteData = jest.fn((name, setup) => { })
        getState.mockImplementation(() => {
            return {
                present: {
                    setup: {
                        setups: [
                            { route: "foo" }
                        ]
                    }
                }
            }
        })
        dispatch.mockImplementationOnce((name, index, value) => SetupItem.updateEngine(name, index, value))
            .mockImplementationOnce((name, setup) => SetupItem.updateRouteData(name, setup))
        event = { target: { value: "Pumpe xyz" } }
        obj = { name: "foo", index: 0 }
        SetupItem.handleEngineChange(event, obj)(dispatch, getState)
        expect(dispatch).toHaveBeenCalledTimes(2)
        expect(getState).toHaveBeenCalledTimes(1)
        expect(SetupItem.updateEngine).toHaveBeenCalledTimes(1)
        expect(SetupItem.updateRouteData).toHaveBeenCalledTimes(1)
    })
    it('handleHoselineSizeChange', () => {
        getState.mockImplementation(() => {
            return {
                present: {
                    setup: {
                        setups: [
                            { route: "foo" }
                        ]
                    }
                }
            }
        })
        dispatch.mockImplementationOnce()
            .mockImplementationOnce()
        const event = { target: { value: "B" } }
        const obj = { name: "foo" }
        //SetupItem.set
        //updateRouteData = jest.fn()
        SetupItem.handleHoselineSizeChange(event, obj)(dispatch, getState)
        expect(updateRouteData).toHaveBeenCalledTimes(1)
    })
    it('handleHoselineCountChange', () => {
        event = { target: { value: 2 } }
        obj = { name: "foo" }
        SetupItem.updateHoselineCount = jest.fn()
        getState.mockImplementation(() => {
            return {
                present: {
                    setup: {
                        setups: [
                            { route: "foo" }
                        ]
                    }
                }
            }
        })
        dispatch.mockImplementationOnce(() => SetupItem.updateHoselineCount())
        SetupItem.handleHoselineCountChange(event, obj)(dispatch, getState)
        expect(SetupItem.updateHoselineCount).toHaveBeenCalledTimes(1)
        expect(updateRouteData).toHaveBeenCalledTimes(1)
    })
    it('handleHoselineSystemChange', () => {
        event = { target: { value: "baz" } }
        obj = { name: "foo" }
        getState.mockImplementation(() => {
            return {
                present: {
                    setup: {
                        setups: [
                            { route: "foo" }
                        ]
                    }
                }
            }
        })
        SetupItem.handleHoselineSystemChange(event, obj)(dispatch, getState)
        expect(dispatch).toHaveBeenCalledWith({
            type: 'setup/setSetupData', payload: { name: "foo", hoselineSystem: "baz" }
        })
        expect(updateRouteData).toHaveBeenCalledTimes(1)
    })
}) */

describe('getHoselineSize', () => {
    const cases = [
        {sizes: [], hoselineSize: undefined, expected: ''},
        {sizes: ['A', 'B'], hoselineSize: undefined, expected: ''},
        {sizes: ['B'], hoselineSize: 'A', expected: ''},
        {sizes: ['B'], hoselineSize: 'B', expected: 'B'},
        {sizes: ['A', 'B'], hoselineSize: 'B', expected: 'B'},
    ]
    it.each(cases)('$sizes with $hoselineSize returns $expected', ({sizes, hoselineSize, expected}) => {
        expect(SetupItem.getHoselineSize(sizes, hoselineSize)).toEqual(expected)
    })
})

describe('getHoselineCount', () => {
    const cases = [
        {hoselineSize: undefined, exitPoints: {}, hoselineCount: undefined, expected: ''},
        {hoselineSize: 'B', exitPoints: {}, hoselineCount: undefined, expected: ''},
        {hoselineSize: 'B', exitPoints: {'B': 2}, hoselineCount: undefined, expected: ''},
        {hoselineSize: 'B', exitPoints: {'B': 2}, hoselineCount: 3, expected: ''},
        {hoselineSize: 'B', exitPoints: {'B': 2}, hoselineCount: 2, expected: 2},
    ]
    it.each(cases)('$hoselineSize, $exitPoints, $hoselineCount returns $expexted',
        ({hoselineSize, exitPoints, hoselineCount, expected}) => {
            expect(SetupItem.getHoselineCount(hoselineSize, exitPoints, hoselineCount)).toEqual(expected)
    })
})

describe('getFlow', () => {
    const cases = [
        {hoselineCount: undefined, flow: 400, expected: ''},
        {hoselineCount: 2, flow: 400, expected: 400},
        {hoselineCount: 1, flow: '', expected: ''},
    ]
    it.each(cases)('$hoselineCount, $flow returns $expected', ({hoselineCount, flow, expected}) => {
        expect(SetupItem.getFlow(hoselineCount, flow)).toEqual(expected)
    })
})


describe('wtfBro', () => {
    expect(SetupItem.wtfBro({ volume: 800 }, { flow: 400 })).toEqual(800)
})

describe('getEngineVolumeAndCount', () => {
    it('returns expected values index 0', () => {
        const engine800 = { volume: 800 }
        expect(SetupItem.getEngineVolumeAndCount({
            destinationVolume: 800,
            engine: engine800,
            prevSetup: undefined,
            index: 0
        })).toEqual([800, 1])
        expect(SetupItem.getEngineVolumeAndCount({
            destinationVolume: 600,
            engine: engine800,
            prevSetup: undefined,
            index: 0
        })).toEqual([600, 1])
        expect(SetupItem.getEngineVolumeAndCount({
            destinationVolume: 1300,
            engine: engine800,
            prevSetup: undefined,
            index: 0
        })).toEqual([650, 2])
    })
    it('returns expected values index != 0', () => {
        const engine800 = { volume: 800 }
        const prevSetupCase1 = {hoselineCount: 1, volume: 800, count: 1}
        const prevSetupCase2 = {hoselineCount: 2, volume: 900, count: 1}
        const prevSetupCase3 = {hoselineCount: 1, volume: 600, count: 3}
        expect(SetupItem.getEngineVolumeAndCount({
            destinationVolume: 800,
            engine: engine800,
            prevSetup: prevSetupCase1,
            index: 1
        })).toEqual([800, 1])
        expect(SetupItem.getEngineVolumeAndCount({
            destinationVolume: 1800,
            engine: engine800,
            prevSetup: prevSetupCase2,
            index: 1
        })).toEqual([300, 3])
        expect(SetupItem.getEngineVolumeAndCount({
            destinationVolume: 800,
            engine: engine800,
            prevSetup: prevSetupCase3,
            index: 1
        })).toEqual([600, 1])
    })
})

describe('updateEngine', () => {
    const dispatch = jest.fn()
    const getState = jest.fn(() => {
        return {
            present: {
                setup: {
                    destinationVolume: 800,
                    setups: [
                        { route: "foo" }
                    ]
                }
            }
        }
    })
    //SetupItem.getEngineVolumeAndCount = jest.fn(() => [42, 1])
    SetupItem.updateEngine("foo", 0, "PFP 8/8")(dispatch, getState)
    //expect(SetupItem.getEngineVolumeAndCount).toHaveBeenCalled()
    expect(dispatch).toHaveBeenCalledWith({
        type: 'setup/setSetupData',
        payload: {
            route: "foo",
            engineType: "PFP 8/8",
            volume: 800,
            maxVolume: 800,
            count: 1,
            pressureSystem: 8
        }
    })
    dispatch.mockReset()
    SetupItem.updateEngine("foo", 0, "XXXX")(dispatch, getState)
    expect(dispatch).not.toHaveBeenCalled()
})

describe('updateHoselineCount', () => {
    const dispatch = jest.fn()
    const getState = jest.fn(() => {
        return {
            present: {
                setup: {
                    setups: [{ route: "bar", volume: 800 }, { route: "foo", volume: 1000 }]
                }
            }
        }
    })
    SetupItem.updateHoselineCount("foo", 2)(dispatch, getState)
    expect(dispatch).toHaveBeenCalledWith({
        type: 'setup/setSetupData',
        payload: {
            route: 'foo',
            hoselineCount: 2,
            flow: 500
        }
    })
})