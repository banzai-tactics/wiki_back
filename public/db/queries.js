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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../services/User");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Pool = require('pg').Pool;
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});
//get all users
const getUsers = () => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        else {
            return results;
        }
    });
};
//get one user by id
const getUserById = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!token) { //if no token is presented
            throw new Error('Token provided is not valid');
        }
        else {
            const user = yield pool.query('SELECT * FROM users WHERE id = $1', [token]);
            if (user != undefined) { //TODO: think of better if
                console.log(user.rows);
                return new User_1.User(user.rows[0].username, user.rows[0].lang, user.rows[0].id);
            }
            else {
                // if (token != user.rows[0].id) {//if wrong token is presented
                //     throw new Error('token provided is not valid');
                //     // return response.status(403).json({ error: 'wrong token!' });
                // } else {//successful
                // }
            }
        }
    }
    catch (error) {
        throw error;
    }
});
//get one user by name
const getUserByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield pool.query('SELECT * FROM users WHERE username = $1', [name]);
    return new User_1.User(user.rows[0].username, user.rows[0].lang, user.rows[0].id);
});
//add new user or if exists "login"
const createUser = (username, lang) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield getUserByName(username);
        console.log("testtttttttttt");
        if (user != undefined) {
            if (lang != user.lang) {
                yield updateUser(user.token, lang);
            }
            return new User_1.User(user.username, lang, user.token);
        }
        else {
            const newUser = yield pool.query('INSERT INTO users (username, lang) VALUES ($1, $2) RETURNING *', [username, lang]);
            return new User_1.User(newUser.rows[0].username, newUser.rows[0].lang, newUser.rows[0].id);
        }
    }
    catch (error) {
        throw error;
    }
});
//update user info
const updateUser = (token, lang) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield pool.query('UPDATE users SET lang = $1 WHERE id = $2', [lang, token]);
});
//delete user
const deleteUser = (token) => {
    pool.query('DELETE FROM users WHERE id = $1', [token], (error, results) => {
        if (error) {
            throw error;
        }
        else {
            console.log(results);
            return (`User deleted with ID: ${token}`);
        }
    });
};
//export
module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
// BL VS CONTROLLER - need to seprate the two. all error handle in next()
//config file by enviorment variables. conifg.ts - > file.env (gen variables & secrets) not in commit.
// https://www.npmjs.com/package/dotenv
// use const or let not var. immutable concept.
//unknow is better then any => typeof === blah
//use next(e)
//add try catch in async
