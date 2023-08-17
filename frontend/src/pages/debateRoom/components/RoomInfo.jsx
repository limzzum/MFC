import React, { useState, useEffect } from "react";
import { Row, Col, Button, ProgressBar } from "react-bootstrap";
import style from "../debatePage.module.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { AXIOS_BASE_URL } from "../../../config";
import axios from "axios";
import { useStompClient } from "../../../SocketContext";

function RoomInfo({
  status,
  playerStatus,
  role,
  onStatusChange,
  onRoleChange,
  debateRoomInfo,
  players,
  roomId,
  playerAIdInfo,
  playerBIdInfo,
  setPlayerAIdInfo,
  setPlayerBIdInfo,
  debateStart,
  ongoingRoomInfo,
  userInfo,
  turnChange,
  playerAInfo,
  userId,
  playerReady,
  setPlayerReady,
  setIsTopicAReady,
  setIsTopicBReady,
  isTopicAReady,
  isTopicBReady,
  setDebateRoomInfo,
}) {
  const stompClient = useStompClient();
  const total = debateRoomInfo.totalTime * 60;
  const talk = debateRoomInfo.talkTime * 60;

  const [totalTime, setTotalTime] = useState(total);
  const [speechTime, setSpeechTime] = useState(talk);
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    // return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

    const hours = Math.floor(minutes / 60);
    const remainingSeconds = seconds % 60;
    const remainingMinutes = minutes % 60;
    return `${hours}:${remainingMinutes}:${remainingSeconds}`;
  };
  // const speechformatTime = (time) => {
  //   const minutes = Math.floor(time / 60);
  //   const seconds = time % 60;
  //   const remainingMinutes = minutes % 60;
  //   const remainingSeconds = seconds;
  //   return `${remainingMinutes}:${remainingSeconds}`;
  // };
  //===========================================================================
  // const stompRef = useRef(null);

  const handleReadyClick = (isATopic) => {
    console.log("@@@@@@@@@@@@@@@@@@@@@@TQTQTQTQTQTQ");
    console.log(playerReady[0]);
    console.log(playerReady[1]);
    if (stompClient) {
      const payload = {
        roomId: roomId,
        userId: userId,
        isATopic: isATopic,
        isReady: !playerReady[isATopic ? 0 : 1],
      };
      stompClient.send("/to/player/ready", JSON.stringify(payload));
    }
  };
  //===========================================================================

  const [user1HP, setUser1HP] = useState(100);
  const [user2HP, setUser2HP] = useState(100);
  const [playerAHistory, setPlayerAHistory] = useState(null);
  const [playerBHistory, setPlayerBHistory] = useState(null);

  useEffect(() => {
    if (status === "ongoing") {
      // 총 토론시간 타이머
      const totalTimer = setInterval(() => {
        const currentTime = new Date();
        const startTime = new Date(debateRoomInfo?.startTime);
        const timeDifferenceInMillis = currentTime - startTime;
        const seconds = Math.floor(timeDifferenceInMillis / 1000);
        const minutes = Math.floor(seconds / 60);
        if (minutes >= debateRoomInfo.totalTime) {
          // onStatusChange("done");
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
        // const currentTime1 = new Date();
        // const startTime1 = new Date(ongoingRoomInfo?.startTalkTime);
        // const timeDifferenceInMillis1 = currentTime1 - startTime1;
        const timeDifferenceInMillis1 = 14000;
        const seconds1 = Math.floor(timeDifferenceInMillis1 / 1000);
        if (speechTime > 0 && totalTime > 0) {
          setSpeechTime(talk - seconds1);
        }
      }, 1000);

      // if (speechTime === 0 && totalTime > 0) {
      //   // setSpeechTime(talk);
      //   if (userInfo.id === ongoingRoomInfo?.curUserId) {
      //     turnChange();
      //   }
      // }

      return () => {
        clearInterval(totalTimer);
        clearInterval(speechTimer);
      };
    } // eslint-disable-next-line
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
  //0817 heejeong 이미 ongoing 되는 코드 있어서 주석처리한다.
  // useEffect(() => {
  //   if (status === "waiting" && playerReady[0] && playerReady[1]) {
  //     onStatusChange("ongoing");
  //     if (userInfo.id === playerAIdInfo) {
  //       debateStart();
  //     }
  //   }
  //   // eslint-disable-next-line
  // }, [playerReady, status]);

  const playerGetHistory = async (userId) => {
    try {
      const response = await axios.get(`${AXIOS_BASE_URL}/record/${userId}`);
      return response.data.data;
    } catch (e) {
      // console.log(`사용자 전적 불러오기 API 오류: ${e}`);
      return null;
    }
  };
  useEffect(() => {
    if (playerAIdInfo === null) {
      setPlayerAHistory(null);
    } else {
      playerGetHistory(playerAIdInfo).then((promiseResult) => {
        setPlayerAHistory(promiseResult);
      });
    }
    // eslint-disable-next-line
  }, [playerAIdInfo]);

  useEffect(() => {
    if (playerBIdInfo === null) {
      setPlayerBHistory(null);
    } else {
      playerGetHistory(playerBIdInfo).then((promiseResult) => {
        setPlayerBHistory(promiseResult);
      });
    }
    // eslint-disable-next-line
  }, [playerBIdInfo]);

  // null 값 처리
  useEffect(() => {
    for (const player of players) {
      if (player) {
        if (player.topicTypeA) {
          playerGetHistory(player.viewerDto.userId).then((promiseResult) => {
            setPlayerAIdInfo(player.viewerDto.userId);
            setPlayerAHistory(promiseResult);
          });
        } else {
          playerGetHistory(player.viewerDto.userId).then((promiseResult) => {
            setPlayerBIdInfo(player.viewerDto.userId);
            setPlayerBHistory(promiseResult);
          });
        }
      }
    }
    // eslint-disable-next-line
  }, [players]);

  useEffect(() => {
    if (stompClient) {
      stompClient.subscribe(`/from/player/status/${roomId}`, (message) => {
        const content = JSON.parse(message.body);
        if (content.isATopic) {
          setUser1HP(content.hp);
        } else {
          setUser2HP(content.hp);
        }
      });

      stompClient.subscribe(`/from/player/ready/${roomId}`, (message) => {
        const content = JSON.parse(message.body);
        console.log("ready하고 결과 받는 곳임");
        if (content.isATopic) {
          setIsTopicAReady(content.isReady);
        } else {
          setIsTopicBReady(content.isReady);
        }
        console.log(content.isATopic);
        console.log(content.isReady);
        if (content.isAllReady) {
          onStatusChange("ongoing");
          debateRoomUpdateStatus();
          if (userInfo.id === playerAIdInfo) {
            debateStart();
          }
        }
      });
    }
    // eslint-disable-next-line
  }, [stompClient]);

  const debateRoomUpdateStatus = async () => {
    try {
      // const base_url = `http://localhost:8081/api/debate/${roomId}`;
      const base_url = `${AXIOS_BASE_URL}/debate/${roomId}`;
      const response = await axios.get(base_url, null);
      console.log("수정!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log(response.data.data);
      setDebateRoomInfo(response.data);
    } catch (e) {
      // console.log("토론방 시작 정보 가져오기 실패:", e);
    }
  };

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
      <Row className={`m-0`}>
        <Col className={style.userInfo}>
          {playerAHistory && playerAHistory.nickName ? (
            <div>
              <div className={style.nickBOx}>
                <p>{playerAHistory.nickName}&nbsp;</p>
              </div>
              <div className={style.infoBOx}>
                <span>{playerAHistory.winCount}승&nbsp;</span>
                <span>{playerAHistory.drawCount}무&nbsp;</span>
                <span>{playerAHistory.loseCount}패&nbsp;</span>
                <span>
                  /&nbsp;승률&nbsp;{playerAHistory.winRate.toFixed(0)}%
                </span>
              </div>
            </div>
          ) : (
            <span>플레이어 대기 중...</span>
          )}
        </Col>
        <Col xs={1} className={`${style.debateTimer} mx-auto p-0 mt-1`}>
          <div>
            <p>남은 시간</p>
            {formatTime(totalTime)}
          </div>
        </Col>
        <Col className={style.userInfo}>
          {playerBHistory && playerBHistory.nickName ? (
            <div>
              <div className={style.nickBOx}>
                <p>{playerBHistory.nickName}&nbsp;</p>
              </div>
              <div className={style.infoBOx}>
                <span>{playerBHistory.winCount}승&nbsp;</span>
                <span>{playerBHistory.drawCount}무&nbsp;</span>
                <span>{playerBHistory.loseCount}패&nbsp;</span>
                <span>
                  /&nbsp;승률&nbsp;{playerBHistory.winRate.toFixed(0)}%
                </span>
              </div>
            </div>
          ) : (
            <span>플레이어 대기 중...</span>
          )}
        </Col>
      </Row>
      <Row className={`${style.bottomBox} p-0 m-0`}>
        <Col className={style.userStatus}>
          {status === "waiting" &&
            playerStatus[0] &&
            role === "participant" && (
              <Button
                className={
                  playerReady[0]
                    ? `${style.completeButton}`
                    : `${style.readyButton}`
                }
                onClick={() => {
                  if (userInfo.id === playerAIdInfo) {
                    setPlayerReady([!playerReady[0], playerReady[1]]);
                    handleReadyClick(true); // 왼쪽 준비 버튼 클릭 시 isATopic이 true
                  }
                }}
              >
                {playerReady[0] ? "준비 완료" : "준비"}
              </Button>
            )}
          {status === "waiting" && role === "spectator" && isTopicAReady && (
            <span className={style.readyComplete}>플레이어 준비 완료</span>
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
          {/* <FontAwesomeIcon icon={faMicrophone} className={`${style.micIcon}`} />
          &nbsp;
          {speechformatTime(speechTime)} */}
        </Col>
        <Col className={style.userStatus}>
          {status === "waiting" &&
            playerStatus[1] &&
            role === "participant" && (
              <Button
                className={
                  playerReady[1]
                    ? `${style.completeButton}`
                    : `${style.readyButton}`
                }
                onClick={() => {
                  if (userInfo.id === playerBIdInfo) {
                    setPlayerReady([playerReady[0], !playerReady[1]]);
                    handleReadyClick(false);
                  }
                }}
              >
                {playerReady[1] ? "준비 완료" : "준비"}
              </Button>
            )}
          {status === "waiting" && role === "spectator" && isTopicBReady && (
            <span className={style.readyComplete}>플레이어 준비 완료</span>
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
