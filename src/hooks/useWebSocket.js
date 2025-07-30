import { useEffect, useRef } from 'react';

export default function useWebSocket(onMessage) {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:8080/ws/turnos');

    socketRef.current.onmessage = (event) => {
      onMessage(JSON.parse(event.data));
    };

    return () => {
      socketRef.current.close();
    };
  }, [onMessage]);
}