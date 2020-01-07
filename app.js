const mongoose = require('mongoose');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const Login = require('./models/login');

const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

const loginRoute = require('./routes/login');
const attendanceRoutes = require('./routes/attendance');
const userRoutes = require('./routes/user');

/* For every incoming request use login user */
app.use((req, res, next) => {
  Login.findById('5e0f02643ca14c6958c83b58')
    .then((loginUser) => {
      req.loginUser = loginUser;
      next();
    })
    .catch(() => {
      console.error('No admin user created');
    });
});
app.use(userRoutes);
app.use(attendanceRoutes);
app.use(errorController.get404);

mongoose.connect('mongodb+srv://attendance:L2LGCOffh28fwhTj@cluster0-a3dsx.mongodb.net/attendanceDB?retryWrites=true&w=majority').then(() => {
  // If we have user don't create
  Login.findOne().then((loginUser) => {
    if (!loginUser) {
      const loginUser = new Login({
        uName: 'admin',
        role: 'admin',
        password: 'admin'
      });
      loginUser.save();
    }
  }).catch(() => { });
  app.listen('3000');
}).catch((error) => {
  console.error(error);
})
