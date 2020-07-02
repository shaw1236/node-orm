import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id = undefined;

    @Column("varchar", {length: 40})
    firstName = "";

    @Column("varchar", {length: 40})
    lastName = "";

    @Column("int")
    age = 0;

}
