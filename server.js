const express = require('express');
const bodyParser = require('body-parser');

const questionRouter = require('./modules/question/question.js');
let PORT = 8888;

let app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/question', questionRouter);

app.listen(PORT, () => {
    console.log(`Server started listening on port ${PORT}`);
});
