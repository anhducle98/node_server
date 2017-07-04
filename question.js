const express = require('express');
const fs = require('fs');
const path = require('path');
const requestLib = require('request');

let router = express.Router();

router.get('/:id', (request, response) => {
    console.log("GET question");
    requestLib.get(
        'http://localhost:8888/api/question/' + request.params.id,
        (err, res, body) => {
            console.log("GET request completed");
            if (err) {
                console.log("Cannot get from api");
                response.send("ERROR");
                return;
            }
            if (res.statusCode == 200) {
                let o = JSON.parse(body);
                response.render('stats', {
                    content: o["content"],
                    yes_count: o["yes_count"],
                    no_count: o["no_count"]
                });
            } else {
                response.send("Cannot get question");
            }
        }
    );
});

module.exports = router;