import {Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, ManyToMany} from "typeorm";
import { PhotoMetadata } from "./PhotoMetadata";
import { Author } from "./Author";
import { Album } from "./Album";

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number; // auto-increment / sequence / serial / generated identity column

    @Column({length: 100})
    name: string;

    @Column('text')
    description: string;

    @Column()
    filename: string;

    @Column("double")
    views: number;

    @Column()
    isPublished: boolean;

    @OneToOne(type => PhotoMetadata, pm => pm.photo, {
        cascade: true,
    })
    metadata: PhotoMetadata;

    @ManyToOne(type => Author, a => a.photos)
    author: Author;

    @ManyToMany(type => Album, a => a.photos)
    albums: Album[];
}

/** 
table Photo {
    id: number;
    name: string;
    description: string;
    filename: string;
    views: number;
    isPublished: boolean;
}

Column types in the database are inferred from the property types, e.g. 
number will be converted into integer, string into varchar, boolean into bool, etc. 
But you can use any column type your database supports by explicitly specifying a column type into the @Column decorator.

Each entity must have at least one primary key column. This is a requirement and you can't avoid it. To make a column a 
primary key, you need to use @PrimaryColumn decorator.
*/