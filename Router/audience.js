const express = require('express');
const { Event } = require('../models');
const { io } = require('../index')

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
        res.status(200).json({ eventId: data.id });

        const namespace1 = io.of('/:eventid');
        namespace1.on('connection', (socket) => {
          namespace1.emit('news', { hello: 'Someone connected at namespace1' });
        });
      }
    });
});


/*
// NameSpace 1번
const namespace1 = io.of('/:eventid');
// connection을 받으면, news 이벤트에 hello 객체를 담아 보낸다
namespace1.on('connection', (socket) => {
  namespace1.emit('news', { hello: 'Someone connected at namespace1' });
});
*/


module.exports = router;
