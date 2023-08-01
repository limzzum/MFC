import { useState, useEffect } from "react";
import styles from './rankingProfile.module.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import profileImage from '../../images/img.jpg'

function RankingProfile() {

    return (
        <div className="mt-2">
          <Container>
            <Row>
                <Col className={styles.ranking}>
                    1
                </Col>
            <Col>
            <div className={`${styles.profileImage} mb-3`}>
                <img className={`${styles.radiusImg} ${styles.nowImg}`} src={profileImage} alt="profileImage" />
            </div>
            </Col>
            <Col className={`${styles.ranking} ${styles.rankNick}`}>테스트</Col>
            <Col className={styles.ranking}>
                <p>150pt</p>
            </Col>
            <Col className={styles.ranking}>
                <p>87%</p>
            </Col>
            </Row>
          </Container>
        </div>
    );
}

export default RankingProfile;