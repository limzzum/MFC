import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCross,
  faHeartCirclePlus,
  faUserClock,
  faVolumeXmark,
  faHand,
} from "@fortawesome/free-solid-svg-icons";
import style from "../debatePage.module.css";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

function DebateBtns({
  status,
  role,
  onRoleChange,
  debateRoomInfo,
  setPlayerStatus,
  setUserReady,
  voteResult,
  roomId,      //추가
  userId,  
  itemCodeId,  // 추가
  handlePlayerAVideoStream, 
  handlePlayerBVideoStream, 
  publisher, 
  playerA, 
  playerB, 
  setPlayerA, 
  setPlayerB
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedTopic, setSelectedTopics] = useState([]);
  const [isVotingEnabled, setVotingEnabled] = useState(true);
  const votingCooldown = debateRoomInfo.talkTime * 120;
  const [remainingTime, setRemainingTime] = useState(votingCooldown);

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  //----------------------------------------------------------------------------------------
  const stompClient = useRef(null);  // useRef를 사용하여 stompClient 선언

useEffect(() => {
    // const socket = new SockJS("http://localhost:8081/mfc");
    const socket = new SockJS("https://goldenteam.site/mfc");
    stompClient.current = Stomp.over(socket);
    console.log('소켓 연결 완료');
    stompClient.current.connect({}, () => {
        stompClient.current.subscribe(`/from/player/${roomId}`, (response) => {
            const message = JSON.parse(response.body);
            console.log("Item response received:", message);
        });
    });

    return () => {
        if (stompClient.current) {
            stompClient.current.disconnect();
        }
    };
// eslint-disable-next-line
}, []);

const sendItemRequest = (itemId) => {
  const requestUrl = "/to/player/item";
  const requestData = {
      "roomId": `${roomId}`,
      // "userId": `${userId}`,
      "userId": 2,
      // isTopicA: selectedTopic.includes('A'),
      isTopicA: selectedTopic.includes('A'),
      "itemCodeId": itemId,
  };
  console.log('전송 데이터:', requestData);

  if (stompClient.current && stompClient.current.connected) {
    stompClient.current.send(requestUrl, JSON.stringify(requestData));
    console.log('전송성공');
} else {
    console.error("소켓 연결이 아직 활성화되지 않았습니다.");
}
};
//----------------------------------------------------------------------------------------
  const handleVote = async () => {
    // 투표 로직 구현
    console.log(`Selected ${selectedTopic}`);

    try {
      // rooId랑 userId 보내주셔서 넣어주세요 ( 충돌날까봐 우선 작성안했습니다 )
      // const roomId = 35;
      // const userId = 326; 
      // const base_url = `http://localhost:8081/api/viewer/vote/${roomId}/${userId}`;
      const base_url = `https://goldenteam.site/mfc/viewer/vote/${roomId}/${userId}`;

      const response = await axios.patch(base_url, null, {
        params: { vote: selectedTopic },
      });
      if (response.data.status === "BAD_REQUEST") {
        console.log("투표 가능한 시간이 아닙니다");
      } else {
        console.log("투표 결과 전송 성공:", response.data);
      }
    } catch (e) {
      console.log("투표 결과 전송 실패:", e);
    }

    setShowModal(false);
    setVotingEnabled(false); // 투표 후 투표 비활성화
  };

  useEffect(() => {
    // const sock = new SockJS("http://localhost:8081/mfc");
    const sock = new SockJS("https://goldenteam.site/mfc");
    const stompClient = Stomp.over(sock);

    stompClient.connect({}, function () {
      console.log("WebSocket 연결 성공");
    });
  }, []);
  useEffect(() => {
    if (!isVotingEnabled) {
      // 투표 후 재투표 가능 시간 설정
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);

      //일정 시간이 지나면 투표 가능하도록 활성화
      setTimeout(() => {
        setVotingEnabled(true);
        setRemainingTime(votingCooldown);
        clearInterval(timer);
      }, votingCooldown * 1000);

      //컴포넌트 언마운트 시 타이머 정리
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isVotingEnabled, votingCooldown]);

  const handleVideoToggle = () => {
    setIsVideoOn(!isVideoOn);
    publisher.publishVideo(!isVideoOn);
  };

  const handleAudioToggle = () => {
    setIsAudioOn(!isAudioOn);
    publisher.publishAudio(!isAudioOn);
  }


  const handleRoleChangeToSpectator = (stream) => {
    onRoleChange("spectator");
    setPlayerStatus([false, false]);
    setUserReady(false);
    if(playerA === stream){
      setPlayerA(undefined);
    }
    if(playerB === stream){
      setPlayerB(undefined);
    }
  };


  return (
    <div className={style.Btns}>
      <Row>
        <Col xs={{ span: 9 }}>
          {role === "participant" && status === "ongoing" && (
            <>
              <Button variant="secondary">연장하기</Button>
              <Button variant="danger">항복하기</Button>
            </>
          )}
        </Col>
        <Col xs={2}>
          {role === "participant" && status === "waiting" && (
            <Button
              variant="outline-primary"
              onClick={ () => handleRoleChangeToSpectator(publisher)}
            >
              관전자로 돌아가기
            </Button>
          )}
        </Col>
      </Row>
      <Row>
      {/* <Col className={style.items}>
          {status === "ongoing" && ( */}
      <Col className={style.items}>
          {role === "participant" && status === "ongoing" && (
            <>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>
                    포션
                    <hr />
                    체력을 10 회복합니다
                  </Tooltip>
                }
              >
                <Button variant="outline-primary" onClick={() => sendItemRequest(9)}>
                  <FontAwesomeIcon icon={faHeartCirclePlus} size="2x" />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>
                    수호천사
                    <hr />
                    최후의 일격을 1회 무시합니다
                  </Tooltip>
                }
              >
                <Button variant="outline-primary" onClick={sendItemRequest(8)}>
                  <FontAwesomeIcon icon={faCross} size="2x" />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>
                    시간연장
                    <hr />
                    연장횟수와 상관없이 발언 시간을 연장합니다
                  </Tooltip>
                }
              >
                <Button variant="outline-primary" onClick={sendItemRequest(10)}>
                  <FontAwesomeIcon icon={faUserClock} size="2x" />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>
                    상대 음소거
                    <hr />
                    상대방 마이크를 10초간 끕니다
                  </Tooltip>
                }
              >
                <Button variant="outline-primary" onClick={sendItemRequest(11)}>
                  <FontAwesomeIcon icon={faVolumeXmark} size="2x" />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>
                    끼어들기
                    <hr />
                    상대 발언시간에 10초간 말할 수 있습니다
                  </Tooltip>
                }
              >
                <Button variant="outline-primary" onClick={sendItemRequest(12)}>
                  <FontAwesomeIcon icon={faHand} size="2x" />
                </Button>
              </OverlayTrigger>
            </>
          )}
        </Col>
        <Col className={style.onOff}>
          {role === "spectator" && status === "ongoing" && (
            <Button variant="primary" onClick={() => setShowModal(true)}>
              투표하기
            </Button>
          )}
          <Button variant="primary" onClick={handleVideoToggle}>
            { isVideoOn ? "CAM OFF" : "CAM ON"}
          </Button>
          {role === "participant" && (
            <Button variant="primary" onClick={handleAudioToggle}>
              { isAudioOn ? "음소거" : "음소거 해제"}
            </Button>
          )}
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Vote for Topics</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Check
              key="topicA"
              type="radio"
              label={debateRoomInfo.atopic}
              id="topicA"
              value="A"
              checked={selectedTopic === "A"}
              onChange={() => setSelectedTopics("A")}
              disabled={!isVotingEnabled}
            />
            <Form.Check
              key="topicB"
              type="radio"
              label={debateRoomInfo.btopic}
              id="topicB"
              value="B"
              checked={selectedTopic === "B"}
              onChange={() => setSelectedTopics("B")}
              disabled={!isVotingEnabled}
            />
          </Form>
          {!isVotingEnabled && (
            <p>{remainingTime}초 뒤에 재투표가 가능합니다.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleVote}>
            투표하기
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DebateBtns;
