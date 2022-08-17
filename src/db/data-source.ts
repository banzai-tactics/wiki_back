import "reflect-metadata";
// import {DataSource } from "typeorm";
import { createConnection, getConnection } from "typeorm";

import { typeOrmConfig } from "../ormconfig";
import { Search } from "./entity/Search";
import { User } from "./entity/User";
require('dotenv').config();

export const connection = async () => {
    try {
        await createConnection({
            type: "postgres",
            host: process.env.HOST,
            port: parseInt(process.env.PORT!),
            username: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            synchronize: false,
            logging: false,
            entities: [
                User,
                Search,
            ],
            migrations: ['./migrations/*.ts'],
        });

        console.log('connected')

    } catch (error) {
        console.error(error);
        throw new Error('unable to connect to db');
    }

}



export const closeConnection = async () => {
    await getConnection().close();
}
