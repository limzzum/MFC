import RankingProfile from '../../components/rankingpage/rankingProfile.js'
import RankMyProfile from '../../components/rankingpage/rankMyProfile.js'
import RankingSearchBar from '../../components/rankingpage/rankingSearchBar.js'
import style from './ranking.module.css';

import "bootstrap/dist/css/bootstrap.min.css";

function Ranking() {

    
    return (
        <div className={style.wrapper}>
            <RankMyProfile />
            <div className={style.nextBox}> 
            <RankingSearchBar />
            <div className={style.rankTitleBox}>
                <div className={style.rankTitle}>랭킹</div>
                <div className={style.rankTitle}></div>
                <div className={style.rankTitle}>유저명</div>
                <div className={style.rankTitle}>경험치</div>
                <div className={style.rankTitle}>승률</div>
            </div>
            <div className="mx-auto">
                <RankingProfile />
            </div>
        </div>
        </div>
    );

}

export default Ranking;