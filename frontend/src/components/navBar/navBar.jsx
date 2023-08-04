import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import {Container} from 'react-bootstrap';
import style from './navBar.module.css';
import logo from '../../images/logo.png';
import searchIcon from '../../images/search.png';

function NavBar() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleLogout = () => {
        console.log('로그아웃');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`검색어: ${searchTerm}`);
        setSearchTerm('');
    };

    return (
        <Container>
            <div className={style.navbar}>
                <Link className={style.navbarMenu} to={'/'}>
                    <img className={style.logo} src={logo} alt='로고' />
                </Link>
                <div className={style.links}>
                    <Link className={style.navbarMenu} to={'/ranking'}>랭킹</Link>
                    <Link className={style.navbarMenu} to={'/item'}>아이템</Link>
                    <Link className={style.navbarMenu} to={'/profile'}>마이페이지</Link>
                </div>
                <form onSubmit={handleSubmit} className={style.searchBar}>
                    <input 
                        type='text' 
                        placeholder='검색'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className={style.btn}>
                        <img className={style.icon} src={searchIcon} alt='검색'/>
                    </button>
                </form>
                
                <button className={style.btn} onClick={handleLogout}>
                    로그아웃
                </button>
            </div>
        </Container>
    );
}

export default NavBar;
