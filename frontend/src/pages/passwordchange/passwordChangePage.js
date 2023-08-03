import React, { useState, useEffect } from "react";
import style from './passwordChange.module.css';
import "bootstrap/dist/css/bootstrap.min.css";
import logoImage from "../../images/logo.png"
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";

function PasswordChangePage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validPassword, setValidPassword] = useState("")
  const { userId } = useParams();

  const regex = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = () => {
    axios.get(`api/user/info/${userId}`)
      .then(response => {
        setValidPassword(response.data.password);
      })
      .catch(error => {
        console.error("사용자 정보 가져오기 오류:", error);
      });
  };

  const updatePassword = () => {
    const updatedUser = {
      password: newPassword,
    };

    axios.patch(`api/user/${userId}`, updatedUser)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error("비밀번호 업데이트 오류:", error);
      });
  };


  // 비밀번호 오류 처리
  const passwordSubmit = (event) => {
    event.preventDefault();
    
    if (currentPassword.trim() == validPassword && newPassword === confirmPassword && regex.test(newPassword)) {
      updatePassword();
    } else {
    // 모든 칸이 채워지지 않았을 때
      if (currentPassword.trim() === "" || newPassword.trim() === "" || confirmPassword.trim() === "") {
        alert("모든 비밀번호 입력란을 채워주세요.");
        // 바꿀 비밀번호가 확인 비밀번호와 같지 않을 때
      } else if (newPassword !== confirmPassword) {
        alert("변경할 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        setNewPassword("")
        setConfirmPassword("")
        // 비밀번호의 조건
      } else if (!regex.test(newPassword)) {
        alert("비밀번호는 영문자, 숫자, 특수문자를 포함하여 8자 이상 20자 이하여야 합니다.");
        setNewPassword("");
        setConfirmPassword("");
      } 
    }
  };

  return (
    <div className={style.wrapper}>
      <div className={style.innerContent}>
        <img className={style.logoImage} src={logoImage} alt='none'></img>
        <p className={style.MFC}>Mouth Fighting Championship</p>
      </div>
      <div>
        <hr />
        <p className={`mx-3 ${style.title} mt-2`}>비밀번호 변경</p>
        <hr />
        <div className={`${style.contentWrap}`}>
        <form onSubmit={passwordSubmit}>
          <div className={style.profileText}>
            <div className={style.inputtitle}>현재비밀번호</div>
              <div className={style.inputWrap}>
                <input
                  className="input form-control w-100"
                  type="password"
                  placeholder="현재 비밀번호"
                  value={currentPassword}
                  style={{ fontSize: '18px'}}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className={style.inputtitle}>변경 비밀번호</div>
                <div className={style.inputWrap}></div>
                <input
                  className="input form-control w-100"
                  type="password"
                  placeholder="변경할 비밀번호"
                  value={newPassword}
                  style={{ fontSize: '18px'}}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <div className={style.inputtitle}>비밀번호 확인</div>
                <div className={style.inputWrap}></div>
                <input
                  className="input form-control w-100"
                  type="password"
                  placeholder="비밀번호 확인"
                  value={confirmPassword}
                  style={{ fontSize: '18px'}}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
                <div className="mx-auto">
                  <Button
                    className="w-100 mb-4"
                    variant="primary"
                    type="submit"
                  >
                    변경
                  </Button>
                </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PasswordChangePage;