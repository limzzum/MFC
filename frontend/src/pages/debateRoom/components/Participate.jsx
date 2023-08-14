import React, { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import { Row, Col } from "react-bootstrap";
import style from "../debatePage.module.css";
import UserVideoComponent from "../Openvidu/UserVideoComponent";

function Participate({
  roomId,
  userId,
  status,
  role,
  onRoleChange,
  playerStatus,
  setPlayerStatus,
  handlePlayerAVideoStream,
  handlePlayerBVideoStream,
  publisher,
  playerA,
  playerB,
}) {
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
    };
  }, [roomId, userId, playerStatus]);

  const handlePostPlayer = (isTopicA) => {
    if (stompRef.current) {
      stompRef.current.send(
        `/to/room/player/${roomId}`,
        JSON.stringify({
          roomId: roomId,
          userId: userId,
          isTopicA: isTopicA,
        })
      );
    }
  };

  return (
    <div>
      <Row className={`m-0 p-0`}>
        <Col className={`m-0 p-0`}>
          <div className={`${style.Participant} mx-auto`}>
            {playerStatus[0] === false && status === "waiting" && (
              <button
                className={`${style.button} btn`}
                onClick={() => {
                  onRoleChange("participant");
                  setPlayerStatus((prevStatus) => [true, prevStatus[1]]);
                  handlePlayerAVideoStream(publisher);
                  handlePostPlayer(true);
                }}
              >
                참가하기
              </button>
            )}
            {role === "participant" && playerA !== undefined && (
              <UserVideoComponent
                className="playerA"
                streamManager={playerA}
                called={style.Participant}
              />
            )}
          </div>
          {/* <span className={`mx-auto`}>남은 연장 횟수: </span> */}
          {/* <div className={`${style.rightCount} m-0 p-0 mx-auto`}>
            <span>남은 연장 횟수: </span>
          </div> */}
        </Col>
        <Col xs={1} className={`m-0 p-0`}></Col>
        <Col className={`m-0 p-0`}>
          <div className={`${style.Participant} mx-auto`}>
            {playerStatus[1] === false && status === "waiting" && (
              <button
                className={`${style.button} btn`}
                onClick={() => {
                  onRoleChange("participant");
                  setPlayerStatus((prevStatus) => [prevStatus[0], true]);
                  handlePlayerBVideoStream(publisher);
                  handlePostPlayer(false);
                }}
              >
                참가하기
              </button>
            )}
            {role === "participant" && playerB !== undefined && (
              <UserVideoComponent
                className="playerB"
                streamManager={playerB}
                called={style.Participant}
              />
            )}
          </div>
          {/* <div className={`${style.rightCount} m-0 p-0 mx-auto`}>
            <span>남은 연장 횟수: </span>
          </div> */}
        </Col>
      </Row>
    </div>
  );
}

export default Participate;
