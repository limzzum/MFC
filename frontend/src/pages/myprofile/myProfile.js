import { useState, useEffect } from "react";
import styles from "./myProfile.module.css";
import baseProfile from "../../images/baseProfile.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, InputGroup, Form, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserDeleteModal from "../../components/myprofile/userdeletemodal";
import { userState } from "../../recoil/token";
import { useRecoilValue } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAt,
  faCircleUser,
  faCamera,
  faKey,
} from "@fortawesome/free-solid-svg-icons";

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
      const response = await axios.get(
        `https://goldenteam.site/api/user`,
        config
      );
      setUserInfo(response.data.data);
      console.log(response.data.data);

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
          if (changeNickname === "") {
            setFinalChangeNickname(userInfo.nickname);
          } else {
            setFinalChangeNickname(changeNickname);
          }
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

  const profileImgUpload = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "multipart/form-data",
      },
    };
    const formData = new FormData();
    if (selectedImage) {
      formData.append("profile", selectedImage);
    }

    try {
      const response = await axios.post(
        "https://goldenteam.site/api/user/profile",
        formData,
        config
      );

      console.log("프로필 이미지 업데이트 응답:", response.data);
      // 이후 필요한 작업 수행
    } catch (error) {
      console.error("프로필 이미지 업데이트 오류:", error);
    }
  };

  // 프로필 업데이트
  const handleProfileUpdate = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    if (selectedImage) {
      console.log("y");
      profileImgUpload();
    }
    const requestData = {
      nickname: finalChangeNickname,
    };
    // PATCH 요청을 통해 변경 정보 전송
    axios
      .patch("https://goldenteam.site/api/user", requestData, config)
      .then((response) => {
        console.log(response.data);
        console.log("프로필 변경 성공");
        alert("프로필 변경이 완료되었습니다.");
        window.location.reload();
      })
      .catch((error) => {
        console.error("프로필 변경 실패", error);
      });
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleNicknameButtonClick();
    }
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.profileTitle}>
        <strong className={styles.username}>{userInfo.nickname}</strong> 님의
        정보
      </p>
      <hr className="mb-5" />
      <Row className="my-4">
        <Col xs={12} md={5} className={styles.wrapperProfile}>
          <div className={styles.profileImage}>
            <img
              className={`${styles.radiusImg}`}
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : userInfo.profile
                  ? `https://goldenteam.site/profiles/${userInfo.profile}`
                  : baseProfile
              }
              alt="profileImage"
            />
            <label htmlFor="fileInput" className={`${styles.imgSetting}`}>
              <FontAwesomeIcon icon={faCamera} />
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </Col>
        <Col className="mx-3">
          <Row>
            <Col xs={12} className="mb-2">
              <label htmlFor="이메일" className={styles.labelmypage}>
                <FontAwesomeIcon icon={faAt} size="sm" /> 이메일
              </label>
              <input
                className="form-control inputemail"
                type="text"
                placeholder={userInfo.email}
                readOnly
              />
            </Col>
            <Col xs={12}>
              <label htmlFor="Nickname" className={styles.labelmypage}>
                <FontAwesomeIcon icon={faCircleUser} size="sm" /> 닉네임 변경
              </label>
              <div className="input-group">
                <InputGroup>
                  <Form.Control
                    style={{
                      borderColor: "var(--blue-200)",
                      fontSize: "16px",
                    }}
                    placeholder={userInfo.nickname}
                    aria-label="Nickname"
                    aria-describedby="checkDuplicate"
                    value={changeNickname}
                    onChange={(e) => {
                      setChangeNickname(e.target.value);
                    }}
                    onKeyPress={handleEnterKeyPress}
                  />
                  <button
                    className={`btn  ${styles.MypageBtn}`}
                    id="userSearch"
                    onClick={handleNicknameButtonClick}
                  >
                    중복확인
                  </button>
                </InputGroup>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="m-3">
        <div>
          <Link to="/pwchange" className={`${styles.pwText}`}>
            <FontAwesomeIcon icon={faKey} size="xs" /> 비밀번호변경
          </Link>
        </div>
      </Row>
      <Row className="mt-5">
        <Col>
          <button
            className={`${styles.btnChange} btn w-100 m-0`}
            type="submit"
            onClick={handleProfileUpdate}
          >
            변경
          </button>
        </Col>
        <Col>
          <button
            className={`${styles.btnDelete} btn w-100 m-0`}
            onClick={handleWithdrawButtonClick}
          >
            탈퇴
          </button>
        </Col>
      </Row>
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
