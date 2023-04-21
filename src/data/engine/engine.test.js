import { availableEngines, getEngine, getValidEngines } from './engines'
//{ name: "FP 8/8", volume: 800, pressureSystem: 8, DIN: 14420, sizes: ['B'], entryPoints: { 'A': 1, 'B': 2 }, exitPoints: { 'A': 1, 'B': 2 } },
describe("engines have expected properties", () => {
    it.each(availableEngines)("", (engine) => {
        //console.log(engine)
        expect(engine.name).toBeDefined()
        expect(engine.volume).toBeDefined()
        expect(engine.pressureSystem).toBeDefined()
        expect(engine.DIN).toBeDefined()
        expect(engine.sizes).toBeDefined()
        expect(engine.entryPoints).toBeDefined()
        expect(engine.exitPoints).toBeDefined()
    }) 
})

describe('getEngine', () => {
    it('returns undefined if engine doesnt exist', () => {
        expect(getEngine('foo')).toEqual(undefined)
    })
    it('returns engine if engine exists', () => {
        expect(getEngine('FPN 10-2000')).toEqual({
            name: "FPN 10-2000",
            volume: 2000,
            pressureSystem: 10,
            DIN: 1028,
            sizes: ['B'],
            entryPoints: { 'A': 2, 'B': 4 },
            exitPoints: { 'A': 2, 'B': 4 }
        })
    })
})

describe('getValidEngines', () => {
    it('returns empty list if no valid engines', () => {
        const previousSetup = {maxVolume: 400, flow: 400}
        expect(getValidEngines(previousSetup)).toEqual([])
    })
    it('returns list of valid engines', () => {
        const previousSetup = {maxVolume: 2000, flow: 1000}
        expect(getValidEngines(previousSetup)).toHaveLength(7)
    })
})