import "reflect-metadata";
import {createConnection, ConnectionOptions} from "typeorm";
import { User } from "./entity/User";
import { Photo } from "./entity/Photo";
import { Author } from "./entity/Author";
import { Album } from "./entity/Album";
import { PhotoMetadata } from "./entity/PhotoMetadata";

const options: ConnectionOptions =
{
    type: "mysql",     // mariadb, postgres, cockroachdb, sqlite, mssql, oracle, cordova, nativescript, react-native, expo, or mongodb.
    host: "localhost",  
    port: 3306,
    username: "root",
    password: "Shaw1236$",
    database: "mydb",
    entities: [
        Photo, 
        PhotoMetadata,
        User,
        Author,
        Album
    ],
    synchronize: true,  // entities will be synced with the database tables
    logging: false      // no logging
};

async function user() {
    let connection = await createConnection(options);
    
    /** 
    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "Shaw1236";
    user.lastName = "Shaw1236$";
    user.age = 55;
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);
    */
    console.log("Loading users from the database...");

    //const users = await connection.manager.find(User);
    let userRepo = connection.getRepository(User);
    const users = await userRepo.find();

    //console.log("Loaded users: ", users);
    return users;
}

async function photo() {
    let connection = await createConnection(options);
    
    /*
    let photo = new Photo();
    photo.name = "Me and Bears";
    photo.description = "I am near polar bears";
    photo.filename = "photo-with-bears.jpg";
    photo.views = 1;
    photo.isPublished = true;

    await connection.manager.save(photo);
    console.log("Photo has been saved. Photo id is", photo.id);
    */
   
    //let savedPhotos = await connection.manager.find(Photo);
    //console.log("All photos from the db: ", savedPhotos);

    let photoRepository = connection.getRepository(Photo);

    // find() -> [], findOne -> {}, findAndCount -> [], scalar
    // save({}), remove({})
    let allSavedPhotos = await photoRepository.find();
    //console.log("All photos from the db: ", allSavedPhotos);

    let firstPhoto = await photoRepository.findOne(1);
    //console.log("First photo from the db: ", firstPhoto);

    // Update
    //let photoToUpdate = await photoRepository.findOne(1);
    //photoToUpdate.name = "Me, my friends and polar bears";
    //await photoRepository.save(photoToUpdate);

    // Remove
    //let photoToRemove = await photoRepository.findOne(1);
    //await photoRepository.remove(photoToRemove);

    let meAndBearsPhoto = await photoRepository.findOne({ name: "Me and Bears" });
    //console.log("Me and Bears photo from the db: ", meAndBearsPhoto);

    let allViewedPhotos = await photoRepository.find({ views: 1 });
    //console.log("All viewed photos: ", allViewedPhotos);

    let allPublishedPhotos = await photoRepository.find({ isPublished: true });
    //console.log("All published photos: ", allPublishedPhotos);

    let [allPhotos, photosCount] = await photoRepository.findAndCount();
    //console.log("All photos: ", allPhotos);
    //console.log("Photos count: ", photosCount);

    // create a photo
    let photo = new Photo();
    photo.name = "Me and Bears";
    photo.description = "I am near polar bears";
    photo.views = 1;
    photo.filename = "photo-with-bears.jpg";
    photo.isPublished = true;

    // create a photo metadata
    let metadata = new PhotoMetadata();
    metadata.height = 640;
    metadata.width = 480;
    metadata.compressed = true;
    metadata.comment = "cybershoot";
    metadata.orientation = "portait";
    //metadata.photo = photo; // this way we connect them

    // get entity repositories
    //let photoRepository = connection.getRepository(Photo);
    //let metadataRepository = connection.getRepository(PhotoMetadata);

    // first we should save a photo
    //await photoRepository.save(photo);

    // photo is saved. Now we need to save a photo metadata
    //await metadataRepository.save(metadata);

    // done
    //console.log("Metadata is saved, and relation between metadata and photo is created in the database too");
    photo.metadata = metadata; // this way we connect them

    // get repository
    //let photoRepository = connection.getRepository(Photo);

    // saving a photo also save the metadata
    await photoRepository.save(photo);

    console.log("Photo is saved, photo metadata is saved too.")
 }

 async function album() {
    let connection = await createConnection(options);

    // create a few albums
    let album1 = new Album();
    album1.name = "Bears";
    await connection.manager.save(album1);
    
    let album2 = new Album();
    album2.name = "Me";
    await connection.manager.save(album2);
    
    // create a few photos
    let photo = new Photo();
    photo.name = "Me and Bears";
    photo.description = "I am near polar bears";
    photo.filename = "photo-with-bears.jpg";
    photo.albums = [album1, album2];
    photo.views = 2;
    photo.isPublished = true;
    await connection.manager.save(photo);
    
    // now our photo is saved and albums are attached to it
    // now lets load them:
    //const loadedPhoto = await connection.getRepository(Photo).findOne(1, { relations: ["albums"] });
    const loadedPhoto = await connection.getRepository(Photo).findByIds([photo.id], { relations: ["albums"] });
    return loadedPhoto; 
} 

async function queryBuild() {
    let connection = await createConnection(options);

    let photos = await connection
    .getRepository(Photo)
    .createQueryBuilder("photo") // first argument is an alias. Alias is what you are selecting - photos. You must specify it.
    .innerJoinAndSelect("photo.metadata", "metadata")
    .leftJoinAndSelect("photo.albums", "album")
    .where("photo.isPublished = true")
    .andWhere("(photo.name = :photoName OR photo.name = :bearName)")
    .orderBy("photo.id", "DESC")
    .skip(5)
    .take(10)
    .setParameters({ photoName: "My", bearName: "Mishka" })
    .getMany();
    
    return photos;
}
user().then(result => console.log(result))
//album().then(result => console.log(result))
.catch(err => console.error(err))