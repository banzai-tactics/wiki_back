import express from 'express';
import bodyParser from 'body-parser';
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
    const lang = req.get('Accept-Language').substring(0, 2) // get from header
    if (checkName(articleId)) {
        var wikiArticle = await getWiki(articleId, lang);
        res.send(wikiArticle);
    } else {
        var err = encodeURIComponent('name_containes_illegal_chars');
        res.redirect('../public/views/404.html/?err=' + err);
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