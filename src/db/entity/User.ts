import {
    Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, BaseEntity
} from "typeorm"
import { Search } from "./Search"

@Entity()
export class User extends BaseEntity {
    @Column()
    username: string;

    @Column()
    lang: string;

    @PrimaryGeneratedColumn("uuid")
    token: string;


    @OneToMany(() => Search, (search) => search.user, {
        cascade: true
    }) // note: we will create user property in the search class below
    searches: Search[];

    addSearch(search: Search) {
        if (this.searches == null) {
            this.searches = new Array<Search>();
        }
        this.searches.push(search);
    }
}
