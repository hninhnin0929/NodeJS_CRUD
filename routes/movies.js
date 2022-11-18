var express = require('express');
var router = express.Router();

// let movies = [
//     {
//         title: "Matrix",
//         year: 1988,
//     },
//     {
//         title: "Titanic",
//         year: 2000,
//     }
// ]

let Movies = require('../model/moviesData');

router.get('/', async (req, res)=> {
    try{
        const movies = await Movies.find();
        if(!movies) throw Error('No Items');
        await res.status(200).json(movies);
    }catch(err){
        await res.status(400).json({mesg: err})
    }
});
router.get('/:id', async (req, res)=> {
    try{
        const movie = await Movies.findById(req.params.id);
        if(!movie) throw Error('No Items');
        await res.status(200).json(movie);
    }catch(err){
        await res.status(400).json({mesg: err})
    }
});

router.post('/', async (req, res)=> {
    const newMovie = new Movies(req.body);
    try{
        const saveMovie = await newMovie.save();
        if(!saveMovie) throw Error('Someting went wrong with the movie');
        await res.status(200).json(saveMovie);
    }catch(err){
        await res.status(400).json({mesg: err})
    }
});

router.patch('/:id', async (req, res)=> {
    try{
        const movie = await Movies.findByIdAndUpdate(req.params.id, req.body);
        if(!movie) throw Error('Someting went wrong with the movie');
        await res.status(200).json({success: true, movie: movie});
    }catch(err){
        await res.status(400).json({mesg: err})
    }
});

router.delete('/:id', async (req, res)=> {
    try{
        const movie = await Movies.findByIdAndDelete(req.params.id);
        if(!movie) throw Error('No movie found');
        await res.status(200).json({success: true});
    }catch(err){
       await res.status(400).json({mesg: "Movie Not Found"})
    }
});

/* GET movies listing. */
/*
router.get('/', function(req, res, next) {
    console.log("Movies / Controller")
    res.send(movies);
});
*/

/* GET movies listing. */
router.get(/matrix.*$/, function(req, res, next) {
    console.log("Movies Matrix / Controller");
    res.send('Movies Matrix List');
});

/* GET movies id. */
router.get('/:movieId/', function(req, res, next) {
    console.log("MovieID / Controller");
    res.send('Get Movies with MovieID');
});

/* POST movies created. */
router.post('/', function(req, res, next) {
    console.log("Movies Create / Controller", req.body);
    movies.push(req.body);
    res.send('Movie Create');
});

/* GET movies details. */
router.get('/details', function(req, res, next) {
    console.log("Movies Details / Controller");
    res.send('Movies Details');
});

module.exports = router;
