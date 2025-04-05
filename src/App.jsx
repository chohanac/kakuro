import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header/Header';
import CreateGrid from './pages/CreateGrid/CreateGrid';
import PlayGrid from './pages/PlayGrid/PlayGrid';
import Instructions from './pages/Instructions/Instructions';

import './app.scss'

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                {/* <Route path='/' element={<Grid />} /> */}

                <Route path='/' element={<PlayGrid />} />

                <Route path='/create' element={<CreateGrid />} />

                <Route path='/instructions' element={<Instructions />} />



                {/* <Route path='/' element={<Grid />} /> */}


                {/* <Route path='/inventory/:id' element={<InventoryDetails />} />
          <Route path='/inventory/:id/edit' element={<EditInventory />} /> */}
            </Routes>
            <div className='background'></div>
        </BrowserRouter>
    )
}

export default App;
