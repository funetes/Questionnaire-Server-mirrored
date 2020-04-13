const jwt = require("jsonwebtoken");
const { Presentor } = require("../models");


const verification = function (req, res, next) {

  /*
  1. 프레젠터 : 로그인 토큰 인증
  2. 프레젠터 : 회원가입
  3. 청중 (코드입장)
  */
    console.log('***************************************', req)
    const token = req.headers.authorization
      ? req.headers.authorization.slice(7)
      : null;
  
    if (!token) {
      // console.error(err.stack);
      // res.status(401).send({ result : 'fail'})
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