import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logoImage from '../../images/logo.png';
import style from './signupPage.module.css';

function SignupPage() {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleEmail = (e) => {
    setEmail(e.target.value);
    const regex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (regex.test(e.target.value)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };

  const handleSendEmailClick = () => {
    if (emailValid) {
      setTimer(180);
      setIsActive(true);
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

  const handleAuthButtonClick = () => {
    // 인증번호 확인 로직을 여기에 추가
    axios
      .post('/api/verifyAuthCode', { email, authCode }) // 실제 서버 주소 및 API 경로에 맞게 수정
      .then((response) => {
        alert('인증이 완료되었습니다!');
      })
      .catch((error) => {
        alert('인증번호가 올바르지 않습니다.');
      });
  };

  const handleNicknameButtonClick = () => {
    // 닉네임 확인 로직을 여기에 추가
    axios
      .post('/api/checkNickname', { nickname }) // 실제 서버 주소 및 API 경로에 맞게 수정
      .then((response) => {
        if (response.data.isAvailable) {
          alert('확인되었습니다!');
        } else {
          alert('이미 사용 중인 닉네임입니다.');
        }
      })
      .catch((error) => {
        alert('닉네임 확인에 실패하였습니다.');
      });
  };

  const handleSignupButtonClick = () => {
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
    } else {
      // 서버로 회원가입 정보를 보내는 로직을 여기에 추가
      axios
        .post('/api/signup', { email, authCode, nickname, password }) // 실제 서버 주소 및 API 경로에 맞게 수정
        .then((response) => {
          alert('회원가입이 완료되었습니다!');
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

          {/* 인증번호 입력 */}
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
              />
              <button
                className={`btn btn-outline-secondary ${style.SignupPageBtn}`}
                style={{
                  fontSize: '14px',
                  color: 'white',
                  backgroundColor: '#354c6fff',
                  borderRadius: '10px',
                  border: 'none',
                }}
                onClick={handleAuthButtonClick}
              >
                인증
              </button>
            </div>
          )}

          {/* 닉네임 */}
          <div className={style.SignupPageInputTitle}>닉네임</div>
          <div className={style.SignupPageInputWrap}>
            <input
              className={`SignupPageInput form-control ${style.SignupPageInput}`}
              style={{ fontSize: '12px', width: '145px' }}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <button
              className={`btn btn-outline-secondary ${style.SignupPageBtn}`}
              style={{
                fontSize: '14px',
                color: 'white',
                backgroundColor: '#354c6fff',
                borderRadius: '10px',
                border: 'none',
              }}
              onClick={handleNicknameButtonClick}
            >
              확인
            </button>
          </div>

          {/* 비밀번호 */}
          <div className={style.SignupPageInputTitle}>비밀번호</div>
          <input
            className={`SignupPageInput form-control ${style.SignupPageInput}`}
            style={{ fontSize: '12px', width: '200px' }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* 비밀번호 확인 */}
          <div className={style.SignupPageInputTitle}>비밀번호 확인</div>
          <input
            className={`SignupPageInput form-control ${style.SignupPageInput}`}
            style={{ fontSize: '12px', width: '200px' }}
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>

        <div className={style.SignupPageBottomBtn}>
          <button
            className={`btn btn-outline-secondary ${style.SignupPageBtn}`}
            style={{
              fontSize: '18px',
              color: 'white',
              backgroundColor: '#354c6fff',
              borderRadius: '10px',
              border: 'none',
              width: '100%',
            }}
            onClick={handleSignupButtonClick}
          >
            가입하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
