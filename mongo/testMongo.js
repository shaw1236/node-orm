// Purpose: test mongo database connectivity
// Author :  Simon Li
// Date   : April 16, 2020

'use strict';

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, mongo) => {
   if (err) throw err;
   console.dir('Connected');
   let dbo = mongo.db('test');

   dbo.collection("dummy").findOne({"user": "me"}, (err, res) => {
       if (err) throw err;
       if (res)
           console.log(res)
       else
           dbo.collection("dummy").insertOne({"user" : "me"}, (err, res) => {
               if (err) throw err;
               console.log(`${res.insertedCount} user with id "${res.insertedId}" inserted`);
           });
   });
   //mongo.close();
});

