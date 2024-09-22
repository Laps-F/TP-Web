'use client';

import { useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { FaHouseChimney } from "react-icons/fa6";

import fetchSuggestedAuthors from '@/back/data';
import ArticleCard from '../components/ArticleCard';

const article = {
  title: "Deep Learning for Image Recognitionnnnnnnnnnnnnnnnnnnnnnnnnn",
  year: 2021,
  authors: ["John Doe", "Jane Smith", "Alice Brown"],
  citations: 125
};

function Pesquisa() {
    const router = new useRouter();
    const [author, setAuthor] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
      // Recuperar informações do sessionStorage
      const storedData = sessionStorage.getItem('authorDetails');
      console.log('storedData');
      console.log(storedData);
      if (storedData) {
        setAuthor(JSON.parse(storedData));
      }
    }, []);

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

    const handleSearch = (e) => {
        e.preventDefault();
        // alert(`Você pesquisou por: ${searchQuery}`);
        setSuggestions([]);
        router.push('/pesquisa')
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        setSuggestions([]);
    };
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.appName}>
            <h1 style={styles.title}>Buscador Científico</h1>
        </div>

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

        <div style={styles.homeButton} onClick={() => router.push('/')}>
            <FaHouseChimney color='black' size={42}/>
        </div>
      </header>

      <div style={styles.contentContainer}>
        <p>Mostrando dados atualmente de:</p>

        <div style={styles.nameAuthor}>
            {author? author.name : 'Carregando...'}
        </div>

        <div style={styles.content}>
            <div style={styles.articles}>
                <ArticleCard 
                  title={article.title}
                  year={article.year}
                  authors={article.authors}
                  citations={article.citations}
                />
            </div>
    
            <div style={styles.stats}>
                quadrado de estatisticas do autorrrrrrrrrrrrrrrrrrrrrrrrrrr
            </div>
        </div>
      </div>
    </div>
  );
}

export default Pesquisa;

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'var(--primary-gray)', // Fundo cinza
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    width: '100vw', // Cobre toda a largura da tela
    padding: '20px',
    backgroundImage: 'linear-gradient(to right, #2364f0, #69aaf5, #add8e6)', // Fading de roxo azulado para azul claro
    color: 'var(--secondary-text-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box', // Evita que padding afete o width
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
    color: 'var(--primary-text-color)',
  },
  appName: {
    display: 'flex',
    alignItems: 'center',
    width: '10vw',
  },
  title: {
    fontSize: '2rem',
    margin: 0,
  },
  homeButton: {
    justifyContent: 'center',
    paddingRight: '3vw',
  },
  nameAuthor: {
    width: '100%', // Garante que o conteúdo também cubra toda a largura
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'var(--primary-text-color)',
    backgroundColor: 'white',
    border: '1px solid var(--border-color)',
  },
  contentContainer: {
    flex: 1,
    width: '100%', // Garante que o conteúdo também cubra toda a largura
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    color: 'var(--primary-text-color)',
  },
  content: {
    width: '100%', // Garante que o conteúdo também cubra toda a largura
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    color: 'var(--primary-text-color)',
    
  },
  articles: {
    backgroundColor: 'white',
    border: '1px solid var(--border-color)',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  stats: {
    backgroundColor: 'white',
    border: '1px solid var(--border-color)',
    justifyContent: 'center',
    minHeight: '60vh',

  }
};
