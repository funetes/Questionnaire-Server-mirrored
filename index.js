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
const { Presentor, Event, Question } = require("./models");
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

  console.log('connected')
  // Join 이벤트 수신
  socket.on("join", ({ eventCode }) => {
    // room 이라는 namespace 만들기
    Event.findOne({ where : {
      code_name : eventCode
    }})
    .then( data => {
      let eventId = data.id
      socket.join(eventId);

      Question.findAll( { where : {
        eventId
      }})
      .then(data => {
        io.to(eventId).emit('allMessages', {
          data
        })
      })

    })
 
}) })

http.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

