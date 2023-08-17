import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const port = 1234;
const app = express();
app.use(cors());
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000' // replace the value with the front-end base url
  }
});

function getRandomInt() {
  return Math.floor(Math.random() * 5);
}
const messageTemplates = [
  {
    type: 'initialize',
    severity: 'info',
    message: 'Initialize app works'
  },
  {
    type: 'build',
    severity: 'info',
    message: 'Build message'
  },
  {
    type: 'deploy',
    severity: 'info',
    message: 'Deployment message'
  },
  {
    type: 'cleanup',
    severity: 'info',
    message: 'Cleanup update'
  },
  {
    type: 'postProcess',
    severity: 'info',
    message: 'Post-processing in the works'
  }
];

io.on('connection', socket => {
  console.log('A user connected');

  socket.on('joinRoom', roomId => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);

    setInterval(() => {
      const randomIndex = getRandomInt();
      const randomMessage = messageTemplates[randomIndex];
      const log = { ...randomMessage, dateTime: new Date().toLocaleTimeString() }; // we could send the date from the backend as well
      io.to(roomId).emit('message', log); // Emit to specific room
    }, 1000);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(port, () => console.log(`Connected to ${port}`));
