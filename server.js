const express = require('express');
const bodyParser = require('body-parser');
const requestLib = require('request');
const path = require('path');
const pug = require('pug');
const mongoose = require('mongoose');
const config = require('./config.json');

const PORT = 8888;

const apiRouter = require('./api.js');
const questionRouter = require('./question.js');

let app = express();

mongoose.connect(config.dbpath, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Database server connected");
    }
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.resolve('./public')));

app.set('views', './views')
app.set('view engine', 'pug');

app.use('/api', apiRouter);
app.use('/question', questionRouter);

app.get('/', (request, response) => {
    requestLib.get(
        'http://localhost:8888/api/question',
        (err, res, body) => {
            if (err || res.statusCode != 200) {
                console.log(err);
                response.send("ERROR");
                return;
            }
            let data = JSON.parse(body);
            console.log(body);
            response.render('index', {
                content: data.content,
                id: Buffer.from(data._id.toString(), 'ascii').toString('base64')
            });
        }
    );
});

//upload new question
app.get('/ask', (req, res) => {
    res.render('question');
});

app.listen(PORT, () => {
    console.log("Server started on port ", PORT);
});