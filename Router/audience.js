const express = require('express');

const router = express.Router();

// 이벤트 입장
router.post('/join', (req, res) => {
  res.send('hello');
});

// 질문 리스트 불러오기
router.get('/questions', (req, res) => {
  res.send('hello');
});


module.exports = router;
