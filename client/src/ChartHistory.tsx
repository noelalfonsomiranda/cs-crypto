import React from 'react';
import "chart.js/auto";
import { Line } from 'react-chartjs-2';

// interface HistoryItem {
//   timestamp: number;
//   value: number;
// }

interface Props {
  history: any[];
}

const ChartHistory: React.FC<Props> = ({history}) => {
  const timestamps = history.map(item =>
    new Date(item.timestamp).toISOString().slice(0, 19).replace('T', ' '))
  const prices = history.map(({price}) => price)
    
  const data = {
    labels: timestamps,
    datasets: [
      {
        label: 'Price',
        data: prices,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'History',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return <Line data={data} options={options} />
}

export default ChartHistory