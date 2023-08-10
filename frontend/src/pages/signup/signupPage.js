import React, { useState, useEffect } from "react";
import axios from "axios";
import logoImage from "../../images/logo.png";
import style from "./signupPage.module.css";
import { useNavigate } from "react-router-dom";
import { Button, Form, InputGroup } from "react-bootstrap";


function SignupPage() {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [authCodeValid, setAuthCodeValid] = useState(false); // Added state
  const [nickname, setNickname] = useState("");
  const [nicknameAvailable, setNicknameAvailable] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const navigate = useNavigate();

  // 이메일 형식 검사하는 부분
  const handleEmail = (e) => {
    setEmail(e.target.value);
    const regex =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (regex.test(e.target.value)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };

  // 비밀번호 형식 검사하는 부분
  const handlePassword = (e) => {
    setPassword(e.target.value);
    const regex =
      /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
    if (regex.test(e.target.value)) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  };

  // 인증 이메일 보내면 타이머가 작동하는 부분
  const handleSendEmailClick = () => {
    if (emailValid) {
      // Email 보내기 요청 보내는 API 호출
      axios
        .get("https://goldenteam.site/api/user/email/verify", { params: { email } }) // 실제 서버 주소에 맞게 수정
        .then((response) => {
          alert("인증메일이 전송되었습니다!");
          setTimer(180);
          setIsActive(true);
        })
        .catch((error) => {
          alert("인증메일 전송에 실패하였습니다.");
        });
    }
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);
  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (passwordConfirm !== password && passwordConfirm.length > 0) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  }, [passwordConfirm, password]);

  const handleAuthButtonClick = () => {
    axios
      .post("https://goldenteam.site/api/user/email/verify", { email, authCode }) // 실제 서버 주소에 맞게 수정
      .then((response) => {
        alert("인증이 완료되었습니다!");
        setEmailValid(true);
        setAuthCodeValid(true);
      })
      .catch((error) => {
        alert("인증번호가 올바르지 않습니다.");
      });
  };

  // 닉네임 중복검사 하는 부분
  const handleNicknameButtonClick = () => {
    axios
      .get(`https://goldenteam.site/api/user/nickname/?nickname=${nickname}`) // 실제 서버 주소 및 API 경로에 맞게 수정
      .then((response) => {
        // ----------이 부분 서버 열리고 수정-----------
        console.log(response);
        if (response.data.status === "ACCEPTED") {
          alert("확인되었습니다!");
          setNicknameAvailable(true);
        } else {
          alert("이미 사용 중인 닉네임입니다.");
          setNicknameAvailable(false);
        }
      })
      .catch((error) => {
        alert("닉네임 확인에 실패하였습니다.");
      });
  };

  // 회원가입 요청 보내는 부분
  const handleSignupButtonClick = () => {
    if (!emailValid || !passwordValid || passwordMismatch || !nicknameAvailable || !authCodeValid) {
      // authCodeValid도 검사에 추가
      alert("입력한 정보를 다시 확인해주세요.");
    } else {
      axios
        .post("https://goldenteam.site/api/user", { email, nickname, password, emailNum: parseInt(authCode) }) // 실제 서버 주소 및 API 경로에 맞게 수정
        .then((response) => {
          alert("회원가입이 완료되었습니다!");
          // 회원가입 후 메인 페이지로 이동
          navigate("/login");
        })
        .catch((error) => {
          alert("회원가입에 실패하였습니다.");
        });
    }
  };

  return (
    <div className={style.SignupPageWrapper}>
      <div className={style.Signupform}>
      <div className={style.SignupPageInnerContent}>
        <img className={style.SignupPageLogoImage} src={logoImage} alt="Logo" />
        <p className={style.SignupPageMFC}>Mouth Fighting Championship</p>

        <p className={style.SingupTitle}>회원가입</p>

        <div className={style.SignupPageContentWrap}>
          <div className={style.SignupPageInputTitle}>이메일</div>
          <div className={style.SignupPageInputWrap}>
            {/* 이메일 인증 전송 */}
            <InputGroup className="mb-2">
                <Form.Control
                    style={{ borderColor:"var(--blue-200)", fontSize:"16px"}}
                    placeholder="이메일 입력"
                    aria-label="eamilAuth"
                    aria-describedby="email"
                    value={email}
                    onChange={handleEmail}
                />
                <button 
                    className={`btn  ${style.SignupBtn}`}
                    id="emailAuth"
                    onClick={handleSendEmailClick}
                >
                  확인
                </button>
            </InputGroup>
          </div>

          {isActive && (
            <div>
              <p className={style.SignupPageInputTitle}>인증번호 입력
              <span style={{ fontSize: "15px", marginLeft: "10px", color: "red", textAlign:"left"}}>{formatTime()}</span>
              </p>
            </div>
          )}
          {isActive && (
            <div className={style.SignupPageInputWrap}>
              {/* 이메일 인증 번호 입력 */}
              <InputGroup className="mb-2">
                <Form.Control
                    style={{ borderColor:"var(--blue-200)", fontSize:"16px"}}
                    placeholder="인증번호 입력"
                    aria-label="emailCheck"
                    aria-describedby="emailCheck"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                />
                <button 
                    className={`btn  ${style.SignupBtn}`}
                    id="emailAuth"
                    onClick={handleAuthButtonClick}
                >
                  확인
                </button>
              </InputGroup>
            </div>
          )}

          <div className={style.SignupPageInputTitle}>닉네임</div>
          <div className={style.SignupPageInputWrap}>
            {/* 닉네임 중복 확인 */}
            <InputGroup className="mb-2">
                <Form.Control
                    style={{ borderColor:"var(--blue-200)", fontSize:"16px"}}
                    placeholder="닉네임"
                    aria-label="nickNameCheck"
                    aria-describedby="nickNameCheck"
                    value={nickname}
                    onChange={(e) => {
                      setNickname(e.target.value);
                      setNicknameAvailable(false);
                      }}  />
                <button 
                    className={`btn  ${style.SignupBtn}`}
                    id="emailAuth"
                    onClick={handleNicknameButtonClick}
                >
                  확인
                </button>
              </InputGroup>
          </div>

<div className="  mb-2">
          <div className={`${style.SignupPageInputTitle}`}>비밀번호</div>
          <input
            className={`SignupPageInput form-control ${style.SignupPageInput}`}
            type="password"
            value={password}
            onChange={handlePassword}
          />
          {!passwordValid && password.length > 0 && (
            <div className={style.ErrorText}>영문, 숫자, 특수문자 포함 8자 이상 입력</div>
          )}
</div>
<div className="  mb-2">
          <div className={style.SignupPageInputTitle}>비밀번호 확인</div>
          <input
            className={`SignupPageInput form-control ${style.SignupPageInput}`}
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          {passwordMismatch && <div className={style.ErrorText}>비밀번호가 일치하지 않습니다.</div>}
        </div>
        </div>
        <div className={style.SignupPageBottomBtn}>
          <button
            className={`btn btn-outline-light ${style.SignupBtn}`}
            style={{
              fontSize: "18px",
              color: "white",
              // backgroundColor:
              //   !emailValid || !passwordValid || passwordMismatch || !nicknameAvailable || !authCodeValid
              //     ? "var(--blue-800)"
              //     : "blue",
              borderRadius: "10px",
              border: "none",
              width: "100%",
            }}
            onClick={handleSignupButtonClick}
            disabled={!emailValid || !passwordValid || passwordMismatch || !nicknameAvailable || !authCodeValid}
          >
            가입하기
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

export default SignupPage;
