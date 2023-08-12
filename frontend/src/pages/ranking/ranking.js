import React, { useState, useEffect } from "react";
import axios from "axios";
import RankingProfile from "../../components/rankingpage/rankingProfile.js";
import RankMyProfile from "../../components/rankingpage/rankMyProfile.js";
import RankingSearchBar from "../../components/rankingpage/rankingSearchBar.js";
import style from "./ranking.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { userIdState } from "../../recoil/userId";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

function Ranking() {
  const [rankUsers, setRankUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [myRecord, setMyRecord] = useState([]);
  const [myWinRate, setMyWinRate] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const user = useRecoilValue(userIdState);
  const userId = user.userId;

  useEffect(() => {
    fetchData();
    getMyRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const getMyRecord = () => {
    axios
      .get(`https://goldenteam.site/api/record/${userId}`)
      .then((response) => {
        setMyRecord(response.data.data);
        setMyWinRate(response.data.data.winRate.toFixed(2));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchData = async (keyword = "") => {
    try {
      const response = await axios.get(
        // `https://goldenteam.site/api/record/list/?page=${page}&perPage=10&keyword=${keyword}`
        `https://goldenteam.site/api/record/list/?page=${page}&perPage=10&keyword=${keyword}`
      );
      setTotalPage(response.data.data.totalPageCount);
      setRankUsers(response.data.data.result);
    } catch (error) {
      console.error("랭크유저 정보 가져오기 오류:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 0 || newPage >= totalPage) return;
    setPage(newPage);
  };

  const handleSearch = (keyword) => {
    setPage(0);
    fetchData(keyword);
  };

  return (
    <div className={style.wrapper}>
      <RankMyProfile myData={myRecord} myWinRate={myWinRate} />
      <div className={`${style.nextBox} mx-auto`}>
        <RankingSearchBar onSearch={handleSearch} />
        <div className={`mt-4`}>
          <Row className="w-100 m-0">
            <Col className={style.rankTitle}>순위</Col>
            <Col xs={5} className={style.rankTitle}>
              닉네임
            </Col>
            <Col className={style.rankTitle}>경험치</Col>
            <Col className={style.rankTitle}>승률</Col>
          </Row>
        </div>
        <div className={style.rankBox}>
          {rankUsers.map((userData, index) => (
            <RankingProfile
              key={index}
              rank={page * 10 + index + 1}
              userData={userData}
            />
          ))}
        </div>
        <div>
          {/* {page > 0 && (
            <button
              className={`btn ${style.pageBtn} `}
              onClick={() => handlePageChange(page - 1)}
            >
              <FontAwesomeIcon icon={faChevronLeft} color="black" size="sm" />
            </button>
          )} */}
          <button
            className={`btn ${style.pageBtn} `}
            onClick={() => handlePageChange(page - 1)}
          >
            <FontAwesomeIcon icon={faChevronLeft} color="navy" size="sm" />
          </button>
          {totalPage <= 5 && //토탈 카운트가 5보다 작거나 같은 경우
            Array.from({ length: totalPage }, (_, index) => (
              <span
                key={index + 1}
                className={
                  page === index
                    ? `${style.currentPage}`
                    : `${style.PageNumber}`
                }
                onClick={() => handlePageChange(index)}
              >
                {index + 1}&nbsp;
              </span>
            ))}
          {totalPage > 5 &&
            totalPage - page > 5 &&
            // page > totalPage - 5 && //6 > 10-5 5
            Array.from({ length: 5 }, (_, index) => (
              <span
                key={index + 1} // 페이지 번호는 1부터 시작하므로 index + 1을 사용
                className={
                  page === index + page
                    ? `${style.currentPage}`
                    : `${style.PageNumber}`
                }
                onClick={() => handlePageChange(index + page)} // 페이지 번호는 1부터 시작하므로 index + 1을 사용
              >
                {index + page + 1}&nbsp;
              </span>
            ))}
          {totalPage > 5 &&
            totalPage - page <= 5 && // totalPage - page <= 5
            Array.from({ length: 5 }, (_, index) => (
              <span
                key={index}
                className={
                  page === totalPage - (totalPage - 5) + index
                    ? `${style.currentPage}`
                    : `${style.PageNumber}`
                }
                onClick={() =>
                  handlePageChange(totalPage - (totalPage - 5) + index)
                }
              >
                {totalPage - (totalPage - 5) + index + 1}&nbsp;
              </span>
            ))}
          <button
            className={`btn ${style.pageBtn} `}
            onClick={() => handlePageChange(page + 1)}
            // disabled={rankUsers.length < 10}
          >
            <FontAwesomeIcon icon={faChevronRight} color="navy" size="sm" />
          </button>
          {/* <span>{page + 1}</span> */}
        </div>
      </div>
    </div>
  );
}

export default Ranking;
