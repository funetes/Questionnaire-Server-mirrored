const jwt = require("jsonwebtoken");
const { Presentor } = require("../models");


const verification = function (req, res, next) {


    // console.log('***************************************', req)
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
            // 인증이 되면 req 객체에 user 라는 프로퍼티 만들어줌
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