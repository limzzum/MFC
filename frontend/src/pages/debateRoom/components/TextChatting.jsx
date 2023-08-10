import React, { useState, useRef, useEffect } from "react";
import SockJS from "sockjs-client";
import webstomp from "webstomp-client";
import { userInfoState } from "../../../recoil/userInfo";
import style from "../debatePage.module.css";
import { useRecoilValue } from "recoil";

function TextChatting({ roomId }) {
  const [inputText, setInputText] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const userInfo = useRecoilValue(userInfoState);

  console.log("userInfo: ", userInfo);

  const chatAreaRef = useRef();
  const stompRef = useRef(null);

  useEffect(() => {
    const userNickname = userInfo.nickname;
    

    //우선 여기로 테스트
    var sock = new SockJS("http://localhost:8081/mfc");


    // var sock = new SockJS("https://goldenteam.site/mfc");
    var stomp = webstomp.over(sock);
    stompRef.current = stomp;

    stomp.connect({}, function (frame) {
      console.log("STOMP Connection");

      //4. subscribe(path, callback)으로 메세지를 받을 수 있음
      stomp.subscribe(`/from/chat/${roomId}`, (message) => {
        const content = JSON.parse(message.body);

        setChatMessages((prevMessage) => [...prevMessage, { nickName: content.nickName, message: content.message }]);
      });

      //3. send(path, header, message)로 메세지를 보낼 수 있음
      stomp.send("/to/chat", {}, ({ roomId, nickName: userNickname, message: "테스트다" }));
    });

    return () => {
      if (stomp.current) {
        stomp.disconnect();
      }
    };
  }, [roomId, userInfo.nickname]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputText.trim() !== "") {
      stompRef.current.send(
        "/to/chat",
        {},
        JSON.stringify({
          roomId,
          nickName: userInfo.nickname,
          message: inputText,
        })
      );
      setInputText("");
    }
  };

  // // 메시지 받는 경우 테스트를 위한 함수
  // const handleReceiveMessage = () => {
  //     setChatMessages((prevMessage) => [
  //         ...prevMessage,
  //         {text: "메시지 받는거 테스트", sender: "other"},
  //     ]);
  // };

  // 새 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
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
                message.nickname === "user" ? style.userMessage : style.otherMessage
              }`}
            >
              <p className={style.sender}>{message.sender === "user" ? "나" : `${message.sender}`}</p>
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
        {/* <button onClick={handleReceiveMessage}>Receive Test</button> */}
      </div>
    </>
  );
}

export default TextChatting;
