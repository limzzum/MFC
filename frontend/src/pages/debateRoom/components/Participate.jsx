import { Row, Col } from "react-bootstrap";
import style from "../debatePage.module.css";
import UserVideoComponent from "../Openvidu/UserVideoComponent";
import AudioSegmentationComponent from "../AudioSegmentationComponent";
import { useStompClient } from "../../../SocketContext";

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
  myStatus,
  setMyStatus,
}) {
  const stompClient = useStompClient();

  const handlePostPlayer = (isTopicA) => {
    console.log("이거되니?");
    if (stompClient) {
      stompClient.send(
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

  return (
    <div>
      <Row className={`m-0 p-0`}>
        <Col className={`m-0 p-0`}>
          <div className={`${style.Participant} mx-auto`}>
            {playerA === undefined &&
              playerStatus[0] === false &&
              status === "waiting" && (
                <button
                  className={`${style.button} btn`}
                  onClick={() => {
                    onRoleChange("participant");
                    setPlayerStatus((prevStatus) => [true, prevStatus[1]]);
                    handlePlayerAVideoStream(publisher);
                    handlePostPlayer(true);
                    setMyStatus(true);
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
          <AudioSegmentationComponent
            roomId={roomId}
            userId={userId}
            myStatus={myStatus}
          />
        </Col>
        <Col xs={1} className={`m-0 p-0`}></Col>
        <Col className={`m-0 p-0`}>
          <div className={`${style.Participant} mx-auto`}>
            {playerB === undefined &&
              playerStatus[1] === false &&
              status === "waiting" && (
                <button
                  className={`${style.button} btn`}
                  onClick={() => {
                    onRoleChange("participant");
                    setPlayerStatus((prevStatus) => [prevStatus[0], true]);
                    handlePlayerBVideoStream(publisher);
                    handlePostPlayer(false);
                    setMyStatus(false);
                  }}
                >
                  참가하기
                </button>
              )}
            {playerB !== undefined && (
              <UserVideoComponent
                className="playerB"
                streamManager={playerB}
                called={style.Participant}
              />
            )}
          </div>
          {/* <div className={`${style.rightCount} m-0 p-0 mx-auto`}>
            <span>남은 연장 횟수: </span>
          </div> */}
        </Col>
      </Row>
    </div>
  );
}

export default Participate;
