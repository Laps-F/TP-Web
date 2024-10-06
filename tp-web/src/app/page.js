'use client';

import { useState} from 'react';
import { useRouter } from 'next/navigation';

import fetchSuggestedAuthors, { fetchAuthorFromOpenAlex, fetchAuthorshipFromOpenAlex} from '@/back/data';
import styles from './page.module.css';
import Decom from './assets/decom_logo.svg';
import Ufop from './assets/ufop_logo.png';

function Home() {
  const router = new useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [author, setAuthor] = useState(null);

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
    setSuggestions([]);
    const authorObj = await fetchAuthorFromOpenAlex(author.id.split('/').pop())
    const authorshipList = await fetchAuthorshipFromOpenAlex(author.id.split('/').pop())

    console.log(authorshipList);
    console.log(authorObj)

    sessionStorage.setItem('authorDetails', JSON.stringify(authorObj));
    sessionStorage.setItem('authorshipListDetails', JSON.stringify(authorshipList.results));

    router.push('/pesquisa');
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
        />
        <button type="submit">Pesquisar</button>

        {suggestions.length > 0 && (
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