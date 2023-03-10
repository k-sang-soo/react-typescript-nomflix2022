import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Routes/Home';
import Search from './Routes/Search';
import Tv from './Routes/TV';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />}>
                    <Route path="movies/:movieId" element={<Home />} />
                </Route>
                <Route path="/tv" element={<Tv />} />
                <Route path="/search" element={<Search />} />
            </Routes>
        </Router>
    );
}

export default App;
