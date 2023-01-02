import { useQuery } from 'react-query';
import { getMovies } from './../api';

function Home() {
    const { data, isLoading } = useQuery(['movies', 'nowPlaying'], getMovies);
    console.log(isLoading);
    console.log(data);

    return <h1>Home</h1>;
}

export default Home;
