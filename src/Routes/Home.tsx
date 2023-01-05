import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getMovies, IGetMoviesResult } from './../api';
import { makeImagePath } from './../until';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

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

const Row = styled(motion.div)`
    position: absolute;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(6, 1fr);
    width: 100%;
`;

const Box = styled(motion.div)<{ $bgPhoto: string }>`
    height: 0;
    padding-bottom: 56.2%;
    color: red;
    font-size: 24px;
    background-color: #fff;
    background-image: url(${(props) => props.$bgPhoto});
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
`;

console.log('Box', Row);

const rowVariants = {
    hidden: {
        x: window.innerWidth,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.innerWidth,
    },
};

const offset = 6;

function Home() {
    const { data, isLoading } = useQuery<IGetMoviesResult>(['movies', 'nowPlaying'], getMovies);
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const increaseIndex = () => {
        if (data) {
            if (leaving) return;
            setLeaving(true);
            const totalMoviesLength = data.results.length - 1;
            const maxIndex = Math.floor(totalMoviesLength / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const toggleLeaving = () => setLeaving(false);
    console.log(isLoading);
    console.log(data);

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
                            <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: 'tween', duration: 1 }} key={index}>
                                {data?.results
                                    .slice(1)
                                    .slice(offset * index, offset * index + offset)
                                    .map((movie) => (
                                        <Box key={movie.id} $bgPhoto={makeImagePath(movie.backdrop_path, 'w500')}></Box>
                                    ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                </>
            )}
        </Wrapper>
    );
}

export default Home;
