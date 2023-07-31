import React, {useState} from 'react';
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

  const [showResultModal, setShowResultModal] = useState(false);
  const goToMainPage = () => {
    setShowResultModal(false);
    console.log('go to main page');
  };

  // const state = 'waiting';

  return (
    <div className={style.debatePage}>
      <Row>
        <Header/>
      </Row>
      <Row className='debatePart'>
        <Col xs={9}>
          <RoomInfo/>
          <Participate/>
        </Col>
        <Col xs={3}>
          <Stack gap={1}>
            <ScreenShare/>
            <TextChatting/>
          </Stack>
        </Col>
      </Row>
      <Row>
        <DebateBtns/>
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
