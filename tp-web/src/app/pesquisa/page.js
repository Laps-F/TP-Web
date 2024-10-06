'use client';

import { useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { FaHouseChimney } from "react-icons/fa6";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faTags, faUsers } from '@fortawesome/free-solid-svg-icons';

import fetchSuggestedAuthors, { fetchAuthorFromOpenAlex, fetchAuthorshipFromOpenAlex} from '@/back/data';
import ArticlesList from '../components/ArticlesList';
import CitationChart from '../components/DoughnutGraph';
import StatsModal from '../components/StatsModal';
import styles from './page.module.css';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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


  function createCoAutorList(articles) {
    let coAuthor = []
      if (articles){
          const coAuthorsSet = new Set();
  
          // Percorrendo todos os artigos
          articles.forEach(article => {
          // Percorrendo todos os authorships de cada artigo
          article.authorships.forEach(authorship => {
              // Se o nome do autor não for o autor principal, adiciona ao Set
              if (authorship.author.display_name !== author.display_name) {
              coAuthorsSet.add(authorship.author.display_name);
              }
          });
          });
          coAuthor = Array.from(coAuthorsSet);
          // console.log(coAuthor);
      }
      return coAuthor;
  }
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
  const coAutorList = createCoAutorList(authorshipList);
  console.log('coAuthorList', coAutorList);

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
    console.log('author', author)
    console.log('articles', articles)
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

        <div className={styles.homeButton} onClick={() => router.push('/')}>
            <FaHouseChimney color='black' size={42}/>
        </div>
      </header>

      <div className={styles.contentContainer}>
        <div className={styles.nameAuthorContainer}>
          <h1>Mostrando dados atualmente de</h1>
          <div className={styles.nameAuthor}>
              <p>{author? author.display_name : 'Carregando...'}</p>
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
                      <output className={styles.outputField}><FontAwesomeIcon icon={faBuilding} />&nbsp;{author && author.last_known_institutions ? author.last_known_institutions[0].display_name : 'Nenhuma Instituição Registrada'}</output>
                      <output className={styles.outputField}><FontAwesomeIcon icon={faTags} />&nbsp;{author && author.topics && author.topics.lenght > 0 ? author.topics[0].display_name : 'Nenhum Tópico Encontrado'}</output>
                      <output className={styles.outputField}><FontAwesomeIcon icon={faUsers} />&nbsp;{coAutor.author? coAutor.author : 'Carregando...'}</output>
                      <button className={styles.buttonFilter} onClick={openModal}>Ver e Filtrar Todos</button>
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
  

