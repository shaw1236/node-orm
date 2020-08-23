const Promise = require('bluebird');
const mongoose = require('mongoose');

const database = 'mydatabase';
mongoose.connect(`mongodb://localhost:27017/${database}`, {
  	useNewUrlParser: true,
  	useUnifiedTopology: true
})
.then(() => console.log("connected"))
.catch(err => console.error(err))

const Schema = mongoose.Schema;
//console.log(Schema);
const ObjectId = Schema.ObjectId;
 
const BlogPost = new Schema({
  	author: ObjectId,
  	title: String,
  	body: String,
  	date: { type: Date, default: Date.now }
});
const myModel = mongoose.model("BlogPost", BlogPost);
console.log(myModel);

const Task = new Schema({
    id: {type: Number, required: true},
	title: {type: String, require: true},
    description: {type: String},
    done: { type: Boolean, default: false},
});
const TaskModel = Promise.promisifyAll(mongoose.model("Task", Task));
//console.log(TaskModel);
    
async function test1() {
	let res = await myModel.create({title: "Test blog", body: "Test body"});
	console.log(res);
//myModel.findOne({title: "Test blog"}).then(console.log)
    await mongoose.connection.close();
}

async function query() {
	let res = await TaskModel.findAsync({}, {_id: 0, __v: 0});
    mongoose.connection.close();
    
    return res;
}

async function create() {
    let count = await TaskModel.countAsync();
    //console.log(count);
    let task = { id: count + 1, title: "Mongoose Test", description: "Mongoose async call" };   
	let res = await TaskModel.createAsync(task)

    mongoose.connection.close();
    
    return res;
}

async function update() {
    let update = { title: "Mongoose Test Update", done: true };   
	let res = await TaskModel.updateOneAsync({id: 4}, {$set: update})

    mongoose.connection.close();
    
    return res;
}

//create().then(console.log)
//update().then(console.log)
query().then(console.log)

