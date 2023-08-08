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
            <div className={style.navbar}>
                <Link className={style.navbarMenu} to={'/'}>
                    <img className={style.logo} src={logo} alt='로고' />
                </Link>
                <div className={style.links}>
                    <Link className={style.navbarMenu} to={'/ranking'}>랭킹</Link>
                    <Link className={style.navbarMenu} to={'/item'}>아이템</Link>
                    <Link className={style.navbarMenu} to={'/profile'}>마이페이지</Link>
                </div>
                <div>
                <InputGroup>
                <Form.Control
                    placeholder="검색어를 입력해주세요"
                    aria-label="keyword"
                    aria-describedby="userSearch"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                />
                <Button 
                    style={{ backgroundColor:"#354C6FFF" }}
                    variant="outline-secondary" 
                    id="userSearch"
                    onClick={handleSubmit}
                >
                    <img src={searchIcon} className={style.searchIcon} alt="Search Icon" />
                </Button>
            </InputGroup>
            </div>
                <button className={style.btn} onClick={handleLogout}>
                    로그아웃
                </button>
            </div>
        </Container>
    );
}

export default NavBar;
