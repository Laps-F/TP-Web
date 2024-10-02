'use client';

import ArticleCard from '../components/ArticleCard';
import styles from './ArticlesList.module.css';

const article = {
  title: "Deep Learning for Image Recognitionnnnnnnnnnnnnnnnnnnnnn",
  year: 2021,
  authors: ["John Doe", "Jane Smith", "Alice Brown"],
  citations: 125
};

function ArticlesList({ articles } ) {
    console.log('articles insine ArticleList: ', articles);
    return (
        <div className= {styles.articlesList}>
            {articles && articles.length > 0 ? (
                articles.map((article, index) => (
                    <ArticleCard
                        key={index}
                        title={article.title}
                        year={article.created_date}
                        authors={["John Doe", "Jane Smith", "Alice Brown"]} // Ajuste conforme necessário
                        citations={article.cited_by_count}
                    />
                ))
            ) : (
                <p>Loading articles...</p> // Mensagem de carregamento ou fallback
            )}
        </div>
    );
};

export default ArticlesList;

