import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import {Container} from 'react-bootstrap';
import style from './navBar.module.css';
import logo from '../../images/logo.png';
import searchIcon from '../../images/search.png';
import { Button, Form, InputGroup } from "react-bootstrap";
import { userState } from '../../recoil/token'
import { userIdState } from '../../recoil/userId'
import { useRecoilState } from 'recoil';
import "bootstrap/dist/css/bootstrap.min.css";
// import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'

function NavBar() {
    const [ keyword, setKeyword ] = useState('');
    const [ , setUserToken ] = useRecoilState(userState)
    const [ , setUserId ] = useRecoilState(userIdState)


    const handleLogout = () => {
        console.log('로그아웃');
        setUserToken("")
        setUserId("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`검색어: ${keyword}`);
        setKeyword('');
        
    };

    return (
        <Container>
             <div className={`${style.navbar} navbar navbar-expand-lg bg-white navbar-light py-0 px-4`}>
                <Link className={style.navbarMenu} to={'/'}>
                    <img className={`${style.logo} p-1`} src={logo} alt='로고' />
                </Link>
                <div>
                <InputGroup className='mx-3'>
                <Form.Control
                    placeholder="검색어를 입력해주세요"
                    aria-label="keyword"
                    aria-describedby="userSearch"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    style={{ fontSize: "14px"}}
                />
                <Button 
                    style={{ backgroundColor:"var(--blue-800)", fontsize:"16px" , inlineheight:"35px", padding:"0px"}}
                    className='px-2'
                    variant="outline-secondary" 
                    id="userSearch"
                    onClick={handleSubmit}
                >
                    <img src={searchIcon} className={style.searchIcon} alt="Search Icon" />
                </Button>
                </InputGroup>
                </div>
                <button
                    type="button"
                    className={`navbar-toggler`}
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarCollapse"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`${style.links} collapse navbar-collapse`} id="navbarCollapse">
                    <div className={`navbar-nav ms-auto`}>
                        <Link className={`${style.navbarMenu} nav-item nav-link text-center`} to={'/ranking'}>랭킹</Link>
                        <Link className={`${style.navbarMenu} nav-item nav-link text-center`} to={'/item'}>아이템</Link>
                        <Link className={`${style.navbarMenu} nav-item nav-link text-center`} to={'/profile'}>마이페이지</Link>
                        <button className={`${style.navbarMenu} nav-item nav-link text-center`} onClick={handleLogout}>
                        로그아웃</button>
                    </div>
                </div>
           </div>
        </Container>
    );
}

export default NavBar;
