const express = require('express');
const { Event } = require('../models');

const router = express.Router();


// 이벤트 생성
router.post('/create', (req, res) => {
  // eventname, user_id, codename
  const user_id = req.user;
  const { eventname } = req.body;
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
        res.status(200).json({ result: 'success', eventId: instance.id });
      }
    });
});

// 이벤트 리스트 불러오기
router.get('/list', (req, res) => {
  const user_id = req.user;
  Event.findAll({
    where: {
      presentorId: user_id,
    },
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).end();
    });
});


module.exports = router;
