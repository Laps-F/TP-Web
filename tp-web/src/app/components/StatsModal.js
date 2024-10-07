import styles from './StatsModal.module.css'

const StatsModal = ({ isOpen, onRequestClose, author, coAuthor }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onRequestClose();
    }
  };
  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button className={styles.modalCloseButton} onClick={onRequestClose}>&times;</button>
        
        <div className={styles.modalRect}>
          <h3 className={styles.modalHeading}>Instituições</h3>
          <ul>
            {author?.affiliations?.map((inst, index) => (
              <li key={index} className={styles.modalText}>{inst.institution.display_name}</li>
            )) || <p className={styles.modalText}>Nenhuma instituição registrada</p>}
          </ul>
        </div>
        <div className={styles.modalRect}>
          <h3 className={styles.modalHeading}>Tópicos</h3>
          <ul>
            {author?.topics?.map((topic, index) => (
              <li key={index} className={styles.modalText}>{topic.display_name}</li>
            )) || <p className={styles.modalText}>Nenhum tópico encontrado</p>}
          </ul>
        </div>
        <div className={styles.modalRect}>
          <h3 className={styles.modalHeading}>Co-Autores</h3>
          <ul>
            {coAuthor?.map((co, index) => (
              <li key={index} className={styles.modalText}>{co}</li>
            )) || <p className={styles.modalText}>Nenhum co-autor encontrado</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
