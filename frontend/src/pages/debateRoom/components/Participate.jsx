import React from "react";
import {  Row, Col } from "react-bootstrap";
import style from '../debatePage.module.css';
import UserVideoComponent from "../Openvidu/UserVideoComponent";

function Participate({status, role, onRoleChange, playerStatus, setPlayerStatus, handlePlayerAVideoStream, publisher, playerA, playerB, setPlaerA, setPlayerB}){
    
    const handlePlayerAChangeToSpectator = (publisher) => {
        onRoleChange('participant');
        setPlayerStatus((prevStatus) => [true, prevStatus[1]]);
        handlePlayerAVideoStream(publisher);
    };

    const handlePlayerBChangeToSpectator = () => {
        onRoleChange('participant');
        setPlayerStatus((prevStatus) => [prevStatus[0], true]);
    }
    
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
                                onClick={handlePlayerAChangeToSpectator(publisher)}
                            >
                                참가하기
                            </button>
                        }
                        { 
                            playerA !== undefined ? (
                                <UserVideoComponent streamManager={playerA} />
                            ):null}
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
                                onClick={handlePlayerBChangeToSpectator}
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