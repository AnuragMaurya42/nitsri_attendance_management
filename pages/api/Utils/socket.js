const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("A client connected:", socket.id);

    socket.on("student-signal", (data) => {
      // Broadcast the student signal to all connected clients
      io.emit("student-signal", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Server is running on https://nitsri-attendance-management.vercel.app/`);
  });
});
