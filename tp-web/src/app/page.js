'use client';

import { useState} from 'react';
import { useRouter } from 'next/navigation';

import fetchSuggestedAuthors, { fetchAuthorFromOpenAlex } from '@/back/data';
import Decom from './assets/decom_logo.svg';
import Ufop from './assets/ufop_logo.png';

function Home() {
  const router = new useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  // const [author, setAuthor] = useState(null);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if(query.length > 0) {
      fetchSuggestedAuthors(query).then(res => setSuggestions(res));
    }
    else {
      setSuggestions([]);
    }
  };

  async function handleSearch (e) {
    e.preventDefault();
    const author = await fetchAuthorFromOpenAlex(searchQuery.id.split('/').pop())
    setSuggestions([]);
    sessionStorage.setItem('authorDetails', JSON.stringify(author));
    router.push('/pesquisa');
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Buscador Científico</h1>

      <form style={styles.searchContainer} onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Digite sua pesquisa..." 
          value={searchQuery.name}
          onChange={handleSearchChange}
        />
        <button type="submit">Pesquisar</button>

        {suggestions.length > 0 && (
          <ul style={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <li 
                key={index} 
                onClick={() => handleSuggestionClick(suggestion)}
                style={styles.suggestionItem}
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </form>

      <div style={styles.sponsorsContainer}>
        <img src={Decom.src} alt="Patrocinador 1" />
        <img src={Ufop.src} alt="Patrocinador 2" />
      </div>
    </div>
  );
}

export default Home;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    minHeight: '100vh', // Para ocupar a tela toda
    position: 'relative', // Para que os patrocinadores fiquem absolutos no rodapé
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '220px',
    position: 'relative', // Necessário para o posicionamento das sugestões
    width: '100%',
    maxWidth: '500px',
  },
  suggestionsList: {
    position: 'absolute',
    top: '110%', // Logo abaixo do campo de pesquisa
    left: '0',
    width: '100%', // Ocupa o mesmo espaço do input
    backgroundColor: 'var(--secondary-text-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '5px',
    zIndex: 1,
  },
  suggestionItem: {
    padding: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid var(--highlight-color)',
  },
  sponsorsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    position: 'absolute',
    bottom: '20px', // Fixa o container no final da página
    width: '100%',
    maxWidth: '500px',
  },
};
