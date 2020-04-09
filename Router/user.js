const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { Event } = require('../models');

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
  }).then((instance, exist) => {
    if (exist) {
      res.status(409).json({ result: 'fail' });
    } else {
      res.status(200).json({ result: 'success' });
    }
  });
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
        res.status(204).send('hello');
      } else {
        const token = jwt.sign({ username: data.username, email: data.email }, 'shhhhh', { expiresIn: '10h' });

        res.set(
          'Authorization', `Bearer ${token}`,
        );
        res.status(200).json({ token });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});


module.exports = router;
