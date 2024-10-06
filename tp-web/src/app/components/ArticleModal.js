import styles from './ArticleModal.module.css'; // Importando o mesmo arquivo de estilo

const Modal = ({ isOpen, onClose, article, authorStats}) => {
    if (!isOpen) return null;
  
    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
          onClose(); // Fecha o modal ao clicar fora dele
        }
    };

    return (
        <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
    
                <div className={styles.header}>
                    <h2>{article.display_name}</h2>
                    <p>{article.authorships.map(authorship => authorship.author.display_name).join(', ')}</p>
                </div>
    
                <div className={styles.body}>
                    <div className={styles.summary}>
                    <h3>Palavras Chave</h3>
                    <p>{article.keywords.map(key => key.display_name).join(', ')}</p>
                    </div>
        
                    <div className={styles.topics}>
                    <h3>Tópicos</h3>
                    <ul>
                        {article.topics.length > 0? article.topics.map((topic, index) => (
                        <li key={index}>{topic.display_name}</li>
                        )) : <li>Carregando tópicos</li>}
                    </ul>
                    </div>
                </div>
        
                <div className={styles.footer}>
                    <div className={styles.info}>
                        <p>Publicado em: {article.locations[0].source.display_name}</p>
                        <p>Ano Publicação: {article.publication_year}</p>
                    </div>
        
                    <div className={styles.citation}>
                        <p>Citado por&nbsp;</p>
                        <div className={styles.circle}>{authorStats.totalWorks}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
  

export default Modal;