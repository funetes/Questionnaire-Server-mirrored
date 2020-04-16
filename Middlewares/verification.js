const jwt = require("jsonwebtoken");
const { Presentor } = require("../models");

const verification = function (req, res, next) {
    const token = req.headers.authorization
      ? req.headers.authorization.slice(7)
      : null;
  
    if (!token) {
      next();
    } else {
      const decoded = jwt.verify(token, "shhhhh");
      Presentor.findOne({
        where: {
          username: decoded.username,
          email: decoded.email,
        },
      })
        .then((data) => {
          if (data) {
            req.user = data.id;
          }
          next();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  
  module.exports = verification;