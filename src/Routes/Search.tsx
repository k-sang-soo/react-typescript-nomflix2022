import { useLocation } from 'react-router-dom';
import { IGetSearchMovieResult, getSearch } from './../api';
import { useQuery } from 'react-query';
import styled from 'styled-components';

const Loading = styled.div`
    font-size: 24px;
    color: red;
`;

function Search() {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get('keyword');
    const type = new URLSearchParams(location.search).get('type');

    const { data, isLoading } = useQuery<IGetSearchMovieResult>(['movies', 'search'], () => getSearch(type!, keyword!));
    console.log('search data', data);

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                data?.results.map((el) => (
                    <ul key={el.id}>
                        <li>{el.title}</li>
                        <li>{el.release_date}</li>
                        <li>{el.overview}</li>
                        <li>{el.vote_average}</li>
                    </ul>
                ))
            )}
        </>
    );
}

export default Search;
