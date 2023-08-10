import styles from './rankingProfile.module.css';
import baseProfile from "../../images/baseProfile.png";

function RankingProfile({ rank, userData }) {
    return (
        <div className={styles.profileBox}>
            <div className={styles.contentBox}>
                {rank}
            </div>
            
            <div className={styles.contentBox}>
                <img className={`${styles.radiusImg} w-50`} src={userData.profile
                  ? `https://goldenteam.site/profiles/${userData.profile}`
                  : baseProfile} alt="profileImage" />
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
