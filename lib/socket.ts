import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket && typeof window !== "undefined") {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_API_ENDPOINT, {
      autoConnect: false,
      withCredentials: true, // VERY important
      transports: ["websocket"],
    });
  }

  return socket;
};
