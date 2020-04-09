require('dotenv').config();
const audience = require('./Router/audience');
const jwt = require('jsonwebtoken');

const express = require('express');


const app = express();
const http = require('http').createServer(app);
const cors = require('cors');

const port = process.env.PORT;
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { Presentor } = require('./models');
const user = require('./Router/user');
const presentor = require('./Router/presentor');

const verification = function (req, res, next) {
  // console.log('this is req : ', req )
  const token = req.headers.authorization;
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
    .catch(err => {
      console.log(err)
    });
};


app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors({
  credentials: true,
}));
app.use(verification);


// 라우팅
app.use('/user', user);
app.use('/audience', audience);
app.use('/presentor', presentor);


http.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
