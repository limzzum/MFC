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

  const chatAreaRef = useRef();
  const stompRef = useRef(null);

  useEffect(() => {
    const userNickname = userInfo.nickname;
    // 웹 소켓 연결
    var sock = new SockJS("http://localhost:8081/mfc");
    // var sock = new SockJS("https://goldenteam.site/mfc");
    var stomp = webstomp.over(sock);
    stompRef.current = stomp;
    stomp.connect({}, function (frame) {
    // 여기까지 연결 확인

      //4. subscribe(path, callback)으로 메세지를 받을 수 있음
      stomp.subscribe(`/from/chat/${roomId}`, (message) => {

        // console.log('itwas',{message})
        const content = message.body;
        // console.log('itis',{content})
        setChatMessages((prevMessage) => [...prevMessage, { sender: content.nickName, text: content.message }]);
      });

      //3. send(path, header, message)로 메세지를 보낼 수 있음
      stomp.send("/to/chat", {}, { roomId :roomId, nickName: userNickname, message: "테스트다" });
      console.log(stomp.nickName)
    });

    return () => {
      if (stomp.current) {
        stomp.disconnect();
      }
    };
  }, [roomId, userInfo.nickname]);

  const handleInputChange = (event) => {
    // input 값이 입력될 때마다 갱신
    setInputText(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputText.trim() !== "") {
      stompRef.current.send(
        "/to/chat",
        {},
        {
          roomId : roomId,
          nickName: userInfo.nickname,
          message: inputText,
        }
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
                            message.sender === userInfo.nickname ? style.userMessage : style.otherMessage
                        }`}
                    >
                        <p className={style.sender}>{message.sender === userInfo.nickname ? "나" : `${message.sender}`}</p>
                        <p className={style.sender}>{message.sender === userInfo.nickname ? "나" : `${message.sender}`}</p>

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
