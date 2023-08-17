import React, { useState, useRef, useEffect } from "react";
import { userInfoState } from "../../../recoil/userInfo";
import style from "../debatePage.module.css";
import { useRecoilValue } from "recoil";
import { Form, InputGroup } from "react-bootstrap";
import { useStompClient } from "../../../SocketContext";

function TextChatting({ roomId }) {
  const [inputText, setInputText] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const userInfo = useRecoilValue(userInfoState);

  // 이 부분 다시 보기 / 채팅을 재참조하는 부분
  const chatAreaRef = useRef();

  const stompClient = useStompClient();

  useEffect(() => {
    if (stompClient) {
      // 여기에서 stompClient를 사용하여 작업 수행
      stompClient.subscribe(`/from/chat/${roomId}`, (message) => {
        const content = JSON.parse(message.body);
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { sender: content.nickName, text: content.message },
        ]);
      });

      stompClient.subscribe(`/from/chat/penalty/${roomId}`, (message) => {
        const content = JSON.parse(message.body);
        const penaltyResult = {
          nickName: content.userName,
          penalty: content.penaltyName,
          point: content.points,
        };
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        console.log(content);
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { sender: "admin", text: penaltyResult },
        ]);
      });
    }
  }, [stompClient, roomId]);

  useEffect(() => {
    chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
  }, [chatMessages]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSendMessage = () => {
    if (stompClient && inputText.trim() !== "") {
      // 여기에서 stompClient를 사용하여 작업 수행
      stompClient.send(
        "/to/chat",
        JSON.stringify({
          roomId: `${roomId}`,
          nickName: userInfo.nickname,
          message: inputText,
        })
      );
      // heejeong : 패널티 소켓 테스트하려고 해놓은 것임.
      stompClient.send(
        "/to/chat/penalty",
        JSON.stringify({
          roomId: `${roomId}`,
          userId: 329,
          isATopic: true,
          penaltyCodeId: 2,
        })
      );
      setInputText("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSendMessage();
      event.preventDefault(); // prevent the default action (newline) from happening
    }
  };

  return (
    <>
      <div>
        <div className={style.ChatArea}>
          <div className={style.chatMessages} ref={chatAreaRef}>
            {chatMessages.map((message, index) =>
              message.sender === "admin" ? (
                <p className={style.penaltyChat} key={index}>
                  <strong>
                    플레이어&nbsp;[{message.text.nickName}]&nbsp;::&nbsp;
                    {message.text.penalty}&nbsp; -{message.text.point}점
                  </strong>
                </p>
              ) : (
                <div
                  key={index}
                  className={`${style.messageContainer} ${
                    message.sender === userInfo.nickname
                      ? style.userMessage
                      : style.otherMessage
                  }`}
                >
                  <p className={`${style.sender}`}>
                    {message.sender === userInfo.nickname
                      ? "나"
                      : message.sender}
                  </p>
                  <div className={style.messageBubble}>{message.text}</div>
                </div>
              )
            )}
          </div>
        </div>
        <div className={style.chatInput}>
          <InputGroup>
            <Form.Control
              placeholder="메시지를 입력하세요"
              value={inputText}
              onChange={handleInputChange}
              className={style.inputChat}
              onKeyPress={handleKeyPress}
              style={{
                borderColor: "var(--blue-500)",
                borderTopLeftRadius: "0px",
                borderTopRightRadius: "0px",
                fontSize: "16px",
              }}
            />
            <button
              className={`${style.inputBtn} btn`}
              onClick={handleSendMessage}
            >
              전송
            </button>
          </InputGroup>
        </div>
      </div>
    </>
  );
}

export default TextChatting;
