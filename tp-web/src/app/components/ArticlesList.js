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
    return (
        <div className= {styles.articlesList}>
            {console.log(articles.results)}
            {/* {articles.result.map((article, index) => (
                <ArticleCard
                    key={index}
                    title={article.title}
                    year={article.created_date}
                    authors={"teste"}
                    citations={article.cited_by_count}
                />
            ))} */}
        </div>
    );
};

export default ArticlesList;

