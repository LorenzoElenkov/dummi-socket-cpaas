import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const port = 1234;
const app = express();
const server = createServer(app);

const io = new Server(server);

io.on('connection', async socket => {
  socket.on('appId', raw => {
    // we make the socket (user) to join a room with a name of the app id
    const data = JSON.parse(raw);
    socket.join(data.appId);
  });
});

// emit a message to the client, who has previously joined a room with a name of the app id
io
  .to('appId') // change 'appId' here with the actual application id as string
  .emit('typeOfMessage', "Message content"); // change 'typeOfMessage' for example with 'success', 'warning', 'error', 'info'; second argument is the actual content to be streamed to the client

server.listen(port, () => console.log(`Connected to ${port}`));
