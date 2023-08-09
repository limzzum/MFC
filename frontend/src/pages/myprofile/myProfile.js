import { useState, useEffect } from "react";
import styles from "./myProfile.module.css";
import baseProfile from "../../images/baseProfile.png";
import settingIcon from "../../images/settingIcon.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button ,Row, InputGroup, Form } from "react-bootstrap";
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
      console.log(response.data.data)
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
            setFinalChangeNickname(userInfo.nickname)
          } else {
          setFinalChangeNickname(changeNickname);}
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
  const handleProfileUpdate = async() => {
    // const config = {
    //   headers: {
    //     Authorization: `Bearer ${userToken}`,
    //   },
    // };
    const formData = new FormData()
    
    formData.append("file", selectedImage[0])
    const requestData = [{
      nickname: finalChangeNickname,
    }];
    
    const blob = new Blob([JSON.stringify(requestData)], {type: "application/json"}) 
    
    formData.append("data", blob)

    // PATCH 요청을 통해 변경 정보 전송
    await axios({
      method: "PATCH",
      url: `https://goldenteam.site/api/user`,
      mode: "cors",
      headers: {
        "Content-Type": "multipart/form-data", // Content-Type을 반드시 이렇게 하여야 한다.
        Authorization: `Bearer ${userToken}`
      
      },
      data: formData, // data 전송시에 반드시 생성되어 있는 formData 객체만 전송 하여야 한다.
    })
    // 이전 코드
    // axios
    //   .patch("https://goldenteam.site/api/user", requestData, config)
    //   .then((response) => {
    //     console.log(response.data);
    //     console.log("프로필 변경 성공");
    //     window.location.reload();
    //   })
    //   .catch((error) => {
    //     console.error("프로필 변경 실패", error);
    //   });
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleNicknameButtonClick();
    }
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.profileTitle}>My Profile</p>
      <div>
        <hr />
        <form>
          <div className={styles.profileImage}>
            <img
              className={`${styles.radiusImg}`}
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)  // 선택한 이미지의 URL을 생성
                  : userInfo.profile === null
                  ? baseProfile
                  : userInfo.profile
              }
              alt="profileImage"
            />

            {/* 이미지 업로드 인풋 */}
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
                <input className="form-control w-75" type="text" style={{fontSize:"15px"}} placeholder={userInfo.email} readOnly />
              </li>
              <li>
                <label htmlFor="Nickname" className="mb-2">
                  닉네임 변경
                </label>
                <div className="input-group mb-4 w-75">
                <InputGroup>
                  <Form.Control
                    placeholder={userInfo.nickname}
                    aria-label="Nickname"
                    aria-describedby="checkDuplicate"
                    style={{fontSize: "16px"}}
                    value={changeNickname}
                    onChange={(e) => {
                    setChangeNickname(e.target.value);
                    }}
                    onKeyPress={handleEnterKeyPress}
                  />
                  <Button 
                      style={{ backgroundColor: "#354C6FFF", fontSize: "15px" }}
                      variant="outline-light" 
                      id="userSearch"
                      onClick={handleNicknameButtonClick}
                  >중복확인
                  </Button>
              </InputGroup>
                  
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
