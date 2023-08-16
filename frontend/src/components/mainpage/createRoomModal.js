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
    <div
      className={`modal ${showModal ? "show d-block" : ""} ${
        style.modalBackground
      }`}
      tabIndex="-1"
      role="dialog"
    >
      <div className={`modal-dialog ${style.modalBox}`} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">토론방 생성</h5>
          </div>
          <div className="modal-body">
            <label className={style.contentTitle}>
              주제 :: 두 가지를 입력해주세요
            </label>
            <div className="row">
              <div className="col-md-12">
                <span className={style.contentTitle}></span>
                <input
                  type="text"
                  className="form-control"
                  value={title1}
                  onChange={(e) => setTitle1(e.target.value)}
                  placeholder="ex) 물렁한 복숭아가 더 맛있다"
                />
              </div>
              {/* <div className="col-md-1">
                <span className={style.contentTitle}></span>
              </div> */}
              <div className="col-md-12 mt-2">
                <input
                  type="text"
                  className="form-control"
                  value={title2}
                  onChange={(e) => setTitle2(e.target.value)}
                  placeholder="ex) 딱딱한 복숭아가 더 맛있다"
                />
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-md-6">
                <div className={`my-2`}>
                  <label className={style.contentTitle}>토론시간 (분)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={debateTime}
                    min={0}
                    onChange={(e) => setDebateTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className={`my-2`}>
                  <label className={style.contentTitle}>발언 시간</label>
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
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className={`my-2`}>
                  <label className={style.contentTitle}>관전자 수</label>
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
                </div>
              </div>
              <div className="col-md-6">
                <div className={`my-2`}>
                  <label className={style.contentTitle}>연장 횟수</label>
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
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
            >
              닫기
            </button>
            <button
              type="button"
              className={`btn ${style.createBtn}`}
              onClick={handleCreateRoom}
            >
              방 만들기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateRoomModal;
