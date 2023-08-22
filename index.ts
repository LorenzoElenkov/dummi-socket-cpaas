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
    origin: 'http://localhost:3000', // replace the value with the front-end base url
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
  // when the client connects to the socket server
  console.log('A user connected');
  // socket.handshake.auth.token is showing the idToken which is also used in API headers
  // we can check if the idToken is valid, if we need
  socket.on('joinRoom', appId => {
                                              // this 'joinRoom' is emitted from the client to the server, when
    socket.join(appId);                       // the user clicks the button on the UI that opens up the page with terminal logs for the specific app clicked
    console.log(`User joined room ${appId}`); // on line 51, the server expects the client to send a payload of type string, which is the application ID
                                              // on line 52, the server makes the client join a room of the application ID
    setInterval(() => {
      // this setInterval is just to test that client receives messages sent from the server
      const randomIndex = getRandomInt();
      const randomMessage = messageTemplates[randomIndex];
      const log = { ...randomMessage, dateTime: new Date().toLocaleTimeString() }; // we could send the date from the backend as well
      io.to(appId).emit('message', log);                                           // Server emits message only to clients in this `appId` room and `log` is the payload
    }, 1000);
  });

  socket.on('leaveRoom', appId => {
    //
    socket.leave(appId);
    console.log(`User left room ${appId}`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(port, () => console.log(`Connected to ${port}`));
