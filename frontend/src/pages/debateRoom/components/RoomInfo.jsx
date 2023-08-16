import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Button, ProgressBar } from "react-bootstrap";
import style from "../debatePage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { AXIOS_BASE_URL } from "../../../config";
import axios from "axios";
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { SOCKET_BASE_URL } from "../../../config";
import { useRecoilState } from 'recoil';
import { userReadyState } from '../../../recoil/debateStateAtom'
function RoomInfo({
  status,
  playerStatus,
  role,
  onStatusChange,
  onRoleChange,
  debateRoomInfo,
  players,
  roomId,
  userId
}) {
  const user1HP = 70;
  const user2HP = 100;

  const total = debateRoomInfo.totalTime * 60;
  const talk = debateRoomInfo.talkTime * 60;
  const [userReady, setUserReady] = useRecoilState(userReadyState);

  const [totalTime, setTotalTime] = useState(total);
  const [speechTime, setSpeechTime] = useState(talk);
  const [playerA, setPlayerA] = useState(undefined);
  const [playerB, setPlayerB] = useState(undefined);
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };
//===========================================================================
const stompRef = useRef(null);
useEffect(() => {
  let sock = new SockJS(`${SOCKET_BASE_URL}`);
  let stomp = Stomp.over(sock);

  stomp.connect({}, function() {
    stompRef.current = stomp;
    // 구독하는 부분
    stomp.subscribe(`/from/player/ready/${roomId}`, (message) => {
      console.log(`여기는 메시지 ${message.body}`)      
      
      const content = JSON.parse(message.body);
      // 여기서 받은 데이터를 처리할 수 있습니다.
      
      if (content.isATopic !== undefined && content.isReady === true) {
        setUserReady(prevState => {
          if (content.isATopic) {
            return [content.isReady, prevState[0]];
          } else {
            return [prevState[1], content.isReady];
          }
        });
      }
      // console.log(`여기는 ${content.isReady}`)  
      console.log(`여기는 유저 1번 ${userReady[0]}`)
      console.log(`여기는 유저 2번 ${userReady[1]}`)

      // console.log(`여기는 유저 1번 ${userReady[0]}`)
      // console.log(`여기는 유저 2번 ${userReady[1]}`)

      console.log(`여기는 모두 다 레디 ${content.isAllReady}`)     
       
    });
  });
  return () => {
    if (stompRef.current) {
      stompRef.current.disconnect();
    }
  };
}, [roomId]);

const handleReadyClick = (isATopic) => {
  if(stompRef.current) {
    const payload = {
      roomId: roomId,
      userId: userId,
      isATopic: isATopic,
      isReady: userReady[isATopic ? 0 : 1]
    };
    stompRef.current.send("/to/player/ready", {}, JSON.stringify(payload));
  }
}
//===========================================================================

  useEffect(() => {
    if (status === "ongoing") {
      // 총 토론시간 타이머
      const totalTimer = setInterval(() => {
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
          setTotalTime(debateRoomInfo.totalTime * 60 - seconds);
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
  }, [
    status,
    onStatusChange,
    totalTime,
    speechTime,
    talk,
    debateRoomInfo.startTime,
    debateRoomInfo.totalTime,
  ]);

  //두 참가자가 모두 준비가 되면 토론 시작
  useEffect(() => {
    if (status === "waiting" && userReady[0] && userReady[1]) {
      onStatusChange("ongoing");
    }
  }, [userReady, status, onStatusChange]);
  
  const playerGetHistory = async (userId) => {
    try {
      const response = await axios.get(`${AXIOS_BASE_URL}/record/${userId}`)
      return response.data.data;
    } catch (e) {
      console.log(`사용자 전적 불러오기 API 오류: ${e}`);
      return null;
    }
  }
  // null 값 처리
  useEffect( ()=> {
    for(const player of players) {
      if(player) {
        if(player.topicTypeA) {
          playerGetHistory(player.viewerDto.userId)
          .then((promiseResult) => {
            setPlayerA(promiseResult);
          })
        }else {
          playerGetHistory(player.viewerDto.userId)
          .then((promiseResult) => {
            setPlayerB(promiseResult);
          })
        }
      }
    }
  // eslint-disable-next-line
  },[players]);
  console.log(`여기는 유저 1번 ${userReady[0]}`)
  console.log(`여기는 유저 2번 ${userReady[1]}`)
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
        {playerA && playerA.nickName ? (
        <span>{playerA.nickName}&nbsp;</span>
        ) : (
        <span>사용자1&nbsp;</span>
        )}
          <span>
          <strong>승</strong> {playerA && playerA.nickName ? (
        <span>{playerA.winCount}&nbsp;</span>
        ) : (
        <span>&nbsp;</span>
        )}
          </span>
          <span>무&nbsp; {playerA && playerA.nickName ? (
        <span>{playerA.drawCount}&nbsp;</span>
        ) : (
        <span>&nbsp;</span>
        )}</span>
          <span>패&nbsp; {playerA && playerA.nickName ? (
        <span>{playerA.loseCount}&nbsp;</span>
        ) : (
        <span>&nbsp;</span>
        )}</span>
          <span>승률  {playerA && playerA.nickName ? (
        <span>{playerA.winRate.toFixed(0)}%&nbsp;</span>
        ) : (
        <span>&nbsp;</span>
        )}</span>
        </Col>
        <Col xs={1} className={`${style.debateTimer} mx-auto p-0 mt-1`}>
          <div>
            <p>남은 시간</p>
            {formatTime(totalTime)}
          </div>
        </Col>
        <Col className={style.userInfo}>
        {playerB && playerB.nickName ? (
        <span>{playerB.nickName}&nbsp;</span>
        ) : (
        <span>사용자2&nbsp;</span>
        )}
          <span>
          <strong>승</strong> {playerB && playerB.nickName ? (
        <span>{playerB.winCount}&nbsp;</span>
        ) : (
        <span>&nbsp;</span>
        )}
          </span>
          <span>무&nbsp; {playerB && playerB.nickName ? (
        <span>{playerB.drawCount}&nbsp;</span>
        ) : (
        <span>&nbsp;</span>
        )}</span>
          <span>패&nbsp; {playerB && playerB.nickName ? (
        <span>{playerB.loseCount}&nbsp;</span>
        ) : (
        <span>&nbsp;</span>
        )}</span>
          <span>승률  {playerB && playerB.nickName ? (
        <span>{playerB.winRate.toFixed(0)}%&nbsp;</span>
        ) : (
        <span>&nbsp;</span>
        )}</span>
        </Col>
      </Row>
      <Row className={style.bottomBox}>
        <Col className={style.userStatus}>
          {status === "waiting" && playerStatus[0] && (
            <Button
              className={
                userReady[0] ? `${style.completeButton}` : `${style.readyButton}`
              }
              onClick={() => {
                setUserReady(prevState => ([!prevState[0], prevState[1]]));
                handleReadyClick(true); // 왼쪽 준비 버튼 클릭 시 isATopic이 true
              }}
              >
              {userReady[0] ? "준비 완료" : "준비"}
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
                userReady[1] ? `${style.completeButton}` : `${style.readyButton}`
              }
              onClick={() => {
                setUserReady(prevState => ([prevState[0], !prevState[1]]));
                handleReadyClick(false);
              }}
            >
              {userReady[1] ? "준비 완료" : "준비"}
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
