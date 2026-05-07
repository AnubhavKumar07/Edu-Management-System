// PieChart — wrapper around react-chartjs-2 Pie
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  'rgba(99, 102, 241, 0.8)',
  'rgba(16, 185, 129, 0.8)',
  'rgba(245, 158, 11, 0.8)',
  'rgba(239, 68, 68, 0.8)',
  'rgba(14, 165, 233, 0.8)',
  'rgba(168, 85, 247, 0.8)',
  'rgba(236, 72, 153, 0.8)',
  'rgba(34, 211, 238, 0.8)',
  'rgba(163, 230, 53, 0.8)',
  'rgba(251, 146, 60, 0.8)',
];

const PieChart = ({ labels, values, title, height = 300 }) => {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: COLORS.slice(0, labels.length),
        borderColor: 'rgba(15, 15, 26, 0.8)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 11 },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      title: {
        display: !!title,
        text: title,
        color: '#f1f5f9',
        font: { family: 'Inter', size: 14, weight: 600 },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 15, 26, 0.9)',
        titleFont: { family: 'Inter' },
        bodyFont: { family: 'Inter' },
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
  };

  return (
    <div style={{ height }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
