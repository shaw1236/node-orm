// Purpose: test mongo database connectivity
// Author :  Simon Li
// Date   : April 16, 2020

'use strict';

const Promise = require('bluebird');
const mongo = Promise.promisifyAll(require('mongodb'));
const url = "mongodb://localhost:27017";

async function check() {
    let client, res;
    try {
		client = await mongo.MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
		console.dir('Connected');
    	
		let dbo = client.db('test');
        //console.log(dbo);

		let collection = await dbo.collection("dummy");

		res = await collection.findOne({"user": "me"});
    	if (!res) { 
        	res = await collection.insertOne({"user" : "me"});
        	res = `${res.insertedCount} user with id "${res.insertedId}" inserted`;
    	}
    }
    catch(ex) {
        res = ex;
    }

    client.close();

    return res;
}
//check().then(console.log)

// https://docs.mongodb.com/master/tutorial/enable-authentication/#re-start-the-mongodb-instance-with-access-control
async function checkAuth() {
    try {
        //console.log(mongo);
    	//let db = await MongoClient.connect('mongodb://user:pass@dhost:port/baseName');
        //?authSource=admin
 
        let userpass = "myTester:test";     
        //let url = `mongodb://${userpass}@localhost:27017/testsec`;
        let url = `mongodb://localhost:27017/testsec`;

        let client = await mongo.MongoClient.connectAsync(url, {useUnifiedTopology: true})
        let dbo = client.db();
        //console.log(dbo);
        
		let collection = await dbo.collection("dummy");

		let res = await collection.findOne({"user": "me"});
    	if (!res) { 
        	res = await collection.insertOne({"user" : "me"});
        	res = `${res.insertedCount} user with id "${res.insertedId}" inserted`;
    	}
        
        client.close();
        return res;
    }
    catch(ex) {
        return ex;
    }

}
checkAuth().then(console.log)
