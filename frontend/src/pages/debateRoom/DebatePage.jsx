import React, { useCallback, useRef, useEffect, useState } from "react";
import axios from "axios";
import { OpenVidu } from "openvidu-browser";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import {
  useStatus,
  useRole,
  getDebateRoomState,
  getVoteResultState,
} from "../../recoil/debateStateAtom";
import { Row, Col, Stack, Modal, Button, ProgressBar } from "react-bootstrap";
import Header from "./components/Header";
import ScreenShare from "./components/ScreenShare";
import Participate from "./components/Participate";
import TextChatting from "./components/TextChatting";
import DebateBtns from "./components/DebateBtns";
import Spectator from "./components/Spectator";
import RoomInfo from "./components/RoomInfo";
import { userInfoState } from "../../recoil/userInfo";

import style from "./debatePage.module.css";

// tempImg
import winnerImg from "../../images/img.jpg";
import ModifyRoomModal from "./components/modifyRoomModal";

const APPLICATION_SERVER_URL = "https://goldenteam.site/";

function DebatePage() {
  const { roomId } = useParams();
  const userInfo = useRecoilValue(userInfoState);

  // 토론방 상태 호출
  const debateRoomInfo = useRecoilValue(getDebateRoomState(roomId));
  const voteResult = useRecoilValue(getVoteResultState(roomId));

  // 참가자 참가여부
  const [playerStatus, setPlayerStatus] = useState([false, false]);
  // 참가자 준비여부
  const [userReady, setUserReady] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);

  // 토론방 수정 웹소켓 코드
  const modifyStompRef = useRef(null);
  useEffect(() => {
    // var sock = new SockJS("http://localhost:8081/mfc");
    var sock = new SockJS("https://goldenteam.site/mfc");
    var stomp = Stomp.over(sock);
    stomp.connect({}, function () {
      modifyStompRef.current = stomp;
      stomp.subscribe(`/from/room/update/${roomId}`, (message) => {
        const content = JSON.parse(message.body);
        console.log(content);
      });
    });
    return () => {
      if (modifyStompRef.current) {
        modifyStompRef.current.disconnect();
      }
    };
  });
  // 코드 끝

  const handleModifyModalOpen = () => {
    setIsModifyModalOpen((prev) => !prev);
  };

  // OpenVidu 코드 시작
  const [mySessionId, setMySessionId] = useState(roomId);
  const [myUserName, setMyUserName] = useState(userInfo.nickname);
  const [session, setSession] = useState(undefined);
  // const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [playerA, setPlayerA] = useState(undefined);
  const [playerB, setPlayerB] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [, setCurrentVideoDevice] = useState(null);

  const OV = useRef(new OpenVidu());

  const handlePlayerAVideoStream = useCallback(
    async (stream) => {
      if (playerA !== stream) {
        setPlayerA(stream);
        if (playerB === stream) {
          setPlayerB(undefined);
          setPlayerStatus([true, false]);
        }
      } else if (playerA === stream) {
        setPlayerA(undefined);
        setPlayerStatus((prevStatus) => [!prevStatus[0], prevStatus[1]]);
      }
      // eslint-disable-next-line
    },
    [playerA, playerB]
  );

  const handlePlayerBVideoStream = useCallback(
    async (stream) => {
      if (playerB !== stream) {
        setPlayerB(stream);
        if (playerA === stream) {
          setPlayerA(undefined);
          setPlayerStatus([false, true]);
        }
      } else if (playerB === stream) {
        setPlayerB(undefined);
        setPlayerStatus((prevStatus) => [prevStatus[0], !prevStatus[1]]);
      }
      // eslint-disable-next-line
    },
    [playerA, playerB]
  );

  useEffect(() => {
    const updatedFilteredSubscribers = subscribers.filter(
      (sub) => sub !== playerA && sub !== playerB
    );
    setFilteredSubscribers(updatedFilteredSubscribers);
    console.log("subscribe: ", subscribers);
    console.log("playerA: ", playerA);
    console.log("playerB: ", playerB);
    console.log("filteredSubscribers: ", filteredSubscribers);
    // eslint-disable-next-line
  }, [subscribers, playerA, playerB]);

  const joinSession = () => {
    const mySession = OV.current.initSession();

    mySession.on("streamCreated", (event) => {
      const subscriber = mySession.subscribe(event.stream, undefined);
      setSubscribers((subscribers) => [...subscribers, subscriber]);
    });

    mySession.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    mySession.on("exception", (exception) => {
      console.warn(exception);
    });

    setSession(mySession);
  };

  useEffect(() => {
    joinSession();

    return () => leaveSession();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (session) {
      // Get a token from the OpenVidu deployment
      getToken().then(async (token) => {
        try {
          await session.connect(token, { clientData: myUserName });

          let publisher = await OV.current.initPublisherAsync(undefined, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: "640x480",
            frameRate: 30,
            insertMode: "APPEND",
            mirror: false,
          });

          session.publish(publisher);

          const devices = await OV.current.getDevices();
          const videoDevices = devices.filter(
            (device) => device.kind === "videoinput"
          );
          const currentVideoDeviceId = publisher.stream
            .getMediaStream()
            .getVideoTracks()[0]
            .getSettings().deviceId;
          const currentVideoDevice = videoDevices.find(
            (device) => device.deviceId === currentVideoDeviceId
          );

          // setMainStreamManager(publisher);
          setPublisher(publisher);
          setSubscribers((prevSubscribers) => [publisher, ...prevSubscribers]);
          setCurrentVideoDevice(currentVideoDevice);
        } catch (error) {
          console.log(
            "There was an error connecting to the session:",
            error.code,
            error.message
          );
        }
      });
    }
    // eslint-disable-next-line
  }, [session, myUserName]);

  const leaveSession = useCallback(() => {
    // Leave the session
    if (session) {
      session.disconnect();
    }

    // Reset all states and OpenVidu object
    OV.current = new OpenVidu();
    setSession(undefined);
    setSubscribers([]);
    setMySessionId(undefined);
    setMyUserName(userInfo.nickname);
    // setMainStreamManager(undefined);
    setPublisher(undefined);
  }, [session, userInfo.nickname]);

  const deleteSubscriber = useCallback((streamManager) => {
    setSubscribers((prevSubscribers) => {
      const index = prevSubscribers.indexOf(streamManager);
      if (index > -1) {
        const newSubscribers = [...prevSubscribers];
        newSubscribers.splice(index, 1);
        return newSubscribers;
      } else {
        return prevSubscribers;
      }
    });
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      leaveSession();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [leaveSession]);

  const getToken = useCallback(async () => {
    return createSession(mySessionId).then((sessionId) =>
      createToken(sessionId)
    );
  }, [mySessionId]);

  const createSession = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/sessions",
      { customSessionId: sessionId },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data; // The sessionId
  };

  const createToken = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/sessions/" + sessionId + "/connections",
      {},
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data; // The token
  };

  subscribers.forEach((subscriber) => {
    const clientData = JSON.parse(subscriber.stream.connection.data).clientData;
    console.log(`subscriber clientData: ${clientData}`);
  });
  // OpenViidu 코드 종료

  console.log("debateRoomInfo: ", debateRoomInfo);
  console.log("voteResult: ", voteResult);

  const result = {
    status: "OK",
    message: "관전자에게 토론 결과 보내기 성공",
    data: {
      winner: "user1",
      winnerImg: "",
      a: {
        vote: 3,
        hp: 85,
        coin: 302,
        exp: 55,
      },
      b: {
        vote: 7,
        hp: 55,
        coin: 200,
        exp: 96,
      },
      isSurrender: false,
      isExit: false,
    },
  };

  const totalVote = result.data.a.vote + result.data.b.vote;

  // recoil 상태를 사용하는 훅
  const [status, setStatus] = useStatus();
  const [role, setRole] = useRole();
  const [viewers, setViewers] = useState();
  const [players, setPlayers] = useState();

  // 참가자 목록 가져오기 수정 필요
  useEffect(() => {
    const getParticipants = async () => {
      try {
        const response = await axios.get(
          `${APPLICATION_SERVER_URL}api/viewer/list/${roomId}`
        );
        const data = response.data;
        console.log("data: ", data);
        setViewers(data.data.viewers);
        setPlayers(data.data.players);

        console.log("viewers: ", viewers[0]);
        console.log("players: ", players);
      } catch (error) {
        console.log(error);
      }
    };
    getParticipants();
    // eslint-disable-next-line
  }, []);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const [showResultModal, setShowResultModal] = useState(false);
  const goToMainPage = () => {
    setShowResultModal(false);
    console.log("go to main page");
  };

  useEffect(() => {
    if (debateRoomInfo?.data?.status) {
      setStatus(debateRoomInfo.data.status.toLowerCase());
    }
  }, [debateRoomInfo, setStatus]);

  useEffect(() => {
    if (status === "done") {
      setShowResultModal(true);
    } else {
      setShowResultModal(false);
    }
  }, [status]);

  return (
    <div className={style.debatePage}>
      {session !== undefined ? (
        <>
          <Row className={`m-0 p-0`}>
            <Header
              status={status}
              leaveSession={leaveSession}
              handleModifyModalOpen={handleModifyModalOpen}
            />
          </Row>
          <Row className={` m-0 p-0 my-3 `}>
            <Col xs={9} className={` m-0 p-0`}>
              <RoomInfo
                status={status}
                role={role}
                playerStatus={playerStatus}
                onStatusChange={handleStatusChange}
                userReady={userReady}
                setUserReady={setUserReady}
                onRoleChange={handleRoleChange}
                debateRoomInfo={debateRoomInfo.data}
              />
              <Participate
                status={status}
                role={role}
                onRoleChange={handleRoleChange}
                playerStatus={playerStatus}
                setPlayerStatus={setPlayerStatus}
                handlePlayerAVideoStream={handlePlayerAVideoStream}
                handlePlayerBVideoStream={handlePlayerBVideoStream}
                publisher={publisher}
                playerA={playerA}
                playerB={playerB}
                setPlayerA={setPlayerA}
                setPlayerB={setPlayerB}
              />
            </Col>
            <Col xs={3}>
              <Stack gap={1}>
                <ScreenShare roomId={roomId} role={role} status={status} />
                <TextChatting roomId={roomId} />
              </Stack>
            </Col>
          </Row>
          <Row className={`m-0 p-0`}>
            <DebateBtns
              status={status}
              role={role}
              onStatusChange={handleStatusChange}
              onRoleChange={handleRoleChange}
              setPlayerStatus={setPlayerStatus}
              setUserReady={setUserReady}
              debateRoomInfo={debateRoomInfo.data}
              voteResult={voteResult.data}
              handlePlayerAVideoStream={handlePlayerAVideoStream}
              handlePlayerBVideoStream={handlePlayerBVideoStream}
              publisher={publisher}
              playerA={playerA}
              playerB={playerB}
              setPlayerA={setPlayerA}
              setPlayerB={setPlayerB}
              roomId={roomId}
              userId={userInfo.Id}
              // isTopicA={}
            />
          </Row>
          <Row className={`m-0 p-0`}>
            <Spectator
              voteResult={voteResult.data}
              filteredSubscribers={filteredSubscribers}
            />
          </Row>

          {isModifyModalOpen && (
            <ModifyRoomModal
              debateRoomInfo={debateRoomInfo.data}
              roomId={roomId}
              isModifyModalOpen={isModifyModalOpen}
              handleModal={handleModifyModalOpen}
              stompRef={modifyStompRef.current}
            />
          )}
          {/* 토론 결과 Modal*/}
          <Modal
            show={showResultModal}
            onHide={() => setShowResultModal(false)}
          >
            <Modal.Header>
              <Modal.Title>토론 결과</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {result ? (
                <>
                  <p>{result.data.winner} 승리</p>
                  <img src={winnerImg} alt="승자 프로필" />
                </>
              ) : (
                <p>무승부</p>
              )}

              <p>투표 결과</p>
              <ProgressBar>
                <ProgressBar
                  variant="success"
                  label={result.data.a.vote}
                  now={(result.data.a.vote / totalVote) * 100}
                  key={1}
                />
                <ProgressBar
                  variant="danger"
                  label={result.data.b.vote}
                  now={(result.data.b.vote / totalVote) * 100}
                  key={2}
                />
              </ProgressBar>
              <p>잔여 HP</p>
              <ProgressBar>
                <ProgressBar
                  variant="success"
                  label={result.data.a.hp}
                  now={(result.data.a.hp / 200) * 100}
                  key={1}
                />
                <ProgressBar
                  variant="danger"
                  label={result.data.b.hp}
                  now={(result.data.a.hp / 200) * 100}
                  key={2}
                />
              </ProgressBar>
              <hr />
              <p>얻은 경험치: {result.data.a.exp} (+10)</p>
              <p>얻은 코인: {result.data.a.coin} (+15)</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={goToMainPage}>
                메인 페이지로 이동
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : null}
    </div>
  );
}

export default DebatePage;
