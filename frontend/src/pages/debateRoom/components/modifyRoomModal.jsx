import React, {useState} from "react";
import { Modal, Button } from "react-bootstrap";
import style from "../../../components/mainpage/createRoomModal.module.css";

function ModifyRoomModal({
    debateRoomInfo,
    roomId,
    isModifyModalOpen,
    handleModal,
    stompRef
}) {

    const [title1, setTitle1] = useState(debateRoomInfo.atopic);
    const [title2, setTitle2] = useState(debateRoomInfo.btopic);
    const [debateTime, setDebateTime] = useState(debateRoomInfo.totalTime);
    const [speechTime, setSpeechTime] = useState(debateRoomInfo.talkTime);
    const [spectatorCount, setSpectatorCount] = useState(debateRoomInfo.maxPeople);
    const [extensionCount, setExtensionCount] = useState(debateRoomInfo.overTimeCount);

    const handleModifyRoom = () => {
        if (stompRef) {
            stompRef.send(`/to/room/update/${roomId}`, JSON.stringify({
                totalTime: debateTime,
                talkTime: speechTime,
                maxPeople: spectatorCount,
                overTimeCount: extensionCount,
                atopic: title1,
                btopic: title2,
            }));
            }
            handleModal();
        };
    return (
    <>
        <Modal show={isModifyModalOpen} onHide={handleModal}>
            <Modal.Header closeButton>
                <Modal.Title>토론방 수정</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <label className={style.contentTitle}>제목:</label>
                <div className="row">
                <div className="col-md-12">
                    <input
                    type="text"
                    className="form-control"
                    value={title1}
                    onChange={(e) => setTitle1(e.target.value)}
                    />
                </div>
                <div className="col-md-1">
                    <span>VS</span>
                </div>
                <div className="col-md-12">
                    <input
                    type="text"
                    className="form-control"
                    value={title2}
                    onChange={(e) => setTitle2(e.target.value)}
                    />
                </div>
                </div>
                <label className={style.contentTitle}>토론시간 (분):</label>
                <input
                type="text"
                className="form-control"
                value={debateTime}
                onChange={(e) => setDebateTime(e.target.value)}
                />
                <label className={style.contentTitle}>발언시간:</label>
                <select
                className="form-select"
                value={speechTime}
                onChange={(e) => setSpeechTime(e.target.value)}
                >
                <option value="1">1분</option>
                <option value="2">2분</option>
                <option value="3">3분</option>
                <option value="4">4분</option>
                <option value="5">5분</option>
                </select>
                <label className={style.contentTitle}>관전자 수:</label>
                <select
                className="form-select"
                value={spectatorCount}
                onChange={(e) => setSpectatorCount(e.target.value)}
                >
                <option value="1">1명</option>
                <option value="2">2명</option>
                <option value="3">3명</option>
                <option value="4">4명</option>
                <option value="5">5명</option>
                <option value="6">6명</option>
                </select>
                <label className={style.contentTitle}>연장 횟수:</label>
                <select
                className="form-select"
                value={extensionCount}
                onChange={(e) => setExtensionCount(e.target.value)}
                >
                <option value="0">0회</option>
                <option value="1">1회</option>
                <option value="2">2회</option>
                <option value="3">3회</option>
                </select>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleModal}>
                닫기
                </Button>
                <Button variant="primary" onClick={handleModifyRoom}>
                방 수정
                </Button>
            </Modal.Footer>
        </Modal>
    </>

    );
}

export default ModifyRoomModal;
