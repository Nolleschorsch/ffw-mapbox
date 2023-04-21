import { getHoseLine } from '../data/hoseline/hoseline'

export const getMinPressure = (hoselineSystem, fooFactor) => {
    const base = hoselineSystem === 'openSystem' ? 0.1 : 1.5
    return Math.round(base * (fooFactor / 100) * 100) / 100
}

export const getNextCurrentPressure = (hoseline, previousPressure, next, prev) => {
    const nextElevationDiff = next.elevation - prev.elevation
    const nextDistanceDiff = next.distance - prev.distance
    const nextPressureDiff = hoseline.getPressureDifferenceTotal(
        { height: nextElevationDiff, length: nextDistanceDiff }
    )
    return Math.round((previousPressure - nextPressureDiff) * 100) / 100
}

export const setPressureAndEngine = (data) => {
    let {
        nextCurrentPressure,
        minPressure,
        previousPressure,
        pressureDiff,
        previousIsEngine,
        pressureSystem,
        currentPressure
    } = data

    let engine = false

    let pressureIn = Math.round((previousPressure - pressureDiff) * 100) / 100
    let pressureOut = Math.round((previousPressure - pressureDiff) * 100) / 100

    if (previousIsEngine) {
        pressureIn = Math.round((pressureSystem - pressureDiff) * 100) / 100
    }

    if (nextCurrentPressure <= minPressure) {
        engine = true
        currentPressure = pressureSystem
        pressureOut = pressureSystem
        previousIsEngine = true
    } else {
        previousIsEngine = false
    }

    return {
        pressureIn,
        pressureOut,
        currentPressure,
        previousIsEngine,
        engine
    }
}

// TODO: make this work. currently not updating correctly => use old version below
// NEW
export const addPressureData = (data, setup, volumeIn, pressureOutPreviousRoute, previousSetupData) => {

    const {
        pressureSystem, hoselineSize, hoselineCount, hoselineSystem, fooFactor, count, flow, volume
    } = setup

    const hoseline = getHoseLine(hoselineSize, flow)

    let [pressureLossTotal, elevationDiff, distanceDiff, pressureDiff] = [0, 0, 0, 0]
    let pressureIn = pressureOutPreviousRoute
    let [pressureOut, currentPressure, previousPressure] = [pressureSystem, pressureSystem, pressureSystem]
    // TODO: minPressure openSystem 0.1 is just an assumption and might be wrong
    /* let _minPressure = hoselineSystem === 'openSystem' ? 0.1 : 1.5
    let minPressure = Math.round(_minPressure * (fooFactor / 100) * 100) / 100 */
    const minPressure = getMinPressure(hoselineSystem, fooFactor)
    let engine = true
    let previousIsEngine = false

    data.forEach((data, index, pressureData) => {
        let [previous_x, x, next_x] = [pressureData[index - 1], pressureData[index], pressureData[index + 1]]
        let { distance, elevation } = x

        if (index === 0) {
            pressureData[index] = Object.assign(
                {},
                pressureData[index],
                {
                    currentPressure,
                    pressureLossTotal,
                    elevationDiff,
                    distanceDiff,
                    pressureDiff,
                    engine,
                    pressureIn,
                    pressureOut
                }
            )
        } else {
            engine = false
            elevationDiff = elevation - previous_x.elevation
            distanceDiff = distance - previous_x.distance
            pressureDiff = hoseline.getPressureDifferenceTotal({ height: elevationDiff, length: distanceDiff })
            currentPressure = Math.round((previousPressure - pressureDiff) * 100) / 100
            pressureLossTotal = Math.round((pressureLossTotal + pressureDiff) * 100) / 100

            if (index + 1 < pressureData.length) {
                let nextCurrentPressure = getNextCurrentPressure(hoseline, previousPressure, next_x, previous_x)

                const pressureAndEngine = setPressureAndEngine({
                    nextCurrentPressure,
                    minPressure,
                    previousPressure,
                    pressureDiff,
                    previousIsEngine,
                    pressureSystem,
                    currentPressure
                })

                pressureIn = pressureAndEngine.pressureIn
                pressureOut = pressureAndEngine.pressureOut
                previousIsEngine = pressureAndEngine.previousIsEngine
                engine = pressureAndEngine.engine
                currentPressure = pressureAndEngine.currentPressure


            }
            // last point needs to be an engine
            if (index + 1 === pressureData.length) {
                engine = true
                currentPressure = pressureSystem
                pressureOut = pressureSystem
                pressureIn = Math.round((previousPressure - pressureDiff) * 100) / 100
            }

            pressureData[index] = Object.assign(
                {},
                pressureData[index],
                {
                    currentPressure,
                    pressureLossTotal,
                    elevationDiff,
                    distanceDiff,
                    pressureDiff,
                    engine,
                    pressureIn,
                    pressureOut
                }
            )

            pressureData[index].currentPressure = currentPressure
            previousPressure = currentPressure
        }
    })

    return [data, setup.count]

}

// OLD UGLY BUT WORKING
/* export const addPressureDataOLD = (data, setupData, destinationVolume, pressureOutPreviousRoute, previousSetupData) => {


    const { pressureSystem, hoselineSize, hoselineCount, hoselineSystem, fooFactor } = setupData
    const prevCount = previousSetupData.count

    // count might be no longer needed since its part of setup now
    let count = 1
    while (destinationVolume > setupData.volume * count || (prevCount % count && count < prevCount)) {
        count++
    }

    //console.log(count, previousSetupData.count, count === previousSetupData.count)
    //console.log(`count: ${count}, setup.count: ${setupData.count}, prevCount: ${prevCount}`)

    const volume = destinationVolume / count

    const flow = volume / hoselineCount
    const hoseline = getHoseLine(hoselineSize, flow)

    let pressureLossTotal = 0
    let elevationDiff = 0
    let distanceDiff = 0
    let pressureDiff = 0
    let pressureIn = pressureOutPreviousRoute
    let pressureOut = pressureSystem
    let currentPressure = pressureSystem
    let previousPressure = pressureSystem
    let _minPressure = hoselineSystem === 'openSystem' ? 0.1 : 1.5 // TODO: minPressure openSystem 0.1 is just an assumption and might be wrong
    let minPressure = parseFloat((_minPressure * (fooFactor / 100)).toFixed(2))
    let engine = true
    let previousIsEngine = false

    data.forEach((data, index, pressureData) => {

        let previous_x = pressureData[index - 1]
        let next_x = pressureData[index + 1]
        let x = pressureData[index]
        let { lat, lng, distance, elevation, distanceReversed, distancePartial, distanceReversedPartial } = x

        if (index === 0) {
            pressureData[index] = Object.assign(
                {},
                pressureData[index],
                {
                    currentPressure,
                    pressureLossTotal,
                    elevationDiff,
                    distanceDiff,
                    pressureDiff,
                    engine,
                    pressureIn,
                    pressureOut
                }
            )
        }

        else {
            engine = false
            elevationDiff = elevation - previous_x.elevation
            distanceDiff = distance - previous_x.distance
            pressureDiff = hoseline.getPressureDifferenceTotal({ height: elevationDiff, length: distanceDiff })
            currentPressure = parseFloat((previousPressure - pressureDiff).toFixed(2))
            pressureLossTotal = parseFloat((pressureLossTotal + pressureDiff).toFixed(2))

            if (index + 1 < pressureData.length) {
                let nextElevationDiff = next_x.elevation - previous_x.elevation
                let nextDistanceDiff = next_x.distance - previous_x.distance
                let nextPressureDiff = hoseline.getPressureDifferenceTotal({ height: nextElevationDiff, length: nextDistanceDiff })
                let nextCurrentPressure = parseFloat((previousPressure - nextPressureDiff).toFixed(2))
                pressureIn = pressureOut = parseFloat((previousPressure - pressureDiff).toFixed(2))
                if (previousIsEngine) {
                    pressureIn = parseFloat((pressureSystem - pressureDiff).toFixed(2))
                }

                if (nextCurrentPressure <= minPressure) {
                    engine = true
                    currentPressure = pressureSystem
                    pressureOut = pressureSystem
                    previousIsEngine = true
                } else {
                    previousIsEngine = false
                }
            }

            // last point needs to be an engine
            if (index + 1 === pressureData.length) {
                engine = true
                currentPressure = pressureSystem
                pressureOut = pressureSystem
                pressureIn = parseFloat((previousPressure - pressureDiff).toFixed(2))
            }

            pressureData[index] = Object.assign(
                {},
                pressureData[index],
                {
                    currentPressure,
                    pressureLossTotal,
                    elevationDiff,
                    distanceDiff,
                    pressureDiff,
                    engine,
                    pressureIn,
                    pressureOut
                }
            )

            pressureData[index].currentPressure = currentPressure
            previousPressure = currentPressure
        }

    })

    return [data, count]

} */

export default addPressureData