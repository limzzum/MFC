import React from "react";
import styles from './rankingProfile.module.css';
import profileImage from '../../images/img.jpg';

function RankingProfile({ rank, userData }) {
    console.log(userData)
    return (
        <div className={styles.profileBox}>
            <div className={styles.contentBox}>
                {rank}
            </div>
            
            <div className={styles.contentBox}>
                <img className={`${styles.radiusImg} w-50`} src={profileImage} alt="profileImage" />
            </div>
            <div className={styles.contentBox}>{userData.nickName}</div>
            <div className={styles.contentBox}>
                {userData.exp}
            </div>
            <div className={styles.contentBox}>
                {userData.winRate.toFixed(2)}%
            </div>
        </div>
    );
}

export default RankingProfile;
