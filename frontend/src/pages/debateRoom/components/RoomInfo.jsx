import React, { useState, useEffect } from "react";
import { Row, Col, Button, ProgressBar } from "react-bootstrap";
import style from "../debatePage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";

function RoomInfo({
  status,
  playerStatus,
  role,
  onStatusChange,
  onRoleChange,
  debateRoomInfo,
  userReady,
  setUserReady,
  viewers, 
  userInfo
}) {
  const user1HP = 70;
  const user2HP = 100;

  const total = debateRoomInfo.totalTime * 60;
  const talk = debateRoomInfo.talkTime * 60;

  const [totalTime, setTotalTime] = useState(total);
  const [speechTime, setSpeechTime] = useState(talk);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  useEffect(() => {
    if (status === "ongoing") {
      // 총 토론시간 타이머
      const totalTimer = setInterval( () => {
        const currentTime = new Date();
        const startTime = new Date(debateRoomInfo.startTime);
        const timeDifferenceInMillis = currentTime - startTime;
        const seconds = Math.floor(timeDifferenceInMillis / 1000);
        const minutes = Math.floor(seconds / 60);
        if (minutes >= debateRoomInfo.totalTime) {
            // onStatusChange('done');
          } else {
            // const hours = Math.floor(minutes / 60); 
            // const remainingSeconds = seconds % 60;
            // const remainingMinutes = minutes % 60;
          
            // console.log(`Remaining Time: ${hours} hours, ${remainingMinutes} minutes, ${remainingSeconds} seconds`);'
            setTotalTime((debateRoomInfo.totalTime*60)-seconds);
          }
        }, 1000);
      // 1회 발언시간 타이머
      const speechTimer = setInterval(() => {
        if (speechTime > 0 && totalTime > 0) {
          setSpeechTime((prevTime) => prevTime - 1);
        }
      }, 1000);

      if (speechTime === 0 && totalTime > 0) {
        setSpeechTime(talk);
      }

      return () => {
        clearInterval(totalTimer);
        clearInterval(speechTimer);
      };
    }
  }, [status, onStatusChange, totalTime, speechTime, talk, debateRoomInfo.startTime, debateRoomInfo.totalTime]);

  //두 참가자가 모두 준비가 되면 토론 시작
  useEffect(() => {
    if (status === "waiting" && userReady[0] && userReady[1]) {
      onStatusChange("ongoing");
    }
  }, [userReady, status, onStatusChange]);

  return (
    <>
      <Row className={`${style.roomInfo} m-0`}>
        <Col id="option1" className={`${style.infoText} ${style.opinion1}`}>
          <span>{debateRoomInfo.atopic}</span>
        </Col>
        <Col xs={1} className={`${style.vs}`}>
          <span>VS</span>
        </Col>
        <Col id="option2" className={`${style.infoText} ${style.opinion2}`}>
          <span>{debateRoomInfo.btopic}</span>
        </Col>
      </Row>
      <Row>
        <Col className={style.userInfo}>
          <span>사용자1&nbsp;</span>
          <span>
            <strong>승</strong> 5&nbsp;
          </span>
          <span>무 0&nbsp;</span>
          <span>패 0&nbsp;</span>
          <span>승률 100%</span>
        </Col>
        <Col xs={1} className={`${style.debateTimer} mx-auto p-0 mt-1`}>
          <div>
            <p>남은 시간</p>
            {formatTime(totalTime)}
          </div>
        </Col>
        <Col className={style.userInfo}>
          <span>사용자2&nbsp;</span>
          <span>
            <strong>승</strong> 5&nbsp;
          </span>
          <span>무 1&nbsp;</span>
          <span>패 0&nbsp;</span>
          <span>승률 100%</span>
        </Col>
      </Row>
      <Row className={style.bottomBox}>
        <Col className={style.userStatus}>
          {status === "waiting" && playerStatus[0] && (
            <Button
              className={
                userReady ? `${style.completeButton}` : `${style.readyButton}`
              }
              onClick={() => setUserReady((prevState) => !prevState)}
            >
              {userReady ? "준비 완료" : "준비"}
            </Button>
          )}
          {status === "ongoing" && (
            <ProgressBar
              className={`${style.user1HP} ${style.hpBar} mx-auto`}
              now={user1HP}
              variant="danger"
              label={`${user1HP}`}
            />
          )}
        </Col>
        <Col xs={1} className={`${style.speechTimer} mx-auto p-0`}>
          <FontAwesomeIcon icon={faMicrophone} className={`${style.micIcon}`} />
          &nbsp;
          {formatTime(speechTime)}
        </Col>
        <Col className={style.userStatus}>
          {status === "waiting" && playerStatus[1] && (
            <Button
              className={
                userReady ? `${style.completeButton}` : `${style.readyButton}`
              }
              onClick={() => setUserReady((prevState) => !prevState)}
            >
              {userReady ? "준비 완료" : "준비"}
            </Button>
          )}
          {status === "ongoing" && (
            <ProgressBar
              className={`${style.hpBar} mx-auto`}
              now={user2HP}
              variant="danger"
              label={`${user2HP}`}
            />
          )}
        </Col>
      </Row>
    </>
  );
}

export default RoomInfo;
