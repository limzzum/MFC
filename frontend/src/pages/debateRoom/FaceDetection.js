import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import style from './debatePage.module.css';
import leftVector from '../../images/leftVector.png';
import rightVector from '../../images/rightVector.png';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

tf.setBackend('webgl');

function Spectator() {
    const [userVideoStream, setUserVideoStream] = useState(null);
    const videoRef = useRef(null);  // 비디오 요소에 대한 참조를 생성합니다.
    const [model, setModel] = useState(null); // 모델을 상태로 저장합니다.

    useEffect(() => {
        const getVideoStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setUserVideoStream(stream);
                }
            } catch (e) {
                console.log(`에러가 발생했습니다. ${e}`);
            }
        };

        const loadModel = async () => {
            try {
                const tfModel = await tf.loadGraphModel('./best_web_model/model.json');
                setModel(tfModel);
            } catch (e) {
                console.log(`모델 로딩 에러: ${e}`);
            }
        };

        getVideoStream();
        loadModel();

        return () => {
            if (userVideoStream) {
                userVideoStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (userVideoStream && model && videoRef.current) {
                const webcamImage = tf.browser.fromPixels(videoRef.current);
                const resizedImage = tf.image.resizeBilinear(webcamImage, [640, 640]);
                const expandedImage = tf.expandDims(resizedImage, 0);

                const inputTensorName = model.inputNodes[0];
                const outputTensorName = model.outputNodes[0];
                const input = { [inputTensorName]: expandedImage };
                const output = await model.executeAsync(input, outputTensorName);

                const predictionArray = output.dataSync();
                const maxValue = predictionArray.indexOf(Math.max(...predictionArray));
                if (maxValue % 2 === 0) {
                    console.log("notAngry");
                } else {
                    console.log("angry");
                }

                webcamImage.dispose();
                resizedImage.dispose();
                expandedImage.dispose();
                output.dispose();
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [userVideoStream, model]);

    return (
        <div className={style.Spectator}>
            <div className={style.voteResult}>
                {/* 비디오 요소를 여기에 추가하고 ref로 연결합니다. */}
                <video ref={videoRef} style={{ display: 'none' }} autoPlay playsInline muted></video>
            </div>
            <div className={style.spectatorList}>
                <Button><img src={leftVector} alt="leftVector" /></Button>
                <Button><img src={rightVector} alt="rightVector" /></Button>
            </div>
        </div>
    );
}

export default Spectator;
