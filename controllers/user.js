const User = require('../models/user');
const Moment = require('moment');


/* get all */
exports.getUsers = (req, res, next) => {
  User.find().then((users) => {
    res.send(users);
  }).catch((error) => {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving Users."
    });
  });
};

/* get one */
exports.getUser = (req, res, next) => {
  const userId = req.params.userId;

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "User not found "
        });
      }
      res.send(user);
    }).catch(err => {
      return res.status(500).send({
        message: "Error retrieving User "
      });
    });
};

exports.getUserAttendanceDates = (req, res, next) => {
  const userId = req.params.userId;  // URL Param
  // pass all or date range
  let period = req.query.period;
  let filterAll = period === 'all';
  let op = null;
  if (filterAll)
    op = User
      .findOne({ userId })
      .populate('attendances', 'date _id');

  op.then((attendanceDates) => {
    res.send(attendanceDates);
  }).catch((err) => {
    return res.status(500).send({
      message: err.message || "Could not mark attendance"
    });
  });
}

/* use POST for CREATE operations. */
exports.postUser = (req, res, next) => {

  const name = req.body.name;
  const lastName = req.body.lastName;
  const dob = req.body.dob;
  const email = req.body.email;
  const mobile = req.body.mobile;
  const imageUrl = req.body.imageUrl;
  const membershipStart = req.body.membershipStart;
  const membershipEnd = req.body.membershipEnd;
  const timeStamp = Moment().toDate(); // Created

  const user = new User({ name, lastName, dob, email, mobile, imageUrl, membershipStart, membershipEnd, timeStamp });

  user.save().then((result) => {
    console.log(result);
    res.send(result);
  }).catch((error) => {
    res.status(500).send({
      message: error.message || "Some error occurred while creating the User."
    });
  })

};

/*   use PUT for UPDATE operations. */
exports.putUser = (req, res, next) => {
  const userId = req.params.userId;  // URL Param
  const name = req.body.name;
  const lastName = req.body.lastName;
  const dob = req.body.dob;
  const email = req.body.email;
  const mobile = req.body.mobile;
  const imageUrl = req.body.imageUrl;
  const membershipStart = req.body.membershipStart;
  const membershipEnd = req.body.membershipEnd;

  // Find user and update it with the request body
  User.findById(userId).then((user) => {
    user.timeStamp = Moment().toDate();  // updated
    user.name = name || user.name;
    user.lastName = lastName || user.lastName;
    user.dob = dob || user.dob;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;
    user.imageUrl = imageUrl || user.imageUrl;
    user.membershipStart = membershipStart || user.membershipStart;
    user.membershipEnd = membershipEnd || user.membershipEnd;
    return user.save()
  }).then(user => {
    if (!user) {
      return res.status(404).send({
        message: "User not found"
      });
    }
    res.send(user);
  }).catch(err => {
    return res.status(500).send({
      message: "Error updating User"
    });
  });
};

/* use DELETE for DELETE operations. */
exports.deleteUser = (req, res) => {
  const userId = req.params.userId;

  User.findByIdAndRemove(userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "User not found"
        });
      }
      res.send({ message: "User deleted successfully!" });
    }).catch(err => {


      return res.status(500).send({
        message: "Could not delete User"
      });
    });
};
