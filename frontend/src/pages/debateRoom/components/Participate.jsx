import React from "react";
import { Row, Col } from "react-bootstrap";
import style from '../debatePage.module.css';
import UserVideoComponent from "../Openvidu/UserVideoComponent";

function Participate({status, role, onRoleChange, playerStatus, setPlayerStatus, handlePlayerAVideoStream, handlePlayerBVideoStream, publisher, playerA, playerB, setPlaerA, setPlayerB}){
    return (
        <div>
            <Row>
                <Col>
                    <div className={style.Participant}>
                        {
                            (playerStatus[0] === false &&
                            status === 'waiting') &&
                            <button 
                                className={style.button} 
                                onClick={() => {
                                    onRoleChange('participant');
                                    setPlayerStatus((prevStatus) => [true, prevStatus[1]]);
                                    handlePlayerAVideoStream(publisher);
                                }}
                            >
                                참가하기
                            </button>

                        }
                        {
                            (role === 'participant' && playerA !== undefined) &&
                            <UserVideoComponent className='playerA' streamManager={playerA} called={style.Participant}/>                       
                        }

                    </div>
                    <span>남은 연장 횟수: </span>
                </Col>
                <Col>
                    <div className={style.Participant}>
                        { 
                            playerStatus[1] === false &&
                            status === 'waiting' &&
                            <button 
                                className={style.button} 
                                onClick={() => {
                                    onRoleChange('participant');
                                    setPlayerStatus((prevStatus) => [prevStatus[0], true]);
                                    handlePlayerBVideoStream(publisher);
                                }}
                            >
                                참가하기
                            </button>
                        }
                        {
                            (role === 'participant' && playerB !== undefined) &&
                            <UserVideoComponent className='playerB' streamManager={playerB} called={style.Participant}/>
                        }
                    </div>
                    <span>남은 연장 횟수: </span>
                </Col>
            </Row>
        </div>
    );
}

export default Participate;