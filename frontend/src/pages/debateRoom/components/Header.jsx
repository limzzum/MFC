import React from 'react';
import {Button} from 'react-bootstrap';
import logoImage from '../../../images/logo.png'
import style from '../debatePage.module.css';

function Header() {
  return (
    <header className={style.header}>
      <img src={logoImage} alt="logo" className="logo"/>
      <ul>
        <li>
          <Button>Setting</Button>
        </li>
        <li>
          <Button>Exit</Button>
        </li>
      </ul>
    </header>
  );
}

export default Header;
