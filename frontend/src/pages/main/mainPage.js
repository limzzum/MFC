import axios from "axios";
import style from "./mainPage.module.css";
import { BsPlusSquare } from "react-icons/bs";
import DebateRoomCard from "../../components/mainpage/debateRoomCard";
import { useRecoilValue } from "recoil";
import { userState } from "../../recoil/token";
import { userIdState } from "../../recoil/userId";
import { useNavigate } from "react-router-dom";
import CreateRoomModal from "../../components/mainpage/createRoomModal";
import {useEffect, useState, useRef} from "react"

function MainPage() {
  const [showModal, setShowModal] = useState(false);
  const [title1, setTitle1] = useState("");
  const [title2, setTitle2] = useState("");
  const [debateTime, setDebateTime] = useState("");
  const [speechTime, setSpeechTime] = useState("");
  const [spectatorCount, setSpectatorCount] = useState("");
  const [extensionCount, setExtensionCount] = useState("");
  const [ongoingDebateRooms, setOngoingDebateRooms] = useState([]);
  const [waitingDebateRooms, setWaitingDebateRooms] = useState([]);
  const [minWaitingRoomId, setMinWaitingRoomId] = useState(null);
  const [userProfileImg1,] = useState("")
  const [userProfileImg2,] = useState("")

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
      atopicUserUrl : userProfileImg1,
      btopicUserUrl : userProfileImg2,
    };

    // 서버에 POST 요청 보내기
    try {
      const response = await axios.post(`https://goldenteam.site/api/debate/${userId.userId}`, roomData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenis}`,
        },
      });
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

  const [minRoomId, setMinRoomId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        let apiUrl = "https://goldenteam.site/api/debate/list/ongoing";
        if (minRoomId !== null) {
          apiUrl += `?minRoomId=${minRoomId}&size=12`;
        } else {
          apiUrl += "?minRoomId=10000&size=12";
        }
        const response = await axios.get(apiUrl);
        const data = response.data.data;

        if (data.length > 0) {
          const newMinRoomId = Math.min(...data.map((room) => room.roomId));
          setMinRoomId(newMinRoomId);
          setOngoingDebateRooms(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, [minRoomId]);

  useEffect(() => {
    async function fetchData() {
      try {
        let apiUrl = "https://goldenteam.site/api/debate/list/waiting";
        if (minWaitingRoomId !== null) {
          apiUrl += `?minRoomId=${minWaitingRoomId}&size=12`;
        } else {
          apiUrl += "?minRoomId=10000&size=12";
        }

        const response = await axios.get(apiUrl);
        const data = response.data.data;
        console.log(response)
        console.log(data)
        if (data.length > 0) {
          const newMinRoomId = Math.min(...data.map((room) => room.roomId));
          setMinWaitingRoomId(newMinRoomId);
          setWaitingDebateRooms(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    
    
    fetchData();
    // eslint-disable-next-line
  }, [minWaitingRoomId]);


  const waitingContainerRef = useRef(null);
  const [iswaitingLoading, setIsLoading] = useState(false);
  
  // 무한크롤링 (WaitingRoom)
  useEffect(() => {
    if (waitingContainerRef.current) {
      waitingContainerRef.current.addEventListener("scroll", handleWaitingScroll);
      
    }
    // eslint-disable-next-line
  }, []);
  
  const handleWaitingScroll = () => {
    if (waitingContainerRef.current) {
      const container = waitingContainerRef.current;
      
      // 스크롤 컨테이너의 스크롤 위치와 컨테이너 내용의 높이를 비교하여 스크롤이 맨 아래로 내려갔는지 확인
      if (container.scrollHeight - container.scrollTop === container.clientHeight && !iswaitingLoading) {
        loadMoreWaitingDebateRooms();
      }
    }
  };

  const loadMoreWaitingDebateRooms = async () => {
    setIsLoading(true);
    try {
      let apiUrl = "https://goldenteam.site/api/debate/list/waiting";
      if (minWaitingRoomId !== null) {
        apiUrl += `?minRoomId=${minWaitingRoomId}&size=12`;
      } else {
        apiUrl += "?minRoomId=10000&size=12";
      }
  
      const response = await axios.get(apiUrl);
      const newData = response.data.data;
    
      if (newData.length > 0) {
        const newMinRoomId = Math.min(...newData.map((room) => room.roomId));
        setMinWaitingRoomId(newMinRoomId);
        setWaitingDebateRooms(newData);
      }
    } catch (error) {
      console.error("Error fetching more data:", error);
    }
    setIsLoading(false);
  };

  const ongoingContainerRef = useRef(null);
  const [isongoingLoading, setisongoingLoading] = useState(false);
  // 무한크롤링 (OngoingRoom)
  useEffect(() => {
    if (ongoingContainerRef.current) {
      ongoingContainerRef.current.addEventListener("scroll", handleOngoingScroll);
      
    }
    // eslint-disable-next-line
  }, []);
  
  const handleOngoingScroll = () => {
    if (ongoingContainerRef.current) {
      const container = ongoingContainerRef.current;
      
      // 스크롤 컨테이너의 스크롤 위치와 컨테이너 내용의 높이를 비교하여 스크롤이 맨 아래로 내려갔는지 확인
      if (container.scrollHeight - container.scrollTop === container.clientHeight && !isongoingLoading) {
        console.log("oooooooooo")
        loadMoreOngoingDebateRooms();
      }
    }
  };

  const loadMoreOngoingDebateRooms = async () => {
    setisongoingLoading(true);
    try {
      let apiUrl = "https://goldenteam.site/api/debate/list/ongoing";
        if (minRoomId !== null) {
          apiUrl += `?minRoomId=${minRoomId}&size=12`;
        } else {
          apiUrl += "?minRoomId=10000&size=12";
        }
        const response = await axios.get(apiUrl);
        const newData = response.data.data;
  
      if (newData.length > 0) {
        const newMinRoomId = Math.min(...newData.map((room) => room.roomId));
        setMinWaitingRoomId(newMinRoomId);
        setOngoingDebateRooms(newData);
      }
    } catch (error) {
      console.error("Error fetching more data:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="container">
      <div className="innercontents">
        <div className={`${style.createroombuttoncontainer} justify-content-end`}>
          <button
            className={`btn ${style.createroombutton}`}
            onClick={openModal}
            style={{ width: "fit-content", padding: "0.5rem" }}
          >
            <BsPlusSquare className={style.createroombuttonicon} style={{ fontSize: "1.5rem" }} />
          </button>
        </div>
        <hr className={style.horizontalline} />
        <div className={style.titlebox}>
          <span className={style.title}>참여 가능한 토론방</span>
        </div>
        <div className={style.debateRoomContainer} id="waitingRommContainer" ref={waitingContainerRef}>
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
        <hr className={style.horizontalline} />
        <div className={style.titlebox}>
          <span className={style.title}>진행 중인 토론방</span>
        </div>
        <div className={style.debateRoomContainer} id="ongoingRoomContainer" ref={ongoingContainerRef}>
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
    </div>
  );
}

export default MainPage;