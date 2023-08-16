import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import { Row, Col } from "react-bootstrap";
import style from "../debatePage.module.css";
import UserVideoComponent from "../Openvidu/UserVideoComponent";
import { SOCKET_BASE_URL } from "../../../config";
// import ImageSegmentationComponent from "../ImageSegmentation"

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
  updatePlayer,
}) {
  const stompRef = useRef(null);
  console.log("userId", userId);
  console.log("roomId", roomId);
  useEffect(() => {
    var sock = new SockJS(`${SOCKET_BASE_URL}`);
    var stomp = Stomp.over(sock);
    stomp.connect({}, function () {
      console.log("요청이 가니??___________________________");
      stompRef.current = stomp;
      stomp.subscribe(`/from/player/enter/${roomId}`, (message) => {
        const content = JSON.parse(message.body);
        console.log("플레이어 등록 응답", content); // 데이터 파싱해서 프론트에 저장?
        updatePlayer(content);
      });
    });
    return () => {
      if (stompRef.current) {
        stompRef.current.disconnect();
      }
    };
    // eslint-disable-next-line
  }, [roomId, userId, playerStatus]);

  const handlePostPlayer = (isTopicA) => {
    if (stompRef.current) {
      console.log("A주제인가?", isTopicA);
      stompRef.current.send(
        `/to/player/enter`,
        JSON.stringify({
          roomId: roomId,
          userId: userId,
          isATopic: isTopicA,
          isReady: false,
        })
      );
    }
  };

  const [showImageSegmentation, setShowImageSegmentation] = useState(false);
  const handleParticipantClick = (isTopicA) => {
    onRoleChange("participant");
    if (isTopicA) {
      setPlayerStatus((prevStatus) => [true, prevStatus[1]]);
      handlePlayerAVideoStream(publisher);
    } else {
      setPlayerStatus((prevStatus) => [prevStatus[0], true]);
      handlePlayerBVideoStream(publisher);
    }
    handlePostPlayer(isTopicA);
    setShowImageSegmentation(true); // 참여하기 버튼을 클릭하면 이미지 세그멘테이션 기능 활성화
  };
  return (
    <div>
      <Row className={`m-0 p-0`}>
        <Col className={`m-0 p-0`}>
          <div className={`${style.Participant} mx-auto`} style={{ position: 'relative' }}>
            <div style={{ position: 'relative', width: '100%', paddingBottom: '75%' }}>
              {playerA === undefined && playerStatus[0] === false && status === "waiting" && (
                <button
                  className={`${style.button} btn`}
                  onClick={() => handleParticipantClick(true)}
                >
                  참가하기
                </button>
              )}
              {playerA !== undefined && (
                <UserVideoComponent
                  className="playerA"
                  streamManager={playerA}
                  called={style.Participant}
                />
              )}
            </div>
            {showImageSegmentation && (
              <div style={{ position: 'relative', width: '100%', paddingBottom: '75%' }}>
                {/* <ImageSegmentationComponent /> */}
              </div>
            )}
          </div>
        </Col>
        <Col xs={1} className={`m-0 p-0`}></Col>
        <Col className={`m-0 p-0`}>
          <div className={`${style.Participant} mx-auto`} style={{ position: 'relative' }}>
            <div style={{ position: 'relative', width: '100%', paddingBottom: '75%' }}>
              { playerB === undefined && playerStatus[1] === false && status === "waiting" && (
                <button
                  className={`${style.button} btn`}
                  onClick={() => handleParticipantClick(false)}
                >
                  참가하기
                </button>
              )}
              { playerB !== undefined && (
                <UserVideoComponent
                  className="playerB"
                  streamManager={playerB}
                  called={style.Participant}
                />
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Participate;