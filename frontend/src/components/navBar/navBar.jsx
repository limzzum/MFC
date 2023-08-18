import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import {Container} from 'react-bootstrap';
import style from './navBar.module.css';
import logo from '../../images/logo.png';
import searchIcon from '../../images/search.png';
import {  Modal, Button, Form, InputGroup } from "react-bootstrap";
import { userState } from '../../recoil/token'
import { userIdState } from '../../recoil/userId'
import { useRecoilState } from 'recoil';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
// import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js';
import DebateRoomCard from '../mainpage/debateRoomCard';


function NavBar() {
    const [ keyword, setKeyword ] = useState('');
    const [ , setUserToken ] = useRecoilState(userState)
    const [ , setUserId ] = useRecoilState(userIdState)


    const handleLogout = () => {
        console.log('로그아웃');
        setUserToken("");
        setUserId("");
        localStorage.removeItem('mfctoken');
        localStorage.removeItem('recoil-persist');
        localStorage.removeItem('userId');
        window.location.reload()
    };
    // 검색 결과를 저장할 상태
    const [searchResults, setSearchResults] = useState([]);
    // 모달 표시 여부를 저장할 상태
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(`검색어: ${keyword}`);

        try {
            const response = await axios.get(`https://goldenteam.site/api/debate/listWithKeyword`, {
                params: {
                    keyword,
                    minRoomId: 10000, // 이 값을 조절해야 할 수도 있습니다.
                    size: 10000
                }
            });
    
            if (response.data.status === "OK") {
                console.log("검색 결과:", response.data.data);
                setSearchResults(response.data.data);
                setShowModal(true); // 검색이 완료되면 모달을 표시합니다.
            } else {
                console.error("검색 실패:", response.data.message);
            }
        } catch (error) {
            console.error("API 요청 중 에러 발생:", error);
        }
    
        setKeyword('');
    }
    const handleCloseModal = () => setShowModal(false);
    return (
        <>
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
        <Modal className={style.customModalWidth} show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>검색 결과</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <hr className={style.horizontalline} />
            <div className={style.titlebox}>
            </div>
            <div className={style.debateRoomContainer}>
                {searchResults.length === 0 ? (
                    <p>검색 결과가 없습니다.</p>
                    ) : (
                    searchResults.map((room) => (
                        <DebateRoomCard
                        key={room.roomId}
                        title1={room.atopic}
                        title2={room.btopic}
                        debateTime={room.totalTime}
                        speechTime={room.talkTime}
                        roomId={room.roomId}
                        userProfileImg1={room.atopicUserUrl}
                        userProfileImg2={room.btopicUserUrl}
                        />
                        ))
                        )}
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
                닫기
            </Button>
        </Modal.Footer>
    </Modal>
    </>

        
    );
}

export default NavBar;
