const express = require('express');
const { Event } = require('../models');

const router = express.Router();


// 이벤트 생성
router.post('/create', (req, res) => {
  // eventname, user_id, codename
  const user_id = req.user;
  const eventname = req.body.eventname;
  const codename = req.body.code_name;

  Event.findOrCreate({
    where: {
      eventname,
    },
    defaults: {
      code_name: codename,
      presentorId: user_id,
    },
  })
    .then((instance, exist) => {
      if (exist) {
        res.status(409).json({ result: 'fail' });
      } else {
        res.status(200).json({ result: 'success' });
      }
    });
});

/*
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
*/


// 이벤트 리스트 불러오기
router.get('/list', (req, res) => {
  res.send('hello');
});

// 질문 리스트 불러오기
router.get('/questions', (req, res) => {
  console.log('this is token : ', req.headers.authorization);


  res.send('hello');
});


module.exports = router;
