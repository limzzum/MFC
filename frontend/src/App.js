import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
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
        <nav>
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
              <Link to='/pages/myprofile/myProfile'>myProfilePage</Link>
            </li>
            <li>
              <Link to='/pages/ranking/ranking'>rankingPage</Link>
            </li>
            <li>
              <Link to='/pages/main/mainPage'>mainPage</Link>
            </li>
            <li>
              <Link to='/pages/item/itempage'>itemPage</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path='/pages/login/loginPage' element={<LoginPage />} />
          <Route path='/pages/passwordchange/passwordChangePage/:userId' element={<PasswordChangePage />} />
          <Route path='/pages/signup/signupPage' element={<SignupPage />} />
          <Route path='/pages/main/mainPage' element={<MainPage />} />
          <Route path='/pages/login/loginPage' element={<LoginPage/>}>
          </Route>
          <Route path='/pages/passwordchange/passwordChangePage' element={<PasswordChangePage/>}>
          </Route>
          <Route path='/pages/debateRoom/debatePage.jsx' element={<DebatePage/>}>
          </Route>  
          <Route path='/pages/signup/signupPage' element={<SignupPage/>}>
          </Route>
          <Route path='/pages/myprofile/myProfile' element={<MyProfilePage/>}>
          </Route>
          <Route path='/pages/ranking/ranking' element={<RankingPage/>}>
          </Route>
          <Route path='/pages/item/itempage' element={<ItemPage/>}>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
