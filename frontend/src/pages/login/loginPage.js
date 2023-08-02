import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import logoImage from "../../images/logo.png"
import style from "./loginPage.module.css"
import axios from 'axios'

function Loginpage() {
  const [email, setEmail] = useState('') 
  const [pw, setPw] = useState('')
  const [emailValid, setEmailValid] = useState(false)
  const [pwValid, setPwValid] = useState(false)
  const [notAllow, setNotAllow] = useState(true)
  const [token, setToken] = useState('');


  useEffect(() => {
    if(emailValid && pwValid) {
      setNotAllow(false);
      return;
    }
    setNotAllow(true);
  }, [emailValid, pwValid]);

  const handleEmail = (e) => {
    setEmail(e.target.value)
    const regex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
      if(regex.test(email)) {
        setEmailValid(true)
      } else {
        setEmailValid(false)
      }
  }

  const handlePassword = (e) => {
    setPw(e.target.value)
    const regex =
    /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
  if (regex.test(e.target.value)) {
    setPwValid(true);
  } else {
    setPwValid(false);
  }
  }

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', { email, pw }); // 실제 서버 주소 및 API 경로에 맞게 수정
      const { token } = response.data;
      setToken(token);
      localStorage.setItem('token', token); // 토큰을 로컬 스토리지에 저장
      alert('로그인이 성공적으로 완료되었습니다.');
    } catch (error) {
      alert('아이디와 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className={style.wrapper}>
      <div className={style.innercontent}>
        <img className={style.logoImage} src={logoImage} alt='none'></img>
        <p className={style.MFC}>Mouth Fighting Championship</p>

        <div className={style.contentWrap}>
          <div className={style.inputtitle}>이메일</div>
          <div className={style.inputWrap}>
            <input className='input form-control w-50'
            placeholder='sample@gmail.com'
            value={email}
            onChange={handleEmail}
            style={{ fontSize: '12px'}}/>
          </div>
          <div className={style.errorMessageWrap}>
            {
              !emailValid && email.length > 0 && (
                <div>올바른 이메일을 입력해주세요.</div>
              )
            }
          </div>
          <div className={style.inputtitle}>비밀번호</div>
          <div className={style.inputWrap}>
            <input className={`${style.input} form-control w-50`}
            type='password' 
            placeholder='영문, 숫자, 특수문자 포함 8자 이상' 
            value={pw}
            onChange={handlePassword}
            style={{ fontSize: '12px' }}/>
          </div>
          <div className={style.errorMessageWrap}>
            {!pwValid && pw.length > 0 && (
              <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
            )}
          </div>
        </div>
      </div>
        <div>
          <button disabled={notAllow}
          class="btn btn-outline-secondary"
          className={style.loginbtn}
          onClick={handleLogin}>
            로그인
         </button>
        </div>
        
        <div className={style.bottomBtn}>
          <Link to = '/FindPWPage'>
            <button className={style.findPW} >비밀번호 찾기</button>
          </Link>
          <Link to = '/SignupPage'>
            <button className={style.signup} >회원가입</button>
          </Link>
        </div>
    </div>
  )
}
export default Loginpage