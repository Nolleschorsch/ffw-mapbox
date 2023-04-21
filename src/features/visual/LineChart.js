import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import Accordion from 'react-bootstrap/Accordion'
import { getRouteColor } from '../../common/colors'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const setOptions = (title) => {
    return {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
                text: title
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
}



export const setLineChartData = (pData) => {

    const labels = pData.map(p => p.distance)
    return ({
        labels,
        datasets: [
            {
                label: 'Höhe',
                data: labels.map(((x, i) => pData[i].elevation)),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                yAxisID: 'y',
            },
            {
                label: 'Bar',
                data: labels.map(((x, i) => pData[i].currentPressure)),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                yAxisID: 'y1',
            },
        ],
    })
};


export const LineChart = (props) => {

    const {pData, name} = props
    //const pressureData = useSelector(state => state.present.mapbox.routes)
    //const setupData = useSelector(state => state.present.setup)


    //const pData = x.coordinates
    //const name = setupData.setups[i].displayName
    //const color = getRouteColor(x)
    const lineChartData = setLineChartData(pData)
    const options = setOptions(name)

    return (
        <div className="linechart-container"><Line options={options} data={lineChartData} /></div>
    )






}

export default LineChart