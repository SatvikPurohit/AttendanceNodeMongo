
const Login = require('../models/login');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* check authentication */
exports.getAuth = (req, res, next) => {
  let getUser;
  let uName = req.body.uName;
  // Find bu uName and send JWT
  Login.findOne({
    uName
  }).then(user => {
    if (!user) {
      return res.status(401).json({
        message: "Authentication failed"
      });
    }
    getUser = user;
    //compare pwd
    return bcrypt.compare(req.body.password, user.password);
  }).then(response => {
    if (!response) {
      return res.status(401).json({
        message: "Authentication failed"
      });
    };
    //
    let jwtToken = jwt.sign(
      {
        uName: getUser.uName,
        role: getUser.role,
        userId: getUser._id
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "7 days"
      }
    );

    res.status(200).json({
      token: jwtToken,
      expiresIn: 604800,
      msg: getUser
    });
  }).catch(err => {
    return res.status(401).json({
      message: "Authentication failed"
    });
  });
};
