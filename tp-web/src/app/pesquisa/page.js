'use client';

import { useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { FaHouseChimney } from "react-icons/fa6";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faTags, faUsers } from '@fortawesome/free-solid-svg-icons';

import fetchSuggestedAuthors, { fetchAuthorFromOpenAlex, fetchAuthorshipFromOpenAlex} from '@/back/data';
import ArticlesList from '../components/ArticlesList';
import CitationChart from '../components/DoughnutGraph';
import styles2 from './page.module.css';

function Pesquisa() {
  const router = new useRouter();
  const [author, setAuthor] = useState(null);
  const [authorshipList, setAuthorshipList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [id, setId] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [authorStats, setAuthorStats] = useState({
    totalWorks: 0,
    firstAuthorWorks: 0,
    coAuthorWorks: 0,
  });

  useEffect(() => {
    // Recuperar informações do sessionStorage
    const storedAuthorData = sessionStorage.getItem('authorDetails');
    const storedAuthorshipData = sessionStorage.getItem('authorshipListDetails');
    
    if (storedAuthorData) {
      setAuthor(JSON.parse(storedAuthorData));
    }
    if(storedAuthorshipData){
      setAuthorshipList(JSON.parse(storedAuthorshipData));
    }
  }, []);

  useEffect(() => {
    calculateAuthorStats(authorshipList);
  }, [authorshipList]);

  function findSecondMostFrequentAuthor(articles) {
    const authorFrequency = {};

    // Itera sobre cada artigo
    articles.forEach(article => {
        // Itera sobre a lista de authorships de cada artigo
        article.authorships.forEach(authorship => {
            const authorName = authorship.author.display_name;

            // Incrementa a contagem do autor
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

    // Percorre as entradas do objeto de frequências
    for (const [author, count] of Object.entries(authorFrequency)) {
        if (count > maxCount) {
            // Atualiza o segundo mais frequente antes de atualizar o mais frequente
            secondMaxCount = maxCount;
            secondMostFrequentAuthor = author;

            // Atualiza o mais frequente
            maxCount = count;
        } else if (count > secondMaxCount) {
            // Atualiza o segundo mais frequente
            secondMaxCount = count;
            secondMostFrequentAuthor = author;
        }
    }

    return { author: secondMostFrequentAuthor, count: secondMaxCount };
  }
  const coAutor = findSecondMostFrequentAuthor(authorshipList);

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
      sessionStorage.clear();

      const authorObj = await fetchAuthorFromOpenAlex(id.split('/').pop())
      const authorshipList = await fetchAuthorshipFromOpenAlex(id.split('/').pop())

  
      setAuthor(authorObj);
      setAuthorshipList(authorshipList.results);
  };

  const handleSuggestionClick = (suggestion) => {
      setSearchQuery(suggestion.name);
      setId(suggestion.id);
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
                value={searchQuery}
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

      <div className={styles2.contentContainer}>
        <div style={styles.nameAuthorContainer}>
          <h1>Mostrando dados atualmente de</h1>
          <div style={styles.nameAuthor}>
              <p>{author? author.display_name : 'Carregando...'}</p>
          </div>
        </div>

        <div style={styles.content}>
          <div>
            <h1>Artigos</h1>
            <div style={styles.articles}>
                <ArticlesList articles={authorshipList} authorStats={authorStats}/>
            </div>
          </div>
          
          <div>
            <h1>Dados do Autor</h1>
            <div style={styles.stats}>
              <div style={styles.row}>
                <div style={styles.totalWorks}>
                  <h2>Total de trabalhos</h2>
                  <div style={styles.circle}>
                      <h2>{authorStats.totalWorks}</h2>
                  </div>
                </div>
                <div style={styles.test}>
                  <div style={styles.rectangle}>
                    <div style={styles.filterField}>
                      <output style={styles.outputField}><FontAwesomeIcon icon={faBuilding} />&nbsp;{author && author.last_known_institutions && author.last_known_institutions > 0? author.last_known_institutions[0].display_name : 'Nenhuma Instituição Registrada'}</output>
                      <output style={styles.outputField}><FontAwesomeIcon icon={faTags} />&nbsp;{author && author.topics && author.topics.lenght > 0 ? author.topics[0].display_name : 'Nenhum Tópico Encontrado'}</output>
                      <output style={styles.outputField}><FontAwesomeIcon icon={faUsers} />&nbsp;{coAutor.author? coAutor.author : 'Carregando...'}</output>
                      <button style={styles.buttonFilter}>Ver e Filtrar Todos</button>
                    </div>
                  </div>
                </div>
              </div>
              <div style={styles.row}>
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
  
const styles = {
  container: {
    backgroundColor: 'var(--primary-gray)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    width: '100vw',
    padding: '20px',
    backgroundImage: 'linear-gradient(to right, #2364f0, #69aaf5, #add8e6)',
    color: 'var(--secondary-text-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    maxWidth: '500px',
  },
  suggestionsList: {
    position: 'absolute',
    top: '110%',
    left: '0',
    width: '100%',
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
  nameAuthorContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '60vw',
    margin: '1vh',
  },
  nameAuthor: {
    width: '100%',
    height: '5vh',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    color: 'var(--primary-text-color)',
    backgroundColor: 'white',
    border: '1px solid var(--border-color)',
    marginBottom: '6vh',
    paddingLeft: '3vw',
    fontSize: '20px',
  },
  contentContainer: {
    width: '100%',
    height: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  
  content: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'space-evenly',
  },
  articles: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    height: '100%',
    width: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflowX: 'auto',
    padding: '5px',
  },
  stats: {
    backgroundColor: 'white',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    height: '100%',
    width: '90vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  totalWorks: {
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '50%',
    padding: '20px',
  },
  circle: {
    width: '100%',
    height: '85%',
    borderRadius: '50%',
    border: '3px solid black',
    backgroundColor: '#69aaf5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleMinus: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#add8e6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '10px',
  },
  rectangle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: '100%',
    backgroundColor: 'var(--primary-color)',
    border: '1px solid black',
    borderRadius: '5px',
    marginLeft: '1vw',
  },
  filterContainer: {
    display: 'flexbox',
    alignItems: 'center',
    justifyContent: 'center',
    height: '70%',
  },
  filterField: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    height: '70%',
  },
  outputField: {
    width: '90%',
    margin: '2px',
    backgroundColor: 'var(--background-color)',
    fontSize: '1rem',
  },
  buttonFilter: {
    margin: '1px',
    backgroundColor: '#69aaf5',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  test: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  }
};

