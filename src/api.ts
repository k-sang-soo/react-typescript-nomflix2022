const API_KEY = 'ea24823f1c54cf5b3b163947c5be97d5';
const BASE_PATH = 'https://api.themoviedb.org/3';

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then((response) => response.json());
}
