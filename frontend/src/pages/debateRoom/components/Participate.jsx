import React, { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import { Row, Col } from "react-bootstrap";
import style from '../debatePage.module.css';
import UserVideoComponent from "../Openvidu/UserVideoComponent";


function Participate({ roomId, userId, status, role, onRoleChange, playerStatus, setPlayerStatus, handlePlayerAVideoStream, handlePlayerBVideoStream, publisher, playerA, playerB}){

    const stompRef = useRef(null);

    useEffect(() => {
        // var sock = new SockJS("http://localhost:8081/mfc");
        var sock = new SockJS("https://goldenteam.site/mfc");
        var stomp = Stomp.over(sock);
        stomp.connect({}, function () {
            stompRef.current = stomp;
            stomp.subscribe(`/from/room/player/${roomId}`, (message) => {
                const content = JSON.parse(message.body);
                console.log(content);
            });
        });
        return () => {
            if (stompRef.current) {
                stompRef.current.disconnect();
            }
        }
    }, [roomId, userId, playerStatus]);

    const handlePostPlayer = (isTopicA) => {
        if(stompRef.current) {
            stompRef.current.send(
                `/to/room/player/${roomId}`,
                JSON.stringify({
                    roomId: roomId,
                    userId: userId,
                    isTopicA : isTopicA,
                })
            );
        }
    };
    
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
                                    handlePostPlayer(true);
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
                                    handlePostPlayer(false);
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