import { useState } from "react";
import styles from './rankingSearchBar.module.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, InputGroup } from "react-bootstrap";
import searchIcon from '../../images/searchIcon.png';

function RankingSearchBar({ onSearch }) {
    const [keyword, setKeyword] = useState("");

    const handleSearch = () => {
        onSearch(keyword);
    };

    return (
        <div>
            <InputGroup className="mb-3 mt-5">
                <Form.Control
                    placeholder="username"
                    aria-label="username"
                    aria-describedby="userSearch"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                />
                <Button 
                    variant="outline-secondary" 
                    id="userSearch"
                    onClick={handleSearch}
                >
                    검색
                    <img src={searchIcon} className={styles.searchIcon} alt="Search Icon" />
                </Button>
            </InputGroup>
        </div>
    );
}

export default RankingSearchBar;
