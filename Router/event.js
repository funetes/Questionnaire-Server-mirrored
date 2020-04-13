const express = require('express');
const { Question } = require('../models');

const router = express.Router();

// 발표자, 청중 실시간 소통 시 전체 정보 쏴주기

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