import React from 'react';
import { Scatter } from 'react-chartjs-2';

const ScatterPlot = ({ data }) => {
    const scatterData = {
        datasets: [
            {
                label: 'Scatter Plot',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                pointRadius: 6,
                pointHoverRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'linear', // Use 'linear' scale for the X-axis (numeric data)
                position: 'bottom',
                title: {
                    display: true,
                    text: 'Technicality',
                    font: {
                        weight: 'bold',
                    },
                },
            },
            y: {
                type: 'linear', // Use 'linear' scale for the Y-axis (numeric data)
                title: {
                    display: true,
                    text: 'Business Criticality',
                    font: {
                        weight: 'bold',
                    },
                },
            },
        },
    };

    return (
        <div>
            <Scatter data={scatterData} options={options} />
        </div>
    );
};

export default ScatterPlot;
