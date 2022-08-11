// import { User } from "./entity/User";
// import dotenv from 'dotenv'
// //import { AppDataSource } from "./data-source";
// import { Search } from "./entity/Search";
// dotenv.config();

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

import { User } from './entity/User';
import { Search } from './entity/Search';
import { createQueryBuilder } from 'typeorm';


// /*TYPEORM */
async function getAllUsersTypeORM() {
    const users = await createQueryBuilder("user")
        .select('user')
        .from(User, 'user')
        .leftJoinAndSelect("user.searches", "search")
        .getMany()
    // const users = await AppDataSource
    // .getRepository(User)
    // .createQueryBuilder("user")
    // .leftJoinAndSelect("user.searches", "search")
    // .getMany()
    return users;

}

async function createUserTypeORM(username: string, lang: string) {
    //check if user already exists
    const userTmp = await getUserByNameTypeORM(username);
    if (userTmp != null) {
        console.log(userTmp.searches);
        return userTmp;
    } else {
        const user = User.create({
            username: username,
            lang: lang,
            searches: []
        });
        await user.save();
        return user;

        // user.username = username;
        // user.lang = lang;
        // user.searches = [];
        // const userRepository = AppDataSource.getRepository(User);
        // const newUser = await userRepository.save(user);
        // return newUser;
    }
}

async function getUserByNameTypeORM(username: string) {

    const byNameUser = await createQueryBuilder("user")
        .select('user')
        .from(User, 'user')
        .where('user.username = :username', { username: username })
        .leftJoinAndSelect("user.searches", "search")
        .getOne()
    // const userRepo = AppDataSource.getRepository(User);
    // //get by name user
    // const byNameUser = await userRepo.findOneBy({
    //     username: username,
    // })
    // console.log("First user from the db: ", byNameUser)
    return byNameUser;
}

async function getUserByIdTypeORM(token: string) {
    const user = await createQueryBuilder("user")
        .select('user')
        .from(User, 'user')
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
}

// //update user function
async function updateUserTypeORM(token: string, lang: string) {
    const user = User.create({
        lang: lang,
        searches: []
    });
    await user.save();
    return user;

    //     const userRepository = AppDataSource.getRepository(User)
    // const userToUpdate = await userRepository.findOneBy({
    //     token: token,
    // })
    // userToUpdate!.lang = lang;
    // await userRepository.save(userToUpdate!);
}

//remove user function
async function removeUserTypeORM(token: string) {
    const res = await User.delete(token);
    return res
    // const userRepository = AppDataSource.getRepository(User)
    // const userToUpdate = await userRepository.findOneBy({
    //     token: token,
    // })
    // await userRepository.remove(userToUpdate!);
}

//add search
async function addSearchTypeORM(user: User, title: string) {
    const search = Search.create({
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
}


module.exports = {
    getAllUsersTypeORM,
    getUserByIdTypeORM,
    createUserTypeORM,
    updateUserTypeORM,
    removeUserTypeORM,
    addSearchTypeORM,
}

