import React, {useEffect, useState} from 'react';
import {useStatus, useRole} from '../../recoil/debateStateAtom';
import { Row, Col, Stack, Modal, Button} from 'react-bootstrap';
import Header from './components/Header';
import ScreenShare from './components/ScreenShare';
import Participate from './components/Participate';
import TextChatting from './components/TextChatting';
import DebateBtns from './components/DebateBtns';
import Spectator from './components/Spectator';
import RoomInfo from './components/RoomInfo';

import style from './debatePage.module.css';

function DebatePage() {

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
        <Button onClick={() => handleStatusChange('waiting')}>wating</Button>
        <Button onClick={() => handleStatusChange('ongoing')} >ongoing</Button>
        <Button onClick={() => handleStatusChange('done')}>done</Button>
      </Row>
      <Row className='debatePart'>
        <Col xs={9}>
          <RoomInfo
            status={status}
            role={role}
            onStatusChange={handleStatusChange}
            onRoleChange={handleRoleChange}
          />
          <Participate role={role} onRoleChange={handleRoleChange}/>
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
        />
      </Row>
      <Row>
        <Spectator/>
      </Row>

      {/* 토론 결과 Modal*/}
      <Modal show={showResultModal} onHide={() => setShowResultModal(false)}>
        <Modal.Header>
          <Modal.Title>토론 결과</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>토론 결과</p>
          <p>포인트: 전체 포인트(+획득 포인트)</p>
          <p>경험치: 전체 경험치(+획득 경험치)</p>
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
