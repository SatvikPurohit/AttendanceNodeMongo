const MongoClient = require('mongodb').MongoClient;
const uri = "";
let _db;

/**
 * After DB Connection has been established -
 * start Node app
 *
 * @param {*} callback: To start node app
 */
const mongoConnect = (callback) => {
  MongoClient.connect(uri, { useNewUrlParser: true }).then(client => {
    _db = client.db();
    callback();
  }).catch(err => {
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
