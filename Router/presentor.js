const express = require('express');
const { Event } = require('../models');

const router = express.Router();

router.post('/create', (req, res) => {
  const { eventname, codename } = req.body

  if(!req.user){
    res.status(404).json({ result : 'fail'});
  } else {
    Event.findOrCreate({
      where: {
        code_name: codename,
      },
      defaults: {
        eventname,
        presentorId: req.user,
      },
    })
      .spread((instance, created) => {
        if(!created){
          res.status(409).json({ duplicated: true });
        } else {
          res.status(200).json({ result: 'success', eventId: instance.id });
        }
      })
      .catch(err => {
        res.status(500).json( { result : 'internal error '})
      });
  }

});

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
