import React from "react";
import style from "./createRoomModal.module.css";

function CreateRoomModal({
  showModal,
  closeModal,
  title1,
  setTitle1,
  title2,
  setTitle2,
  debateTime,
  setDebateTime,
  speechTime,
  setSpeechTime,
  spectatorCount,
  setSpectatorCount,
  extensionCount,
  setExtensionCount,
  handleCreateRoom,
}) {
  return (
    <div className={`modal ${showModal ? "show d-block" : ""}`} tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">토론방 만들기</h5>
            <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
          </div>
          <div className="modal-body">
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
            <select className="form-select" value={speechTime} onChange={(e) => setSpeechTime(e.target.value)}>
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
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              닫기
            </button>
            <button type="button" className="btn btn-primary" onClick={handleCreateRoom}>
              방 만들기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateRoomModal;
