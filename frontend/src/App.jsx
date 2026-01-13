import React from 'react'
import { Toaster } from 'react-hot-toast';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import AdminPage from './pages/adminPage';
import HomePage from './pages/homePage';
import LoginPage from './user/loginPage';
import RegisterPage from './user/registerPage';


const App = () => {
  return (
    <BrowserRouter>
    <Toaster position='top-right' />
      <Routes path="/">
        <Route path="/adminPage/*" element={<AdminPage />} />
        <Route path="/homePage/*" element={<HomePage />} />
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/registerPage" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App