import axios from "axios";
import style from "./mainPage.module.css";
import DebateRoomCard from "../../components/mainpage/debateRoomCard";
import { userState } from "../../recoil/token";
import { userIdState } from "../../recoil/userId";
import { useNavigate } from "react-router-dom";
import CreateRoomModal from "../../components/mainpage/createRoomModal";
import { useEffect, useState, useRef } from "react";
import { useRecoilValue } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { Container, Row, Col } from "react-bootstrap";

function MainPage() {
  const [showModal, setShowModal] = useState(false);
  const [title1, setTitle1] = useState();
  const [title2, setTitle2] = useState();
  const [debateTime, setDebateTime] = useState();
  const [speechTime, setSpeechTime] = useState(1);
  const [spectatorCount, setSpectatorCount] = useState();
  const [extensionCount, setExtensionCount] = useState();
  const [ongoingDebateRooms, setOngoingDebateRooms] = useState([]);
  const [waitingDebateRooms, setWaitingDebateRooms] = useState([]);
  const [userProfileImg1] = useState();
  const [userProfileImg2] = useState();

  const ongoingContainerRef = useRef(null);
  const userId = useRecoilValue(userIdState);
  const tokenis = useRecoilValue(userState);
  const navigate = useNavigate();

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const handleCreateRoom = async () => {
    // 토론시간 유효성 검사
    const debateTimeInt = parseInt(debateTime);
    const userIdString = String(userId);

    if (isNaN(debateTimeInt) || debateTimeInt < 20 || debateTimeInt > 120) {
      alert("토론시간은 20분에서 120분 사이의 숫자로 입력해야 합니다.");
      return;
    }

    // 데이터 구성
    const roomData = {
      userId: userIdString,
      totalTime: parseInt(debateTimeInt),
      talkTime: parseInt(speechTime),
      maxPeople: parseInt(spectatorCount),
      overTimeCount: parseInt(extensionCount),
      atopic: title1,
      btopic: title2,
      atopicUserUrl: userProfileImg1,
      btopicUserUrl: userProfileImg2,
    };

    // 서버에 POST 요청 보내기
    try {
      const response = await axios.post(
        `https://goldenteam.site/api/debate/${userId.userId}`,
        roomData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenis}`,
          },
        }
      );
      if (response.data) {
        alert("방이 성공적으로 생성되었습니다.");
        navigate(`/debateRoom/${response.data.data}`);
      }
    } catch (error) {
      console.error("방 생성에 실패하였습니다.", error);
      alert("방 생성에 실패하였습니다.");
    }

    closeModal();
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const apiUrl =
          "https://goldenteam.site/api/debate/list/ongoing?minRoomId=1000000&size=10000";
        const response = await axios.get(apiUrl);
        const data = response.data.data;

        if (data.length > 0) {
          setOngoingDebateRooms(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const apiUrl =
          "https://goldenteam.site/api/debate/list/waiting?minRoomId=10000&size=10000";
        const response = await axios.get(apiUrl);
        const data = response.data.data;
        if (data.length > 0) {
          setWaitingDebateRooms(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
    // eslint-disable-next-line
  }, []);

  const waitingContainerRef = useRef(null);
  return (
    <Container fluid>
      <div className={style.wrapper}>
        <Row className={`${style.createRoomBox} w-100 m-0`}>
          <Col className={`m-0`}>
            <button
              className={`btn  ${style.createRoomBtn}`}
              onClick={openModal}
            >
              <span className={style.createReoomText}>
                토론방 생성&nbsp;
                <FontAwesomeIcon icon={faSquarePlus} />
              </span>
            </button>
          </Col>
        </Row>
        <div>
          <Row className={`${style.createRoomBox} w-100 mx-0 mb-3`}>
            <span className={style.title}>참여 가능한 토론방</span>
          </Row>
          <hr />
          <div
            className={style.debateRoomContainer}
            id="waitingRommContainer"
            ref={waitingContainerRef}
          >
            {waitingDebateRooms.map((room) => (
              <DebateRoomCard
                key={room.roomId}
                title1={room.atopic}
                title2={room.btopic}
                debateTime={room.totalTime}
                speechTime={room.talkTime}
                roomId={room.roomId}
                userProfileImg1={room.atopicUserUrl}
                userProfileImg2={room.btopicUserUrl}
              />
            ))}
          </div>
        </div>

        <div className={`mt-4`}>
          <Row className={`${style.createRoomBox} w-100 mx-0 my-3`}>
            <span className={style.title}>진행 중인 토론방</span>
          </Row>
          <hr />
          <div
            className={style.debateRoomContainer}
            id="ongoingRoomContainer"
            ref={ongoingContainerRef}
          >
            {ongoingDebateRooms.map((room) => (
              <DebateRoomCard
                key={room.roomId}
                title1={room.atopic}
                title2={room.btopic}
                debateTime={room.totalTime}
                speechTime={room.talkTime}
                roomId={room.roomId}
                userProfileImg1={room.atopicUserUrl}
                userProfileImg2={room.btopicUserUrl}
              />
            ))}
          </div>
        </div>
      </div>
      <CreateRoomModal
        showModal={showModal}
        closeModal={closeModal}
        title1={title1}
        setTitle1={setTitle1}
        title2={title2}
        setTitle2={setTitle2}
        debateTime={debateTime}
        setDebateTime={setDebateTime}
        speechTime={speechTime}
        setSpeechTime={setSpeechTime}
        spectatorCount={spectatorCount}
        setSpectatorCount={setSpectatorCount}
        extensionCount={extensionCount}
        setExtensionCount={setExtensionCount}
        handleCreateRoom={handleCreateRoom}
      />
    </Container>
  );
}

export default MainPage;
