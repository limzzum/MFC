// signupPage.js
import React, { useState, useEffect } from 'react';
import logoImage from '../../images/logo.png';
import style from './signupPage.module.css';

function SignupPage() {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);

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
              style={{ fontSize: '12px', width: '137px' }}
              value={email}
              onChange={handleEmail}
            />
            <button
              className={`btn btn-outline-secondary ${style.SignupPageBtn}`}
              style={{
                fontSize: '8px',
                color: 'white',
                backgroundColor: emailValid ? '#354c6fff' : 'grey',
                borderRadius: '10px',
                border: 'none',
              }}
              onClick={handleSendEmailClick}
              disabled={!emailValid}
            >
              메일전송
            </button>
          </div>

          {/* 인증번호 입력 */}
          <div>
            <span className={style.SignupPageInputTitle}>인증번호 입력</span>
            {isActive && (
              <span style={{ fontSize: '12px', marginLeft: '10px', color: 'red' }}>{formatTime()}</span>
            )}
          </div>
          <div className={style.SignupPageInputWrap}>
            <input
              className={`SignupPageInput form-control ${style.SignupPageInput}`}
              style={{ fontSize: '12px', width: '137px' }}
            />
            <button
              className={`btn btn-outline-secondary ${style.SignupPageBtn}`}
              style={{
                fontSize: '8px',
                color: 'white',
                backgroundColor: '#354c6fff',
                borderRadius: '10px',
                border: 'none',
              }}
            >
              인증하기
            </button>
          </div>

          {/* 닉네임 */}
          <div className={style.SignupPageInputTitle}>닉네임</div>
          <div className={style.SignupPageInputWrap}>
            <input
              className={`SignupPageInput form-control ${style.SignupPageInput}`}
              style={{ fontSize: '12px', width: '137px' }}
            />
            <button
              className={`btn btn-outline-secondary ${style.SignupPageBtn}`}
              style={{
                fontSize: '5px',
                color: 'white',
                backgroundColor: '#354c6fff',
                borderRadius: '10px',
                border: 'none',
              }}
            >
              중복검사
            </button>
          </div>

          {/* 비밀번호 */}
          <div className={style.SignupPageInputTitle}>비밀번호</div>
          <input
            className={`SignupPageInput form-control ${style.SignupPageInput}`}
            style={{ fontSize: '12px', width: '200px' }}
          />

          {/* 비밀번호 확인 */}
          <div className={style.SignupPageInputTitle}>비밀번호 확인</div>
          <input
            className={`SignupPageInput form-control ${style.SignupPageInput}`}
            style={{ fontSize: '12px', width: '200px' }}
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
            }}>
            가입하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
