import React, {useState, useEffect} from "react";
import { Row, Col, Button, ProgressBar } from "react-bootstrap";
import style from '../debatePage.module.css';

function RoomInfo(){
    const user1HP = 70;
    const user2HP = 100;

    const [totalTime, setTotalTime] = useState(360);
    const [speechTime, setSpeechTime] = useState(60);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    }

    useEffect(() => {
        // 총 토론시간 타이머
        const totalTimer = setInterval( () => {
            if(totalTime > 0){
                setTotalTime((prevTime) => prevTime - 1);
            }
        }, 1000);

        // 1회 발언시간 타이머
        const speechTimer = setInterval(() => {
            if(speechTime > 0 && totalTime > 0) {
                setSpeechTime((prevTime) => prevTime - 1);
            } 
        }, 1000);

        return () => {
            clearInterval(totalTimer);
            clearInterval(speechTimer);
        };
    }, [totalTime, speechTime]);

    useEffect( () => {
        if(speechTime === 0 && totalTime > 0){
            setSpeechTime(60);
        }
    }, [speechTime, totalTime]);

    return(
        <>
            <Row className={style.roomInfo}>
                <Col id="option1" className={`${style.opinion} ${style.opinion1}`}>
                    <span>title1</span>
                </Col>
                <Col id="option2" className={`${style.opinion} ${style.opinion2}`}>
                    <span>title2</span>
                </Col>
            </Row>
            <Row>
                <Col>
                    사용자1 정보
                </Col>
                <Col xs={2}>
                    {formatTime(totalTime)}
                </Col>
                <Col>
                    사용자2 정보
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button>Ready</Button>
                    <ProgressBar className={style.user1HP} now={user1HP} label={`${user1HP}%`} />
                </Col>
                <Col xs={2}>
                    {formatTime(speechTime)}
                </Col>
                <Col>
                    <Button>Ready</Button>
                    <ProgressBar className="user2HP" now={user2HP} label={`${user2HP}%`} />
                </Col>
            </Row>
        </>
    );
}

export default RoomInfo;