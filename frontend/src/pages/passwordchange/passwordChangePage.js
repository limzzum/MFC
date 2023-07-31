import { useState } from "react";
import styles from './passwordChange.module.css';
import "bootstrap/dist/css/bootstrap.min.css";
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
    <div className={styles.container}>
      <p className={`px-3 ${styles.title}`}>비밀번호 변경</p>
      <div>
        <hr />
        <form onSubmit={passwordSubmit}>
          <div className={styles.profileText}>
              <li>
                <input
                  className="form-control"
                  type="password"
                  placeholder="현재 비밀번호"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </li>
              <li>
                <input
                  className="form-control"
                  type="password"
                  placeholder="변경할 비밀번호"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  className="form-control"
                  type="password"
                  placeholder="비밀번호 확인"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </li>
          </div>
          <Container>
            <Row>
              <div className="col-4  mx-auto">
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
  );
}

export default PasswordChangePage;
