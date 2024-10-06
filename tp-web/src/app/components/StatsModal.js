import React from 'react';
import Modal from 'react-modal';

import styles from './StatsModal.module.css';

const StatsModal = ({ isOpen, onRequestClose, author, coAuthor}) => {
//   const styles = {
//     modal: {
//       content: {
//         display: 'flex',
//         flexDirection: 'row',
//         height: '100vh', // altura completa do modal
//         overflowX: 'scroll', // permite rolagem lateral se necessário
//         padding: '20px',
//       },
//       rect: {
//         width: '33.33%',
//         margin: '0 10px',
//         overflowY: 'scroll', // rolagem vertical em cada retângulo
//         border: '1px solid #ddd',
//         padding: '20px',
//         boxSizing: 'border-box',
//       },
//       closeButton: {
//         position: 'absolute',
//         top: '10px',
//         right: '10px',
//         cursor: 'pointer',
//       }
//     }
//   };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className={styles.modal.rect}>
        <h3>Instituições</h3>
        <ul>
          {author?.affiliations?.map((inst) => (
            <li>{inst.institution.display_name}</li>
          )) || <p>Nenhuma instituição registrada</p>}
        </ul>
      </div>
      <div className={styles.modal.rect}>
        <h3>Tópicos</h3>
        <ul>
          {author?.topics?.map((topic, index) => (
            <li key={index}>{topic.display_name}</li>
          )) || <p>Nenhum tópico encontrado</p>}
        </ul>
      </div>
      <div className={styles.modal.rect}>
        <h3>Co-Autores</h3>
        <ul>
          {coAuthor?.map(co => (
            <li>{co}</li>
          )) || <p>Nenhum co-autor encontrado</p>}
        </ul>
      </div>
      <button className={styles.modal.closeButton} onClick={onRequestClose}>&times;</button>
    </Modal>
  );
};

export default StatsModal;
