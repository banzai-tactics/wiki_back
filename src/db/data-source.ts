import "reflect-metadata";
import { DataSource } from "typeorm";
import { Search } from "./entity/Search";
import { User } from "./entity/User";
require('dotenv').config();

console.log(process.env.USER);
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.HOST,
    port: parseInt(process.env.PORT!),
    username: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    synchronize: true,
    logging: false,
    entities: [User, Search],
    migrations: [],
    subscribers: [],
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
        
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
