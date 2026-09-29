import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = (onNewOrder, onStatusUpdate) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    socketRef.current = io(socketUrl, { transports: ['websocket'] });

    socketRef.current.on('connect', () => {
      console.log('[Socket] Connected:', socketRef.current.id);
    });

    if (onNewOrder) {
      socketRef.current.on('newOrder', onNewOrder);
    }

    if (onStatusUpdate) {
      socketRef.current.on('orderStatusUpdated', onStatusUpdate);
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, []); // eslint-disable-line

  return socketRef;
};

export default useSocket;
