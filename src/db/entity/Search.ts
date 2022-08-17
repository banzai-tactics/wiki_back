import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    JoinColumn,
    Timestamp,
    ManyToOne,
    BaseEntity
} from "typeorm"
import { User } from "./User"

@Entity()
export class Search extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: number

    @Column()
    searchTitle: string


    @Column()
    searchTime: number

    @ManyToOne(() => User, (user) => user.searches)
    user: User


    // constructor(id: string, searchTitle: string, searchTime: number, user: User) {
    //     this.id = id;
    //     this.searchTitle = searchTitle;
    //     this.searchTime = searchTime;
    //     this.user = []
    // }

}