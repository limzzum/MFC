import { useState, useEffect } from "react";
import styles from "./myProfile.module.css";
import profileImage from "../../images/img.jpg";
import settingIcon from "../../images/settingIcon.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import UserDeleteModal from "../../components/myprofile/userdeletemodal";
import { userState } from "../../recoil/token";
import { useRecoilValue } from "recoil";

function MyProfile() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [changeNickname, setChangeNickname] = useState("");
  const [finalChangeNickname, setFinalChangeNickname] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const userToken = user.token;
  console.log(useRecoilValue(userState));
  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  // User정보 가져오기
  const getUserInfo = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };

    try {
      const response = await axios.get(`https://goldenteam.site/api/user`, config);
      setUserInfo(response.data.data);
      setFinalChangeNickname(response.data.data.nickname); // 바로 nickname을 업데이트하도록 수정
    } catch (error) {
      console.error("사용자 정보 가져오기 오류", error);
    }
  };

  // User닉네임 중복 체크

  const handleNicknameButtonClick = () => {
    const requestData = {
      nickname: `${changeNickname}`,
    };

    axios
      .get("https://goldenteam.site/api/user/nickname", { params: requestData })
      .then((response) => {
        console.log(response.data);
        if (response.data.status === "ACCEPTED") {
          alert("확인되었습니다!");
          setFinalChangeNickname(changeNickname);
        } else {
          alert("이미 사용 중인 닉네임입니다.");
          setFinalChangeNickname(`${userInfo.nickname}`);
        }
      })
      .catch((error) => {
        alert("닉네임 확인에 실패하였습니다.");
      });
  };

  const handleWithdrawButtonClick = () => {
    setShowModal(true); // 모달 열기
  };

  const handleModalClose = () => {
    setShowModal(false); // 모달 닫기
  };

  const handleWithdrawConfirm = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    // 탈퇴 처리 로직 구현
    axios
      .delete("https://goldenteam.site/api/user", config)
      .then((response) => {
        console.log(response);
        console.log("탈퇴 처리 성공");
        navigate("/");
      })
      .catch((error) => {
        console.error("탈퇴 처리 실패", error);
      });
  };

  // 프로필 업데이트
  const handleProfileUpdate = () => {
    console.log(finalChangeNickname);
    if (finalChangeNickname === userInfo.nickname) {
      // 변경 사항이 없는 경우 알림 띄우기
      alert("변경 사항이 없습니다.");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const requestData = {
      nickname: finalChangeNickname,
      // 다른 변경 정보를 추가할 수 있음
    };

    // PATCH 요청을 통해 변경 정보 전송
    axios
      .patch("https://goldenteam.site/api/user", requestData, config)
      .then((response) => {
        console.log(response.data);
        console.log("프로필 변경 성공");
        window.location.reload();
      })
      .catch((error) => {
        console.error("프로필 변경 실패", error);
      });
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.profileTitle}>My Profile</p>
      <div>
        <hr />
        <form>
          <div className={styles.profileImage}>
            {selectedImage ? (
              <img className={`${styles.radiusImg}`} src={profileImage} alt="profileImage" />
            ) : (
              <img className={`${styles.radiusImg}`} src={profileImage} alt="profileImage" />
            )}
            <label htmlFor="fileInput" className={`${styles.radiusImg} ${styles.imgSetting}`}>
              <img src={settingIcon} alt="이미지변경" />
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <div className={styles.profileText}>
            <ul>
              <li>
                <label htmlFor="이메일" className="mb-2">
                  이메일
                </label>
                <input className="form-control w-75" type="text" placeholder={userInfo.email} readOnly />
              </li>
              <li>
                <label htmlFor="Nickname" className="mb-2">
                  닉네임 변경
                </label>
                <div className="input-group mb-4 w-75">
                  <input
                    type="text"
                    className="form-control"
                    value={changeNickname}
                    onChange={(e) => {
                      setChangeNickname(e.target.value);
                    }}
                    placeholder={userInfo.nickname}
                    aria-label="Nickname"
                    aria-describedby="basic-addon2"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button" onClick={handleNicknameButtonClick}>
                      중복확인
                    </button>
                  </div>
                </div>
                <div>
                  <Link to="/pwchange" className={`${styles.pwText}`}>
                    비밀번호변경
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </form>
      </div>
      <div>
        <Row className="mb-2">
          <button 
          className={`${styles.btnChange}`} 
          type="submit"
          onClick={handleProfileUpdate}>
            변경
          </button>
          <button 
            className={`${styles.btnDelete}`}
            onClick={handleWithdrawButtonClick}
            >
              탈퇴
          </button>
        </Row>
      </div>
      <UserDeleteModal
        show={showModal}
        onClose={handleModalClose}
        onConfirm={() => {
          handleWithdrawConfirm(); // 탈퇴 처리 함수 호출
          handleModalClose(); // 모달 닫기
        }}
      />
    </div>
  );
}

export default MyProfile;
