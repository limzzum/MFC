import React, {useEffect, useState} from 'react';
import {useRecoilValue} from 'recoil';
import {useStatus, useRole, getDebateRoomState, voteResultState} from '../../recoil/debateStateAtom';
import { Row, Col, Stack, Modal, Button, ProgressBar} from 'react-bootstrap';
import Header from './components/Header';
import ScreenShare from './components/ScreenShare';
import Participate from './components/Participate';
import TextChatting from './components/TextChatting';
import DebateBtns from './components/DebateBtns';
import Spectator from './components/Spectator';
import RoomInfo from './components/RoomInfo';

import style from './debatePage.module.css';

// tempImg
import winnerImg from '../../images/img.jpg';

function DebatePage() {

  // 토론방 상태 호출
  const debateRoomInfo = useRecoilValue(getDebateRoomState);
  const voteResult = useRecoilValue(voteResultState);

  // 참가자 참가여부
  const [playerStatus, setPlayerStatus] = useState([false, false]);
  // 참가자 준비여부
  const [userReady, setUserReady] = useState(false);

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

  return (
    <div className={style.debatePage}>
      <Row>
        <Header/>
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
            <TextChatting/>
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
          // voteResult={voteResult.data}
        />
      </Row>
      <Row>
        <Spectator
          debateRoomInfo={debateRoomInfo.data}
          // voteResult={voteResult.data}
        />
      </Row>

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
    </div>
  )
}

export default DebatePage;
