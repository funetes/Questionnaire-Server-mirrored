require("dotenv").config();
const audience = require("./Router/audience");
const jwt = require("jsonwebtoken");
const express = require("express");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require("cors");

const port = process.env.PORT;
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { Presentor, Question } = require("./models");
const user = require("./Router/user");
const presentor = require("./Router/presentor");
const event = require("./Router/event");

const verification = function (req, res, next) {
  const token = req.headers.authorization
    ? req.headers.authorization.slice(7)
    : null;

  if (!token) {
    next();
  } else {
    const decoded = jwt.verify(token, "shhhhh");
    Presentor.findOne({
      where: {
        username: decoded.username,
        email: decoded.email,
      },
    })
      .then((data) => {
        if (data) {
          req.user = data.id;
        }
        next();
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

app.set("socketio", io);

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(
  cors({
    credentials: true,
  })
);
app.use(verification);

// for socketio routing
app.set("socketio", io);

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

// 라우팅
app.use("/user", user);
app.use("/audience", audience);
app.use("/presentor", presentor);
app.use("/event", event);

// socketIO
io.on("connect", (socket) => {
  // Join 이벤트 수신
  socket.on("join", ({ name, room }) => {
    // room 이라는 namespace 만들기
    socket.join(room);

    // 해당 namespace에게 데이터 쏘기
    io.to(room).emit("roomData", {
      room,
      name
    });
  });

  // sendMessage 이벤트 수신
  socket.on("sendMessage", ({ message, room}) => {
    // 받은 메세지를 namespace 내 전체 emit
    io.to(room).emit("message", { text: message });

  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

http.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

module.exports = io;

/*
 식별:cookie?

 글쓰기
 - client에서 post_create 이벤트 emit
 - 서버에서 post_create 이벤트 on
 - 받은 데이터 바탕으로 post_update 이벤트 emit
 - client에서는 post_updated 이벤트 on

  좋아요
 - client에서 like_create 이벤트 emit
 - 서버에서 like_create 이벤트 on
 - 받은 데이터 바탕으로 like_update 이벤트 emit
 - client에서는 like_updated 이벤트 on


});
*/
