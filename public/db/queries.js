"use strict";
// import { User } from "./entity/User";
// import dotenv from 'dotenv'
// //import { AppDataSource } from "./data-source";
// import { Search } from "./entity/Search";
// dotenv.config();
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
// const Pool = require('pg').Pool
// const pool = new Pool({
//     user: process.env.USER,
//     host: process.env.HOST,
//     database: process.env.DATABASE,
//     password: process.env.PASSWORD,
//     port: process.env.PORT,
// });
// // //get all users
// // const getUsers = async () => {
// //     try {
// //         const users = await pool.query('SELECT * FROM users ORDER BY id ASC');
// //         return users
// //     } catch (error) {
// //         throw error;
// //     }
// //     // pool.query('SELECT * FROM users ORDER BY id ASC', (error: unknown, results: unknown) => {
// //     //     if (error) {
// //     //         throw error;
// //     //     } else {
// //     //         return results;
// //     //     }
// //     // })
// // }
// // //get one user by id
// // const getUserById = async (token: string) => {
// //     try {
// //         if (!token) {//if no token is presented
// //             throw new Error('Token provided is not valid');
// //         } else {
// //             const user = await pool.query('SELECT * FROM users WHERE id = $1', [token]);
// //             if (user != undefined) {//TODO: think of better if
// //                 console.log(user.rows);
// //                 return new User(user.rows[0].username, user.rows[0].lang, user.rows[0].id)
// //             }
// //             else {
// //                 throw new Error("no such user");
// //             }
// //         }
// //     } catch (error) {
// //         throw error;
// //     }
// // }
// // //get one user by name
// // const getUserByName = async (name: string) => {
// //     try {
// //         const user = await pool.query('SELECT * FROM users WHERE username = $1', [name]);
// //         return new User(user.rows[0].username, user.rows[0].lang, user.rows[0].id);
// //     } catch (error) {
// //         throw error;
// //     }
// // }
// // //add new user or if exists "login"
// // const createUser = async (username: string, lang: string) => {
// //     try {
// //         const user: User = await getUserByName(username);
// //         if (user != undefined) {
// //             if (lang != user.lang) {
// //                 await updateUser(user.token, lang)
// //             }
// //             return new User(user.username, lang, user.token);
// //         } else {
// //             const newUser = await pool.query('INSERT INTO users (username, lang) VALUES ($1, $2) RETURNING *', [username, lang]);
// //             return new User(newUser.rows[0].username, newUser.rows[0].lang, newUser.rows[0].id)
// //         }
// //     } catch (error) {
// //         throw error
// //     }
// // }
// // //update user info
// // const updateUser = async (token: string, lang: string) => {
// //     const user = await pool.query('UPDATE users SET lang = $1 WHERE id = $2', [lang, token]);
// // }
// // //delete user
// // const deleteUser = (token: string) => {
// //     pool.query('DELETE FROM users WHERE id = $1', [token], (error: unknown, results: unknown) => {
// //         if (error) {
// //             throw error
// //         } else {
// //             return (`User deleted with ID: ${token}`)
// //         }
// //     })
// // }
// //export
// // module.exports = {
// //     getUsers,
// //     getUserById,
// //     createUser,
// //     updateUser,
// //     deleteUser,
// // }
// // BL VS CONTROLLER - need to seprate the two. all error handle in next()
// //config file by enviorment variables. conifg.ts - > file.env (gen variables & secrets) not in commit.
// // https://www.npmjs.com/package/dotenv
// // use const or let not var. immutable concept.
// //unknow is better then any => typeof === blah
// //use next(e)
// //add try catch in async
const User_1 = require("./entity/User");
const Search_1 = require("./entity/Search");
const typeorm_1 = require("typeorm");
// /*TYPEORM */
function getAllUsersTypeORM() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield (0, typeorm_1.createQueryBuilder)("user")
            .select('user')
            .from(User_1.User, 'user')
            .leftJoinAndSelect("user.searches", "search")
            .getMany();
        // const users = await AppDataSource
        // .getRepository(User)
        // .createQueryBuilder("user")
        // .leftJoinAndSelect("user.searches", "search")
        // .getMany()
        return users;
    });
}
function createUserTypeORM(username, lang) {
    return __awaiter(this, void 0, void 0, function* () {
        //check if user already exists
        const userTmp = yield getUserByNameTypeORM(username);
        if (userTmp != null) {
            console.log(userTmp.searches);
            return userTmp;
        }
        else {
            const user = User_1.User.create({
                username: username,
                lang: lang,
                searches: []
            });
            yield user.save();
            return user;
            // user.username = username;
            // user.lang = lang;
            // user.searches = [];
            // const userRepository = AppDataSource.getRepository(User);
            // const newUser = await userRepository.save(user);
            // return newUser;
        }
    });
}
function getUserByNameTypeORM(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const byNameUser = yield (0, typeorm_1.createQueryBuilder)("user")
            .select('user')
            .from(User_1.User, 'user')
            .where('user.username = :username', { username: username })
            .leftJoinAndSelect("user.searches", "search")
            .getOne();
        // const userRepo = AppDataSource.getRepository(User);
        // //get by name user
        // const byNameUser = await userRepo.findOneBy({
        //     username: username,
        // })
        // console.log("First user from the db: ", byNameUser)
        return byNameUser;
    });
}
function getUserByIdTypeORM(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, typeorm_1.createQueryBuilder)("user")
            .select('user')
            .from(User_1.User, 'user')
            .where("user.token = :token", { token: token })
            .leftJoinAndSelect("user.searches", "search")
            .getOne();
        // const user = await AppDataSource
        // .getRepository(User)
        // .createQueryBuilder("user")
        // .leftJoinAndSelect("user.searches", "search")
        // .where("user.token = :token", { token: token })
        // .getOne()
        return user;
    });
}
// //update user function
function updateUserTypeORM(token, lang) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = User_1.User.create({
            lang: lang,
            searches: []
        });
        yield user.save();
        return user;
        //     const userRepository = AppDataSource.getRepository(User)
        // const userToUpdate = await userRepository.findOneBy({
        //     token: token,
        // })
        // userToUpdate!.lang = lang;
        // await userRepository.save(userToUpdate!);
    });
}
//remove user function
function removeUserTypeORM(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield User_1.User.delete(token);
        return res;
        // const userRepository = AppDataSource.getRepository(User)
        // const userToUpdate = await userRepository.findOneBy({
        //     token: token,
        // })
        // await userRepository.remove(userToUpdate!);
    });
}
//add search
function addSearchTypeORM(user, title) {
    return __awaiter(this, void 0, void 0, function* () {
        const search = Search_1.Search.create({
            searchTitle: title,
            searchTime: new Date().getDate()
        });
        user.addSearch(search);
        console.log(user);
        user.save();
        // search.searchTitle = title;
        // search.searchTime = new Date().getDate();
        // user.addSearch(search);
        // const userRepository = AppDataSource.getRepository(User);
        // await userRepository.save(user!);
        // await getAllUsersTypeORM();
    });
}
module.exports = {
    getAllUsersTypeORM,
    getUserByIdTypeORM,
    createUserTypeORM,
    updateUserTypeORM,
    removeUserTypeORM,
    addSearchTypeORM,
};
