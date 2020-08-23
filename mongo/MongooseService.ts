// Purpose: Mongo Service class dfrom mongoose
// Author : Simon Li
// Date   : Auguest 20, 2020

'use strict';

import * as goose from 'mongoose';
const host: string = process.env.MONGO_HOST || "localhost";
const port: number = +process.env.MONGO_PORT || 27017;
const database: string = process.env.MONGO_DATABASE || 'mydatabase';

const default_url: string = `mongodb://${host}:${port}/${database}`;
//console.log(default_url);

export default class MongooseService {
    readonly url: string;
    private model: any = null;
    private _isOpen: boolean = false;

    constructor(url: string) {
        this.url = url || default_url;
        this.connect();
    }

    // Return Promise<mongoose.connection>
    async connect(): Promise<object> {
        if (this._isOpen)
            return goose.connection;
  
	    try {
        	await goose.connect(this.url, {useNewUrlParser: true, useUnifiedTopology: true});
			this._isOpen = true;
		}
        catch(err) { 
             this._isOpen = false;
			 console.error(`cannot connect to the mongoDb via ${this.url}`);
             //console.error(err);
        }
	    return await goose.connection;
    }

    setModel(collectionName: string, schemaObj: object): void {
        let schema = new goose.Schema(schemaObj); 
		this.model = require("bluebird").promisifyAll(goose.model(collectionName, schema));
    }

    // return current Promise<client>
    async getClient(): Promise<object> {
        return await goose.connection.client;
    }

    // return a boolean value
    isConnection(): boolean {
        return this._isOpen;
    }

	// return a boolean value
    isOpen(): boolean {
        return this._isOpen;
    }

    close(): void {
        if (this._isOpen) {
	    	goose.disconnect();
            this._isOpen = false;
        }
    }
    
    // Return Promise<object> or Promise<list> for name only
    async listDatabases(nameOnly: boolean = false): Promise<object|Array<object>> {
	    let admin = await (await goose.connection).db.admin();
	    let databaseObj = await admin.listDatabases();
        if (nameOnly) 
             return databaseObj.databases.map(ea => ea.name);
        else
             return databaseObj;
    }      

    // Return Promise<ArrayOfCollection>
    async listCollections(nameOnly: boolean = true): Promise<any[]> {
	    let dbo = await (await goose.connection).db;
        let collections = await	dbo.listCollections().toArray();
	
        if (nameOnly)
            return collections.map(ea => ea.name);
        else
            return collections;
    }

    // Return Promise<ArrayOfDocument>
    async listDocuments(collectionName: string = "heroes", query: object = {}, 
        projection: object = {_id:0, __v:0}): Promise<Array<object>> {
        let dbo = await (await goose.connection).db;
	    let collection = dbo.collection(collectionName);
        
	    let data = collection.find(query, { projection: projection }).toArray();
        return data;
    }
}

if (require.main === module) {
    (async () => { 
        try {
       	    let monS: MongooseService = new MongooseService("mongodb://127.0.0.1:27017/mydatabase");

            console.dir(monS.url);

    	    let res: any = await monS.listDatabases();
            console.log("Database", res);

            res = await monS.listCollections();
            console.log("Collections of db mydatabase", res);

            res = await monS.listDocuments();
	        console.log("Documents", res);

            monS.close();
        }
        catch(ex) {
            console.error(ex);
        }
    })();
}
