import { useState, useEffect } from "react";
import styles from './rankingProfile.module.css'
import "bootstrap/dist/css/bootstrap.min.css";
import profileImage from '../../images/img.jpg'

function RankingProfile() {

    return (
        <div className={styles.profileBox}>
            <div className={styles.contentBox}>
                1
            </div>
            
            <div className={styles.contentBox}>
                <img className={`${styles.radiusImg} w-50`} src={profileImage} alt="profileImage" />
            </div>
            <div className={styles.contentBox}>테스트</div>
            <div className={styles.contentBox}>
                150pt
            </div>
            <div className={styles.contentBox}>
                87%
            </div>
          </div>
    );
}

export default RankingProfile;