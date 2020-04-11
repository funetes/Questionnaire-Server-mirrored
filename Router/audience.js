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
