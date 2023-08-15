import React, { useCallback, useRef, useEffect, useState } from "react";
import axios from "axios";
import { OpenVidu } from "openvidu-browser";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faFaceSmile
} from "@fortawesome/free-solid-svg-icons";
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
import { SOCKET_BASE_URL } from "../../config";
// import getParticipate from '../../api/getParticipateAPI'; // 참가자 생길 때마다 호출해서 갱신해야하나? 물어봐야함

import style from "./debatePage.module.css";

// tempImg
import baseProfileImg from "../../images/baseProfile.png";
import ModifyRoomModal from "./components/modifyRoomModal";

const APPLICATION_SERVER_URL = "https://goldenteam.site/";

function DebatePage() {
  const { roomId } = useParams();
  const userInfo = useRecoilValue(userInfoState);
  console.log("userInfo: ", userInfo);

  // 토론방 상태 호출
  const debateRoomInfo = useRecoilValue(getDebateRoomState(roomId));
  
const getVoteResult = useRecoilValue(getVoteResultState(roomId));
const [voteResult, setVoteResult] = useState(getVoteResult.data);

  // 참가자 참가여부
  const [playerStatus, setPlayerStatus] = useState([false, false]);
  // 참가자 준비여부
  const [userReady, setUserReady] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [players, setPlayers] = useState([]);

  // 토론방 입장 웹소켓 코드
  const enterStompRef = useRef(null);
  useEffect(() => {
    var sock = new SockJS(`${SOCKET_BASE_URL}`);
    var stomp = Stomp.over(sock);
    stomp.connect({}, function () {
      enterStompRef.current = stomp;
      stomp.subscribe(`/from/room/enter/${roomId}`, (message) => {
        const content = JSON.parse(message.body);
        console.log("입장 데이터: ", content);
      });
    });
    // eslint-disable-next-line
  }, []);

  const handleEnterRoom = () => {
    if (enterStompRef.current) {
      enterStompRef.current.send(`/to/room/enter/${roomId}/${userInfo.id}`);
    }
  };

  // 토론방 퇴장 웹소켓 코드 
  const outStompRef = useRef(null);
  useEffect( () => {
    var sock = new SockJS(`${SOCKET_BASE_URL}`);
    var stomp = Stomp.over(sock);
    stomp.connect({}, function() {
      outStompRef.current = stomp;
      stomp.subscribe(`/from/room/out/${roomId}`, (message) => {
        const content = JSON.parse(message.body);
        console.log(`토론방 퇴장 메시지: ${content}`);
      })
    })
  })

  const handleOutRoom = () => {
    if(outStompRef.current){
      outStompRef.current.send(`/to/room/out/${roomId}/${userInfo.id}`);
    }
  }

  const [result, setResult] = useState({
    winner: "user1",
    winnerImg: "",
    playerA: {
      nickName: "Kim",
      vote: 0,
      hp: 80,
      coin: 0,
      exp: 0,
    },
    playerB: {
      nickName: "Lee",
      vote: 0,
      hp: 100,
      coin: 0,
      exp: 0,
    },
    isSurrender: true,
    isExit: false,
  });
  // 토론방 수정 웹소켓 코드
  const modifyStompRef = useRef(null);
  useEffect(() => {
    var sock = new SockJS(`${SOCKET_BASE_URL}`);
    var stomp = Stomp.over(sock);
    stomp.connect({}, function () {
      modifyStompRef.current = stomp;
      stomp.subscribe(`/from/room/update/${roomId}`, (message) => {
        const content = JSON.parse(message.body);
        console.log(content);
      });

      const stompMessage = { roomId: roomId };
      console.log(stompMessage, "");
    });
    // return () => {
    //   if (modifyStompRef.current) {
    //     modifyStompRef.current.disconnect();
    //   }
    // };
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
    handleEnterRoom();

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
            publishAudio: false,
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
  //_________________________________________________________________________________________
  // const stompRef = useRef(null);
  // useEffect(() => {
  //   const sock = new SockJS(`${BASE_URL}`);
  //   const stomp = Stomp.over(sock);

  //   stompRef.current = stomp;

  //   stomp.connect({}, function () {
  //     stomp.subscribe(`/from/room/playerout/${roomId}`, (message) => {
  //       const modalData = JSON.parse(message.body);
  //       setResult(modalData);
  //       handleStatusChange("waiting");
  //     });
  //   });
  //   // eslint-disable-next-line
  // }, [roomId]);

  const leaveSession = useCallback(() => {
    // Leave the session
    if (session) {
      // if ((status === "ongoing") && (role === "participate")){
      //   const stompMessage = { userId: userInfo.id, roomId: parseInt(roomId) };
      //   stompRef.current.send(
      //     `/to/room/playerout/${roomId}/${userInfo.id}`,
      //   JSON.stringify(stompMessage)
      // );}

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
    // eslint-disable-next-line
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

  // const result = {
  //   status: "OK",
  //   message: "관전자에게 토론 결과 보내기 성공",
  //   data: {
  //     winner: "user1",
  //     winnerImg: "",
  //     a: {
  //       vote: 3,
  //       hp: 85,
  //       coin: 302,
  //       exp: 55,
  //     },
  //     b: {
  //       vote: 7,
  //       hp: 55,
  //       coin: 200,
  //       exp: 96,
  //     },
  //     isSurrender: false,
  //     isExit: false,
  //   },
  // };

  // const totalVote = result.data.a.vote + result.data.b.vote;

  // recoil 상태를 사용하는 훅
  const [status, setStatus] = useStatus();
  const [role, setRole] = useRole();
  // const [viewers, setViewers] = useState();
  // const [players, setPlayers] = useState([]);

  // 참가자 목록 가져와서 
  useEffect(() => {
    const getParticipants = async () => {
      try {
        const response = await axios.get(
          `${APPLICATION_SERVER_URL}api/viewer/list/${roomId}`
        );
        const data = response.data;
        // const dataViewers = data.data.viewers;
        const dataPlayers = data.data.players;
        setPlayers(dataPlayers);

        console.log("data: ", data.data);

        for (const player of dataPlayers || []) {
          // console.log(player,"asdf");
          for (const subscriber of subscribers || []) {
            // console.log(subscriber,"qwer");
            // console.log(publisher,"qwerty");
            const clientData = JSON.parse(
              subscriber.stream.connection.data
            ).clientData;
            // console.log("clientData: ", clientData);
            // console.log(`문자열 테스트: ${clientData}, ${player.viewerDto.nickName}`, clientData === player.viewerDto.nickName)
            if (clientData === player.viewerDto.nickName) {
              // console.log("겹치는 닉네임: ", clientData);
              if (player.topicTypeA) {
                setPlayerA(subscriber);
                setPlayerStatus((prev) => [true, prev[1]]);
              } else {
                setPlayerB(subscriber);
                setPlayerStatus((prev) => [prev[0], true]);
              }
            }
          }
        }
      } catch (error) {
        console.log("getParticipants 에러 ", error);
      }
    };

    getParticipants();

    // eslint-disable-next-line
  }, []);

  const updatePlayer = (playerInfo) => {
    console.log("토론 참가자 업데이트: ", playerInfo);
    for(const subscriber of subscribers || []){
      const clientData = JSON.parse(subscriber.stream.connection.data).clientData;
      if(clientData === playerInfo.nickname){
        if(playerInfo.isATopic){
          setPlayerA(subscriber);
          setPlayerStatus((prev) => [true, prev[1]]);
        }else{
          setPlayerB(subscriber);
          setPlayerStatus((prev) => [prev[0], true]);
        }
      }
    }
  }

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
              handleOutRoom={handleOutRoom}
              handleModifyModalOpen={handleModifyModalOpen}
            />
          </Row>
          <Row className={` m-0 p-0 my-3 `}>
            <Col xs={9} className={` m-0 p-0`}>
              <Row>
                <RoomInfo
                  status={status}
                  role={role}
                  playerStatus={playerStatus}
                  onStatusChange={handleStatusChange}
                  userReady={userReady}
                  setUserReady={setUserReady}
                  onRoleChange={handleRoleChange}
                  debateRoomInfo={debateRoomInfo.data}
                  userInfo={userInfo}
                  players={players}
                />
              </Row>
              <Row>
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
                  roomId={roomId}
                  userId={userInfo.id}
                  updatePlayer={updatePlayer}
                />
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
                  voteResult={voteResult}
                  handlePlayerAVideoStream={handlePlayerAVideoStream}
                  handlePlayerBVideoStream={handlePlayerBVideoStream}
                  publisher={publisher}
                  playerA={playerA}
                  playerB={playerB}
                  setPlayerA={setPlayerA}
                  setPlayerB={setPlayerB}
                  roomId={roomId}
                  userId={userInfo.id}
                  setResult={setResult}
                  // isTopicA={}
                />
              </Row>
            </Col>
            <Col xs={3}>
              <Stack gap={1}>
                <ScreenShare roomId={roomId} role={role} status={status} />
                <TextChatting roomId={roomId} />
              </Stack>
            </Col>
          </Row>
          <Row className={`m-0 p-0`}>
            <Spectator
              voteResult={voteResult}
              filteredSubscribers={filteredSubscribers}
              setVoteResult={setVoteResult}
              roomId={roomId}
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
          <div className={`modal ${showResultModal ? "show d-block" : ""}`} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">토론 결과</h5>
                </div>
            <div className="modal-body">
              {result ? (
                <>
                  <p className={style.contentTitle}>승리</p>
                  <p className={style.contentTitleWinner}>{result.winner}</p>
                  <div className={style.imgBox}> 
                    <img src={result.userProfile ? `https://goldenteam.site/${result.userProfile}` : baseProfileImg } 
                      className={style.contentTitleWinnerImg}
                      alt="승자 프로필"
                       />
                  </div>
                </>
              ) : (
                <p>무승부</p>
              )}
              <hr />
              {(!result.isSurrender || result.isExit) ? (
                <>
                  <p>투표 결과</p>
                  <ProgressBar>
                    <ProgressBar
                      variant="success"
                      label={result.playerA.vote}
                      now={
                        (result.playerA.vote /
                          (result.playerA.vote + result.b.vote)) *
                        100
                      }
                      key={1}
                    />
                    <ProgressBar
                      variant="danger"
                      label={result.playerB.vote}
                      now={
                        (result.playerB.vote /
                          (result.playerA.vote + result.playerB.vote)) *
                        100
                      }
                      key={2}
                    />
                  </ProgressBar>
                </>
              ) : null}
              
              <p className={style.contentTitle}>잔여 HP</p>
              <ProgressBar>
                <ProgressBar
                  variant="danger"
                  label={result.playerA.hp}
                  // label={(result.playerA.nickName === result.winner) ? result.playerA.hp : result.playerB.hp }
                  // now={ (result.playerA.nickName === result.winner) ? ((result.playerA.hp / 100) * 100) : ((result.playerB.hp / 100) * 100)}
                  now={(result.playerA.hp / 100) * 100}
                />
              </ProgressBar>
              <hr />
              <div className={style.recordBox}>
                <div className={style.recordAlone}>
                  <p className={style.contentSubTitle}>얻은 경험치</p>
                  <p className={style.contentSubContent}> 
                  <FontAwesomeIcon icon={faFaceSmile} color="orange" />
                    &nbsp; {result.playerA.exp} (+10)</p>
                </div>
                <div className={style.recordAlone}>
                  <p className={style.contentSubTitle}>얻은 코인</p> 
                  <p className={style.contentSubContent}>
                    <FontAwesomeIcon icon={faCoins} color="orange" />
                    &nbsp; {result.playerA.coin} (+15)
                  </p>
                </div>
              </div>
            </div>
            <Modal.Footer>
              <Button variant="secondary" onClick={goToMainPage}>
                메인 페이지로 이동
              </Button>
            </Modal.Footer>
          </div>
          </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default DebatePage;
