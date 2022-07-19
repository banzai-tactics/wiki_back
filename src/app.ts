import express from 'express';
import bodyParser from 'body-parser';
var request: any = require("request");
var cors = require('cors');
var cookieParser = require('cookie-parser');
const db = require('./db/queries');
const uuid = require('uuid').v4
import { getWikiParagraph } from './services/wiki';
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
app.get('/users', db.getUsers) // get all users
app.get('/users/:id', db.getUserById) //get user
app.post('/user', db.createUser) //create new user
app.put('/users/:id', db.updateUser) // update user lang
app.delete('/users/:id', db.deleteUser) // delete user
app.get('/introduction/:articleId', async (req: any, res: any) => {getWikiParagraph(req, res);}); //wiki data
app.use((req, res) => {res.sendFile('./views/404.html', { root: __dirname });});//404 page
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});