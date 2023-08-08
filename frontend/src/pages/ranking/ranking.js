import React, { useState, useEffect } from "react";
import axios from "axios";
import RankingProfile from "../../components/rankingpage/rankingProfile.js";
import RankMyProfile from "../../components/rankingpage/rankMyProfile.js";
import RankingSearchBar from "../../components/rankingpage/rankingSearchBar.js";
import style from "./ranking.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { useRecoilValue } from 'recoil';
import { userIdState } from '../../recoil/userId'


function Ranking() {
    const [ rankUsers, setRankUsers ] = useState([]);
    const [ page, setPage ] = useState(0);
    const [ myRecord, setMyRecord ] = useState([])
    const [ myWinRate, setMyWinRate ] = useState(0)
    const user = useRecoilValue(userIdState);
    const userId = user.userId;

    useEffect(() => {
        fetchData();
        getMyRecord();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const getMyRecord = () => {
        axios.get(`https://goldenteam.site/api/record/${userId}`)
        .then(response => {
            setMyRecord(response.data.data)
            setMyWinRate(response.data.data.winRate.toFixed(2))
        })
        .catch(error => {
            console.log(error)
        })

    }

    const fetchData = async (keyword = "") => {
        try {
            const response = await axios.get(`https://goldenteam.site/api/record/list/?page=${page}&perPage=10&keyword=${keyword}`);
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
            <RankMyProfile myData={myRecord} myWinRate={myWinRate}/>
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