import express from 'express';
import bodyParser from 'body-parser';
var request: any = require("request");
var cors = require('cors');
var cookieParser = require('cookie-parser');
const db = require('./db/queries');
const uuid = require('uuid').v4
import { getWiki, checkName } from './services/wiki';
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
app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
});
//db endpoints
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/user', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)
//get wiki info
app.get('/introduction/:articleId', async (req: any, res: any) => {
    var articleId: string = req.params["articleId"];
    const token = req.get('x-authentication');
    var lang = req.get('Accept-Language').substring(0, 2) // get from header
    if (token != undefined) {
        console.log(token);
        var url: string = `http://localhost:3000/users/${token}`;
        request({ url, headers: { "x-authentication": token } }, async function (err: any, response: any, body: any) {
            if (err) {
                var error = "cannot connect to the server";
            } else {
                lang = JSON.parse(body)[0].lang; // change if user chose lang.
            }
            if (checkName(articleId)) {
                var wikiArticle = await getWiki(articleId, lang);
                res.send(wikiArticle);
            } else {
                var errs = encodeURIComponent('name_containes_illegal_chars');
                res.redirect('../public/views/404.html/?err=' + errs);
            }
        });
    }else{
        var errs = encodeURIComponent('no_token_was_given');
        res.redirect('../public/views/404.html/?err=' + errs);
    }

});

app.listen(port, () => {
    console.log(uuid);
    return console.log(`Express is listening at http://localhost:${port}`);
});

//404 page
app.use((req, res) => {
    res.sendFile('./views/404.html', { root: __dirname });
})