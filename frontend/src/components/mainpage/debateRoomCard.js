import React from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userIdState } from "../../recoil/userId"; 
import { userInfoState } from "../../recoil/userInfo"; 
import { BsStopwatch } from "react-icons/bs";
import { RiSpeakLine } from "react-icons/ri";
import personImage from "../../images/person.png";
import style from "./debateRoomCard.module.css";
import { useNavigate } from "react-router-dom";

const DebateRoomCard = ({ title1, title2, debateTime, speechTime, roomId, userProfileImg1, userProfileImg2 }) => {
  const userId = useRecoilValue(userIdState);
  const userInfo = useRecoilValue(userInfoState);
  const navigate = useNavigate();
  console.log(userProfileImg2)
  console.log(title1)

  const handleJoinClick = async () => {
    const url = `https://goldenteam.site/api/viewer/${roomId}/${userId.userId}`;
    const response = await axios.post(url, {
      roomid: roomId,
      userid: userId.userId,
    });
    console.log(userInfo)
    if (response.status === 200) {
      console.log("이동 성공");
      console.log(response);
      navigate(`/debateRoom/${roomId}`);
    }
  };

  return (
    <div className="">
      <div className="card" style={{ width: "18rem" }}>
        <div className="d-flex">
          <div className={style.imgbox}>
              <img className={style.fullWidthImage} src={userProfileImg1 ? `https://goldenteam.site/profiles/${userProfileImg1}` : personImage} alt="User1" />
          </div>
          <div className={style.imgbox}>
              <img className={style.fullWidthImage} src={userProfileImg2 ? `https://goldenteam.site/profiles/${userProfileImg2}` : personImage} alt="User2" />
          </div>
        </div>
        <div className={style.cardbody}>
          <p className={style.cardtitle}>
            {title1} VS {title2}
          </p>
          <div>
            <BsStopwatch className={style.timeicon} />
            <span className={style.cardtext}>토론 시간: {debateTime}분</span>
          </div>
          <div>
            <RiSpeakLine className={style.timeicon} />
            <span className={style.cardtext}>발언 제한 시간: {speechTime}분</span>
          </div>
        </div>
        <div className="card-body">
          <div className={style.joinbuttoncontainer}>
            <button className={style.joinbutton} onClick={handleJoinClick}>
              참여하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebateRoomCard;
