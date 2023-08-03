import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/navBar/navBar';
import LoginPage from './pages/login/loginPage';
import PasswordChangePage from './pages/passwordchange/passwordChangePage';
import DebatePage from './pages/debateRoom/DebatePage';
import SignupPage from './pages/signup/signupPage';
import MainPage from './pages/main/mainPage';
import MyProfilePage from './pages/myprofile/myProfile';
import RankingPage from './pages/ranking/ranking';
import ItemPage from './pages/item/itemPage';

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        {/* <nav>
          <ul className='horizontal-align'>
            <li>
              <Link to='/pages/login/loginPage'>loginPage</Link>
            </li>
            <li>
              <Link to='/pages/passwordchange/passwordChangePage'>passwordChange</Link>
            </li>
            <li>
              <Link to='/pages/debateRoom/debatePage.jsx'>debatePage</Link>
            </li>
            <li>
              <Link to='/pages/signup/signupPage'>signupPage</Link>
            </li>
            <li>
              <Link to='/pages/myprofile/myProfile/:userId'>myProfilePage</Link>
            </li>
            <li>
              <Link to='/pages/ranking/ranking'>rankingPage</Link>
            </li>
            <li>
              <Link to='/pages/main/mainPage'>mainPage</Link>
            </li>
            <li>
              <Link to='/pages/item/itempage/:userId'>itemPage</Link>
            </li>
          </ul>
        </nav> */}
        <NavBar />
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/pwChange/:userId' element={<PasswordChangePage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/' element={<MainPage />} />
          <Route path='/debateRoom' element={<DebatePage/>}>
          </Route>  
          <Route path='/signup' element={<SignupPage/>}>
          </Route>
          <Route path='/profile' element={<MyProfilePage/>}>
          </Route>
          <Route path='/ranking' element={<RankingPage/>}>
          </Route>
          <Route path='/item' element={<ItemPage/>}>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
