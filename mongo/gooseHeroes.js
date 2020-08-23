const Promise = require('bluebird');
const mongoose = require('mongoose');

const database = 'mydatabase';
mongoose.connect(`mongodb://localhost:27017/${database}`, {
  	useNewUrlParser: true,
  	useUnifiedTopology: true
})
.then(() => {
	console.log("connected")
	mongoose.connection.db.admin().listDatabases().then(console.log);
	mongoose.connection.db.listCollections().toArray().then(console.log);
})
.catch(err => console.error(err))

// Mongo client - mongoose.connection.client
// Database     - mongoose.connection.db
// list all databases: mongoose.connection.db.admin().listDatabase()
// list all collections: mongoose.connection.db.listCollections().toArray()

const Schema = mongoose.Schema;
//console.log(Schema);
const ObjectId = Schema.ObjectId;
 
const HeroSchema = new Schema({
    id: {type: Number, required: true},
	name: {type: String, required: true}
});

// A collection is myheros with HeroSchema
//const HeroModel = Promise.promisifyAll(mongoose.model("Myhero", HeroSchema));

// Heroes or Heroe will also work 
const HeroModel = Promise.promisifyAll(mongoose.model("heroes", HeroSchema));
    
async function query() {
	let res = await HeroModel.findAsync({}, {_id: 0, __v: 0});
    mongoose.connection.close();
    
    return res;
}

async function findOne(id) {
	let res = await HeroModel.findOneAsync({id: id}, {_id: 0, __v: 0});
    mongoose.connection.close();
    
    return res;
}

async function deleteOne(id) {
	let res = await HeroModel.deleteOneAsync({id});
    mongoose.connection.close();
    
    return res;
}

async function create(hero) {
    let count = await HeroModel.countDocumentsAsync();
    //console.log(count);
    hero["id"]  = count? count + 1 : 1;
	let res = await HeroModel.createAsync(hero)

    mongoose.connection.close();
    
    return res;
}

async function updateOne(hero) {
    let {id}  = hero;
    //hero["updatedAt"] = Date.now();
    delete hero.id;
   
	let res = await HeroModel.updateOneAsync({id}, {$set: hero})

    mongoose.connection.close();
    
    return res;
}

//create({name: "Local Torontonian"}).then(console.log);
//updateOne({id: 2, name: "Torontonian"}).then(console.log);
//deleteOne(3).then(console.log);
query().then(console.log);
findOne(2).then(console.log);
