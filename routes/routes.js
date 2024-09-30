const express = require('express');
const MusicController = require('../controllers/MusicController'); 
const routes = express.Router();

// Home page showing the music list
routes.get('/', MusicController.index);

// Page for adding new music
routes.get('/add', (req, res) => {
    res.render('add');
});

// Handle adding new music (using multer for file uploads)
routes.post('/add', MusicController.addMusic, MusicController.addMusicHandler);

// Delete a music entry
routes.get('/delete/:id', MusicController.deleteMusic);

module.exports = routes;
