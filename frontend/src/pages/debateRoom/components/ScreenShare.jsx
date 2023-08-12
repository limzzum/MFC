import React, { useState, useEffect, useRef } from "react";
import style from '../debatePage.module.css';
import { Button } from 'react-bootstrap';
import SockJS from "sockjs-client";
import Stomp from "webstomp-client"; 
import axios from 'axios'

function ScreenShare({ roomId, role }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imgFileName, setImgFileName] = useState("")  
    const imageInputRef = useRef();
    const stompRef = useRef(null);

    useEffect(() => {
        var sock = new SockJS("http://localhost:8081/mfc");
        var stomp = Stomp.over(sock);
        stomp.connect({}, function () {
    // 이 부분 조금 수상 재참조하고, 구독하는 부분
        stompRef.current = stomp;  
        stomp.subscribe(`/from/room/file/${roomId}`, (message) => {
        console.log(JSON.parse(message.body));
    // 이전 메시들에 새로운 메시지를 추가해서 chatMessages를 업데이트
        setImgFileName(message.data);
          });
        });
        
        return () => {
          if (stompRef.current) {
            stompRef.current.disconnect();
          }
        };
      }, [roomId, imgFileName]);

    const handleImageChange = async(event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
        
        // 이미지 등록 서버 저장
        const config = {
            headers: {
              "Content-Type": "multipart/form-data",
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
                // const imageFileName  = response.data.data
                const stompMessage = JSON.stringify({ img: file })
                console.log(stompMessage)
                stompRef.current.send("/to/room/file/{roomId}", {}, stompMessage);
            } catch (error) {
                console.error("이미지 업데이트 오류:", error);
            }
        };
    
    const handleRemoveImage = () => {
        setSelectedImage(null);
    };

    return (
        <div>
            <div className={style.screenShare}>
                {selectedImage ? (
                    <div className={style.uploadedContainer}>
                        <img
                            src={URL.createObjectURL(selectedImage)}
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
                        <Button onClick={() => imageInputRef.current.click()}>
                            이미지 올리기
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ScreenShare;
