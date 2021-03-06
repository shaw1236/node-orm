// Purpose: copy a collection between database
// Author : Simon Li
// Date   : August 19, 2020
//
// Migrate mongo db from azure vm to azure cloud cosmos
// https://docs.microsoft.com/en-us/azure/dms/tutorial-mongodb-cosmos-db

'use strict';

const assert = require('assert');
const { Promise } = require('bluebird');
const mongo = Promise.promisifyAll(require('mongodb'));

const url = "mongodb://localhost:27017";

const sourceDb = "mydatabase";
const targetDb = "test";
const sourceCollection = "tasks";

async function copy(test = true, dbSource = sourceDb, collectionName = sourceCollection, dbTarget = targetDb) {
    let clientSource = null, clientTarget = null;
    let statistics = {};
    try {
        
        //
        // Read 
        // 
        console.info("1. Read the data from the source collection to an array buffer");

		console.log('1.1 Connect to source');
		clientSource = await mongo.MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    	
        let dbo = clientSource.db(dbSource);      
		let collection = await dbo.collection(collectionName);

        console.log("1.2 Read data to an array buffer");
		let data = await collection.find({}, {projection: {_id: 0, __v: 0} }).toArray();
        statistics.numSource = data.length;
        
        console.log("1.3 Source cleanup"); 
		clientSource.close();
        clientSource = null;
        if (test)
        	return data;

        //
        // Write   
        //
        console.info("\n2. Write the array buffer to the target collection");
		console.log('2.1 Connect to target');
		clientTarget = await mongo.MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    	
        dbo = clientTarget.db(dbTarget);      
		collection = await dbo.collection(collectionName);
        
        // Drop the collection if it is already existing
        console.log(`2.2 Check whether the collection ${collectionName} already exists`);
        let collections = await dbo.listCollections({name: collectionName}).toArray();
        if (collections.length) 
            console.log("2.2.1 Drop collection", await collection.drop());
     
        console.log("2.3 Insert the document data to the target");
        let dbresult = await collection.insertMany(data);
        
        console.log("2.4 Collect statistics data");
        statistics.insertedCount = dbresult.insertedCount;
     	statistics.insertedIds = dbresult.insertedIds;
        
        let n = statistics.numShow || 5;
        statistics.first = dbresult.ops.slice(0, statistics.insertedCount > n? n : statistics.insertedCount); 
        statistics.last  = dbresult.ops.slice(statistics.insertedCount > n? statistics.insertedCount-n : 0); 
        statistics.numTarget = await collection.countDocuments({});  // read all the documents from target

        console.log("2.5 Target cleanup");
		clientTarget.close();
        clientTarget = null;
        
        console.log("2.6 Verify the numbers");
        assert.equal(statistics.numSource, statistics.insertedCount, "numSource != insertedCount");
        assert.equal(statistics.numSource, statistics.numTarget,     "Number of source != number of target");
        
        console.log("\n3. All were done!");
        return statistics;
    }
    catch(ex) {
        // Cleanups
        if (clientSource) {
			clientSource.close();
            clientSource = null;
        }        
        if (clientTarget) {
			clientTarget.close();
            clientTarget = null;
        }        
        throw ex;
    }
}

copy(false).then(res => console.log("\nSummary", res))
.catch(console.error);
