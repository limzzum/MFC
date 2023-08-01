// import { useState, useEffect } from "react";
import styles from './myProfile.module.css'
import profileImage from '../../images/img.jpg'
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Row } from "react-bootstrap";

function MyProfile() {

    return (
      <div className={styles.wrapper}>
        <p className={styles.profileTitle}>My Profile</p>
        <div>
          <hr />
            <form>
            <div className={styles.profileImage}>
                <img className={`${styles.radiusImg}`} src={profileImage} alt="profileImage" />
                <a href="https://www.naver.com"><img className={`${styles.radiusImg} ${styles.imgSetting}`} src={profileImage} alt="profileImage" />
                </a>
            </div>
            <div className={styles.profileText}>
                <ul>
                <li>
                  <label for="이메일" className="mb-2">이메일</label>
                  <input className="form-control w-75" type="text" placeholder="email"></input>
                </li>
                <li>
                  <label for="Nickname" className="mb-2">닉네임 변경</label>
                <div className="input-group mb-4 w-75">
                  <input type="text" class="form-control" placeholder="닉네임 적어줘" aria-label="Nickname" aria-describedby="basic-addon2"/>
                  <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button">중복확인</button>
                  </div>
                </div>
                </li>
                </ul>
            </div>
            </form>
          </div>
          <div>
          <Row>
              <Button className="col-4 btn btn-primary w-150px m-auto" type="submit">변경</Button>
              <Button className="col-4 btn btn-danger w-150px m-auto">탈퇴</Button>
          </Row>
        </div>
      </div>
    );
}

export default MyProfile;