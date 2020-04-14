const express = require("express");
const { Event } = require("../models");

const router = express.Router();

// 이벤트 입장
router.post("/join", (req, res) => {
  Event.findOne({
    where: {
      code_name: req.body.code_name,
    },
  }).then((data) => {
    console.log('this is data : ', data)
    if (data) {
      res.status(200).json({ eventId : data.id });
    } else {
      res.status(203).json({ result : 'fail'})
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ result : 'fail'})
  })
});

module.exports = router;
