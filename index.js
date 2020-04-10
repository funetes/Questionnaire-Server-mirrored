require('dotenv').config();
const audience = require('./Router/audience');
const jwt = require('jsonwebtoken');
const express = require('express');


const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');

const port = process.env.PORT;
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { Presentor, Question } = require('./models');
const user = require('./Router/user');
const presentor = require('./Router/presentor');
const event = require('./Router/event');

const verification = function (req, res, next) {
  const token = req.headers.authorization ? req.headers.authorization.slice(7) : null;

  if (!token) {
    next();
  } else {
    const decoded = jwt.verify(token, 'shhhhh');
    Presentor.findOne({
      where: {
        username: decoded.username,
        email: decoded.email,
      },
    })
      .then((data) => {
        if (data) {
          req.user = data.id;
        } next();
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors({
  credentials: true,
}));

app.use(verification);

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

// 라우팅
app.use('/user', user);
app.use('/audience', audience);
app.use('/presentor', presentor);
app.use('/event', event);


// SocketIO
// NameSpace 1번
const namespace1 = io.of('/:eventid');
// connection을 받으면, news 이벤트에 hello 객체를 담아 보낸다
namespace1.on('connection', (socket) => {
  namespace1.emit('news', { hello: 'Someone connected at namespace1' });
});




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


http.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
