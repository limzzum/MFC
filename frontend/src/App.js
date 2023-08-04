import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './components/navBar/navBar';
import LoginPage from './pages/login/loginPage';
import PasswordChangePage from './pages/passwordchange/passwordChangePage';
import DebatePage from './pages/debateRoom/DebatePage';
import SignupPage from './pages/signup/signupPage';
import MainPage from './pages/main/mainPage';
import MyProfilePage from './pages/myprofile/myProfile';
import RankingPage from './pages/ranking/ranking';
import ItemPage from './pages/item/itemPage';

function NavBarWrapper() {
  const location = useLocation();
  
  const hideNavBar = location.pathname === '/debateRoom';
  
  return (
    <>
      { !hideNavBar && <NavBar />}
    </>
  );
}

function App() {


  return (
    <BrowserRouter>
      <div className='App'>
        <NavBarWrapper />
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/pwChange/:userId' element={<PasswordChangePage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/' element={<MainPage />} />
          <Route path='/debateRoom' element={<DebatePage/>} />
          <Route path='/signup' element={<SignupPage/>} />
          <Route path='/profile' element={<MyProfilePage/>} />
          <Route path='/ranking' element={<RankingPage/>} />
          <Route path='/item' element={<ItemPage/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
