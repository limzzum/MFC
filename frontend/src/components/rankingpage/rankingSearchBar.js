import { useState, useEffect } from "react";
import styles from './rankingSearchBar.module.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, InputGroup } from "react-bootstrap";
import searchIcon from '../../images/searchIcon.png'

function RankingSearchBar() {

    return (
        <div>
        <InputGroup className="mb-3 mt-5">
                <Form.Control
                placeholder="username"
                aria-label="username"
                aria-describedby="userSearch"
                />
                <Button 
                variant="outline-secondary" 
                id="userSearch">
                    검색
                <img src={searchIcon} className={styles.searchIcon}/>
                </Button>
            
        </InputGroup>
        </div>
    );
}

export default RankingSearchBar;