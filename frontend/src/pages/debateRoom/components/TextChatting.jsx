import React, { useState, useRef, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client"; 
import { userInfoState } from "../../../recoil/userInfo"; 
import style from "../debatePage.module.css";
import { useRecoilValue } from "recoil";

function TextChatting({ roomId }) {
  const [inputText, setInputText] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const userInfo = useRecoilValue(userInfoState);

// 이 부분 다시 보기 / 채팅을 재참조하는 부분
  const chatAreaRef = useRef();
  const stompRef = useRef(null);

  useEffect(() => {
    var sock = new SockJS("http://localhost:8081/mfc");
    var stomp = Stomp.over(sock);
    stomp.connect({}, function () {
// 이 부분 조금 수상 재참조하고, 구독하는 부분
      stompRef.current = stomp;  
      stomp.subscribe(`/from/chat/${roomId}`, (message) => {
        const content = JSON.parse(message.body);
// 이전 메시들에 새로운 메시지를 추가해서 chatMessages를 업데이트
        setChatMessages((prevMessages) => [...prevMessages, { sender: content.nickName, text: content.message }]);
      });
    });
    
    return () => {
      if (stompRef.current) {
        stompRef.current.disconnect();
      }
    };
  }, [roomId, userInfo.nickname]);

  useEffect(() => {
    chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
  }, [chatMessages]);


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
    }
  };

  

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
