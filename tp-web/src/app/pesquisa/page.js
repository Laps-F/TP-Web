'use client';

import { useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { FaHouseChimney } from "react-icons/fa6";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faTags, faUsers, faChevronLeft, faSearch } from '@fortawesome/free-solid-svg-icons';

import fetchSuggestedAuthors, { fetchAuthorFromOpenAlex, fetchAuthorshipFromOpenAlex} from '@/back/data';
import ArticlesList from '../components/ArticlesList';
import CitationChart from '../components/DoughnutGraph';
import StatsModal from '../components/StatsModal';
import styles from './page.module.css';

function Pesquisa() {
  const router = new useRouter(); 
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState(null);
  const [authorshipList, setAuthorshipList] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [id, setId] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [authorStats, setAuthorStats] = useState({
    totalWorks: 0,
    firstAuthorWorks: 0,
    coAuthorWorks: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const searchHistory = sessionStorage.getItem("searchHistory");

    if(searchHistory){
      let obj = JSON.parse(searchHistory);
      setSearchHistory(obj);
      setAuthor(obj[0].author);
      setAuthorshipList(obj[0].authorship);
    }
  }, []);

  useEffect(() => {
    calculateAuthorStats(authorshipList);
  }, [authorshipList]);


  function createCoAutorList(articles) {
    let coAuthor = []
      if (articles){
          const coAuthorsSet = new Set();
  
          articles.forEach(article => {

            article.authorships.forEach(authorship => {
              if (authorship.author.display_name !== author.display_name) {
              coAuthorsSet.add(authorship.author.display_name);
              }
          });
          });
          coAuthor = Array.from(coAuthorsSet);
      }
      return coAuthor;
  }
  function findSecondMostFrequentAuthor(articles) {
    const authorFrequency = {};

    articles.forEach(article => {
        article.authorships.forEach(authorship => {
            const authorName = authorship.author.display_name;

            if (authorFrequency[authorName]) {
                authorFrequency[authorName]++;
            } else {
                authorFrequency[authorName] = 1;
            }
        });
    });

    let maxCount = 0;
    let secondMaxCount = 0;
    let secondMostFrequentAuthor = null;

    for (const [author, count] of Object.entries(authorFrequency)) {
        if (count > maxCount) {
            secondMaxCount = maxCount;
            secondMostFrequentAuthor = author;

            maxCount = count;
        } else if (count > secondMaxCount) {
            secondMaxCount = count;
            secondMostFrequentAuthor = author;
        }
    }

    return { author: secondMostFrequentAuthor, count: secondMaxCount };
  }
  const coAutor = findSecondMostFrequentAuthor(authorshipList);
  const coAutorList = createCoAutorList(authorshipList);

  const calculateAuthorStats = (articles) => {
    let totalWorks = 0;
    let firstAuthorWorks = 0;
    let coAuthorWorks = 0;

    for (let i = 0; i < articles.length; i++) {
      let authorList = articles[i].authorships
      if (authorList.some(a => a.author.id === author.id && a.author_position === 'first')){
        firstAuthorWorks++;
      }
      else if (authorList.some(a => a.author.id === author.id && a.author_position !== 'first'))
        coAuthorWorks++;
      totalWorks++;
    }

    setAuthorStats({
      totalWorks,
      firstAuthorWorks,
      coAuthorWorks
    });
  };

  function getLastSearch() {
    if (searchHistory.length > 1) {
        const obj = searchHistory[searchHistory.length - 2];
        setSearchHistory(searchHistory => searchHistory.slice(0, -1));
        if(obj !== null && obj !== undefined) {
          setAuthor(obj.author);
          setAuthorshipList(obj.authorship);
        }
    } else {
        return null;
    }
  }
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
    sessionStorage.clear();

    const authorObj = await fetchAuthorFromOpenAlex(id.split('/').pop())
    const authorshipList = await fetchAuthorshipFromOpenAlex(id.split('/').pop())

    let searchHistoryStorage = searchHistory;
    searchHistoryStorage.push({author: authorObj, authorship: authorshipList.results});

    setSearchHistory(searchHistoryStorage);
    setAuthor(authorObj);
    setAuthorshipList(authorshipList.results);
    setLoading(false);
    setSearchQuery('');
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setId(suggestion.id);
    setSuggestions([]);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.appName}>
            <h1 className={styles.title}>Buscador Científico</h1>
        </div>

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

        <div className={styles.homeButton} onClick={() => router.push('/')}>
            <FaHouseChimney color='black' size={42}/>
        </div>
      </header>

      <div className={styles.contentContainer}>
        <div className={styles.nameAuthorContainer}>
          <h1>Mostrando dados atualmente de</h1>
          <div className={styles.nameAuthor}>
              <p>{author? author.display_name : 'Carregando...'}</p>
              <div onClick={getLastSearch} className={styles.lastSearch}>
                <FontAwesomeIcon icon={faChevronLeft}/>
              </div>
          </div>
        </div>

        <div className={styles.content}>
          <div>
            <h1>Artigos</h1>
            <div className={styles.articles}>
                <ArticlesList articles={authorshipList} authorStats={authorStats}/>
            </div>
          </div>
          
          <div>
            <h1>Dados do Autor</h1>
            <div className={styles.stats}>
              <div className={styles.row}>
                <h2>Total de trabalhos</h2>
                <div className={styles.circle}>
                    <h2>{authorStats.totalWorks}</h2>
                </div>
                <div className={styles.test}>
                  <div className={styles.rectangle}>
                    <div className={styles.filterField}>
                      <output className={styles.outputField}><FontAwesomeIcon icon={faBuilding} />&nbsp;{author && author.last_known_institutions && author.last_known_institutions.length > 0? author.last_known_institutions[0].display_name : 'Nenhuma Instituição Registrada'}</output>
                      <output className={styles.outputField}><FontAwesomeIcon icon={faTags} />&nbsp;{author && author.topics && author.topics.length > 0 ? author.topics[0].display_name : 'Nenhum Tópico Encontrado'}</output>
                      <output className={styles.outputField}><FontAwesomeIcon icon={faUsers} />&nbsp;{coAutor.author? coAutor.author : 'Carregando...'}</output>
                      <button className={styles.buttonFilter} onClick={openModal}>Ver Todos</button>
                      <StatsModal 
                        isOpen={isModalOpen} 
                        onRequestClose={closeModal} 
                        author={author}
                        coAuthor={coAutorList} 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.row}>
                <CitationChart authorCitations={authorStats.firstAuthorWorks} coAuthorCitations={authorStats.coAuthorWorks} />
              </div>         
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  
export default Pesquisa;
  

