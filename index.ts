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
      const message = `Message from server at ${new Date().toLocaleTimeString()} in room ${roomId}`;
      io.to(roomId).emit('message', message); // Emit to specific room
    }, 4000);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// // example function
// const getMessage = (appId: string) => {
//   // something happens, which after we have to send the stream message to the client
//   // ...
//   console.log("get message")
//   // emit a message to the client(s), who have previously joined a room with a name of the app id
//   io.to(appId) // change 'appId' here with the actual application id as string
//     .emit("newStatus", {
//       severity: "SEVERITY", // replace 'SEVERITY' with 'info', 'warning', 'error', 'success'
//       message: "Example", // replace 'Example' with status message
//     });
// };

// app.post("/trigger-message/:appId", (req, res) => {
//   const { appId } = req.params;
//   getMessage(appId);
// });

server.listen(port, () => console.log(`Connected to ${port}`));
