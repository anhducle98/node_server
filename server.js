const express = require('express');
const bodyParser = require('body-parser');
const requestLib = require('request');
const path = require('path');
const exphbs  = require('express-handlebars');

const PORT = 8888;

const apiRouter = require('./api.js');
const questionRouter = require('./question.js');

let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.resolve('./public')));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

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
            let o = JSON.parse(body);
            response.render('index', {
                content: o["content"],
                id: o["id"]
            });
        }
    );
});

//upload new question
app.get('/ask', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/question.html'));
});

app.listen(PORT, () => {
    console.log("Server started on port ", PORT);
});