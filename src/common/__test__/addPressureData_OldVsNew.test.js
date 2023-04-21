/* import { addPressureDataNew, addPressureData } from "../calculator";

describe('addPressureDataNew vs addPressureData', () => {
    it('returns same data', () => {
        const data = [
            {distance: 0, elevation: 10},
            {distance: 20, elevation: 10},
            {distance: 40, elevation: 10}
        ]
        const setup = {
            pressureSystem: 8,
            hoselineSize: 'B',
            hoselineCount: 1,
            hoselineSystem: 'closedSystem',
            fooFactor: 100,
            count: 1,
            flow: 800,
            volume: 800
        }
        const volumeIn = 800
        const pressureOutPreviousRoute = 0
        const previousSetupData = {}
        const old = addPressureData(data, setup, volumeIn, pressureOutPreviousRoute, previousSetupData)
        const nu = addPressureDataNew(data, setup, volumeIn, pressureOutPreviousRoute, previousSetupData)
        expect(old).toEqual(nu)
    })
}) */
describe('No longer needed if new version of working as expected addPressureData', () => {
    it.todo('delete this test')
})