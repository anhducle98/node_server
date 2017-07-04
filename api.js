const express = require('express');
const fs = require('fs');
const path = require('path');

let api = express.Router();

let Utils = {
    file_path: path.join(__dirname, 'questions_list.json'),
    get_question_list: () => {
        let file_path = path.join(__dirname, 'questions_list.json');
        try {
            var questionList = JSON.parse(fs.readFileSync(file_path, 'utf-8'));
        } catch (err) {
            console.log(err);
            res.send("Sorry error happened");
            return;
        }
        if (!questionList) questionList = [];
        return questionList;
    },
    set_question_list: (questionList, callback) => {
        fs.writeFile(Utils.file_path, JSON.stringify(questionList), (err) => {
            if (err) {
                console.log("Cannot writeFile");
                console.log(err);
            }
            callback();
        });
    }
};

api.get('/question', (req, res) => {
    let questionList = Utils.get_question_list();
    if (questionList.length == 0) {
        res.send("Sorry I don't have any questions :v");
        return;
    }
    res.json(questionList[Math.floor(Math.random() * questionList.length)]);
});

api.get('/question/:id', (req, res) => {
    console.log("API received GET request");
    let questionList = Utils.get_question_list();
    if (questionList.length == 0) {
        res.send("Sorry I don't have any questions :v");
        return;
    }
    let id = req.params.id;
    id %= questionList.length;
    res.json(questionList[id]);
});

api.post('/question', (req, res) => {
    let questionList = Utils.get_question_list();
    let new_question = {
        content: req.body.question,
        yes_count: 0,
        no_count: 0,
        id: questionList.length
    }
    console.log('new question = ', new_question);
    questionList.push(new_question);
    Utils.set_question_list(questionList, () => {
        res.redirect('/question/' + new_question.id);
    });
});

api.post('/answer', (req, res) => {
    let questionList = Utils.get_question_list();
    let id = req.body.id % questionList.length;
    if (req.body.answer == "Yes") {
        questionList[id].yes_count += 1;
    } else {
        questionList[id].no_count += 1;
    }
    Utils.set_question_list(questionList, () => {
        res.redirect('/question/' + id);
    });
});

module.exports = api;