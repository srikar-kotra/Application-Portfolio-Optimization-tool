import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';
Chart.register(...registerables);

const PieChart = ({ labels, dataval }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        let chartInstance = null;

        // Check if chartRef.current is available before creating the chart
        if (chartRef.current && labels && dataval) {
            const chartOptions = {
                plugins: {
                    legend: {
                        display: true,
                        position: 'right',
                    },
                    title: {
                        display: true,
                        text: 'Pie Chart',
                        fontSize: 20,
                    },
                },
            };

            const chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Pie',
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                        ],
                        data: dataval,
                    },
                ],
            };

            // Destroy the existing Chart instance, if any
            if (chartInstance) {
                chartInstance.destroy();
            }

            chartInstance = new Chart(chartRef.current, {
                type: 'pie',
                data: chartData,
                options: chartOptions,
            });
        }

        // Cleanup function to destroy the Chart instance when the component unmounts
        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [labels, dataval]);

    return <canvas ref={chartRef} />;
};

export default PieChart;
