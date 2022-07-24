import { User } from "../services/User";

//TODO: need to add restrictive permissions
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'api',
    password: 'shefi',
    port: 5432,
});

//get all users
const getUsers = () => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error: unknown, results: unknown) => {
        if (error) {
            throw error;
        } else {
            return results;
        }
    })
}
//get one user by id
const getUserById = async (token: string) => {
    try {


        if (!token) {//if no token is presented
            throw new Error('Token provided is not valid');
        } else {
            const user = await pool.query('SELECT * FROM users WHERE id = $1', [token]);
            if (user != undefined) {//TODO: think of better if
            console.log(user.rows);
                return new User(user.rows[0].username, user.rows[0].lang, user.rows[0].id)
            }
            else {
                // if (token != user.rows[0].id) {//if wrong token is presented
                //     throw new Error('token provided is not valid');
                //     // return response.status(403).json({ error: 'wrong token!' });
                // } else {//successful

                // }
            }
        }
    } catch (error) {
        throw error;
    }
}

//get one user by name
const getUserByName = async (name: string) => {
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [name]);
    return new User(user.rows[0].username, user.rows[0].lang, user.rows[0].id);

}

//add new user or if exists "login"
const createUser = async (username: string, lang: string) => {
    try {
        const user: User = await getUserByName(username);
        if (user != undefined) {
            return user;
        } else {
            const newUser = await pool.query('INSERT INTO users (username, lang) VALUES ($1, $2) RETURNING *', [username, lang]);
            return new User(newUser.rows[0].username, newUser.rows[0].lang, newUser.rows[0].id)
        }
    } catch (error) {
        throw error
    }
}

//update user info
const updateUser = (token: string, lang: string) => {
    pool.query(
        'UPDATE users SET lang = $1 WHERE id = $2',
        [token, lang],
        (error: Error, results: any) => {
            if (error) {
                throw error
            } else {
                // console.log(results); //TODO: delete after complete
                return ({ 'token': token, 'lang': lang });
            }
        }
    )
}

//delete user
const deleteUser = (token: string) => {
    pool.query('DELETE FROM users WHERE id = $1', [token], (error: any, results: any) => {
        if (error) {
            throw error
        } else {
            console.log(results);
            return (`User deleted with ID: ${token}`)
        }
    })
}

//export
module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}


// BL VS CONTROLLER - need to seprate the two. all error handle in next()
//config file by enviorment variables. conifg.ts - > file.env (gen variables & secrets) not in commit.
// https://www.npmjs.com/package/dotenv
// use const or let not var. immutable concept.
//unknow is better then any => typeof === blah
//use next(e)
//add try catch in async