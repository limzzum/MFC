// import { useState, useEffect } from "react";
import styles from './rankMyProfile.module.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faCoins, faHandPeace } from "@fortawesome/free-solid-svg-icons";

import profileImage from '../../images/img.jpg'

function RankingMyProfile() {

    return (
        <div className={styles.boxProfile}>
          <div class={`${styles.rankProfileImage} mx-auto`}>
                <img className={`${styles.radiusImg} ${styles.imgCenter}`} src={profileImage} alt="profileImage" />
            </div>
            <div className={`${styles.rankingMyprofileText} mb-5`}>테스트 님</div>
              <div className={styles.historyBox}>
                <div className={styles.historyItemBox}>
                  <FontAwesomeIcon icon={faCrown} size="4x" color="orange"/>
                  <div className={styles.historyText}>145p</div>
                </div>
                <div className={styles.historyItemBox}>
                  <FontAwesomeIcon icon={faCoins} size="4x" color="orange"/>
                  <div className={styles.historyText}>4568</div>
                </div>
                <div className={styles.historyItemBox}>
                  <FontAwesomeIcon icon={faHandPeace} size="4x" color="white"/>
                  <div className={styles.historyText}>56.78%</div>
                </div>
                </div>
              </div>
    );
}

export default RankingMyProfile;