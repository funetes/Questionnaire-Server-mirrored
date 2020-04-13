const express = require('express');
const { Question } = require('../models');

const router = express.Router();

// 발표자, 청중 입장/로그인 시 질문 정보 보내주기
// 근데 여긴 그냥 인증 없이 정보 다 쏴줘도 상관 없을지? token/sessionId 있는 애들만 쏴줘야 하는거 아닌가

router.get('/:id', (req, res) => {
  const eventId = req.params.id;
  Question.findAll({
    where: {
      eventId,
    },
  })
    .then((data) => {
      if (data.length === 0) {
        res.status(200).json({ result: 'no questions' });
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});


module.exports = router;


// app.use('/event/:id', function (req, res, next) {
//   console.log('Request Type:', req.method);
//   next();
// });
