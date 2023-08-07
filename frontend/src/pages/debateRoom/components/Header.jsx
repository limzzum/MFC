import React from 'react';
import {Link} from 'react-router-dom';
import logoImage from '../../../images/logo.png';
import settingIcon from '../../../images/setting.png';
import exitIcon from '../../../images/exitIcon.png';
import style from '../debatePage.module.css';


function Header() {
  return (
    <header className={style.header}>
      <img className={style.logo} src={logoImage} alt="logo"/>
      <ul>
        <li>
          <img className={style.setting} src={settingIcon} alt='설정  '/>
        </li>
        <li>
          <Link to={'/'}>
            <img className={style.exit} src={exitIcon} alt='나가기'/>
          </Link>
        </li>
      </ul>
    </header>
  );
}

export default Header;
