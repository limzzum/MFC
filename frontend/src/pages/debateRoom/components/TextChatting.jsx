import React, { useState, useRef, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
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
    // https://goldenteam.site
    const SockJs = new SockJS("https://goldenteam.site/mfc", {
      transports: ["websocket"],
      headers: {
        //   // 필요한 헤더 추가
        Origin: "https://goldenteam.site",
      },
      withCredentials: true,
    });
    const stomp = Stomp.over(SockJs);
    stompRef.current = stomp;

    stomp.connect({}, () => {
      stomp.subscribe(`/from/chat/${roomId}`, (message) => {
        const content = JSON.parse(message.body);

        setChatMessages((prevMessage) => [
          ...prevMessage,
          { nickName: content.nickName, message: content.message },
        ]);
      });

      stomp.send(
        "/to/chat",
        {},
        JSON.stringify({ roomId, nickName: userNickname })
      );
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
                message.nickname === "user"
                  ? style.userMessage
                  : style.otherMessage
              }`}
            >
              <p className={style.sender}>
                {message.sender === "user" ? "나" : `${message.sender}`}
              </p>
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
