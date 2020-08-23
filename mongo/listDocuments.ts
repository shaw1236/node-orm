// Purpose: List documents
// Author : Simon Li
// Date   : April 16, 2020

'use strict';

import * as mongo from 'mongodb';

const url = "mongodb://localhost:27017";

let dbName         = 'mydatabase';
let collectionName = 'tasks';

let client = new mongo.MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
client.connect()                              // return client
.then(client => client.db(dbName))            // return db   
.then(dbo => dbo.collection(collectionName))  // return collection
.then(collection => collection.find({}, {projection: {_id:0,__v:0}}).toArray())
.then(console.log)
.catch(console.error)
.finally(() => client.close())
