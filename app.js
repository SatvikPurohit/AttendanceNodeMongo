const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression')
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@cluster0-a3dsx.mongodb.net/${process.env.MONGO_DB}`;

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

const app = express();

// secured header
app.use(helmet());
// compressed resource : also not supported by Heroku
app.use(compression());
// request logger : 'append' logs in file
app.use(morgan('combined', { stream: accessLogStream }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// Models
const AdminUser = require('./models/login');
//  Routes
const loginRoute = require('./routes/login')
const attendanceRoutes = require('./routes/attendance');
const userRoutes = require('./routes/user');

app.use(loginRoute);
app.use(userRoutes);
app.use(attendanceRoutes);

mongoose.connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
  // Sign-up one admin user
  bcrypt.hash(process.env.ADMIN_PWD, 10).then((hash) => {
    AdminUser.findOne().then((loginUser) => {
      // If we have user don't create
      if (!loginUser) {
        const loginUser = new AdminUser({
          uName: process.env.ADMIN,
          role: 'admin',
          password: hash
        });
        loginUser.save().then((result) => {
          console.log(" Admin Created ", result);
        }).catch((err) => {
          console.log(" Admin Not Created ", err)
        });
      }
    });
    app.listen(process.env.PORT || 3000);
    /* Hosting Provider Provides:
       https.createServer({ key: privateKey, cert: certificate }, app)
      .listen(process.env.PORT || 3000);
    */
  });
}).catch((error) => {
  console.error(' error: ', error);
});
