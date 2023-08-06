import React, { useState, useEffect } from "react";
import axios from "axios";
import RankingProfile from "../../components/rankingpage/rankingProfile.js";
import RankMyProfile from "../../components/rankingpage/rankMyProfile.js";
import RankingSearchBar from "../../components/rankingpage/rankingSearchBar.js";
import style from "./ranking.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

function Ranking() {
    const [rankUsers, setRankUsers] = useState([]);
    const [page, setPage] = useState(0);
    // const userId = 1;
    useEffect(() => {
        fetchData();
        // getMyRecord();
    }, [page]);

    // const getMyRecord = () => {
    //     axios.get(`http://i9a605.p.ssafy.io:8081/api/record/list/${userId}`)
    //     .then(response => {
    //         console.log(response)
    //     })
    //     .catch(error => {
    //         console
    //     })

    // }

    const fetchData = async (keyword = "") => {
        try {
            const response = await axios.get(`http://i9a605.p.ssafy.io:8081/api/record/list/?page=${page}&perPage=10&keyword=${keyword}`);
            setRankUsers(response.data.data.result);
        } catch (error) {
            console.error("랭크유저 정보 가져오기 오류:", error);
        }
    };

    const handlePageChange = newPage => {
        setPage(newPage);
    };

    const handleSearch = keyword => {
        setPage(0);
        fetchData(keyword);
    };

    return (
        <div className={style.wrapper}>
            <RankMyProfile />
            <div className={style.nextBox}> 
                <RankingSearchBar onSearch={handleSearch} />
                <div className={style.rankTitleBox}>
                    <div className={style.rankTitle}>랭킹</div>
                    <div className={style.rankTitle}></div>
                    <div className={style.rankTitle}>유저명</div>
                    <div className={style.rankTitle}>경험치</div>
                    <div className={style.rankTitle}>승률</div>
                </div>
                <div className="mx-auto">
                    {rankUsers.map((userData, index) => (
                        <RankingProfile key={index} rank={page * 10 + index + 1} userData={userData} />
                    ))}
                </div>
                <div>
                    {page > 0 && (
                        <Button onClick={() => handlePageChange(page - 1)}>이전</Button>
                    )}
                    <span>{page + 1}</span>
                    {rankUsers.length >= 10 && (
                        <Button onClick={() => handlePageChange(page + 1)} disabled={rankUsers.length < 10}>다음</Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Ranking;