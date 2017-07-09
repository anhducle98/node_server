const mongoose = require('mongoose');

let questionSchema = mongoose.Schema({
    content: String,
    yes_count: Number,
    no_count: Number
});

module.exports = mongoose.model('Question', questionSchema);