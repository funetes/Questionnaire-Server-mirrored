const express = require('express');

const router = express.Router();

// 회원가입
router.post('/signup', (req, res) => {
  res.send('hello');
});

// 로그인
router.post('/signin', (req, res) => {
  res.send('hello');
});


module.exports = router;
