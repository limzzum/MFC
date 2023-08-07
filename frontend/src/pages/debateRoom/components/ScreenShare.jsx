import React, {useState, useEffect, useRef} from "react";
import {Button} from 'react-bootstrap';
import style from '../debatePage.module.css';


function ScreenShare({status, role}){

    const [screenStream, setScreenStream] = useState(null);
    const videoRef = useRef();

    const startScreenShare = async () => {
        try{
            const stream = await navigator.mediaDevices.getDisplayMedia({video: true});
            setScreenStream(stream);
        }catch(e){
            console.log("화면 공유 중 에러 발생: ", e);
        } 
    };

    const stopScreenShare = () => {
        if(screenStream){
            screenStream.getTracks().forEach((track) => track.stop());
            setScreenStream(null);
            videoRef.current.srcObject = null;
        }
    };

    useEffect(() => {
        if(videoRef.current && screenStream){
            videoRef.current.srcObject = screenStream;
        }
    }, [screenStream]);


    return(
        <div>
            <div className={style.screenShare}>
                {screenStream ? (
                <>
                    <video className={style.shareVideo} ref={videoRef} autoPlay muted />
                    <Button onClick={stopScreenShare}>화면 공유 중지</Button>
                </>
                ) : (
                status === "ongoing" && role === "participate" && (
                    <Button onClick={startScreenShare}>화면 공유 시작</Button>
                )
                )}
            </div>
        </div>
    );
}

export default ScreenShare;