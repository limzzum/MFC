import { useState } from "react";
import styles from "./rankingSearchBar.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, InputGroup } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function RankingSearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    onSearch(keyword);
  };

  return (
    <div>
      <InputGroup>
        <Form.Control
          placeholder="닉네임으로 검색"
          aria-label="username"
          aria-describedby="userSearch"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            borderColor: "var(--blue-200)",
            fontSize: "16px",
          }}
        />
        <button
          className={`btn  ${styles.RankSearchBtn}`}
          id="userSearch"
          onClick={handleSearch}
        >
          검색&nbsp;
          {/* <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" /> */}
        </button>
      </InputGroup>
    </div>
  );
}

export default RankingSearchBar;
