import React from 'react';
import Modal from 'react-modal';

const StatsModal = ({ isOpen, onRequestClose, author}) => {
    const coAuthor = []
  const styles = {
    modal: {
      content: {
        display: 'flex',
        flexDirection: 'row',
        height: '100vh', // altura completa do modal
        overflowX: 'scroll', // permite rolagem lateral se necessário
        padding: '20px',
      },
      rect: {
        width: '33.33%',
        margin: '0 10px',
        overflowY: 'scroll', // rolagem vertical em cada retângulo
        border: '1px solid #ddd',
        padding: '20px',
        boxSizing: 'border-box',
      },
      closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        cursor: 'pointer',
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={styles.modal}>
      <div style={styles.modal.rect}>
        <h3>Instituições</h3>
        <ul>
          {author?.last_known_institutions?.display_name?.map((inst, index) => (
            <li key={index}>{inst.display_name}</li>
          )) || <p>Nenhuma instituição registrada</p>}
        </ul>
      </div>
      <div style={styles.modal.rect}>
        <h3>Tópicos</h3>
        <ul>
          {author?.topics?.map((topic, index) => (
            <li key={index}>{topic.display_name}</li>
          )) || <p>Nenhum tópico encontrado</p>}
        </ul>
      </div>
      <div style={styles.modal.rect}>
        <h3>Co-Autores</h3>
        <ul>
          {coAuthor?.map((co, index) => (
            <li key={index}>{co.author}</li>
          )) || <p>Nenhum co-autor encontrado</p>}
        </ul>
      </div>
      <button style={styles.modal.closeButton} onClick={onRequestClose}>Fechar</button>
    </Modal>
  );
};

export default StatsModal;
