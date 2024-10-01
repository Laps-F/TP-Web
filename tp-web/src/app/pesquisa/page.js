'use client';

import { useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { FaHouseChimney } from "react-icons/fa6";

import fetchSuggestedAuthors from '@/back/data';
import ArticlesList from '../components/ArticlesList';

function Pesquisa() {
    const router = new useRouter();
    const [author, setAuthor] = useState(null);
    const [articlesList, setArticlesList] = useState([]);
    const [authorshipList, setAuthorshipList] = useState([]);
    const [workList, setWorkList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [authorStats, setAuthorStats] = useState({
      totalWorks: 0,
      firstAuthorWorks: 0,
      coAuthorWorks: 0,
  });

    useEffect(() => {
      // Recuperar informações do sessionStorage
      const storedAuthorData = sessionStorage.getItem('authorDetails');
      const storedArticlesListData = sessionStorage.getItem('articlesListDetails');
      const storedAuthorshipData = sessionStorage.getItem('authorshipListDetails');
      const storedAllWorks = sessionStorage.getItem('workListDetails');
      // console.log(storedAuthorData);
      //console.log(storedArticlesListData);
      if (storedAuthorData) {
        setAuthor(JSON.parse(storedAuthorData));
      }
      if(storedArticlesListData) {
        setArticlesList(JSON.parse(storedArticlesListData));
      }
      if(storedAllWorks) {
        setWorkList(JSON.parse(storedAllWorks));
      }
      if(storedAuthorshipData){
        setAuthorshipList(JSON.parse(storedAuthorshipData));
      }

      // calculateAuthorStats(articlesList);
    }, []);

    useEffect(() => {
      calculateAuthorStats(authorshipList);
    }, [authorshipList]);

    const calculateAuthorStats = (articles) => {
      console.log('articles: ', articles);
      let totalWorks = 0;
      let firstAuthorWorks = 0;
      let coAuthorWorks = 0;

      // articles.forEach(article => {
      //     const { authorships } = article;
      //     console.log('authorships: ', authorships);
      //     const isFirstAuthor = authorships.some(authorship => authorship.author_position === 'first');
      //     const isCoAuthor = authorships.some(authorship => authorship.author_position !== 'first');

      //     if (isFirstAuthor) firstAuthorWorks++;
      //     if (isCoAuthor) coAuthorWorks++;
      //     totalWorks++;
      // });
      for (let i = 0; i < articles.length; i++) {
        let authorList = articles[i].authorships
        if (authorList.some(a => a.author.id === author.id && a.author_position === 'first')){
          console.log('oi')
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
      console.log('total works: ' + totalWorks)
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
                    {suggestion? suggestion.name : ''}
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
            {author? author.display_name : 'Carregando...'}
        </div>

        <div style={styles.content}>
            <div style={styles.articles}>
                <ArticlesList articles={articlesList}/>
            </div>
    
            <div style={styles.stats}>

              <div style={styles.containerData}>

                <div style={styles.row}>
                  <p>Total de trabalhos:</p>
                  <div style={styles.circle}>{authorStats.totalWorks}</div>

                  <div style={styles.filterContainer}>
                    <div style={styles.rectangle}>
                      <div style={styles.filterField}>
                        <output style={styles.outputField}>Instituição</output>
                        <output style={styles.outputField}>Co-Author</output>
                        <output style={styles.outputField}>Tópico</output>
                        <button style={styles.buttonFilter}>Filtrar</button>
                      </div>
                    </div>
                  </div>
                
                </div>


                <div style={styles.row}>
                  <p>Trabalhos como Autor:</p>
                  <div style={styles.circleMinus}>{authorStats.firstAuthorWorks}</div>

                  <p>Trabalhos como Co-Autor:</p>
                  <div style={styles.circleMinus}>{authorStats.coAuthorWorks}</div>
                </div>
              </div>         
            </div>
        </div>
      </div>
    </div>
  );
}
  
export default Pesquisa;

// const styles = {
//   container: {
//     minHeight: '100vh',
//     backgroundColor: 'var(--primary-gray)', // Fundo cinza
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   header: {
//     width: '100vw', // Cobre toda a largura da tela
//     padding: '20px',
//     backgroundImage: 'linear-gradient(to right, #2364f0, #69aaf5, #add8e6)', // Fading de roxo azulado para azul claro
//     color: 'var(--secondary-text-color)',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     boxSizing: 'border-box', // Evita que padding afete o width
//   },
//   searchContainer: {
//     display: 'flex',
//     flexDirection: 'row',
//     alignItems: 'center',
//     position: 'relative', // Necessário para o posicionamento das sugestões
//     width: '100%',
//     maxWidth: '500px',
//   },
//   suggestionsList: {
//     position: 'absolute',
//     top: '110%', // Logo abaixo do campo de pesquisa
//     left: '0',
//     width: '100%', // Ocupa o mesmo espaço do input
//     backgroundColor: 'var(--secondary-text-color)',
//     border: '1px solid var(--border-color)',
//     borderRadius: '5px',
//     zIndex: 1,
//   },
//   suggestionItem: {
//     padding: '10px',
//     cursor: 'pointer',
//     borderBottom: '1px solid var(--highlight-color)',
//     color: 'var(--primary-text-color)',
//   },
//   appName: {
//     display: 'flex',
//     alignItems: 'center',
//     width: '10vw',
//   },
//   title: {
//     fontSize: '2rem',
//     margin: 0,
//   },
//   homeButton: {
//     justifyContent: 'center',
//     paddingRight: '3vw',
//   },
//   nameAuthor: {
//     width: '100%', // Garante que o conteúdo também cubra toda a largura
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     color: 'var(--primary-text-color)',
//     backgroundColor: 'white',
//     border: '1px solid var(--border-color)',
//   },
//   contentContainer: {
//     flex: 1,
//     width: '100%', // Garante que o conteúdo também cubra toda a largura
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'space-evenly',
//     alignItems: 'center',
//     color: 'var(--primary-text-color)',
//   },
//   content: {
//     width: '100%', // Garante que o conteúdo também cubra toda a largura
//     display: 'flex',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     color: 'var(--primary-text-color)',
    
//   },
//   articles: {
//     backgroundColor: 'white',
//     border: '1px solid var(--border-color)',
//     justifyContent: 'center',
//     minHeight: '60vh',
//   },
//   stats: {
//     backgroundColor: 'white',
//     border: '1px solid var(--border-color)',
//     justifyContent: 'center',
//     minHeight: '60vh',

//   },
  
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'var(--primary-gray)',
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
  nameAuthor: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'var(--primary-text-color)',
    backgroundColor: 'white',
    border: '1px solid var(--border-color)',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  articles: {
    backgroundColor: 'white',
    border: '1px solid var(--border-color)',
    minHeight: '60vh',
  },
  stats: {
    backgroundColor: 'white',
    border: '1px solid var(--border-color)',
    minHeight: '60vh',
    height: '70vh',
    padding: '0px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerData: {
    width: '100%',
    height: '100vh',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: '50%',
    marginBottom: '10px',
  },
  circle: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#69aaf5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '10px',
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
    width: '100%',
    height: '80px',
    backgroundColor: '#2364f0',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: '20px',
  },
  filterContainer: {
    width: '100%',
  },
  filterField: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  outputField: {
    color: 'white',
    fontSize: '1rem',
    paddingRight: '20px',
  },
  buttonFilter: {
    padding: '10px 20px',
    backgroundColor: '#69aaf5',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

