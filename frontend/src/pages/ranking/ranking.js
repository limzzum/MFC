import React, { useState, useEffect } from "react";
import axios from "axios";
import RankingProfile from "../../components/rankingpage/rankingProfile.js";
import RankMyProfile from "../../components/rankingpage/rankMyProfile.js";
import RankingSearchBar from "../../components/rankingpage/rankingSearchBar.js";
import style from "./ranking.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Ranking() {
    const [rankUsers, setRankUsers] = useState([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        axios.get(`http://i9a605.p.ssafy.io:8081/api/record/list/?page=${page}&perPage=10&keyword=`)
            .then(response => {
                setRankUsers(response.data.data.result);
        })
        .catch(error => {
            console.error("랭크유저 정보 가져오기 오류:", error);
        });
    };


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
                    {rankUsers.map((userData, index) => (
                        <RankingProfile key={index} userData={userData} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Ranking;
