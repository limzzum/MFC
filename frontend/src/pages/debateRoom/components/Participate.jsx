import React from "react";
import {  Row, Col } from "react-bootstrap";
import style from '../debatePage.module.css';

function Participate({role, onRoleChange}){
    return (
        <div>
            <Row>
                <Col>
                    <label className={style.Participant}>
                        { role === 'spectator' &&
                            <button className={style.button} onClick={() => onRoleChange('participant')}>참가하기</button>
                        }
                    </label>
                </Col>
                <Col>
                    <label className={style.Participant}>
                        { role === 'spectator' &&
                            <button className={style.button} onClick={() => onRoleChange('participant')}>참가하기</button>
                        }
                    </label>
                </Col>
            </Row>
        </div>
    );
}

export default Participate;