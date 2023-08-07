import React from "react";
import {  Row, Col } from "react-bootstrap";
import style from '../debatePage.module.css';

function Participate({status, role, onRoleChange, playerStatus, setPlayerStatus}){
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