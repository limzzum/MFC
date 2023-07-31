import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes, Link} from 'react-router-dom';
import LoginPage from './pages/login/loginPage';
import PasswordChangePage from './pages/passwordchange/passwordChangePage';
import DebatePage from './pages/debateRoom/DebatePage';


function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <nav>
          <ul className='horizontal-list'>
            <li>
              <Link to='/pages/login/loginPage'>loginPage</Link>
            </li>
            <li>
              <Link to='/pages/passwordchange/passwordChangePage'>passwordChange</Link>
            </li>
            <li>
              <Link to='/pages/debateRoom/debatePage.jsx'>debatePage</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path='/pages/login/loginPage' element={<LoginPage/>}>
          </Route>
          <Route path='/pages/passwordchange/passwordChangePage' element={<PasswordChangePage/>}>
          </Route>
          <Route path='/pages/debateRoom/debatePage.jsx' element={<DebatePage/>}>
          </Route>  
        </Routes>
      </div>  
    </BrowserRouter> 
  );
}

export default App;
