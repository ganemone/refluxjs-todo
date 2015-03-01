// Type 1: In-memory only datastore (no need to load the database)
var Datastore = require('nedb');
var db = new Datastore();

module.exports = db;