// LineChart — wrapper around react-chartjs-2 Line
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineChart = ({ labels, datasets, title, height = 300 }) => {
  const data = {
    labels,
    datasets: datasets.map((ds, i) => ({
      ...ds,
      borderColor: ds.borderColor || 'rgba(99, 102, 241, 1)',
      backgroundColor: ds.backgroundColor || 'rgba(99, 102, 241, 0.1)',
      pointBackgroundColor: ds.pointBackgroundColor || 'rgba(99, 102, 241, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: ds.fill !== undefined ? ds.fill : true,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: datasets.length > 1,
        labels: { color: '#94a3b8', font: { family: 'Inter' } },
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
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
