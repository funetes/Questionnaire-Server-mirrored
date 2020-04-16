const express = require("express");
const { Event } = require("../models");

const router = express.Router();

router.post("/join", (req, res) => {
  Event.findOne({
    where: {
      code_name: req.body.code_name,
    },
  }).then((data) => {
    if (data) {
      res.status(200).json({ eventId : data.id });
    } else {
      res.status(203).json({ result : 'fail'})
    }
  })
  .catch(err => {
    res.status(500).json({ result : 'fail'})
  })
});

module.exports = router;
