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
const getUsers = (request: any, response: any) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error: any, results: any) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
//get one user by id
const getUserById = (request: any, response: any) => {
    const id = parseInt(request.params.id)
    const token = request.get('x-authentication');
    if (!token) {//if no token is presented
        return response.status(403).json({ error: 'No credentials sent!' });
    } else {
        pool.query('SELECT * FROM users WHERE id = $1', [id], (error: any, results: any) => {
            if (error) {
                throw error
            }
            if (token != results.rows[0].id) {//if wrong token is presented
                return response.status(403).json({ error: 'wrong token!' });
            } else {//successful
                return response.status(200).json(results.rows);
            }
        })
    }
}

//get one user by name
const getUserByName = (name: string,response:any) => {
    console.log('test');
    pool.query('SELECT * FROM users WHERE username = $1', [name], (error: any, results: any) => {
        if (error) {
            throw error
        }
        else {//successful
            response.status(201).send({ 'token': `${results.rows[0].id}` })
        }
    })
}

//add new user or if exists "login"
const createUser = (request: any, response: any) => {
    const { username, lang } = request.body;
    let options = {
        path: "/",
        sameSite: true,
        maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
        httpOnly: true, // The cookie only accessible by the web server
    }
    pool.query('INSERT INTO users (username, lang) VALUES ($1, $2) RETURNING *', [username, lang], (error: any, results: any) => {
        if (error) {
            console.log(error.constraint);
            if (error.constraint == "uniquename") {//user already exits
               getUserByName(username, response)
            }else{
                response.status(500).send({ 'token': `${error}` })
            }
        } else {
            const token = results.rows[0].id
            response.cookie('X-Authorization', token, options)
            // response.redirect('/')
            response.status(201).send({ 'token': `${results.rows[0].id}` })
        }
    })
}

//update user info
const updateUser = (request: any, response: any) => {
    const id = parseInt(request.params.id)
    const { username, lang } = request.body

    pool.query(
        'UPDATE users SET username = $1, lang = $2 WHERE id = $3',
        [username, lang, id],
        (error: any, results: any) => {
            if (error) {
                throw error
            }
            response.status(200).send(`User modified with ID: ${id}`)
        }
    )
}

//delete user
const deleteUser = (request: any, response: any) => {
    const id = parseInt(request.params.id)
    pool.query('DELETE FROM users WHERE id = $1', [id], (error: any, results: any) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
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