import React, { createContext, useContext, useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import { SOCKET_BASE_URL } from "./config";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS(SOCKET_BASE_URL);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      setStompClient(client);
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
      if (socket.readyState === 1) {
        // <-- This is important
        socket.close();
      }
    };
    // eslint-disable-next-line
  }, []);

  return (
    <SocketContext.Provider value={stompClient}>
      {children}
    </SocketContext.Provider>
  );
}

export function useStompClient() {
  return useContext(SocketContext);
}
