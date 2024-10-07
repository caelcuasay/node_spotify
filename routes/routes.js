const express = require('express');
const MusicController = require('../controllers/MusicController'); 
const routes = express.Router();


routes.get('/', MusicController.index);
routes.get('/index', MusicController.index);  


routes.get('/add', (req, res) => {
    res.render('add');
});


routes.post('/add', MusicController.addMusic, MusicController.addMusicHandler);


routes.get('/delete/:id', MusicController.deleteMusic);

module.exports = routes;