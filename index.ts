import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const port = 1234;
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000' // replace the value with the front-end base url
  }
});

io.on('connection', async socket => {
  socket.on('appId', appId => {
    // we make the socket (user) to join a room with a name of the app id
    socket.join(appId);
  });
});

// example function
const getMessage = () => {
  // something happens, which after we have to send the stream message to the client
  // ...
  // emit a message to the client(s), who have previously joined a room with a name of the app id
  io.to('appId') // change 'appId' here with the actual application id as string
    .emit('newStatus', 
    { severity: 'SEVERITY', // replace 'SEVERITY' with 'info', 'warning', 'error', 'success'
      message: 'Example' // replace 'Example' with status message
    });
};

server.listen(port, () => console.log(`Connected to ${port}`));
