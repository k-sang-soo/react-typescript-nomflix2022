const API_KEY = 'ea24823f1c54cf5b3b163947c5be97d5';
const BASE_PATH = 'https://api.themoviedb.org/3';

export interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
}

export interface IGetMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export interface ISearchMovie {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    vote_average: number;
}

export interface IGetSearchMovieResult {
    results: ISearchMovie[];
}

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then((response) => response.json());
}

export function getSearch(type: string, keyword: string) {
    return fetch(`${BASE_PATH}/search/${type}?api_key=${API_KEY}&query=${keyword}`).then((response) => response.json());
}
