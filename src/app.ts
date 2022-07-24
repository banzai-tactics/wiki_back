import express from 'express';
import bodyParser from 'body-parser';
var request: any = require("request");
var cors = require('cors');
var cookieParser = require('cookie-parser');
const db = require('./db/queries');
import { getWikiParagraph } from './services/wiki';
import { next } from 'cheerio/lib/api/traversing';
const app = express();
const port = 3000;

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
app.get('/users', (req, res, next) => {
    const users = db.getUsers()
    res.status(200).json(users)
});
//get user
app.get('/users/:id', (req, res, next) => {
    try {
        const token = request.get('x-authentication');
        if (!token) {//if no token is presented
            throw (Error('no token was presented'));
        } else {
            const user = db.getUserById(token);
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
        const username = body.username;
        const lang = body.lang;
        console.log(body.username);
        let options = {
            path: "/",//TODO: need to check what this means
            sameSite: true,
            maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
            httpOnly: true, // The cookie only accessible by the web server
        }
        const user = await db.createUser(username, lang);
        console.log(user.token);
        res.cookie('X-Authorization', user.token, options)
        res.status(200).send(user);
    } catch (error) {
        next(error)
    }
})
// update user lang
app.put('/users/:token', (req, res, next) => {
    try {
        const token: string = req.params["token"];
        const lang = request.body; //TODO: check format sent
        db.updateUser(token, lang)
    } catch (error) {
        next(error)
    }
});
// delete user
app.delete('/users/:id', (req, res, next) => {
    try {
        const token = parseInt(req.params.id)
        db.deleteUser(token)
    } catch (error) {
        next(error)
    }
})
//wiki data
app.get('/introduction/:articleId', async (req, res, next) => {
    try {
        const articleId: string = req.params["articleId"];
        const token: unknown = req.get('x-authentication');
        //  const lang: unknown = req.get('Accept-Language')?.substring(0, 2) // get from header
        if (typeof token === "string") {
            const wikiData = await getWikiParagraph(articleId, token);
            console.log(wikiData);
            res.status(200).send(wikiData);
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

// BL VS CONTROLLER - need to seprate the two. all error handle in next()
//config file by enviorment variables. conifg.ts - > file.env (gen variables & secrets) not in commit.
// https://www.npmjs.com/package/dotenv
// use const or let not var. immutable concept.
//unknow is better then any => typeof === blah
//use next(e)
//add try catch in async