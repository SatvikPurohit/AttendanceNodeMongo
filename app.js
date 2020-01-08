const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression')
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const https = require('https');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@cluster0-a3dsx.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
// const privateKey = fs.readFileSync('server.key') // read synchronously else stop server
// const certificate = fs.readFileSync('server.cert') // read synchronously else stop server


const errorController = require('./controllers/error');
const Login = require('./models/login');

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

mongoose.connect(MONGODB_URI).then(() => {
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
  app.listen(process.env.PORT || 3000);
  /* Hosting Provider Provides:
     https.createServer({ key: privateKey, cert: certificate }, app)
    .listen(process.env.PORT || 3000);
  */
}).catch((error) => {
  console.error(error);
})


/*
  SSL/TLS Encryption of data between server client communication :
  Public key & Private key both known only to server
  Public key for encryption, Public key or SSL certificate: own key not trusted, warning!
  Private key for decryption
  server.key always to Server
  server.cert send to client
*/
/*
  NODE_ENV=production passed by Heroku
*/
