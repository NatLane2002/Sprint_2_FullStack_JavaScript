const { MongoClient } = require('mongodb');

// const uri = "mongodb://127.0.0.1:27017/";
const atlas = "mongodb+srv://NatLane2002:Seka-2002@sprint2fullstackjavascr.ufeotda.mongodb.net/"

// const pool = new MongoClient(uri);
const pool = new MongoClient(atlas);

module.exports = pool;