import React from 'react'
import { Toaster } from 'react-hot-toast';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import AdminPage from './pages/adminPage';
import HomePage from './pages/homePage';
import LoginPage from './user/loginPage';
import RegisterPage from './user/registerPage';
import Home from './home/home';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { VerifyEmail } from './verifyEmail/verifyEmail';


const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
    <BrowserRouter>
    <Toaster position='top-right' />
      <Routes>
        <Route path="/adminPage/*" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/*' element={<HomePage />}/>
        <Route path='/verify-email' element={<VerifyEmail />} />
      </Routes>
    </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App