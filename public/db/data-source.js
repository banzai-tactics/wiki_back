"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Search_1 = require("./entity/Search");
const User_1 = require("./entity/User");
require('dotenv').config();
console.log(process.env.USER);
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.HOST,
    port: parseInt(process.env.PORT),
    username: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    synchronize: true,
    logging: false,
    entities: [User_1.User, Search_1.Search],
    migrations: [],
    subscribers: [],
});
exports.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization", err);
});
