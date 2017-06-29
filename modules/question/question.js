const express = require('express');
const fs = require('fs');
const path = require('path');

let router = express.Router();
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/question.html'));
});

router.post('/', (req, res) => {
    let file_path = path.join(__dirname, 'questions_list.txt');
    fs.appendFile(file_path, req.body.question + '\n', (err) => {
        if (err) throw err;
        console.log('Question appened successfully');
        res.sendFile(file_path);
    });
});

module.exports = router;