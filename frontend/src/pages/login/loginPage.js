import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userIdState } from "../../recoil/userId";
import { userState } from "../../recoil/token";
import { userInfoState } from "../../recoil/userInfo";
import { useRecoilState } from "recoil";
import logoImage from "../../images/logo.png";
import style from "./loginPage.module.css";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Loginpage() {
  const [email, setEmail] = useState("");
  const [password, setPw] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  // const [notAllow, setNotAllow] = useState(true);
  // const [setNotAllow] = useState(true);
  const [, setUser] = useRecoilState(userState);
  const [, setRecoilUserId] = useRecoilState(userIdState);
  const [, setUserInfo] = useRecoilState(userInfoState);
  const navigate = useNavigate();

  useEffect(() => {
    if (emailValid && pwValid) {
      // setNotAllow(false);
      return;
    }
    // setNotAllow(true);
  }, [emailValid, pwValid]);

  const handleEmail = (e) => {
    setEmail(e.target.value);
    const regex =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (regex.test(email)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };

  const handlePassword = (e) => {
    setPw(e.target.value);
    const regex =
      /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
    if (regex.test(e.target.value)) {
      setPwValid(true);
    } else {
      setPwValid(false);
    }
  };

  const serverAddress = "https://goldenteam.site/api/user/login";

  const handleLogin = async (event) => {
    event.preventDefault(); // form의 기본 동작을 방지합니다.

    // (기존 로그인 로직)
    try {
      const response = await axios.post(`${serverAddress}`, {
        email,
        password,
      });
      const token = response.data.data.accessToken;
      const userId = response.data.data.userId;
      if (token) {
        setRecoilUserId({ userId });
        setUser({ token });
        localStorage.setItem("token", token);

        const config = {
          headers: {
            "content-type": "json/application",
            Authorization: `Bearer ${token}`,
          },
        };

        const userInfoResponse = await axios.get(
          "https://goldenteam.site/api/user",
          config
        );
        setUserInfo(userInfoResponse.data.data);
        navigate("/");
      } else {
        // alert("로그인에 실패하였습니다.");
        toast.error("로그인에 실패하였습니다.");
      }
    } catch (error) {
      toast.error("아이디와 비밀번호를 확인해주세요.");
      // alert("아이디와 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className={style.wrapper}>
      <div className={style.loginform}>
        <form onSubmit={handleLogin}>
          <div className={style.innercontent}>
            <img className={style.logoImage} src={logoImage} alt="none"></img>
            <p className={style.MFC}>Mouth Fighting Championship</p>

            <div className={style.contentWrap}>
              <div className={style.inputWrap}>
                <input
                  className="input form-control"
                  placeholder="이메일"
                  value={email}
                  onChange={handleEmail}
                  style={{ fontSize: "15px" }}
                />
                {/* <div className={style.errorMessageWrap}>
                  {!emailValid && email.length > 0 && (
                    <div>올바른 이메일을 입력해주세요.</div>
                  )}
                </div> */}
              </div>

              <div className="my-2">
                <input
                  className={`${style.input} form-control`}
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={handlePassword}
                  style={{ fontSize: "15px" }}
                />
                {/* <div className={style.errorMessageWrap}>
                  {!pwValid && password.length > 0 && (
                    <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
                  )}
                </div> */}
              </div>
            </div>
            <button
              type="submit"
              // disabled={notAllow}
              className={`${style.loginbtn} btn btn-primary my-1`}
            >
              로그인
            </button>
            <Row>
              <Col>
                <div className={style.bottomBtn}>
                  <Link to="/signup">
                    <button className={style.signup}>비밀번호 재설정</button>
                  </Link>
                </div>
              </Col>
              <Col>
                <div className={style.bottomBtn}>
                  <Link to="/signup">
                    <button className={style.signup}>회원가입</button>
                  </Link>
                </div>
              </Col>
            </Row>
          </div>
        </form>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        limit={1}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </div>
  );
}

export default Loginpage;
