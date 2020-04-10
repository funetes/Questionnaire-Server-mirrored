const express = require('express');
const { Event } = require('../models');

const router = express.Router();

// 이벤트 입장
router.post('/join', (req, res) => {
  Event.findOne({
    where: {
      code_name: req.body.code_name,
    },
  })
    .then((data) => {
      if (!data) {
        res.status(409).json({ result: 'fail' });
      } else {
        // data.id 를 이용해서 리다이렉션 + 해당 이벤트 질문들 쏴주기
        res.status(200).json(data);
      }
    });
});


module.exports = router;