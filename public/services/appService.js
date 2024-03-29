"use strict";
//TODO: need to add restrictive permissions
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'api',
    password: 'shefi',
    port: 5432,
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
const getUserById = (token) => {
    if (!token) { //if no token is presented
        throw new Error('token provided is not valid');
    }
    else {
        pool.query('SELECT * FROM users WHERE id = $1', [token], (error, results) => {
            if (error) {
                throw error;
            }
            else {
                if (token != results.rows[0].id) { //if wrong token is presented
                    throw new Error('token provided is not valid');
                    // return response.status(403).json({ error: 'wrong token!' });
                }
                else { //successful
                    return results.rows;
                }
            }
        });
    }
};
//get one user by name
const getUserByName = (name, response) => {
    console.log('test');
    pool.query('SELECT * FROM users WHERE username = $1', [name], (error, results) => {
        if (error) {
            throw error;
        }
        else { //successful
            response.status(201).send({ 'token': `${results.rows[0].id}` });
        }
    });
};
//add new user or if exists "login"
const createUser = (request, response) => {
    const { username, lang } = request.body;
    let options = {
        path: "/",
        sameSite: true,
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true, // The cookie only accessible by the web server
    };
    pool.query('INSERT INTO users (username, lang) VALUES ($1, $2) RETURNING *', [username, lang], (error, results) => {
        if (error) {
            console.log(error.constraint);
            if (error.constraint == "uniquename") { //user already exits
                getUserByName(username, response);
            }
            else {
                response.status(500).send({ 'token': `${error}` });
            }
        }
        else {
            const token = results.rows[0].id;
            response.cookie('X-Authorization', token, options);
            // response.redirect('/')
            if (lang != results.rows[0].lang) { //lang different then db -> update
            }
            else {
                response.status(201).send({ 'token': `${results.rows[0].id}`, 'lang': lang });
            }
        }
    });
};
//update user info
const updateUser = (request, response) => {
    const id = parseInt(request.params.id);
    const body = request.body;
    console.log(body.id);
    console.log(body.lang);
    pool.query('UPDATE users SET lang = $1 WHERE id = $2', [body.lang, body.id], (error, results) => {
        if (error) {
            throw error;
        }
        console.log(results);
        response.status(200).send({ 'token': body.id, 'lang': body.lang });
    });
};
//delete user
const deleteUser = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`User deleted with ID: ${id}`);
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
