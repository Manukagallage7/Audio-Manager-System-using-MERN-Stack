import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import AdminPage from './pages/adminPage';
import HomePage from './pages/homePage';


const App = () => {
  return (
    <BrowserRouter>
      <Routes path="/">
        <Route path="/adminPage/*" element={<AdminPage />} />
        <Route path="/homePage/*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App