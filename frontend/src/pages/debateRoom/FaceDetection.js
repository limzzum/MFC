import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import style from "./debatePage.module.css";
import leftVector from "../../images/leftVector.png";
import rightVector from "../../images/rightVector.png";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

tf.setBackend("webgl");

function Spectator() {
  const [userVideoStream, setUserVideoStream] = useState(null);
  const videoRef = useRef(null);
  const [model, setModel] = useState(null);
  const modelurl = `${process.env.PUBLIC_URL}/best_web_model/model.json`;

  useEffect(() => {
    const getVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setUserVideoStream(stream);
        }
      } catch (e) {
        console.log(`에러가 발생했습니다. ${e}`);
      }
    };

    getVideoStream();

    return () => {
      if (userVideoStream) {
        userVideoStream.getTracks().forEach((track) => track.stop());
      }
    };
  });

  useEffect(() => {
    const handleCanPlay = () => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("canplay", handleCanPlay);
    }

    return () => {
      if (videoRef.current) {
        // eslint-disable-next-line
        videoRef.current.removeEventListener("canplay", handleCanPlay);
      }
    };
  }, []);

  useEffect(() => {
    const analyzeFacialExpression = async () => {
      if (userVideoStream && model && videoRef.current) {
        const webcamImage = tf.browser.fromPixels(videoRef.current);
        const resizedImage = tf.image.resizeBilinear(webcamImage, [640, 640]);
        const expandedImage = tf.expandDims(resizedImage, 0);

        const inputTensorName = model.inputNodes[0];
        const outputTensorName = model.outputNodes[0];
        const input = { [inputTensorName]: expandedImage };
        const output = await model.executeAsync(input, outputTensorName);

        const predictionArray = Array.from(output.dataSync());
        // console.log("prediction", predictionArray);

        const angryValue = predictionArray[1];
        const noAngryValue = predictionArray[0];
        if (angryValue >= 0.5) {
          console.log("Angry");
        } else if (noAngryValue < 0.5 && angryValue >= noAngryValue) {
          console.log("Angry");
        } else {
          console.log("noAngry");
        }

        webcamImage.dispose();
        resizedImage.dispose();
        expandedImage.dispose();
        output.dispose();
      }
    };

    const interval = setInterval(analyzeFacialExpression, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [userVideoStream, model]);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const tfModel = await tf.loadGraphModel(modelurl);
        setModel(tfModel);
      } catch (e) {
        console.log(`모델 로딩 에러: ${e}`);
      }
    };

    loadModel();
  });

  return (
    <div className={style.Spectator}>
      <div className={style.voteResult}>
        <video
          ref={videoRef}
          style={{ display: "none" }}
          autoPlay
          playsInline
          muted
        ></video>
      </div>
      <div className={style.spectatorList}>
        <Button>
          <img src={leftVector} alt="leftVector" />
        </Button>
        <Button>
          <img src={rightVector} alt="rightVector" />
        </Button>
      </div>
    </div>
  );
}

export default Spectator;
