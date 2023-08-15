import React from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userIdState } from "../../recoil/userId";
import { userInfoState } from "../../recoil/userInfo";
import { BsStopwatch } from "react-icons/bs";
import { RiSpeakLine } from "react-icons/ri";
import personImage from "../../images/person.png";
import baseProfile from "../../images/baseProfile.png";
import style from "./debateRoomCard.module.css";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

const DebateRoomCard = ({
  title1,
  title2,
  debateTime,
  speechTime,
  roomId,
  userProfileImg1,
  userProfileImg2,
}) => {
  const userId = useRecoilValue(userIdState);
  const userInfo = useRecoilValue(userInfoState);
  const navigate = useNavigate();

  const handleJoinClick = async () => {
    const url = `https://goldenteam.site/api/viewer/${roomId}/${userId.userId}`;
    const response = await axios.post(url, {
      roomid: roomId,
      userid: userId.userId,
    });
    console.log(userInfo);
    if (response.status === 200) {
      console.log("이동 성공");
      console.log(response);
      navigate(`/debateRoom/${roomId}`);
    }
  };

  return (
    <div className="">
      <div className={style.card} onClick={handleJoinClick}>
        <div className="d-flex">
          <div className={style.imgbox}>
            <img
              className={style.fullWidthImage}
              src={
                userProfileImg1 === "NONE"
                  ? personImage
                  : userProfileImg1
                  ? `https://goldenteam.site/profiles/${userProfileImg1}`
                  : baseProfile
              }
              alt="User1"
            />
          </div>
          <div className={style.imgbox}>
            <img
              className={style.fullWidthImage}
              src={
                userProfileImg2 === "NONE"
                  ? personImage
                  : userProfileImg2
                  ? `https://goldenteam.site/profiles/${userProfileImg2}`
                  : baseProfile
              }
              alt="User2"
            />
          </div>
        </div>
        <div className={style.cardbody}>
          <div className={`my-1 px-1`}>
            <Row className={`${style.cardtitle} p-0 m-0`}>
              <Col className={`${style.cardtitle} p-0 m-0 text-left`}>
                {title1}
              </Col>
              <Col xs={2} className={`${style.cardtitle} p-0 m-0`}>
                VS
              </Col>
              <Col className={`${style.cardtitle} p-0 m-0`}>{title2}</Col>
            </Row>
          </div>
          <div className={`text-center`}>
            <BsStopwatch className={style.timeicon} />
            <span className={style.cardtext}>
              토론 시간&nbsp;:&nbsp; {debateTime}분
            </span>
          </div>
          <div className={`my-1 text-center mb-3`}>
            <RiSpeakLine className={style.timeicon} />
            <span className={style.cardtext}>
              발언 제한 시간&nbsp;:&nbsp; {speechTime}분
            </span>
          </div>
        </div>
        {/* <div className={style.cardbody}>
          <div className={`${style.joinbuttoncontainer} mx-1 mb-2`}>
            <button
              className={`${style.joinbutton} btn`}
              onClick={handleJoinClick}
            >
              참여하기
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DebateRoomCard;
