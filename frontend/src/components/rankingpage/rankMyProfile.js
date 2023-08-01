// import { useState, useEffect } from "react";
import styles from './rankMyProfile.module.css'
import "bootstrap/dist/css/bootstrap.min.css";
import profileImage from '../../images/img.jpg'
import { Container, Row, Col } from "react-bootstrap";

function RankingMyProfile() {

    return (
        <div className={styles.boxProfile}>
          <div class={`${styles.rankProfileImage} mx-auto`}>
                <img className={`${styles.radiusImg} ${styles.imgCenter}`} src={profileImage} alt="profileImage" />
            </div>
           <div className={`${styles.rankingMyprofileText} mb-5`}>테스트</div>
          <Container>
            <Row>
              <Col>
                <div>
                  <img className="mb-1" src={profileImage} />
                  <p className="mx-auto">145p</p>
                </div>
              </Col>
              <Col>
              <div>
                  <img className="mb-1" src={profileImage} />
                  <p className="mx-auto">145p</p>
                </div>
              </Col>
              <Col>
              <div>
                  <img className="mb-1" src={profileImage} />
                  <p className="mx-auto">145p</p>
                </div>
              </Col>
            </Row>
          </Container>
          </div>
    );
}

export default RankingMyProfile;