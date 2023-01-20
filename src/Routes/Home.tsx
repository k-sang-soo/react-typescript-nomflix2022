import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getMovies, IGetMoviesResult } from './../api';
import { makeImagePath } from './../until';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';

const Wrapper = styled.section`
    background-color: #000;
`;

const Loader = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`;

const Banner = styled.div<{ bgPhoto: string }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: calc(100vh - 65px);
    padding: 0 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.bgPhoto});
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
`;

const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px;
`;

const OverView = styled.p`
    font-size: 24px;
    width: 50%;
`;

const Slider = styled.div`
    position: relative;
    top: -100px;
`;

const Row = styled(motion.div)<{ $grid: number }>`
    position: absolute;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(${(props) => (props.$grid === 6 ? 6 : props.$grid === 4 ? 4 : props.$grid === 3 && 3)}, 1fr);
    width: 100%;
`;

const Box = styled(motion.div)<{ $bgPhoto: string }>`
    height: 0;
    padding-bottom: 56.2%;
    background-color: #fff;
    background-image: url(${(props) => props.$bgPhoto});
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    cursor: pointer;
    &:first-child {
        transform-origin: center left;
    }

    &:last-child {
        transform-origin: center right;
    }
`;

const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${(props) => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4 {
        text-align: center;
        font-size: 18px;
    }
`;

const MoviePopupWrap = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    opacity: 0;
    overflow-y: auto;
`;

const MoviePopupArea = styled(motion.div)`
    position: absolute;
    width: 60vw;
    background-color: ${(props) => props.theme.black.lighter};
    top: 10px;
    left: 0;
    right: 0;
    border-radius: 15px;
    overflow: hidden;
    margin: 0 auto;
`;

const MoviePopupImg = styled.figure`
    height: 0;
    padding-bottom: 56.2%;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
`;

const MoviePopupInner = styled.div`
    padding: 20px;
`;

const MoviePopupTtl = styled.h2`
    color: ${(props) => props.theme.white.lighter};
    text-align: center;
    font-size: 28px;
`;

const MoviePopupOverView = styled.p`
    padding: 20px;
    color: ${(props) => props.theme.white.lighter};
`;

const boxVariants = {
    normal: {
        scale: 1,
        y: 0,
    },
    hover: {
        scale: 1.3,
        y: -50,
        transition: {
            delay: 0.5,
            type: 'tween',
        },
    },
};

const infoVariants = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.5,
            duaration: 0.1,
            type: 'tween',
        },
    },
};

function Home() {
    const navigate = useNavigate();
    const moviePopupMatch = useMatch('/movies/:movieId');
    const [slideGrid, setSlideGrid] = useState(0);
    const { data, isLoading } = useQuery<IGetMoviesResult>(['movies', 'nowPlaying'], getMovies);
    console.log('data', data);

    const [winW, setWinW] = useState(window.innerWidth);
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const increaseIndex = () => {
        if (data) {
            if (leaving) return;
            setLeaving(true);
            const totalMoviesLength = data.results.length - 1;
            const maxIndex = Math.floor(totalMoviesLength / slideGrid) - 1;

            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const toggleLeaving = () => setLeaving(false);
    const onBoxClicked = (movieId: number) => {
        navigate(`/movies/${movieId}`);
    };
    const onBoxHideClicked = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.currentTarget === e.target) {
            navigate('/');
        }
    };

    const clickedMovie = moviePopupMatch?.params.movieId && data?.results.find((movie) => String(movie.id) === moviePopupMatch.params.movieId);

    const handleResize = () => {
        setWinW(window.innerWidth);
    };

    const changeSlideGrid = () => {
        if (winW > 1024) {
            setSlideGrid(6);
        } else if (winW > 640) {
            setSlideGrid(4);
        } else if (winW <= 640) {
            setSlideGrid(3);
        }
    };

    const rowVariants = {
        hidden: {
            x: winW + 10,
        },
        visible: {
            x: 0,
        },
        exit: {
            x: -winW - 10,
        },
    };

    useEffect(() => {
        changeSlideGrid();
        increaseIndex();

        window.addEventListener('resize', handleResize);
        moviePopupMatch ? document.body.classList.add('isFixedScroll') : document.body.classList.remove('isFixedScroll');
        return () => {
            window.addEventListener('resize', handleResize);
        };
    }, [winW, moviePopupMatch]);

    return (
        <Wrapper className="root_section">
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner onClick={increaseIndex} bgPhoto={makeImagePath(data?.results[0].backdrop_path || '')}>
                        <Title>{data?.results[0].title}</Title>
                        <OverView>{data?.results[0].overview}</OverView>
                    </Banner>
                    <Slider>
                        {/* AnimatePresence 는 컴포넌트가 렌더링 되거나 없어질 때 효과를 줌*/}
                        {/* onExitComplete 애니메이션이 끝난 후 함수 호출 */}
                        {/* initial 초기 화면이 애니메이션 값이 들어온 후로 보여지게 만들어 줌 */}
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: 'tween', duration: 1 }} key={index} $grid={slideGrid}>
                                {data?.results
                                    .slice(1)
                                    .slice(slideGrid * index, slideGrid * index + slideGrid)
                                    .map((movie) => (
                                        <Box
                                            // layoutId 는 string 여야 함
                                            layoutId={movie.id + ''}
                                            onClick={() => onBoxClicked(movie.id)}
                                            variants={boxVariants}
                                            initial="normal"
                                            whileHover="hover"
                                            transition={{ type: 'tween' }}
                                            key={movie.id}
                                            $bgPhoto={makeImagePath(movie.backdrop_path, 'w500')}
                                        >
                                            <Info variants={infoVariants}>
                                                <h4>{movie.title}</h4>
                                            </Info>
                                        </Box>
                                    ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    <AnimatePresence>
                        {moviePopupMatch && (
                            <MoviePopupWrap onClick={onBoxHideClicked} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <MoviePopupArea layoutId={moviePopupMatch.params.movieId}>
                                    {clickedMovie && (
                                        <>
                                            <MoviePopupImg
                                                style={{
                                                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(clickedMovie.backdrop_path, 'w500')})`,
                                                }}
                                            />
                                            <MoviePopupInner>
                                                <MoviePopupTtl>{clickedMovie.title}</MoviePopupTtl>
                                                <MoviePopupOverView>{clickedMovie.overview}</MoviePopupOverView>
                                            </MoviePopupInner>
                                        </>
                                    )}
                                </MoviePopupArea>
                            </MoviePopupWrap>
                        )}
                    </AnimatePresence>
                    <div style={{ height: '100vh' }}></div>
                </>
            )}
        </Wrapper>
    );
}

export default Home;
