async function fetchSuggestedAuthors(query) {
    const apiURL = `https://api.openalex.org/autocomplete/authors?q=${query}`;

    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const array = data.results.map(item => ({ name: item.display_name, id: item.id })).slice(0,5);
        // console.log('Dados da API OpenAlex:', array);
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
        
        const keys = ["display_name", "works_api_url"]
        const data = await response.json();
        // console.log('Dados da API OpenAlex:', data);

        // const newObj = keys.reduce((acc, key) => {
        //     if (data[key]) {
        //       acc[key] = data[key];
        //     }
        //     return acc;
        //   }, {});
        // return newObj;
        console.log(data);
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
    }
}

export async function fetchAuthorshipFromOpenAlex(id){
    const apiURL = `https://api.openalex.org/works?filter=authorships.author.id:${id}&per-page=200`;

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
    // const apiURL = `https://api.openalex.org/works?filter=authorships.author.id:${id}&per-page=200&cursor=*`;

    // try {
    //     const response = await fetch(apiURL);
    //     if (!response.ok) {
    //         throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    //     }

    //     let data = await response.json();
    //     let cursor = data.meta.next_cursor
    //     let newURL =  `https://api.openalex.org/works?filter=authorships.author.id:${id}&per-page=200&cursor=${cursor}`;

    //     while (cursor !== null){
    //         let newResponse = await fetch(newURL)
    //         data = await newResponse.json();
    //         cursor = data.meta.next_cursor
    //         newURL =  `https://api.openalex.org/works?filter=authorships.author.id:${id}&per-page=200&cursor=${cursor}`;
    //     }

    //     return data;
    // } catch(error){
    //     console.error('Erro ao buscar dados da API:', error);
    // }

    // let allResults = [];
    // let cursor = '*';
    // const perPage = 200;

    // while (cursor) {
    //     const url = `https://api.openalex.org/works?filter=authorships.author.id:${id}&per-page=${perPage}&cursor=${cursor}`;
        
    //     try {
    //         const response = await fetch(url);
    //         const data = await response.json();
            
    //         // Adiciona os resultados da página atual à lista
    //         allResults = allResults.concat(data.results);
            
    //         // Atualiza o cursor para a próxima página
    //         cursor = data.meta.next_cursor;

    //     } catch (error) {
    //         console.error('Erro ao buscar dados:', error);
    //         break;  // Se houver erro, sair do loop
    //     }
    // }

    // return allResults;
}

export async function fetchWorkFromOpenAlex() {
    const apiURL = `https://api.openalex.org/works`;

    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("work data")

        return data;
    } catch(error) {
        console.error('Erro ao buscar dados da API:', error);
    }
}

export async function fetchFromOpenAlex(query){
    const apiURL = query;

    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        // console.log('Dados da API OpenAlex:', data);
        return data;
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