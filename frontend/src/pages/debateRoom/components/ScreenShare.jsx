import React, { useState, useEffect, useRef } from "react";
import { Button } from 'react-bootstrap';
import style from '../debatePage.module.css';
import axios from 'axios'

function ScreenShare({ status, role }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const imageInputRef = useRef();

    const handleImageChange = async(event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
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
                // 이후 필요한 작업 수행
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
