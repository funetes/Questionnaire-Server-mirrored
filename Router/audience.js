const express = require("express");
const { Event, Question } = require("../models");
const { io } = require("../index");

const router = express.Router();

// 이벤트 입장
router.post("/join", (req, res) => {
  Event.findOne({
    where: {
      code_name: req.body.code_name,
    },
  }).then((data) => {
    if (!data) {
      res.status(409).json({ result: "fail" });
    } else {
      Question.findAll({
        where: {
          eventId: data.id,
        },
      }).then((data) => {
        res.status(200).json(data);
      });
    }
  });
});

/*
청중 입장 후 
1. 여게어사 바로 질문리스트를 다 쏴줄것인지 
2. 이벤트아이디만 주고 다시 /event/:id 쪽으로 질문리스트 get 요청 보내라고 할 지 
논의 필요
*/


module.exports = router;

/* Join Table (Event-Question)
      Event.findAll({
        include: [
          {
            model: Question,
          },
        ],
        where: {
          id: event_id,
        },
      })
      .then(data => console.log(data));

*/
