import React, {useState, useEffect} from "react";
import {Row, Col, Button, Modal, Form, OverlayTrigger, Tooltip} from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCross, faHeartCirclePlus, faUserClock, faVolumeXmark, faHand } from "@fortawesome/free-solid-svg-icons";
import style from '../debatePage.module.css';

function DebateBtns({status, role, onRoleChange, debateRoomInfo, setPlayerStatus, setUserReady, voteResult}){
    const [showModal, setShowModal] = useState(false);
    const [selectedTopic, setSelectedTopics] = useState([]);
    const [isVotingEnabled, setVotingEnabled] = useState(true);
    const votingCooldown = debateRoomInfo.talkTime * 120;
    const [remainingTime, setRemainingTime] = useState(votingCooldown);

    const handleVote = async () => {
        // 투표 로직 구현
        console.log(`Selected ${selectedTopic}`);
        setShowModal(false);
        setVotingEnabled(false);    // 투표 후 투표 비활성화

        try {
            const base_url = "http://i9a605.p.ssafy.io:8081/api/viewer/vote";
            const roomId = 1;
            const userId = 3;
            const voteChoice = selectedTopic;

            const url = `${base_url}/${roomId}/${userId}?vote=${voteChoice}`;

            const response = await axios.patch(url, {vote: voteChoice});
            console.log("투표 결과 전송 성공:", response.data);
        } catch (e) {
            console.log("투표 결과 전송 실패:", e);
        }
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
    }, [isVotingEnabled, votingCooldown]);

    const handleRoleChangeToSpectator = () => {
        onRoleChange('spectator');
        setPlayerStatus([false, false]);
        setUserReady(false);
    }


    return (
        <div className={style.Btns}>
            <Row>
                <Col xs={{span: 9}}>
                    { role === 'participant' && status === 'ongoing' && 
                        <>
                            <Button variant="secondary">연장하기</Button>
                            <Button variant="danger">항복하기</Button>
                        </>
                    }
                </Col>
                <Col xs={2}>
                    { role === 'participant' && status === 'waiting' && 
                        <Button 
                            variant="outline-primary" 
                            onClick={handleRoleChangeToSpectator}
                        >
                            관전자로 돌아가기
                        </Button>
                    }
                </Col>
            </Row>
            <Row>
                <Col className={style.items}>
                    { role === 'participant' && status === 'ongoing' &&
                        <>  
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>포션<hr/>체력을 10 회복합니다</Tooltip>}
                            >
                                <Button variant="outline-primary">
                                    <FontAwesomeIcon icon={faHeartCirclePlus} size="2x" />
                                </Button>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>수호천사<hr/>최후의 일격을 1회 무시합니다</Tooltip>}
                            >
                                <Button variant="outline-primary">
                                    <FontAwesomeIcon icon={faCross} size="2x" />
                                </Button>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>시간연장<hr/>연장횟수와 상관없이 발언 시간을 연장합니다</Tooltip>}
                            >
                                <Button variant="outline-primary">
                                    <FontAwesomeIcon icon={faUserClock} size="2x" />
                                </Button>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>상대 음소거<hr/>상대방 마이크를 10초간 끕니다</Tooltip>}
                            >
                                <Button variant="outline-primary">
                                    <FontAwesomeIcon icon={faVolumeXmark} size="2x" />
                                </Button>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>끼어들기<hr/>상대 발언시간에 10초간 말할 수 있습니다</Tooltip>}
                            >
                                <Button variant="outline-primary">
                                    <FontAwesomeIcon icon={faHand} size="2x" />
                                </Button>
                            </OverlayTrigger>
                        </>
                    }
                </Col>
                <Col className={style.onOff}>
                    { role === 'spectator' && status === 'ongoing' && 
                        <Button variant="primary" onClick={() => setShowModal(true)}>투표하기</Button>
                    }
                    <Button variant="primary">캠 OFF</Button>
                    { role === 'participant' && <Button variant="primary">마이크 OFF</Button>}
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