import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5vh', height: '100%' }}>
      {/* Citações como Co-Autor */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
        <p>Total Citações como Co-Autor</p>
        <div style={{ borderRadius: '50%', border: '2px solid #000', width: '30%', height: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#69aaf5'}}>
          <h2>{coAuthorCitations}</h2>
        </div>
      </div>

      <div style={{ width: '15vh', height: '20vh' }}> {/* Define o tamanho do gráfico */}
        <Doughnut data={data} options={options} />
      </div>

      {/* Citações como Autor */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
        <p>Total Citações como Autor</p>
        <div style={{ borderRadius: '50%', border: '2px solid #000', width: '30%', height: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#69aaf5' }}>
          <h2>{authorCitations}</h2>
        </div>
      </div>
    </div>
  );
};

export default CitationChart;
