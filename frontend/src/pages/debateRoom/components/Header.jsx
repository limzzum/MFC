import React from 'react';
import {Link} from 'react-router-dom';
import logoImage from '../../../images/logo.png';
import settingIcon from '../../../images/setting.png';
import exitIcon from '../../../images/exitIcon.png';
import style from '../debatePage.module.css';


function Header({status, leaveSession, handleModifyModalOpen}) {
  return (
    <header className={style.header}>
      <img className={style.logo} src={logoImage} alt="logo"/>
      <ul>
        { status === 'waiting' && 
          <li>
            <button onClick={handleModifyModalOpen}>
              <img className={style.setting} src={settingIcon} alt='설정 '/>
            </button>
          </li>
        }
          <li>
            <Link to={'/'}>
              <img className={style.exit} src={exitIcon} alt='나가기' onClick={leaveSession}/>
            </Link>
          </li>
      </ul>
    </header>
  );
}

export default Header;
