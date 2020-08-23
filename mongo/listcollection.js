// Purpose: test mongo database connectivity
// Author :  Simon Li
// Date   : April 16, 2020

'use strict';

const Promise = require('bluebird');
const mongo = Promise.promisifyAll(require('mongodb'));
const url = "mongodb://localhost:27017";

async function list() {
    let client, res;
    try {
		client = await mongo.MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
		console.dir('Connected');
    	
		let dbo = client.db('test');
        //res = await dbo.listCollections().toArray();
        res = await dbo.listCollections({name: "dummy"}).toArray();
        //console.log(dbo);
    }
    catch(ex) {
        res = ex;
    }

    client.close();

    return res;
}
list().then(console.log)
.catch(console.error)
