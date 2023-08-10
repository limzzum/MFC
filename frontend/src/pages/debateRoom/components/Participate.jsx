import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import axios from "axios"; 
import style from '../debatePage.module.css';

import { useRecoilValue } from 'recoil';
import { userInfoState } from '../../../recoil/userInfo';

function Participate({status, role, onRoleChange, playerStatus, setPlayerStatus}){
    const userInfo = useRecoilValue(userInfoState); // 리코일 상태에서 유저 정보 가져오기
    const [, setUserProfileImage] = useState(null); // 유저 프로필 이미지 상태

    const handleParticipate = async () => {
        const response = await axios.get(`Yhttps://goldenteam.site/api/user/${userInfo.id}`);
        if (response.data && response.data.imageURL) {
            setUserProfileImage(response.data.imageURL);
        }
        // 여기에 기존에 있던 onRoleChange, setPlayerStatus 로직 추가
    };

    return (
        <div>
            <Row>
                <Col>
                    <div className={style.Participant}>
                        { 
                            role === 'spectator' &&
                            status === 'waiting' &&
                            <button 
                                className={style.button} 
                                onClick={() => {
                                    handleParticipate();
                                    onRoleChange('participant');
                                    setPlayerStatus((prevStatus) => [true, prevStatus[1]]);
                                }}
                            >
                                참가하기
                            </button>
                        }
                    </div>
                    <span>남은 연장 횟수: </span>
                </Col>
                <Col>
                    <div className={style.Participant}>
                        { 
                            role === 'spectator' &&
                            status === 'waiting' &&
                            <button 
                                className={style.button} 
                                onClick={() => {
                                    handleParticipate(); // 추가: 참여하기 버튼 클릭시 handleParticipate 함수 호출
                                    onRoleChange('participant');
                                    setPlayerStatus((prevStatus) => [prevStatus[0], true]);
                                }}
                            >
                                참가하기
                            </button>
                        }
                    </div>
                    <span>남은 연장 횟수: </span>
                </Col>
            </Row>
        </div>
    );
}

export default Participate;
