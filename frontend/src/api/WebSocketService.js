import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import { BASE_URL } from "../config";

// const baseUrl = "http://localhost:8081/mfc";    // 얘는 로컬 테스트용으로 사용
const baseUrl = `${BASE_URL}`; // 푸시할 때는 이 주소로 변경

const WebSocketService = () => {
  const chatStompClientRef = useRef(null);
  const fileStompClientRef = useRef(null);
  const playerStompClientRef = useRef(null);

  const connectChat = (roomId, onMessageReceived) => {
    if (chatStompClientRef.current) {
      return;
    }
    const chatSocket = new SockJS(baseUrl);
    chatStompClientRef.current = Stomp.over(chatSocket);

    chatStompClientRef.current.connect({}, () => {
      console.log("Chat WeobSocket connected");
      chatStompClientRef.current.subscribe(
        `/from/chat/${roomId}`,
        (message) => {
          const content = JSON.parse(message.body);
          onMessageReceived({
            sender: content.nicknName,
            text: content.message,
          });
        }
      );
    });
  };

  const connectFile = (roomId, onFileReceived) => {
    if (fileStompClientRef.current) {
      return;
    }

    const fileSocket = new SockJS(baseUrl);
    fileStompClientRef.current = Stomp.over(fileSocket);

    fileStompClientRef.current({}, () => {
      console.log("File WebSocket connected");
      fileStompClientRef.current.subscribe(
        `/from/room/file/${roomId}`,
        (message) => {
          const content = JSON.parse(message.body);
          onFileReceived(content.data);
        }
      );
    });
  };

  const connectPlayer = (roomId, onPlayerReceived) => {
    if (playerStompClientRef.current) {
      return;
    }

    const playerSocket = new SockJS(baseUrl);
    playerStompClientRef.current = Stomp.over(playerSocket);

    playerStompClientRef.current({}, () => {
      console.log("Player WebSocket connected");
      playerStompClientRef.current.subscribe(
        `/from/room/player/${roomId}`,
        (message) => {
          const content = JSON.parse(message.body);
          onPlayerReceived(content.data);
        }
      );
    });
  };

  const handleSendMessage = (roomId, userInfo, inputText) => {
    if (chatStompClientRef.current && inputText.trim() !== "") {
      chatStompClientRef.current.send(
        "to/chat",
        JSON.stringify({
          roomId: roomId,
          nickName: userInfo.nickName,
          message: inputText,
        })
      );
    }
  };

  const postPlayer = (roomId, userInfo, isTopicA) => {
    if (playerStompClientRef.current) {
      playerStompClientRef.current.send(
        "to/player/enter",
        JSON.stringify({
          roomId: roomId,
          nickName: userInfo.nickName,
          isTopicA: isTopicA,
        })
      );
    }
  };

  const disconnectChat = () => {
    if (chatStompClientRef.current) {
      chatStompClientRef.current.disconnect();
      chatStompClientRef.current = null;
    }
    if (fileStompClientRef.current) {
      fileStompClientRef.current.disconnect();
      fileStompClientRef.current = null;
    }
    if (playerStompClientRef.current) {
      playerStompClientRef.current.disconnect();
      playerStompClientRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      disconnectChat();
    };
  }, []);

  return {
    connectChat,
    connectFile,
    connectPlayer,
    handleSendMessage,
    postPlayer,
  };
};

export default WebSocketService;
