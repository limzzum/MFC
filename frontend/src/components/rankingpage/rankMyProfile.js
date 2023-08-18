// import { useState, useEffect } from "react";
import styles from "./rankMyProfile.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faCoins, faTrophy } from "@fortawesome/free-solid-svg-icons";
import baseProfile from "../../images/baseProfile.png";

function RankingMyProfile({ myData, myWinRate }) {
  return (
    <div className={`${styles.boxProfile} py-auto`}>
      <div className={`${styles.rankingMyprofileText}`}>
        {/* {myData.nickName} 님 */}
        {/* MY RANK */}내 전적
      </div>
      <div className={`${styles.rankProfileImage}  my-1 mx-auto`}>
        <img
          className={`${styles.rankProfileImage}`}
          src={
            myData.profile
              ? `https://goldenteam.site/profiles/${myData.profile}`
              : baseProfile
          }
          alt="profileImage"
        />
      </div>
      {/* <div className={`${styles.rankingMyprofileText} my-2`}>
        {myData.nickName}
      </div> */}
      <div className={`${styles.historyBox} my-4 mt-5`}>
        <div className={`${styles.historyItemBox}`}>
          <FontAwesomeIcon icon={faCrown} size="xl" color="#FFD700" />
          <span className={styles.historyTitleText}>&nbsp;경험치</span>
          <p className={styles.historyText}>EXP {myData.exp}</p>
        </div>
        <div className={styles.historyItemBox}>
          <FontAwesomeIcon icon={faCoins} size="xl" color="#FFD700" />
          <span className={styles.historyTitleText}>&nbsp;코인</span>
          <p className={styles.historyText}>{myData.coin}</p>
        </div>
        <div className={styles.historyItemBox}>
          <FontAwesomeIcon icon={faTrophy} size="xl" color="#FFD700" />
          <span className={styles.historyTitleText}>&nbsp;승률</span>
          <p className={styles.historyText}>
            {myWinRate.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            &nbsp;%
          </p>
        </div>
      </div>
    </div>
  );
}

export default RankingMyProfile;
