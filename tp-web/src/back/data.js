async function fetchSuggestedAuthors(query) {
    const apiURL = `https://api.openalex.org/autocomplete/authors?q=${query}`;

    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const array = data.results.map((item => item.display_name)).slice(0,5);
        console.log('Dados da API OpenAlex:', array);
        return array;
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
    }
}
async function fetchAuthorsFromOpenAlex() {
    const apiURL = 'https://api.openalex.org/authors?per-page=100';

    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const array = data.results.map((item) => ({author: item.display_name}));
        // console.log('Dados da API OpenAlex:', array);
        return array;
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
    }
}

function formatDate(dateString) {
    const dateObj = new Date(dateString);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // Adicione 1 porque os meses começam em 0
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
}

export default fetchSuggestedAuthors;