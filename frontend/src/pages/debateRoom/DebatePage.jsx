import React, { useCallback, useRef, useEffect, useState} from 'react';
import axios from 'axios';
import { OpenVidu} from 'openvidu-browser';
import UserVideoComponent from './Openvidu/UserVideoComponent';
import { useParams } from 'react-router-dom';
import {useRecoilValue} from 'recoil';
import {useStatus, useRole, getDebateRoomState, getVoteResultState} from '../../recoil/debateStateAtom';
import { Row, Col, Stack, Modal, Button, ProgressBar} from 'react-bootstrap';
import Header from './components/Header';
import ScreenShare from './components/ScreenShare';
import Participate from './components/Participate';
import TextChatting from './components/TextChatting';
import DebateBtns from './components/DebateBtns';
import Spectator from './components/Spectator';
import RoomInfo from './components/RoomInfo';
import {userInfoState} from '../../recoil/userInfo';

import style from './debatePage.module.css';

// tempImg
import winnerImg from '../../images/img.jpg';

const APPLICATION_SERVER_URL = 'https://goldenteam.site/';

function DebatePage() {
  const {roomId} = useParams();
  const userInfo = useRecoilValue(userInfoState);

  // 토론방 상태 호출
  const debateRoomInfo = useRecoilValue(getDebateRoomState(roomId));
  const voteResult = useRecoilValue(getVoteResultState(roomId));

  // 참가자 참가여부
  const [playerStatus, setPlayerStatus] = useState([false, false]);
  // 참가자 준비여부
  const [userReady, setUserReady] = useState(false);

  const [mySessionId, setMySessionId] = useState(roomId)
  const [myUserName, setMyUserName] = useState(`${userInfo.nickname}`)
  const [session, setSession] = useState(mySessionId);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(userInfo.nickname);
  const [subscribers, setSubscribers] = useState([]);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);

  const OV = useRef(new OpenVidu());

  // const handleChangeSessionId = useCallback((e) => {
  //     setMySessionId(e.target.value);
  // }, []);

  // const handleChangeUserName = useCallback((e) => {
  //     setMyUserName(e.target.value);
  // }, []);

    /**
   * --------------------------------------------
   * GETTING A TOKEN FROM YOUR APPLICATION SERVER
   * --------------------------------------------
   * The methods below request the creation of a Session and a Token to
   * your application server. This keeps your OpenVidu deployment secure.
   *
   * In this sample code, there is no user control at all. Anybody could
   * access your application server endpoints! In a real production
   * environment, your application server must identify the user to allow
   * access to the endpoints.
   *
   * Visit https://docs.openvidu.io/en/stable/application-server to learn
   * more about the integration of OpenVidu in your application server.
   */
    const getToken = useCallback(async () => {
      return createSession(mySessionId).then(sessionId =>
          createToken(sessionId),
      );
  }, [mySessionId]);

  const createSession = async (sessionId) => {
      const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions', { customSessionId: sessionId }, {
          headers: { 'Content-Type': 'application/json', },
      });
      return response.data; // The sessionId
  };

  const createToken = async (sessionId) => {
      const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections', {}, {
          headers: { 'Content-Type': 'application/json', },
      });
      return response.data; // The token
  };

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

  const handleMainVideoStream = useCallback((stream) => {
      if (mainStreamManager !== stream) {
          setMainStreamManager(stream);
      }
  }, [mainStreamManager]);


  // 여기가 원래 joinSession
  useEffect(() => {
      const mySession = OV.current.initSession();

      mySession.on('streamCreated', (event) => {
          const subscriber = mySession.subscribe(event.stream, undefined);
          setSubscribers((subscribers) => [...subscribers, subscriber]);
      });

      mySession.on('streamDestroyed', (event) => {
          deleteSubscriber(event.stream.streamManager);
      });

      mySession.on('exception', (exception) => {
        console.warn(exception);
      });
      
      console.log("joinSession 되냐");
      setSession(mySession);
    }, [deleteSubscriber]);
  
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
                      resolution: '640x480',
                      frameRate: 30,
                      insertMode: 'APPEND',
                      mirror: false,
                  });

                  session.publish(publisher);

                  const devices = await OV.current.getDevices();
                  const videoDevices = devices.filter(device => device.kind === 'videoinput');
                  const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
                  const currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

                  setMainStreamManager(publisher);
                  setPublisher(publisher);
                  setCurrentVideoDevice(currentVideoDevice);
              } catch (error) {
                  console.log('There was an error connecting to the session:', error.code, error.message);
              }
          });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setMySessionId('SessionA');
      setMyUserName('Participant' + Math.floor(Math.random() * 100));
      setMainStreamManager(undefined);
      setPublisher(undefined);
  }, [session]);

  const switchCamera = useCallback(async () => {
      try {
          const devices = await OV.current.getDevices();
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
  
          if (videoDevices && videoDevices.length > 1) {
              const newVideoDevice = videoDevices.filter(device => device.deviceId !== currentVideoDevice.deviceId);
  
              if (newVideoDevice.length > 0) {
                  const newPublisher = OV.current.initPublisher(undefined, {
                      videoSource: newVideoDevice[0].deviceId,
                      publishAudio: true,
                      publishVideo: true,
                      mirror: true,
                  });
  
                  if (session) {
                      await session.unpublish(mainStreamManager);
                      await session.publish(newPublisher);
                      setCurrentVideoDevice(newVideoDevice[0]);
                      setMainStreamManager(newPublisher);
                      setPublisher(newPublisher);
                  }
              }
          }
      } catch (e) {
          console.error(e);
      }
  }, [currentVideoDevice, session, mainStreamManager]);



  useEffect(() => {
      const handleBeforeUnload = (event) => {
          leaveSession();
      };
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
      };
  }, [leaveSession]);



  console.log('debateRoomInfo: ', debateRoomInfo);
  console.log('voteResult: ', voteResult);

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

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const [showResultModal, setShowResultModal] = useState(false);
  const goToMainPage = () => {
    setShowResultModal(false);
    console.log('go to main page');
  };

  useEffect(() => {
    if(debateRoomInfo?.data?.status){
      setStatus((debateRoomInfo.data.status).toLowerCase());
    }
  }, [debateRoomInfo, setStatus])

  useEffect(() => {
    if(status === 'done'){
      setShowResultModal(true);
    } else{
      setShowResultModal(false);
    }
  }, [status]);

  console.log(`session: ${session}`);

  return (
    <div className={style.debatePage}>
      {session !== undefined ? (
        <>
          <Row>
            <Header 
              status={status}
            />
            <Button onClick={() => setStatus('ongoing')}>ongoing</Button>
          </Row>
          <Row className='debatePart'>
            <Col xs={9}>
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
              />
            </Col>
            <Col xs={3}>
              <Stack gap={1}>
                <ScreenShare status={status} role={role} />
                <TextChatting
                  roomId={roomId}
                />
              </Stack>
            </Col>
          </Row>
          <Row>
            <DebateBtns 
              status={status}
              role={role}
              onStatusChange={handleStatusChange}
              onRoleChange={handleRoleChange}
              setPlayerStatus={setPlayerStatus}
              setUserReady={setUserReady}
              debateRoomInfo={debateRoomInfo.data}
              voteResult={voteResult.data}
            />
          </Row>
          <Row>
            <Spectator
              debateRoomInfo={debateRoomInfo.data}
              voteResult={voteResult.data}
            />
          </Row>

          {mainStreamManager !== undefined ? (
            <div>
              <UserVideoComponent streamManager={mainStreamManager} />
            </div>
          ) : null}

          <div>
            {publisher !== undefined ? (
              <div onClick={() => handleMainVideoStream(publisher)}>
                <UserVideoComponent streamManager={publisher} />
              </div>
            ) : null}
            {subscribers.map((sub, i) => (
              <div key={sub.id} onClick={() => handleMainVideoStream(sub)}>
                <span>{sub.id}</span>
                <UserVideoComponent streamManager={sub} />
              </div>
            ))}
            <input
                className="btn btn-large btn-success"
                type="button"
                id="buttonSwitchCamera"
                onClick={switchCamera}
                value="Switch Camera"
            />
          </div>

          {/* 토론 결과 Modal*/}
          <Modal show={showResultModal} onHide={() => setShowResultModal(false)}>
            <Modal.Header>
              <Modal.Title>토론 결과</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {result ? (
                <>
                  <p>{result.data.winner} 승리</p>
                  <img src={winnerImg} alt='승자 프로필'/>
                </>
              ) : (
                <p>무승부</p>
              )}

              <p>투표 결과</p>
                <ProgressBar>
                    <ProgressBar variant="success" label={result.data.a.vote} now={(result.data.a.vote / totalVote) * 100} key={1} />
                    <ProgressBar variant="danger" label={result.data.b.vote} now={(result.data.b.vote / totalVote) * 100} key={2} />
                </ProgressBar>
              <p>잔여 HP</p>
                <ProgressBar>
                      <ProgressBar variant="success" label={result.data.a.hp} now={(result.data.a.hp / 200) * 100} key={1} />
                      <ProgressBar variant="danger" label={result.data.b.hp} now={(result.data.a.hp / 200) * 100} key={2} />
                  </ProgressBar>
              <hr/>
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
  )
}

export default DebatePage;
