const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MoviesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    director:{
        name: {
            type: String,
            required: true
        }
    },
    year: {
        type: Number
    }
});

module.exports = mongoose.model('Movies',MoviesSchema);