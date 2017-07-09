const express = require('express');
const fs = require('fs');
const path = require('path');
const requestLib = require('request');

let router = express.Router();

router.get('/:id', (request, response) => {
    requestLib.get(
        'http://localhost:8888/api/question/' + request.params.id,
        (err, res, body) => {
            if (err) {
                console.log("Cannot get from api");
                response.send("ERROR");
                return;
            }
            if (res.statusCode == 200) {
                let data = JSON.parse(body);
                response.render('stats', {
                    content: data.content,
                    yes_count: data.yes_count,
                    no_count: data.no_count
                });
            } else {
                response.send("Cannot get question");
            }
        }
    );
});

module.exports = router;