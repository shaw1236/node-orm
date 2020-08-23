import {createConnection} from "typeorm";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";
import {User} from "./entity/User";

const ConnectionOptions =
{
    type: "mysql",     // mariadb, postgres, cockroachdb, sqlite, mssql, oracle, cordova, nativescript, react-native, expo, or mongodb.
    host: "localhost",  
    port: 3306,
    username: "root",
    password: "Shaw1236$",
    database: "mydb",
    entities: [
        Post, 
        Category,
        User
    ],
    synchronize: true,  // entities will be synced with the database tables
    logging: false      // no logging
};

// connection settings are in the "ormconfig.json" file
async function init() {
    const connection = await createConnection(ConnectionOptions);
    
    const category1 = new Category();
    category1.name = "TypeScript";

    const category2 = new Category();
    category2.name = "Programming";

    const post = new Post();
    post.title = "Control flow based type analysis";
    post.text = "TypeScript 2.0 implements a control flow-based type analysis for local variables and parameters.";
    post.categories = [category1, category2];

    let postRepo = await connection.getRepository(Post);
    await postRepo.save(post);
    return post;
}

async function user() {
    let connection = await createConnection(ConnectionOptions);
    
    let userRepo = await connection.getRepository(User);
    
    //console.log("Inserting a new user into the database...");
    //const user = new User();
    //user.firstName = "Test";
    //user.lastName = "Mine";
    //user.age = 35;
    //await connection.manager.save(user);
    //console.log("Saved a new user with id: " + user.id);
    
    // Update
    //let user = await userRepo.findOne({age: 55});
    //user.firstName = "shaw1236";
    //user.lastName = "Shaw1236$"
    //await userRepo.save(user);

    //user = await userRepo.findOne({age: 13});
    //user.firstName = "James";
    //user.lastName = "Li"
    //await userRepo.save(user);

    console.log("Loading users from the database...");

    //const users = await connection.manager.find(User);
    const users = await userRepo.find();

    //console.log("Loaded users: ", users);
    return users;
}

async function queryBuild() {
    let connection = await createConnection(ConnectionOptions); 
    let userRepo = await connection.getRepository(User);

    // Query
    let result = await  
    userRepo.createQueryBuilder("user")
    .where("user.id = :id", { id: 1 })
    .getOne();

    result = await  
    userRepo.createQueryBuilder("user")
    .where("user.id = :id OR user.firstName = :name", { id: 1, name: "Timber" })
    .andWhere("user.lastName = :lastName", { lastName: "Sawn" })
    //.orWhere("user.lastName = :lastName", { lastName: "Saw" })
    //.having("user.firstName = :firstName", { firstName: "Timber" })
    //.andHaving("user.lastName = :lastName", { lastName: "Saw" })
    .getOne();
    
    result = await userRepo.createQueryBuilder("user")
    .select([
        "user.id",
        "user.firstName"
    ])
    .where("user.id IN (:...ids)", { ids: [1, 2, 3, 4] })
    .orderBy("user.id", "ASC")
    .orderBy("user.firstName")
    .addOrderBy("user.id")
    .getMany();

    return result;

    // Insert/create
    result = await userRepo.createQueryBuilder("user")
    .insert()
    .into(User)
    .values([
        //{ firstName: "Timber", lastName: "Saw", age: 40 },
        { firstName: "Phantom2", lastName: "Lancer2", age: 20 }
     ])
    .execute();
    /*
    InsertResult {
        identifiers: [ { id: 11 } ],
        generatedMaps: [ { id: 11 } ],
        raw: OkPacket {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 11,
          serverStatus: 2,
          warningCount: 0,
          message: '',
          protocol41: true,
          changedRows: 0
        }
      }
    */   

    // Update
    result = await userRepo.createQueryBuilder("user")
    .update(User)
    .set({ firstName: "Timber", lastName: "Sawn" })
    .where("id = :id", { id: 4 })
    .execute();
    /*
    UpdateResult {
        generatedMaps: [],
        raw: OkPacket {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 0,
          serverStatus: 2,
          warningCount: 0,
          message: '(Rows matched: 1  Changed: 1  Warnings: 0',
          protocol41: true,
          changedRows: 1
        },
        affected: 1
      }
    */

    //Delete
    result = await userRepo.createQueryBuilder("user")
    .delete()
    .from(User)
    .where("id = :id", { id: 3 })
    .execute();
    /*
    DeleteResult {
        raw: OkPacket {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 0,
          serverStatus: 2,
          warningCount: 0,
          message: '',
          protocol41: true,
          changedRows: 0
        },
        affected: 1
      }
    */

    return result;
}

//init().then(result => console.log(result))
//user().then(result => console.log(result))
queryBuild().then(result => console.log(result))
.catch(error => console.log("Error: ", error));