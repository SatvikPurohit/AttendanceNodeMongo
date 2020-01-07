const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://attendance:L2LGCOffh28fwhTj@cluster0-a3dsx.mongodb.net/attendanceDB?retryWrites=true&w=majority";
let _db;

/**
 * After DB Connection has been established -
 * start Node app
 *
 * @param {*} callback: To start node app
 */
const mongoConnect = (callback) => {
  MongoClient.connect(uri, { useNewUrlParser: true }).then(client => {
    console.log(" Connected ", client);
    _db = client.db();
    callback();
  }).catch(err => {
    console.log(" *** Error *** ", err);
    throw err;
  });
};

/* Managed with connection pooling, for multiple connections */
const getDb = () => {
  if (_db) return _db;
  throw 'No Datbase Found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
