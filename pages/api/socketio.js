import { Server } from 'socket.io';

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log('🛠️ Initializing Socket.IO...');
    const io = new Server(res.socket.server, {
      path: '/api/socketio',
    });

    io.on('connection', (socket) => {
      console.log(`✅ [Socket Connected]: ${socket.id}`);

      socket.on('student-presence', (student) => {
        console.log('📥 Received student:', student);
        socket.broadcast.emit('new-student', student);
      });

      socket.on('disconnect', () => {
        console.log(`❌ Disconnected: ${socket.id}`);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('⚠️ Socket.IO already running');
  }

  res.end();
}
