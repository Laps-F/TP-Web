import React from 'react';
import styles from './ArticleCard.module.css';

const ArticleCard = ({ title, year, authors, citations }) => {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <h2>{title}</h2>
        <p className={styles.year}>{year} ; {authors.join(', ')}</p>
      </div>
      <div className={styles.citationsContainer}>
        <p className={styles.citationsLabel}>Citações</p>
        <div className={styles.citationsCircle}>
          <span>{citations}</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
