require('dotenv').config();
const { Presentor } = require('./models');
const audience = require('./Router/audience')
const presentor = require('./Router/presentor')
const user = require('./Router/user')

const express = require('express');

const app = express();
const http = require('http').createServer(app);
const crypto = require('crypto');
const cors = require('cors');

const port = process.env.PORT;
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors({
  credentials: true,
}));

// 라우팅
app.use('/audience', audience);
app.use('/presentor', presentor);
app.use('/user', user);



// 회원가입
app.post('/', (req, res) => {
  const { body } = req;
  console.log('this is cookie : ', req.signedCookies);
  Presentor.findOrCreate({
    where: {
      email: body.email,
    },
    defaults: {
      username: body.username,
      password: crypto.createHmac('sha256', body.password).digest('hex'),
    },
  }).then((instance, exist) => {
    if (exist) {
      res.status(409).json({ result: 'fail' });
    } else {
      res.status(200).json({ result: 'success' });
    }
  });
});


http.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
