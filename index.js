require("dotenv").config();
const express = require("express");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require("cors");

const port = process.env.PORT;
const bodyParser = require("body-parser");
const morgan = require("morgan");
 
const { Event, Question, AuthKey, Like } = require("./models");

const audience = require("./Router/audience");
const event = require("./Router/event");
const presentor = require("./Router/presentor");
const user = require("./Router/user");

const verification = require("./Middlewares/verification");

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors({ credentials: true, origin : 'http://localhost:3000' }));
app.use(verification);

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.use("/user", user);
app.use("/audience", audience);
app.use("/presentor", presentor);
app.use("/event", event);


const authKeyGenerator = () => {
  return String(Math.floor(Math.random() * Math.pow(10,9)));
};

io.on("connect", (socket) => {
  
  console.log('connected');
  let newAuthKey = authKeyGenerator();

  socket.on("join", ({ eventId, authKey }) => {
    if(!authKey){
      AuthKey.findOrCreate({
        where : { authKey : newAuthKey }})
      .then(() => {
        socket.emit('authKey', { newAuthKey });
      });
    } else {
      AuthKey.findOne({ where : { authKey }})
        .then(data => {
          if(!data){
            return socket.emit('needNewKey', { result : false });
          } 
        })
    };

    Event.findOne({ where : {
      id : eventId
    }})
    .then( data => {
      if(!data){
        socket.emit('notfound', { result : 'event not found'})
      } else {
        let eventId = data.id
        socket.join(eventId);
  
        Question.findAll( { where : { eventId }})
        .then(data => {
          io.to(eventId).emit('allMessages', { data })
        });
      };      
    });
  }); 

  socket.on('sendMessage', ({ eventId, content, authKey }) => {
    eventId = parseInt(eventId);
    Question.create({
      questioner : authKey,
      content,
      eventId
    })
    .then( () => {
      return Question.findAll( { where : { eventId }})
    })
    .then(data => {
      io.to(eventId).emit('allMessages', { data })
    });
  })

  socket.on('sendAnswered', ({ boolean, questionId, eventId }) => {
    Question.update(
      { answered : boolean },
      { where : { id : questionId }}
    )
    .then(() => {
      return Question.findAll( { where : { eventId }})
    })
    .then(data => {
      io.to(eventId).emit('allMessages', { data })
    })
  });

  socket.on('sendLike', ({ authKey, questionId, eventId }) => {
    Like.findOrCreate( { where : {
      questionId,
      audience_id : authKey
    },
    defaults : {
      like : true
    }
  })
  .spread((instance, created) => {
    if(created){
      Question.findAndCountAll({
          include : [ {
            model : Like,
            required : true,
            where : { like : true , questionId : instance.questionId }
          }],
      })
      .then(data => {
        Question.update(
          { numberOfLikes : data.count },
          { where : { id : questionId }}
        )
        .then(() => {
          Question.findAll( { where : { eventId }})
          .then(data => {
            io.to(eventId).emit('allMessages', { data })
          });
        })
      });
    } else {      
      Like.update(
        { like : !instance.like},
        { where : {
          id : instance.id
        }}
      )
      .then(() => {
        Question.findAndCountAll({
          include : [ {
            model : Like,
            required : true,
            where : { like : true , questionId : instance.questionId }
          }],
      })
      .then(data => {
        Question.update(
          { numberOfLikes : data.count },
          { where : { id : questionId }}
        )
        .then(() => {
          Question.findAll( { where : { eventId }})
          .then(data => {
            io.to(eventId).emit('allMessages', { data })
          });
        })
      });
      })
    }
  })
  });
});

http.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

