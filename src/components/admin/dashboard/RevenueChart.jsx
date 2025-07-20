import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

const RevenueChart = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || 'rgba(59, 130, 246, 0.7)', // mặc định màu xanh Tailwind
      borderRadius: 6,
      barThickness: 18,
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#4B5563', // text-gray-600
          font: { size: 12, family: 'inherit' },
        },
      },
      tooltip: {
        backgroundColor: '#1F2937', // bg-gray-800
        titleFont: { weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 10,
      },
    },
    scales: {
      x: {
        ticks: { color: '#6B7280', font: { size: 12 } }, // text-gray-500
        grid: { display: false },
      },
      y: {
        ticks: { color: '#6B7280', font: { size: 12 } },
        grid: {
          color: '#E5E7EB', // border-gray-200
          drawBorder: false,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Doanh thu 30 ngày gần nhất</h2>
      <div className="h-72">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default RevenueChart;
