import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import styles from './DoughnutGraph.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const CitationChart = ({ authorCitations, coAuthorCitations }) => {
  const data = {
    labels: ['Citações como Autor', 'Citações como Co-Autor'],
    datasets: [
      {
        data: [authorCitations, coAuthorCitations],
        backgroundColor: ['#6C4AB6', '#1e87ff'], // cores para os segmentos
        hoverBackgroundColor: ['#4B2991', '#0077ff'],
        borderWidth: 2,
      },
    ],
  };
  
  const options = {
    cutout: '70%', // para criar o espaço no centro
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className={styles.graphContainer}>
      {/* Citações como Co-Autor */}
      <div className={styles.citacoes}>
        <p>Total Citações como Co-Autor</p>
        <div className={styles.circle}>
          <h2>{coAuthorCitations}</h2>
        </div>
      </div>

      <div className={styles.graph}> {/* Define o tamanho do gráfico */}
        <Doughnut data={data} options={options} />
      </div>

      {/* Citações como Autor */}
      <div className={styles.citacoes}>
        <p>Total Citações como Autor</p>
        <div className={styles.circle}>
          <h2>{authorCitations}</h2>
        </div>
      </div>
    </div>
  );
};

export default CitationChart;
