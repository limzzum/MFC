import React, { useState, useRef, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client"; // 올바르게 가져오기
import { userInfoState } from "../../../recoil/userInfo"; // Make sure to import userInfoState from the correct path
import style from "../debatePage.module.css";
import { useRecoilValue } from "recoil";

function TextChatting({ roomId }) {
  const [inputText, setInputText] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const userInfo = useRecoilValue(userInfoState);

  const chatAreaRef = useRef();
  const stompRef = useRef(null);

  useEffect(() => {
    // const userNickname = userInfo.nickname;
    var sock = new SockJS("http://localhost:8081/mfc");
    var stomp = Stomp.over(sock);

    stomp.connect({}, function () {
      stompRef.current = stomp;
      console.log("WebSocket connected!");

      stomp.subscribe(`/from/chat/${roomId}`, (message) => {
        const content = JSON.parse(message.body);
        setChatMessages((prevMessages) => [...prevMessages, { sender: content.nickName, text: content.message }]);
      });
    });

    return () => {
      console.log("이건 되나?");
      if (stompRef.current) {
        stompRef.current.disconnect();
        console.log("WebSocket disconnected!");
      }
      console.log("WebSocket disconnected!"); // 연결 해제 확인을 위한 로그 출력
    };
  }, [roomId, userInfo.nickname]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSendMessage = () => {
    if (stompRef.current && inputText.trim() !== "") {
      stompRef.current.send(
        "/to/chat",
        JSON.stringify({
          roomId: `${roomId}`,
          nickName: userInfo.nickname,
          message: inputText,
        })
      );
      setInputText("");
      console.log("--------------");
      console.log(chatMessages);
    }
  };

  useEffect(() => {
    chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
  }, [chatMessages]);

  return (
    <>
      <div className={style.ChatArea}>
        <div className={style.chatMessages} ref={chatAreaRef}>
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={`${style.messageContainer} ${
                message.sender === userInfo.nickname ? style.userMessage : style.otherMessage
              }`}
            >
              <p className={style.sender}>{message.sender === userInfo.nickname ? "나" : message.sender}</p>
              <div className={style.messageBubble}>{message.text}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={style.chatInput}>
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          value={inputText}
          onChange={handleInputChange}
          className={style.inputChat}
        />
        <button className={style.button} onClick={handleSendMessage}>
          전송
        </button>
      </div>
    </>
  );
}

export default TextChatting;
