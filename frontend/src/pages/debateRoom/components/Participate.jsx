import  { useRef } from "react";
import { Row, Col } from "react-bootstrap";
import style from "../debatePage.module.css";
import UserVideoComponent from "../Openvidu/UserVideoComponent";
import AudioSegmentationComponent from "../AudioSegmentationComponent"

function Participate({
  roomId,
  userId,
  status,
  role,
  onRoleChange,
  playerStatus,
  setPlayerStatus,
  handlePlayerAVideoStream,
  handlePlayerBVideoStream,
  publisher,
  playerA,
  playerB,
  updatePlayer,
}) {
  const stompRef = useRef(null);
  console.log("userId", userId);
  console.log("roomId", roomId);

  const handlePostPlayer = (isTopicA) => {
    if (stompRef.current) {
      console.log("A주제인가?", isTopicA);
      stompRef.current.send(
        `/to/player/enter`,
        JSON.stringify({
          roomId: roomId,
          userId: userId,
          isATopic: isTopicA,
          isReady: false,
        })
      );
    }
  };

  const [showImageSegmentation, setShowImageSegmentation] = useState(false);
  const handleParticipantClick = (isTopicA) => {
    onRoleChange("participant");
    if (isTopicA) {
      setPlayerStatus((prevStatus) => [true, prevStatus[1]]);
      handlePlayerAVideoStream(publisher);
    } else {
      setPlayerStatus((prevStatus) => [prevStatus[0], true]);
      handlePlayerBVideoStream(publisher);
    }
    handlePostPlayer(isTopicA);
    setShowImageSegmentation(true); // 참여하기 버튼을 클릭하면 이미지 세그멘테이션 기능 활성화
  };
  return (
    <div>
      <Row className={`m-0 p-0`}>
        <Col className={`m-0 p-0`}>
          <div className={`${style.Participant} mx-auto`}>
            {playerA === undefined && playerStatus[0] === false && status === "waiting" && (
              <button
                className={`${style.button} btn`}
                onClick={() => {
                  onRoleChange("participant");
                  setPlayerStatus((prevStatus) => [true, prevStatus[1]]);
                  handlePlayerAVideoStream(publisher);
                  handlePostPlayer(true);
                }}
              >
                참가하기
              </button>
            )}
            {playerA !== undefined && (
              <UserVideoComponent
                className="playerA"
                streamManager={playerA}
                called={style.Participant}
              />
            )}
          </div>
          {/* <span className={`mx-auto`}>남은 연장 횟수: </span> */}
          {/* <div className={`${style.rightCount} m-0 p-0 mx-auto`}>
            <span>남은 연장 횟수: </span>
          </div> */}
        </Col>
        <Col xs={1} className={`m-0 p-0`}></Col>
        <Col className={`m-0 p-0`}>
          <div className={`${style.Participant} mx-auto`} style={{ position: 'relative' }}>
            <div style={{ position: 'relative', width: '100%', paddingBottom: '75%' }}>
              { playerB === undefined && playerStatus[1] === false && status === "waiting" && (
                <button
                  className={`${style.button} btn`}
                  onClick={() => handleParticipantClick(false)}
                >
                  참가하기
                </button>
              )}
              { playerB !== undefined && (
                <UserVideoComponent
                  className="playerB"
                  streamManager={playerB}
                  called={style.Participant}
                />
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Participate;