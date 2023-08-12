import React, {useEffect, useState} from "react";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import { Row, Col } from "react-bootstrap";
import style from '../debatePage.module.css';
import UserVideoComponent from "../Openvidu/UserVideoComponent";


function Participate({roomId, userId, status, role, onRoleChange, playerStatus, setPlayerStatus, handlePlayerAVideoStream, handlePlayerBVideoStream, publisher, playerA, playerB}){

    const [stompClient, setStompClient] = useState(null);

    useEffect (() => {
        const sock = new SockJS("http://localhost:8081/mfc");
        const stomp = Stomp.over(sock);
        stomp.connect({}, () => {
            setStompClient(stomp);
            stomp.subscribe(`/from/player/${roomId}`, (message) => {
                const content = JSON.parse(message.body);
                console.log("player subscribe", content);
                
            });

        });
        return () => {
            if(stompClient){
                stomp.disconnect();
                setStompClient(null);
            }
        }
    }, [roomId, stompClient]);

    const postPlayer = (isTopicA) => {
        if(stompClient) {
            const data = {
                roomId,
                userId,
                isTopicA,
            };
            stompClient.send("/to/player/enter", JSON.stringify(data));
            console.log("player post", data);
        } else{
            console.log("stompClient is null");
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
                                    postPlayer(true);
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
                                    postPlayer(false);
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