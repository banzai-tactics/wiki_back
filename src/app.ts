import express from 'express';
import bodyParser from 'body-parser';
var request = require("request");
var cors = require('cors');
var cookieParser = require('cookie-parser');
const db = require('./db/queries');
import { getWikiParagraph } from './services/wiki';
const app = express();
const port = 3000;
import { connection } from './db/data-source'

const conn = async () => {
    await connection();
}
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
//db endpoints
app.get('/', (request, response, next) => { response.json({ info: 'Node.js, Express, and Postgres API' }) });
// get all users
app.get('/users', async (req, res, next) => {
    const users = await db.getAllUsersTypeORM()
    res.status(200).json(users);
});
//get user
app.get('/users/:id', async (req, res, next) => {
    try {
        const token = request.get('x-authentication');
        if (!token) {//if no token is presented
            res.status(401).json(Error('no token was presented'))
        } else {
            const user = await db.getUserByIdTypeORM(token);
            res.status(200).json(user)
        }
    } catch (error) {
        next(error);
    }

});
//create new user
app.post('/user', async (req, res, next) => {
    try {
        const body = req.body;
        console.log(body);
        const username = body.username;
        const lang = body.lang;
        let options = {
            path: "/",//TODO: need to check what this means
            sameSite: true,
            maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
            httpOnly: true, // The cookie only accessible by the web server
        }
        const user = await db.createUserTypeORM(username, lang);
        console.log(user);
        res.cookie('X-Authorization', user.token, options)
        res.status(200).send(user);
    } catch (error) {
        next(error)
    }
})
// update user lang
app.put('/users/:token', async (req, res, next) => {
    try {
        const token: string = req.params["token"];
        const lang = request.body; //TODO: check format sent
        await db.updateUserTypeORM(token, lang)
    } catch (error) {
        next(error)
    }
});
// delete user
app.delete('/users/:id', async (req, res, next) => {
    try {
        const token = parseInt(req.params.id)
        await db.removeUserTypeORM(token)
    } catch (error) {
        next(error)
    }
})
//wiki data
app.get('/introduction/:articleId', async (req, res, next) => {
    try {
        const articleId: string = req.params["articleId"];
        const token: unknown = req.get('x-authentication');
        console.log(articleId)

        //  const lang: unknown = req.get('Accept-Language')?.substring(0, 2) // get from header
        if (typeof token === "string") {
            const wikiData = await getWikiParagraph(articleId, token);
            const userSearchHistory = (await db.getUserByIdTypeORM(token)).searches;
            res.status(200).send({ wikiData, userSearchHistory });
        } else {
            throw (Error('unvalid token'));
        }
    } catch (error) {
        next(error);
    }

});
//Error handler
app.use((err: any, req: any, res: any, next: any) => {
    res.status(400).send(err.message);
    // res.sendFile('./views/404.html', { root: __dirname });
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});


export default app;
