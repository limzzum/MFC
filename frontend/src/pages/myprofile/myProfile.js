import { useState, useEffect } from "react";
import styles from './myProfile.module.css';
import profileImage from '../../images/img.jpg';
import settingIcon from '../../images/settingIcon.png';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Row } from "react-bootstrap";
import { Link } from 'react-router-dom';
import axios from "axios";
import UserDeleteModal from "../../components/myprofile/userdeletemodal";

function MyProfile() {
  const [ selectedImage, setSelectedImage ] = useState(null);
  const [ userInfo, setUserInfo ] = useState({});
  const [ changeNickname , setChangeNickname ] = useState(""); 
  const userToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzAxOTUxMDE0fQ.A7avo0u5nleIbTRaiYqw6kcSjNFzgYN5_PKoZgf5GtU"; 
  const [ finalChangeNickname, setFinalChangeNickname ] = useState("")
  const [showModal, setShowModal] = useState(false); // 모달 상태 추가


  useEffect(() => {
    getUserInfo();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };
  
  // User정보 가져오기
  const getUserInfo = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    };
  
    try {
      const response = await axios.get(`http://i9a605.p.ssafy.io:8081/api/user`, config);
      await setUserInfo(response.data.data);
      setFinalChangeNickname(response.data.data.nickname); // 바로 nickname을 업데이트하도록 수정
    } catch (error) {
      console.error("사용자 정보 가져오기 오류", error);
    }
  };
  

  // User닉네임 중복 체크

  const handleNicknameButtonClick = () => {
    const requestData = {
        nickname: `${changeNickname}`
      };
  
    axios.get('http://i9a605.p.ssafy.io:8081/api/user/nickname', { params: requestData }) 
    .then((response) => {
      console.log(response.data)
      if (response.data.status === 'ACCEPTED') {
        alert('확인되었습니다!');
        setFinalChangeNickname(changeNickname);
      } else {
        alert('이미 사용 중인 닉네임입니다.');
        setFinalChangeNickname(`${userInfo.nickname}`);
      }
      console.log(finalChangeNickname); // 업데이트 이후의 값 출력
    })
    .catch((error) => {
      alert('닉네임 확인에 실패하였습니다.');
    });
  };

  const handleWithdrawButtonClick = () => {
    setShowModal(true); // 모달 열기
  };

  const handleModalClose = () => {
    setShowModal(false); // 모달 닫기
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.profileTitle}>My Profile</p>
      <div>
        <hr />
        <form>
          <div className={styles.profileImage}>
            {selectedImage ? (
              <img
                className={`${styles.radiusImg}`}
                src={profileImage}
                alt="profileImage"
              />
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
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={handleNicknameButtonClick}>
                      중복확인
                    </button>
                  </div>                 
                </div>
                <div>
                  <Link to="/pages/passwordchange/passwordChangePage/:userId" className={`${styles.pwText}`}>
                    비밀번호변경
                  </Link>
                </div> 
              </li>
            </ul>
          </div>
        </form>
      </div>
      <div>
        <Row>
          <Button className="col-4 btn btn-primary w-150px m-auto" type="submit">
            변경
          </Button>
          <Button 
            className="col-4 btn btn-danger w-150px m-auto"
            onClick={handleWithdrawButtonClick}
            >
              탈퇴
          </Button>
        </Row>
      </div>
      <UserDeleteModal
        show={showModal}
        onClose={handleModalClose}
        onConfirm={() => {
          // 여기에 탈퇴 처리 로직을 구현하면 됩니다.
          // 탈퇴 처리 완료 후 필요한 동작을 수행할 수 있습니다.
          // 예: 로그아웃, 페이지 이동 등
          handleModalClose(); // 모달 닫기
        }}
      />
    </div>
  );
}

export default MyProfile;
