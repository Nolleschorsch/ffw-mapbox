import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import LineChart, { setOptions, setLineChartData } from '../LineChart'

describe('LineChart setOptions', () => {
    it('returns expected Object', () => {
        const expected = {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            stacked: false,
            plugins: {
                title: {
                    display: true,
                    text: "foo"
                },
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                },
            },
        }
        expect(setOptions("foo")).toEqual(expected)
    })
})

describe('setLineChartData ', () => {
    it('returns expected Object empty pData', () => {
        expect(setLineChartData([])).toEqual({
            labels: [],
            datasets: [
                {
                    label: 'Höhe',
                    data: [],
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    yAxisID: 'y',
                },
                {
                    label: 'Bar',
                    data: [],
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    yAxisID: 'y1',
                },
            ]
        })
    })
    it('returns expected Object', () => {
        const pData = [{ distance: 100, elevation: 42, currentPressure: 8 }, { distance: 200, elevation: 69, currentPressure: 1337 }]
        const expected = {
            labels: [100, 200],
            datasets: [
                {
                    label: 'Höhe',
                    data: [42, 69],
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    yAxisID: 'y',
                },
                {
                    label: 'Bar',
                    data: [8, 1337],
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    yAxisID: 'y1',
                },
            ],
        }
        expect(setLineChartData(pData)).toEqual(expected)
    })
})

describe('LineChart', () => {
    it('can render', () => {
        const props = { name: "Foo", pData: [] }
        render(<LineChart {...props} />)
    })
})