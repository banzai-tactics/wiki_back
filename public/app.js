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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
var request = require("request");
var cors = require('cors');
var cookieParser = require('cookie-parser');
const db = require('./db/queries');
const wiki_1 = require("./services/wiki");
const app = (0, express_1.default)();
const port = 3000;
app.use(cors());
app.use(cookieParser());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
//db endpoints
app.get('/', (request, response, next) => { response.json({ info: 'Node.js, Express, and Postgres API' }); });
// get all users
app.get('/users', (req, res, next) => {
    const users = db.getUsers();
    res.status(200).json(users);
});
//get user
app.get('/users/:id', (req, res, next) => {
    try {
        const token = request.get('x-authentication');
        if (!token) { //if no token is presented
            throw (Error('no token was presented'));
        }
        else {
            const user = db.getUserById(token);
            res.status(200).json(user);
        }
    }
    catch (error) {
        next(error);
    }
});
//create new user
app.post('/user', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const username = body.username;
        const lang = body.lang;
        console.log(body.username);
        let options = {
            path: "/",
            sameSite: true,
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true, // The cookie only accessible by the web server
        };
        const user = yield db.createUser(username, lang);
        console.log(user.token);
        res.cookie('X-Authorization', user.token, options);
        res.status(200).send(user);
    }
    catch (error) {
        next(error);
    }
}));
// update user lang
app.put('/users/:token', (req, res, next) => {
    try {
        const token = req.params["token"];
        const lang = request.body; //TODO: check format sent
        db.updateUser(token, lang);
    }
    catch (error) {
        next(error);
    }
});
// delete user
app.delete('/users/:id', (req, res, next) => {
    try {
        const token = parseInt(req.params.id);
        db.deleteUser(token);
    }
    catch (error) {
        next(error);
    }
});
//wiki data
app.get('/introduction/:articleId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articleId = req.params["articleId"];
        const token = req.get('x-authentication');
        //  const lang: unknown = req.get('Accept-Language')?.substring(0, 2) // get from header
        if (typeof token === "string") {
            const wikiData = yield (0, wiki_1.getWikiParagraph)(articleId, token);
            console.log(wikiData);
            res.status(200).send(wikiData);
        }
        else {
            throw (Error('unvalid token'));
        }
    }
    catch (error) {
        next(error);
    }
}));
//Error handler
app.use((err, req, res, next) => {
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
