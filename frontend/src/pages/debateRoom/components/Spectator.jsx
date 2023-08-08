import React, {useState, useEffect, useRef} from "react";
import { Button, ProgressBar } from "react-bootstrap";
import style from '../debatePage.module.css';
import leftVector from '../../../images/leftVector.png';
import rightVector from '../../../images/rightVector.png';

function Spectator({debateRoomInfo, voteResult}) {
    const value1 = voteResult.totalCountA;
    const value2 = voteResult.totalCountB;
    const totalValue = value1 + value2;
    const ratio1 = (value1 === 0 && value2 === 0) ? 50 : (value1 / totalValue) * 100;
    const ratio2 = (value1 === 0 && value2 === 0) ? 50 : (value2 / totalValue) * 100;

    const spectatorCnt = debateRoomInfo.maxPeople <= 2 ? 0 : debateRoomInfo.maxPeople - 2;

    const [userVideoStream, setUserVideoStream] = useState(null);
    const userVideoRef = useRef();

    useEffect(() => {
        // 비디오 스트림 가져오기
        const getVideoStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({video: true});
                setUserVideoStream(stream);
            }catch(e){
                console.log(`에러가 발생했습니다. ${e}`);
            }
        };

        getVideoStream();

        return () => {
            //컴포넌트 언마운트 시 비디오 스트림 해제
            if(userVideoStream){
                userVideoStream.getTracks().forEach((track) => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        //비디오 스트림 연결
        if(userVideoRef.current && userVideoStream){
            userVideoRef.current.srcObject = userVideoStream;
        }
    }, [userVideoStream]);

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
                    {[...Array(spectatorCnt)].map((_, index) => (
                        <div key={index}>
                            <video className={style.spectator} ref={userVideoRef} autoPlay muted />
                        </div>
                    ))}
                <Button><img src={rightVector} alt="rightVector"/></Button>
            </div>
        </div>
    );
}


export default Spectator;
