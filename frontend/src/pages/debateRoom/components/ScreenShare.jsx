import { useState, useEffect, useRef } from "react";
import style from "../debatePage.module.css";
import axios from "axios";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useStompClient } from "../../../SocketContext";

function ScreenShare({ status, roomId, role }) {
  const stompClient = useStompClient();
  const [imgFileName, setImgFileName] = useState(null);
  const imageInputRef = useRef();

  useEffect(() => {
    if (stompClient) {
      stompClient.subscribe(`/from/room/file/${roomId}`, (message) => {
        const messageData = JSON.parse(message.body);
        setImgFileName(messageData.filePath);
      });
      console.log(imgFileName);
    }
  }, [stompClient, imgFileName, roomId]);

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
      stompClient.send(`/to/room/file/${roomId}`, JSON.stringify(stompMessage));
    } catch (error) {
      console.error("이미지 업데이트 오류:", error);
    }
  };

  const handleRemoveImage = () => {
    const stompMessage = { filePath: null };
    stompClient.send(`/to/room/file/${roomId}`, JSON.stringify(stompMessage));
  };

  console.log(imgFileName);
  return (
    <div>
      <div className={style.screenShare}>
        {imgFileName ? (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>클릭 시, 사진 공유가 취소됩니다</Tooltip>}
          >
            <img
              src={`https://goldenteam.site/profiles/${imgFileName}`}
              alt="Uploaded"
              className={style.shareImg}
              onClick={() => {
                if (role === "participant") handleRemoveImage();
              }}
            />
          </OverlayTrigger>
        ) : (
          <div>
            <input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            {role === "participant" && (
              <button
                className={`${style.button} btn`}
                onClick={() => {
                  imageInputRef.current.click();
                }}
              >
                이미지 올리기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ScreenShare;
