import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from 'cors';

const port = 1234;
const app = express();
app.use(cors());
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // replace the value with the front-end base url
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);

    setInterval(() => {
      const message = {
        type: "initialize",
        severity: "info",
        message: "Initialize app works"
      }
      console.log(message);
      io.to(roomId).emit('message', message); // Emit to specific room
    }, 10000);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(port, () => console.log(`Connected to ${port}`));
