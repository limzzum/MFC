import { useState, useEffect, useRef } from "react";
import style from "../debatePage.module.css";
import { Button } from "react-bootstrap";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import axios from "axios";

function ScreenShare({ status, roomId, role }) {
  const [imgFileName, setImgFileName] = useState(null);
  const imageInputRef = useRef();
  const stompRef = useRef(null);

    useEffect(() => {
        var sock = new SockJS("https://goldenteam.site/mfc");
        // var sock = new SockJS("http://localhost:8081/mfc")
        var stomp = Stomp.over(sock);

    stompRef.current = stomp;

    stomp.connect({}, function () {
      // 이 부분 조금 수상 재참조하고, 구독하는 부분
      stomp.subscribe(`/from/room/file/${roomId}`, (message) => {
        const messageData = JSON.parse(message.body);
        setImgFileName(messageData.filePath);
      });
      console.log(imgFileName);
    });

    return () => {
      if (stompRef.current) {
        stompRef.current.disconnect();
      }
    };
  }, [roomId, imgFileName]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    // 이미지 등록 서버 저장
    const config = {
      headers: {
        "Content-Type": "multipanrt/form-data",
      },
    };
    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }
    try {
      const response = await axios.post(
        "https://goldenteam.site/api/debate/image",
        formData,
        config
      );
      console.log("이미지 업데이트 응답:", response.data);
      const filePath = response.data.data;
      const stompMessage = { filePath: `${filePath}` };
      stompRef.current.send(
        `/to/room/file/${roomId}`,
        JSON.stringify(stompMessage)
      );
    } catch (error) {
      console.error("이미지 업데이트 오류:", error);
    }
  };

  const handleRemoveImage = () => {
    const stompMessage = { filePath: null };
    stompRef.current.send(
      `/to/room/file/${roomId}`,
      JSON.stringify(stompMessage)
    );
  };

  console.log(imgFileName);
  return (
    <div>
      <div className={style.screenShare}>
        {imgFileName ? (
          <div className={style.uploadedContainer}>
            <img
              src={`https://goldenteam.site/profiles/${imgFileName}`}
              alt="Uploaded"
              className={style.uploadedImage}
              style={{ objectFit: "contain" }}
            />
            <Button variant="danger" onClick={handleRemoveImage}>
              이미지 제거
            </Button>
          </div>
        ) : (
          <div>
            <input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <button
              className={`${style.button} btn`}
              onClick={() => imageInputRef.current.click()}
            >
              이미지 올리기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScreenShare;
