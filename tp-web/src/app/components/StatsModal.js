import React from 'react';
import Modal from 'react-modal';

const StatsModal = ({ isOpen, onRequestClose, author, coAuthor }) => {

  const styles = {
    modal: {
      content: {
        display: 'flex',
        flexDirection: 'row',
        height: '100vh', // altura completa do modal
        overflowX: 'scroll', // permite rolagem lateral se necessário
        padding: '20px',
        backgroundColor: '#f0f0f0', // fundo cinza claro entre os retângulos
      },
      rect: {
        width: '33.33%',
        margin: '0 10px',
        overflowY: 'scroll', // rolagem vertical em cada retângulo
        border: '1px solid #ddd',
        borderRadius: '10px', // bordas arredondadas
        padding: '20px',
        boxSizing: 'border-box',
        backgroundColor: '#fff', // fundo branco dentro dos retângulos
        textAlign: 'center', // centraliza o texto
      },
      text: {
        marginBottom: '15px', // aumenta a separação entre textos
        lineHeight: '1.5', // melhora a legibilidade
        fontSize: '16px',
        color: '#333',
      },
      heading: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '10px',
        textTransform: 'uppercase',
      },
      closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '24px',
        color: '#333',
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={styles.modal}>
      <div style={styles.modal.rect}>
        <h3 style={styles.modal.heading}>Instituições</h3>
        <ul>
          {author?.affiliations?.map((inst, index) => (
            <li key={index} style={styles.modal.text}>{inst.institution.display_name}</li>
          )) || <p style={styles.modal.text}>Nenhuma instituição registrada</p>}
        </ul>
      </div>
      <div style={styles.modal.rect}>
        <h3 style={styles.modal.heading}>Tópicos</h3>
        <ul>
          {author?.topics?.map((topic, index) => (
            <li key={index} style={styles.modal.text}>{topic.display_name}</li>
          )) || <p style={styles.modal.text}>Nenhum tópico encontrado</p>}
        </ul>
      </div>
      <div style={styles.modal.rect}>
        <h3 style={styles.modal.heading}>Co-Autores</h3>
        <ul>
          {coAuthor?.map((co, index) => (
            <li key={index} style={styles.modal.text}>{co}</li>
          )) || <p style={styles.modal.text}>Nenhum co-autor encontrado</p>}
        </ul>
      </div>
      <button style={styles.modal.closeButton} onClick={onRequestClose}>&times;</button>
    </Modal>
  );
};

export default StatsModal;
