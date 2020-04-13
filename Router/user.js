const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { Presentor } = require('../models');

const router = express.Router();

// 회원가입
router.post('/signup', (req, res) => {
  const { body } = req;
  Presentor.findOrCreate({
    where: {
      email: body.email,
    },
    defaults: {
      username: body.username,
      password: crypto.createHmac('sha256', body.password).digest('hex'),
    },
  })
  .spread( (instance, created) => {
    if(!created){
      res.status(409).json({ result: 'fail' });
    } else {
      res.status(200).json({ result: 'success' });
    }
  })
});


// 로그인
router.post('/signin', (req, res) => {
  const { body: { email, password } } = req;
  Presentor.findOne({
    where: {
      email,
      password: crypto.createHmac('sha256', password).digest('hex'),
    },
  })
    .then((data) => {
      if (data === null) {
        // 응답 변경 후 API 변경 필요할듯
        res.status(204).send('hello');
      } else {
        const token = jwt.sign({ username: data.username, email: data.email }, 'shhhhh', { expiresIn: '10h' });
        // client에서 fetch 요청 보낼 때에는 Bearer 세팅 해줘야 함 : https://gist.github.com/egoing/cac3d6c8481062a7e7de327d3709505f
        res.status(200).json({ token, presentorId : data.id }); //아이디도 같이 요청!
      }
    })
    .catch((err) => {
      console.log(err);
    });
});


module.exports = router;
