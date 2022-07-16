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
const uuid = require('uuid').v4;
const wiki_1 = require("./services/wiki");
const app = (0, express_1.default)();
const port = 3000;
app.use(cors());
app.use(cookieParser());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' });
});
//db endpoints
app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/user', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);
//get wiki info
app.get('/introduction/:articleId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var articleId = req.params["articleId"];
    const token = req.get('x-authentication');
    var lang = req.get('Accept-Language').substring(0, 2); // get from header
    if (token != undefined) {
        console.log(token);
        var url = `http://localhost:3000/users/${token}`;
        request({ url, headers: { "x-authentication": token } }, function (err, response, body) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    var error = "cannot connect to the server";
                }
                else {
                    lang = JSON.parse(body)[0].lang; // change if user chose lang.
                }
                if ((0, wiki_1.checkName)(articleId)) {
                    var wikiArticle = yield (0, wiki_1.getWiki)(articleId, lang);
                    res.send(wikiArticle);
                }
                else {
                    var errs = encodeURIComponent('name_containes_illegal_chars');
                    res.redirect('../public/views/404.html/?err=' + errs);
                }
            });
        });
    }
    else {
        var errs = encodeURIComponent('no_token_was_given');
        res.redirect('../public/views/404.html/?err=' + errs);
    }
}));
app.listen(port, () => {
    console.log(uuid);
    return console.log(`Express is listening at http://localhost:${port}`);
});
//404 page
app.use((req, res) => {
    res.sendFile('./views/404.html', { root: __dirname });
});
