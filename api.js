const express = require('express');
const fs = require('fs');
const path = require('path');

const Question = require('./models/questionModel');

let api = express.Router();

api.get('/question', (req, res) => {
    Question.aggregate([{$sample: { size: 1 }}], (err, result) => {
        if (err) {
            console.log(err);
            res.json({});
        } else {
            res.json(result[0]);
        }
    });
});

api.get('/question/:id', (req, res) => {
    let id = Buffer.from(req.params.id, 'base64').toString('ascii');
    Question.findById(id, (err, doc) => {
        if (err) {
            console.log(err);
            res.json({});
        } else {
            res.json(doc);
        }
    });
});

api.post('/question', (req, res) => {
    let new_question = new Question({
        content: req.body.question,
        yes_count: 0,
        no_count: 0,
    });
    console.log('new question = ', new_question);
    new_question.save((err) => {
        if (err) {
            console.log(err);
            res.send('Error saving new question');
        } else {
            console.log('New question saved successfully');
            res.redirect('/question/' + Buffer.from(new_question._id.toString(), 'ascii').toString('base64'));
        }
    });
});

api.post('/answer', (req, res) => {
    let id = Buffer.from(req.body.id, 'base64').toString('ascii');
    Question.findById(id, (err, doc) => {
        if (req.body.answer == "Yes") {
            doc.yes_count += 1;
        } else {
            doc.no_count += 1;
        }
        doc.save((err) => {
            if (err) {
                console.log('Answer cannot be saved');
                res.send("Error sending answer");
            } else {
                console.log('Answer saved successfully');
                res.redirect('/question/' + req.body.id);
            }
        });
    });
});

module.exports = api;