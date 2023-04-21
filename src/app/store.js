import { combineReducers, configureStore } from '@reduxjs/toolkit'
import undoable, { excludeAction } from 'redux-undo';
import setupReducer from '../features/setup/setupSlice'
import mapReducer from '../features/map/mapSlice'

export const rootReducer = combineReducers({
    setup: setupReducer,
    mapbox: mapReducer
})

export const undoableRootReducer = undoable(rootReducer, {limit: 100})


export const store = configureStore({
    reducer: undoableRootReducer
})

export default store