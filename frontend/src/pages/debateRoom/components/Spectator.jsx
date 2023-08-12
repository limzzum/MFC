import React from "react";
import { Button, ProgressBar } from "react-bootstrap";
import UserVideoComponent from '../Openvidu/UserVideoComponent';

import style from '../debatePage.module.css';
import leftVector from '../../../images/leftVector.png';
import rightVector from '../../../images/rightVector.png';

function Spectator({ voteResult, filteredSubscribers}) {
    const value1 = voteResult.totalCountA;
    const value2 = voteResult.totalCountB;
    const totalValue = value1 + value2;
    const ratio1 = (value1 === 0 && value2 === 0) ? 50 : (value1 / totalValue) * 100;
    const ratio2 = (value1 === 0 && value2 === 0) ? 50 : (value2 / totalValue) * 100;

    // const spectatorCnt = debateRoomInfo.maxPeople <= 2 ? 0 : debateRoomInfo.maxPeople - 2;
    return (
        <div className={style.Spectator}>
            <div className={style.voteResult}>
                <ProgressBar>
                    <ProgressBar variant="success" label={value1} now={ratio1} key={1} />
                    <ProgressBar variant="danger" label={value2} now={ratio2} key={2} />
                </ProgressBar>
            </div>
            <div className={style.spectatorList}>
                <Button><img src={leftVector} alt="leftVector"/></Button>
                    {/* {[...Array(spectatorCnt)].map((_, index) => (
                        <div key={index}>
                            <video className={style.spectator} ref={userVideoRef} autoPlay muted />
                        </div>
                    ))} */}
                    {filteredSubscribers.map((sub, i) => (
                        <div key={sub.id} className={style.Spectator}>
                            <span>{sub.id}</span>
                            <UserVideoComponent streamManager={sub} called={style.spectator}/>
                        </div>
                    ))}
                <Button><img src={rightVector} alt="rightVector"/></Button>
            </div>
        </div>
    );
}

export default Spectator;
