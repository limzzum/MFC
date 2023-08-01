import React, {useState, useEffect} from "react";
import {Row, Col, Button, Modal, Form} from "react-bootstrap";
import style from '../debatePage.module.css';

function DebateBtns(){
    const [showModal, setShowModal] = useState(false);
    const [selectedTopic, setSelectedTopics] = useState([]);
    const [isVotingEnabled, setVotingEnabled] = useState(true);
    const votingCooldown = 30;
    const [remainingTime, setRemainingTime] = useState(votingCooldown);

    const topics = ['topic A', 'topic B'];

    const handleVote = () => {
        // 투표 로직 구현
        console.log(`Selected ${selectedTopic}`);
        setShowModal(false);
        setVotingEnabled(false);    // 투표 후 투표 비활성화
    };
useEffect(() => {
    if(!isVotingEnabled){
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
}, [isVotingEnabled]);



    return (
        <div className={style.Btns}>
            <Row>
                <Col xs={{span: 5}}>
                    <Button variant="outline-primary">연장하기</Button>
                </Col>
                <Col xs={{span: 5}}>
                    <Button variant="outline-primary">연장하기</Button>
                    <Button variant="outline-primary">항복하기</Button>
                </Col>
                <Col xs={2}>
                    <Button variant="outline-primary">관전자로 돌아가기</Button>
                </Col>
            </Row>
            <Row>
                <Col className={style.items}>
                    <Button variant="outline-primary">포션</Button>
                    <Button variant="outline-primary">수호천사</Button>
                    <Button variant="outline-primary">연장</Button>
                    <Button variant="outline-primary">마이크</Button>
                    <Button variant="outline-primary">끼어들기</Button>
                    <Button variant="outline-primary">음성변조</Button>
                </Col>
                <Col className={style.onOff}>
                    <Button variant="primary" onClick={() => setShowModal(true)}>투표하기</Button>
                    <Button variant="primary">캠 OFF</Button>
                    <Button variant="primary">마이크 OFF</Button>
                </Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Vote for Topics</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    {topics.map((topic) => (
                    <Form.Check
                        key={topic}
                        type="radio"
                        label={topic}
                        id={topic}
                        checked={selectedTopic === topic}
                        onChange={() => setSelectedTopics(topic)}
                        disabled={!isVotingEnabled}
                    />
                    ))}
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