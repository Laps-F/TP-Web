async function fetchSuggestedAuthors(query) {
    const apiURL = `https://api.openalex.org/autocomplete/authors?q=${query}`;

    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const array = data.results.map(item => ({ name: item.display_name, id: item.id })).slice(0,5);
        return array;
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
    }
}
export async function fetchAuthorFromOpenAlex(query) {
    const apiURL = `https://api.openalex.org/authors/${query}`;

    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
    }
}

export async function fetchAuthorshipFromOpenAlex(id){
    const apiURL = `https://api.openalex.org/works?filter=authorships.author.id:${id}&per-page=5`;

    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        return data;
    } catch(error) {
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