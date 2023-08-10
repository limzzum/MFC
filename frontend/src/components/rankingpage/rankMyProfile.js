// import { useState, useEffect } from "react";
import styles from './rankMyProfile.module.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faCoins, faHandPeace } from "@fortawesome/free-solid-svg-icons";
import baseProfile from "../../images/baseProfile.png";

function RankingMyProfile({ myData, myWinRate }) {
  
    return (
        <div className={styles.boxProfile}>
          <div className={`${styles.rankProfileImage} mx-auto`}>
                <img className={`${styles.radiusImg} ${styles.imgCenter}`} src={myData.profile
                  ? `https://goldenteam.site/profiles/${myData.profile}`
                  : baseProfile} alt="profileImage" />
            </div>
            <div className={`${styles.rankingMyprofileText} mb-5`}>{myData.nickName} 님</div>
              <div className={styles.historyBox}>
                <div className={styles.historyItemBox}>
                  <FontAwesomeIcon icon={faCrown} size="4x" color="orange"/>
                  <div className={styles.historyText}>{myData.exp}</div>
                </div>
                <div className={styles.historyItemBox}>
                  <FontAwesomeIcon icon={faCoins} size="4x" color="orange"/>
                  <div className={styles.historyText}>{myData.coin}</div>
                </div>
                <div className={styles.historyItemBox}>
                  <FontAwesomeIcon icon={faHandPeace} size="4x" color="white"/>
                  <div className={styles.historyText}>{myWinRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %</div>
                </div>
                </div>
              </div>
    );
}

export default RankingMyProfile;