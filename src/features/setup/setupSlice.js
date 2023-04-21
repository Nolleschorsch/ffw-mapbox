import { createSlice } from '@reduxjs/toolkit'
//import initialStateDebug from '../../debug/bla.json';
import initialStateDebug from '../../debug/stateRouteIsSet.json';

export const initialState = { setups: [], destinationVolume: 1600, showSetup: false, openSetup: null }

export const initialStateFuck = initialStateDebug.present.setup

export const setupSlice = createSlice({
    name: 'setup',
    initialState: initialState,
    //initialState: initialStateDebug.present.setup,
    reducers: {
        resetToInitialStateSetup(state, action) {
            return { ...initialState }
        },
        setOpenSetup(state, action) {
            return {
                ...state,
                openSetup: action.payload
            }
        },
        setShowSetup(state, action) {
            return {
                ...state,
                showSetup: action.payload
            }
        },
        setDestinationVolume(state, action) {
            return {
                ...state,
                destinationVolume: action.payload
            }
        },
        addSetup(state, action) {
            if (!state.setups.filter(x => x.route === action.payload.routeName).length) {
                const newSetups = [...state.setups]
                newSetups.splice(action.payload.index, 0, { route: action.payload.routeName, fooFactor: 100 })
                return {
                    ...state,
                    setups: newSetups.map((s, i) => s.customName ? s : Object.assign({}, s, { displayName: `Strecke ${i + 1}` }))
                }
            }
        },
        removeSetup(state, action) {
            return { ...state, setups: [...state.setups.filter(x => x.route !== action.payload)] }
        },
        setSetup(state, action) {
            return { ...state, setups: [{ route: action.payload, displayName: "Strecke 1", customName: false, fooFactor: 100 }] }
        },
        /* setSetupData(state, action) {
            const {name, ...data} = action.payload
            const index = state.setups.findIndex(setup => setup.route === name)
            const newState = [...state.setups]
            const setup = newState[index]
            const newSetup = {...setup, ...data}
            newState.splice(index, 1, newSetup)
            return {...state, setups: newState}
        }, */
        setSetupData(state, action) {
            const { route, ...data } = action.payload
            const index = state.setups.findIndex(setup => setup.route === route)
            const newState = [...state.setups]
            const setup = newState[index]
            const newSetup = { ...setup, ...data }
            newState.splice(index, 1, newSetup)
            return { ...state, setups: newState }
        },
        resetSetup() {
            return { setups: [], destinationVolume: 0 }
        },
        updateSetup(state, action) {
            const { index, data } = action.payload
            const newState = [...state.setups]
            newState.splice(index, 1, data)
            return {
                ...state,
                setups: [...newState]
            }
        }
    }
})

export const {
    resetToInitialStateSetup,
    setOpenSetup,
    setShowSetup,
    setDestinationVolume,
    addSetup,
    removeSetup,
    setSetup,
    resetSetup,
    updateSetup,
    setSetupData
} = setupSlice.actions
export default setupSlice.reducer