"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
require("reflect-metadata");
// import {DataSource } from "typeorm";
const typeorm_1 = require("typeorm");
const Search_1 = require("./entity/Search");
const User_1 = require("./entity/User");
require('dotenv').config();
console.log(process.env.USER);
// export const AppDataSource = new DataSource({
//     type: 'postgres',
//     host: process.env.HOST,
//     port: parseInt(process.env.PORT!),
//     username: process.env.USER,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE,
//     synchronize: true,
//     logging: false,
//     entities: [User, Search],
//     migrations: [],
//     migrationsTableName: "",
//     subscribers: [],
// });
// AppDataSource.initialize()
//     .then(() => {
//         console.log("Data Source has been initialized!")
//     })
//     .catch((err) => {
//         console.error("Error during Data Source initialization", err)
//     })
const connection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, typeorm_1.createConnection)({
            type: "postgres",
            host: process.env.HOST,
            port: parseInt(process.env.PORT),
            username: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            synchronize: true,
            logging: false,
            entities: [
                User_1.User,
                Search_1.Search,
            ],
            migrations: ['./migrations/*.ts'],
        });
        console.log('connected');
    }
    catch (error) {
        console.error(error);
        throw new Error('unable to connect to db');
    }
});
exports.connection = connection;
