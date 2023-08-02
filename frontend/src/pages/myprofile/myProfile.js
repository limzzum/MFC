import { useState } from "react";
import styles from './myProfile.module.css';
import profileImage from '../../images/img.jpg';
import settingIcon from '../../images/settingIcon.png';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Row } from "react-bootstrap";
import { Link } from 'react-router-dom';

function MyProfile() {
  const [selectedImage, setSelectedImage] = useState(null);
  // const { userId } = useParams();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // 선택된 파일(file)을 상태(selectedImage)에 저장
    setSelectedImage(file);
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.profileTitle}>My Profile</p>
      <div>
        <hr />
        <form>
          <div className={styles.profileImage}>
            {selectedImage ? (
              <img
                className={`${styles.radiusImg}`}
                src={URL.createObjectURL(selectedImage)}
                alt="profileImage"
              />
            ) : (
              <img className={`${styles.radiusImg}`} src={profileImage} alt="profileImage" />
            )}
            <label htmlFor="fileInput" className={`${styles.radiusImg} ${styles.imgSetting}`}>
              <img src={settingIcon} alt="이미지변경" />
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <div className={styles.profileText}>
            <ul>
              <li>
                <label htmlFor="이메일" className="mb-2">
                  이메일
                </label>
                <input className="form-control w-75" type="text" placeholder="email"></input>
              </li>
              <li>
                <label htmlFor="Nickname" className="mb-2">
                  닉네임 변경
                </label>
                <div className="input-group mb-4 w-75">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="닉네임 적어줘"
                    aria-label="Nickname"
                    aria-describedby="basic-addon2"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button">
                      중복확인
                    </button>
                  </div>                 
                </div>
                <div>
                  <Link to="/pages/passwordchange/passwordChangePage/:userId" className={`${styles.pwText}`}>
            비밀번호변경
                </Link>
                </div> 
              </li>
            </ul>
          </div>
        </form>
      </div>
      <div>
        <Row>
          <Button className="col-4 btn btn-primary w-150px m-auto" type="submit">
            변경
          </Button>
          <Button className="col-4 btn btn-danger w-150px m-auto">탈퇴</Button>
        </Row>
      </div>
    </div>
  );
}

export default MyProfile;
