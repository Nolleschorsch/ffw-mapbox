// innendurchmesser B: 75mm A: 110mm
//import * as interpoly from 'interpolating-polynomial'

export class HoseLine {

    constructor() {
        this.name = ''
        this.display = ''
        this.hoseLength = 0
        this.flowFrictionData100Meter = {}
        this.pressureDifferenceHeight10m = 0
        this.pressureDifferenceLength100m = 0
        this.flow = 0
        this.friction = 0
    }

    /* interpoly(points) {
        var n = points.length - 1, p;

        p = function (i, j, x) {
            if (i === j) {
                return points[i][1];
            }

            return ((points[j][0] - x) * p(i, j - 1, x) +
                (x - points[i][0]) * p(i + 1, j, x)) /
                (points[j][0] - points[i][0]);
        };

        return function (x) {
            if (points.length === 0) {
                return 0;
            }
            return p(0, n, x);
        };
    }

    getFriction(volume) {
        const points = Object.keys(this.flowFrictionData100Meter).map(key => {
            return [parseInt(key), this.flowFrictionData100Meter[key]]
        })
        const f = this.interpoly(points)
        return f(volume)
    } */

    setFlow(value) {
        if (this.flowFrictionData100Meter[value] != undefined) {
            this.flow = value
            this.friction = this.flowFrictionData100Meter[value]
        } else {
            this.friction = this._getNextBiggestValue(value)
        }
    }

    // this might cause unexpected behavior?
    // use next biggest value if key is missing from flowFricitonData100Meter 
    _getNextBiggestValue(value) {
        const availableValues = Object.keys(this.flowFrictionData100Meter).map(k => parseInt(k))
        let nextBiggestKey
        for (let i = 0; i < availableValues.length; i++) {
            nextBiggestKey = availableValues[i]
            if (value <= nextBiggestKey) break;
        }
        const nextBiggestValue = this.flowFrictionData100Meter[nextBiggestKey]

        return nextBiggestValue
    }

    getPressureDifferenceHeight(height) {
        return parseFloat(((this.pressureDifferenceHeight10m / 10) * height).toFixed(2))
    }

    getPressureDifferenceLength(length) {
        return parseFloat(((this.friction / 100) * length).toFixed(2))
    }

    getPressureDifferenceTotal(heigthLengthObj) {
        let { height, length } = heigthLengthObj
        return parseFloat((this.getPressureDifferenceHeight(height) + this.getPressureDifferenceLength(length)).toFixed(2))
    }

}

// 100 meter B-Hoseline
export class BHoseLine100 extends HoseLine {

    constructor(flow) {
        super()
        this.name = 'B'
        this.display = 'B-Schlauch (LFS BW)'
        this.hoseLength = 0.02;
        this.flowFrictionData100Meter = {
            200: 0.1,
            400: 0.3,
            600: 0.6,
            800: 1.0,
            1000: 1.4,
            1200: 2.0
        }
        this.pressureDifferenceHeight10m = 1
        this.setFlow(flow)
    }

}

export class BHoseLine100EinsatzleiterWiki extends HoseLine {

    constructor(flow) {
        super()
        this.name = 'B1'
        this.display = 'B-Schlauch (Einsatzleiterwiki)'
        this.hoseLength = 0.02;
        this.flowFrictionData100Meter = {
            200: 0.1,
            300: 0.2,
            400: 0.3,
            500: 0.5,
            600: 0.6,
            700: 0.9,
            800: 1.1,
            900: 1.5,
            1000: 1.7,
            1100: 1.9,
            1200: 2.5,
            1300: 2.9,
            1400: 3.45,
            1500: 4.0,
            1600: 4.6,
            1700: 5.2,
            1800: 5.8,
            1900: 6.4,
            2000: 7.0
        }
        this.pressureDifferenceHeight10m = 1
        this.setFlow(flow)
    }

}

export class BHoseLine100GrossTwueltedt extends HoseLine {

    constructor(flow) {
        super()
        this.name = 'B2'
        this.display = 'B-Schlauch (feuerwehr-gross-twuelpstedt.de)'
        this.hoseLength = 0.02;
        this.flowFrictionData100Meter = {
            200: 0.1,
            300: 0.2,
            400: 0.3,
            500: 0.5,
            600: 0.7,
            700: 0.9,
            800: 1.1,
            900: 1.4,
            1000: 1.7,
            1100: 2.1,
            1200: 2.5
        }
        this.pressureDifferenceHeight10m = 1
        this.setFlow(flow)
    }

}

export class AHoseLine100EinsatzleiterWiki extends HoseLine {

    constructor(flow) {
        super()
        this.name = 'A'
        this.display = 'A-Schlauch (Einsatzleiterwiki)'
        this.hoseLength = 0.02;
        this.flowFrictionData100Meter = {
            1000: 0.3,
            1100: 0.35,
            1200: 0.4,
            1300: 0.45,
            1400: 0.5,
            1500: 0.6,
            1600: 0.65,
            1700: 0.75,
            1800: 0.8,
            1900: 0.9,
            2000: 1.0,
            2100: 1.1,
            2200: 1.2,
            2300: 1.3,
            2400: 1.45,
            2500: 1.6,
            2600: 1.75,
            2700: 1.9,
            2800: 2.0,
            2900: 2.15,
            3000: 2.3
        }
        this.pressureDifferenceHeight10m = 1
        this.setFlow(flow)
    }

}

export const availableHoselines = [BHoseLine100, BHoseLine100EinsatzleiterWiki, AHoseLine100EinsatzleiterWiki]

export const getHoseLine = (hoseline, flow) => {
    switch (hoseline) {
        case 'B':
            return new BHoseLine100(flow)
        case 'B1':
            return new BHoseLine100EinsatzleiterWiki(flow)
        case 'B2':
            return new BHoseLine100GrossTwueltedt(flow)
        case 'A':
            return new AHoseLine100EinsatzleiterWiki(flow)
        default:
            return new BHoseLine100(flow)
    }
}

// TODO: add A, B and D Hoselines