import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header/Header';
import CreateGrid from './pages/CreateGrid/CreateGrid';
import PlayGrid from './pages/PlayGrid/PlayGrid';
import Instructions from './pages/Instructions/Instructions';
import './App.scss'
function App() {

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path='/' element={<PlayGrid />} />
                <Route path="/:name" element={<PlayGrid />} />
                <Route path="/grid/:name" element={<PlayGrid gridURL={true} />} />
                <Route path='/create' element={<CreateGrid />} />
                <Route path='/grids/:num' element={<CreateGrid />} />
                <Route path='/instructions' element={<Instructions />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
