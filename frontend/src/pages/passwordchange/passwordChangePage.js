import { useState } from "react";
import style from './passwordChange.module.css';
import "bootstrap/dist/css/bootstrap.min.css";
import logoImage from "../../images/logo.png"
import { Container, Button, Row } from "react-bootstrap";

function PasswordChangePage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 비밀번호 오류 처리
  const passwordSubmit = (event) => {
    event.preventDefault();
    // 모든 칸이 채워지지 않았을 때
    if (currentPassword.trim() === "" || newPassword.trim() === "" || confirmPassword.trim() === "") {
      alert("모든 비밀번호 입력란을 채워주세요.");
      // 바꿀 비밀번호가 확인 비밀번호와 같지 않을 때
    } else if (newPassword !== confirmPassword) {
      alert("변경할 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      setNewPassword("")
      setConfirmPassword("")
    } else {
      // 모든 조건이 만족 될때 구현 해야함
      console.log("Passwords match. Submitting form...");
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
        <p className={`px-3 ${style.title}`}>비밀번호 변경</p>
        <hr />
        <div className={`${style.contentWrap}`}>
        <form onSubmit={passwordSubmit}>
          <div className={style.profileText}>
            <div className={style.inputtitle}>현재비밀번호</div>
              <div className={style.inputWrap}>  
                <input
                  className="input form-control w-50"
                  type="password"
                  placeholder="현재 비밀번호"
                  value={currentPassword}
                  style={{ fontSize: '12px'}}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className={style.inputtitle}>변경 비밀번호</div>
                <div className={style.inputWrap}></div>
                <input
                  className="input form-control w-50"
                  type="password"
                  placeholder="변경할 비밀번호"
                  value={newPassword}
                  style={{ fontSize: '12px'}}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <div className={style.inputtitle}>비밀번호 확인</div>
                <div className={style.inputWrap}></div>
                <input
                  className="input form-control w-50"
                  type="password"
                  placeholder="비밀번호 확인"
                  value={confirmPassword}
                  style={{ fontSize: '12px'}}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            <Container>
              <Row>
                <div className="col-4 mx-auto">
                  <Button
                    className="w-100 mb-4"
                    variant="primary"
                    type="submit"
                  >
                    변경
                  </Button>
                </div>
              </Row>
            </Container>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PasswordChangePage;
