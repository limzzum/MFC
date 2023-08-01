import React from "react";
import {  Row, Col } from "react-bootstrap";
import style from '../debatePage.module.css';

function Participate(){
    return (
        <div>
            <Row>
                <Col>
                    <label className={style.video}></label>
                </Col>
                <Col>
                    <label className={style.video}></label>
                </Col>
            </Row>
        </div>
    );
}

export default Participate;