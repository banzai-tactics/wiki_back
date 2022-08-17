"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const User_1 = require("./db/entity/User");
const Search_1 = require("./db/entity/Search");
const typeOrmConfig = {
    name: "test",
    type: "postgres",
    host: process.env.HOST,
    port: parseInt(process.env.PORT),
    username: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    synchronize: false,
    logging: false,
    entities: [
        User_1.User,
        Search_1.Search,
    ],
    migrations: ['./db/migrations/*.js'],
    cli: {
        "migrationsDir": "migration"
    }
};
exports.typeOrmConfig = typeOrmConfig;
