'use client';

import { useState} from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import fetchSuggestedAuthors, { fetchAuthorFromOpenAlex, fetchAuthorshipFromOpenAlex} from '@/back/data';
import styles from './page.module.css';
import Decom from './assets/decom_logo.svg';
import Ufop from './assets/ufop_logo.png';

function Home() {
  const router = new useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    setSuggestions([]);
    const authorObj = await fetchAuthorFromOpenAlex(author.id.split('/').pop())
    const authorshipList = await fetchAuthorshipFromOpenAlex(author.id.split('/').pop())

    let searchHistory = [];
    searchHistory.push({author: authorObj, authorship: authorshipList.results});

    router.push('/pesquisa');

    sessionStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    setLoading(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setAuthor(suggestion);
    setSearchQuery(suggestion.name);
    setSuggestions([]);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Buscador Científico</h1>

      <form className={styles.searchContainer} onSubmit={handleSearch}>
        <input 
            type="text" 
            placeholder="Digite sua pesquisa..." 
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
        />
        {loading ? (
          <button type="button" className={styles.loadingButton} disabled>
              <span className={styles.loadingSpinner}></span></button>
        ) : (
          <button type="submit" className={styles.searchButton}><FontAwesomeIcon icon={faSearch} /></button>
        )}
        

        {suggestions && suggestions.length > 0 && (
          <ul className={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <li 
                key={index} 
                onClick={() => handleSuggestionClick(suggestion)}
                className={styles.suggestionItem}
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </form>

      <div className={styles.sponsorsContainer}>
        <img src={Decom.src} alt="Patrocinador 1" />
        <img src={Ufop.src} alt="Patrocinador 2" />
      </div>
    </div>
  );
}

export default Home;