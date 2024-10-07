'use client';

import { useState } from 'react';

import ArticleCard from '../components/ArticleCard';
import Modal from './ArticleModal';
import styles from './ArticlesList.module.css';


function ArticlesList({ articles, authorStats} ) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);

    const openModal = (article) => {
        setSelectedArticle(article);
        setIsModalOpen(true);
    };

    return (
        <div className= {styles.articlesList}>
            {articles && articles.length > 0 ? (
                articles
                    .sort((a, b) => b.cited_by_count - a.cited_by_count)
                    .map((article, index) => (
                    <ArticleCard
                        key={index}
                        title={article.title}
                        year={article.created_date}
                        authors={article.authorships.map(authorship => authorship.author.display_name)}
                        citations={article.cited_by_count}
                        onClick={() => openModal(article)}
                    />
                ))
            ) : (
                <p>Loading articles...</p> 
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} article={selectedArticle} authorStats={authorStats}/>
        </div>
    );
};

export default ArticlesList;

