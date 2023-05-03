import reducer, {
    initialState,
    setOpenSetup,
    setShowSetup,
    setDestinationVolume,
    addSetup,
    removeSetup,
    setSetup,
    setSetupData,
    resetSetup,
    updateSetup
} from '../setupSlice'


describe('setupSlice', () => {
    it('should return initialState', () => {
        expect(reducer(undefined, {})).toEqual(initialState)
    })
    it('should handle setDestinationVolume', () => {
        const previousState = { destinationVolume: 0, setups: [] }
        expect(reducer(previousState, setDestinationVolume(1200))).toEqual({
            destinationVolume: 1200, setups: []
        })
    })
    it('setOpenSetup', () => {
        expect(reducer(initialState, setOpenSetup(1))).toEqual({
            ...initialState, openSetup: 1
        })
    })
    it('setShowSetup', () => {
        expect(reducer(initialState, setShowSetup(true))).toEqual({
            ...initialState, showSetup: true
        })
    })
    it('should handle addSetup on empty list', () => {
        const previousState = { setups: [], destinationVolume: 0 }
        expect(reducer(previousState, addSetup({ routeName: "foo", index: 0 }))).toEqual({
            setups: [{ route: "foo", displayName: "Strecke 1" }],
            destinationVolume: 0
        })
    })
    it('should handle addSetup none empty list', () => {
        const previousState = { setups: [{ route: "foo" }], destinationVolume: 0 }
        expect(reducer(previousState, addSetup({ routeName: "bar", index: 1 }))).toEqual({
            setups: [
                { route: "foo", displayName: "Strecke 1" },
                { route: "bar", displayName: "Strecke 2" }
            ],
            destinationVolume: 0
        })
    })
    it('should handle addSetup with customName none empty list', () => {
        const previousState = {
            setups: [
                { route: "foo", customName: true, displayName: "Foo 1" }], destinationVolume: 0
        }
        expect(reducer(previousState, addSetup({ routeName: "bar", index: 1 }))).toEqual({
            setups: [
                { route: "foo", displayName: "Foo 1", customName: true },
                { route: "bar", displayName: "Strecke 2" }
            ],
            destinationVolume: 0
        })
    })
    it('should handle addSetup none empty list same route', () => {
        const previousState = { setups: [{ route: "foo" }], destinationVolume: 0 }
        expect(reducer(previousState, addSetup({ routeName: "foo", index: 0 }))).toEqual({
            setups: [{ route: "foo" }],
            destinationVolume: 0
        })
    })
    it('should handle removeSetup on empty list', () => {
        const previousState = { setups: [], destinationVolume: 0 }
        expect(reducer(previousState, removeSetup("foo"))).toEqual({ setups: [], destinationVolume: 0 })
    })
    it('should handle removeSetup none empty list', () => {
        const previousState = {
            setups: [
                { route: "foo" },
                { route: "bar" },
                { route: "baz" }
            ],
            destinationVolume: 0
        }
        expect(reducer(previousState, removeSetup("bar"))).toEqual({
            setups: [
                { route: "foo" },
                { route: "baz" }
            ],
            destinationVolume: 0
        })
    })
    it('should handle setSetup', () => {
        const previousState = { setups: [{ route: "bar" }], destinationVolume: 0 }
        expect(reducer(previousState, setSetup("foo"))).toEqual({
            setups: [{ route: "foo", displayName: "Strecke 1", customName: false }],
            destinationVolume: 0
        })
    })
    it('setSetupData', () => {
        const previousState = {
            setups: [
                { route: "foo" },
                { route: "bar" }
            ],
            destinationVolume: 0
        }
        expect(reducer(previousState, setSetupData({ route: "foo", baz: 42 }))).toEqual({
            setups: [
                { route: "foo", baz: 42 },
                { route: "bar" }
            ],
            destinationVolume: 0
        })
    })
    it('resetSetup', () => {
        const previousState = {
            setups: [
                { route: "foo", baz: 42 },
                { route: "bar" }
            ],
            destinationVolume: 0
        }
        expect(reducer(previousState, resetSetup())).toEqual({
            setups: [], destinationVolume: 0
        })
    })
    it('updateSetup', () => {
        const previousState = {
            setups: [
                { route: "foo", baz: 42 },
                { route: "bar" }
            ],
            destinationVolume: 0
        }
        expect(reducer(previousState, updateSetup({ index: 1, data: { route: "bar", baz: 69 } }))).toEqual({
            setups: [
                { route: "foo", baz: 42 },
                { route: "bar", baz: 69 }
            ],
            destinationVolume: 0
        })
    })
})