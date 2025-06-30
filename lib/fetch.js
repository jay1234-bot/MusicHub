const api_url = "https://saavn.dev/api/";

export const getSongsByQuery = async (query) => {
    try {
        const res = await fetch(`${api_url}search/songs?query=${query}`);
        return await res.json();
    } catch (e) {
        console.log(e);
        return { data: { results: [] } };
    }
};

export const getSongsById = async (id) => {
    try {
        const res = await fetch(`${api_url}songs?id=${id}`);
        return await res.json();
    } catch (e) {
        console.log(e);
        return { data: [] };
    }
};

export const getSongsSuggestions = async (id) => {
    try {
        const res = await fetch(`${api_url}songs/${id}/suggestions`);
        return await res.json();
    } catch (e) {
        console.log(e);
        return { data: [] };
    }
};

export const getAlbumById = async (id) => {
    try {
        const res = await fetch(`${api_url}albums?id=${id}`);
        return await res.json();
    } catch (e) {
        console.log(e);
        return { data: {} };
    }
};

export const searchSong = async (query) => {
    try {
        const res = await fetch(`${api_url}search/songs?query=${query}`);
        return await res.json();
    } catch (e) {
        console.log(e);
        return { data: { results: [] } };
    }
}

export const getHome = async () => {
    try {
        const res = await fetch(`${api_url}modules?language=hindi,english,punjabi`);
        return await res.json();
    } catch (e) {
        console.log(e);
        return { data: {} };
    }
}