import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logoImage from '../../images/logo.png';
import style from './signupPage.module.css';
import { useNavigate } from 'react-router-dom';


function SignupPage() {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [authCodeValid, setAuthCodeValid] = useState(false); // Added state
  const [nickname, setNickname] = useState('');
  const [nicknameAvailable, setNicknameAvailable] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const navigate = useNavigate();

  // 이메일 형식 검사하는 부분
  const handleEmail = (e) => {
    setEmail(e.target.value);
    const regex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (regex.test(e.target.value)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };

  // 비밀번호 형식 검사하는 부분
  const handlePassword = (e) => {
    setPassword(e.target.value);
    const regex = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
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
        .get('http://i9a605.p.ssafy.io:8081/api/user/email/verify', { params: { email } }) // 실제 서버 주소에 맞게 수정
        .then((response) => {
          alert('인증메일이 전송되었습니다!');
          setTimer(180);
          setIsActive(true);
        })
        .catch((error) => {
          alert('인증메일 전송에 실패하였습니다.');
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
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // 비밀번호 일치 확인하는 부분
  useEffect(() => {
    if (passwordConfirm !== password && passwordConfirm.length > 0) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  }, [passwordConfirm, password]);

  //----------------------------------------------------------------------------------------------------------------
  // 서버에 요청하는 부분

  // 이메일 인증코드 전송하는 부분
  const handleAuthButtonClick = () => {
    axios
      .post('http://i9a605.p.ssafy.io:8081/api/user/email/verify', { email, authCode }) // 실제 서버 주소에 맞게 수정
      .then((response) => {
        alert('인증이 완료되었습니다!');
        setEmailValid(true);
        setAuthCodeValid(true); // 인증이 완료되면 authCodeValid를 true로 설정
      })
      .catch((error) => {
        alert('인증번호가 올바르지 않습니다.');
      });
  };

  // 닉네임 중복검사 하는 부분
  const handleNicknameButtonClick = () => {
    axios
      .get(`http://i9a605.p.ssafy.io:8081/api/user/nickname/?nickname=${nickname}`) // 실제 서버 주소 및 API 경로에 맞게 수정
      .then((response) => {
        // ----------이 부분 서버 열리고 수정-----------
        console.log(response)
        if (response.data.status==="ACCEPTED") {
          alert('확인되었습니다!');
          setNicknameAvailable(true);
        } else {
          alert('이미 사용 중인 닉네임입니다.');
          setNicknameAvailable(false);
        }
      })
      .catch((error) => {
        alert('닉네임 확인에 실패하였습니다.');
      });
  };

  // 회원가입 요청 보내는 부분  
  const handleSignupButtonClick = () => {
  if (!emailValid || !passwordValid || passwordMismatch || !nicknameAvailable || !authCodeValid) {
    // authCodeValid도 검사에 추가
    alert('입력한 정보를 다시 확인해주세요.');
  } else {
    axios
      .post('http://i9a605.p.ssafy.io:8081/api/user', { email, nickname, password, emailNum: parseInt(authCode) }) // 실제 서버 주소 및 API 경로에 맞게 수정
      .then((response) => {
        alert('회원가입이 완료되었습니다!');
        // 회원가입 후 메인 페이지로 이동
        navigate('/login');
      })
      .catch((error) => {
        alert('회원가입에 실패하였습니다.');
      });
  }
};

  return (
    <div className={style.SignupPageWrapper}>
      <div className={style.SignupPageInnerContent}>
        <img className={style.SignupPageLogoImage} src={logoImage} alt='Logo' />
        <p className={style.SignupPageMFC}>Mouth Fighting Championship</p>

        <div className={style.SignupPageContentWrap}>
          <div className={style.SignupPageInputTitle}>인증메일 전송</div>
          <div className={style.SignupPageInputWrap}>
            <input
              className={`${style.SignupPageInput} form-control`}
              style={{ fontSize: '12px', width: '145px' }}
              value={email}
              onChange={handleEmail}
              disabled={emailValid && authCodeValid}
            />
            <button
              className={`btn btn-outline-secondary ${style.SignupPageBtn}`}
              style={{
                fontSize: '14px',
                color: 'white',
                backgroundColor: emailValid ? '#354c6fff' : 'grey',
                borderRadius: '10px',
                border: 'none',
              }}
              onClick={handleSendEmailClick}
              disabled={!emailValid}
            >
              전송
            </button>
          </div>

          {isActive && (
            <div>
              <span className={style.SignupPageInputTitle}>인증번호 입력</span>
              <span style={{ fontSize: '12px', marginLeft: '10px', color: 'red' }}>{formatTime()}</span>
            </div>
          )}
          {isActive && (
            <div className={style.SignupPageInputWrap}>
              <input
                className={`SignupPageInput form-control ${style.SignupPageInput}`}
                style={{ fontSize: '12px', width: '145px' }}
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                disabled={authCodeValid}
              />
              <button
                className={`btn btn-outline-secondary ${style.SignupPageBtn}`}
                style={{
                  fontSize: '14px',
                  color: 'white',
                  backgroundColor: authCodeValid ? 'grey' : '#354c6fff', 
                  border: 'none',
                }}
                onClick={handleAuthButtonClick}
                disabled={authCodeValid}
              >
                인증
              </button>
            </div>
          )}

          <div className={style.SignupPageInputTitle}>닉네임</div>
          <div className={style.SignupPageInputWrap}>
            <input
              className={`SignupPageInput form-control ${style.SignupPageInput}`}
              style={{ fontSize: '12px', width: '145px' }}
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setNicknameAvailable(false); // Reset nickname availability when input changes
              }}
              disabled={!authCodeValid || nicknameAvailable}              />
            <button
              className={`btn btn-outline-secondary ${style.SignupPageBtn}`}
              style={{
                fontSize: '14px',
                color: 'white',
                backgroundColor: emailValid || !authCodeValid ? 'grey' : '#354c6fff',
                borderRadius: '10px',
                border: 'none',
              }}
              onClick={handleNicknameButtonClick}
              disabled={!authCodeValid || nicknameAvailable}
              >
              확인
            </button>
          </div>

          <div className={style.SignupPageInputTitle}>비밀번호</div>
          <input
            className={`SignupPageInput form-control ${style.SignupPageInput}`}
            style={{ fontSize: '12px', width: '200px' }}
            type="password"
            value={password}
            onChange={handlePassword}
          />
          {!passwordValid && password.length > 0 && (
            <div style={{ color: 'red', fontSize: '12px' }}>
              영문, 숫자, 특수문자 포함 8자 이상 입력
            </div>
          )}

          <div className={style.SignupPageInputTitle}>비밀번호 확인</div>
          <input
            className={`SignupPageInput form-control ${style.SignupPageInput}`}
            style={{ fontSize: '12px', width: '200px' }}
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          {passwordMismatch && (
            <div style={{ color: 'red', fontSize: '12px' }}>
              비밀번호가 일치하지 않습니다.
            </div>
          )}
        </div>

        <div className={style.SignupPageBottomBtn}>
          <button
            className={`btn btn-outline-secondary ${style.SignupPageBtn}`}
            style={{
              fontSize: '18px',
              color: 'white',
              backgroundColor: emailValid || !passwordValid || passwordMismatch || !nicknameAvailable || !authCodeValid
                ? 'grey' : '#354c6fff', 
              borderRadius: '10px',
              border: 'none',
              width: '100%',
            }}
            onClick={handleSignupButtonClick}
            disabled={!emailValid || !passwordValid || passwordMismatch || !nicknameAvailable || !authCodeValid}
          >
            가입하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
