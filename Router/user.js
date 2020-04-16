const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { Presentor } = require('../models');

const router = express.Router();

router.post('/signup', (req, res) => {
  const { body } = req;
  Presentor.findOrCreate({
    where: {
      email: body.email,
    },
    defaults: {
      username: body.username,
      password: crypto.createHmac('sha256', body.password).digest('hex'),
    },
  })
  .spread( (instance, created) => {
    if(!created){
      res.status(409).json({ result: 'fail' });
    } else {
      res.status(200).json({ result: 'success' });
    }
  })
});


router.post('/signin', (req, res) => {
  const { body: { email, password } } = req;
  Presentor.findOne({
    where: {
      email,
      password: crypto.createHmac('sha256', password).digest('hex'),
    },
  })
    .then((data) => {
      if (data === null) {
        res.status(204).send(null);
      } else {
        const token = jwt.sign({ username: data.username, email: data.email }, 'shhhhh', { expiresIn: '10d' });
        res.status(200).json({ token, presentorId : data.id , username : data.username});
      }
    })
    .catch((err) => {
      console.log(err);
    });
});


module.exports = router;
