const multer = require('multer');
const path = require('path');
const Music = require('../models/Music'); // Make sure this path is correct

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid conflicts
    }
});

const upload = multer({ storage: storage });

const MusicController = {
    index: (req, res) => {
        Music.getAllMusic((err, results) => {
            if (err) throw err;
            res.render('index', { musicList: results }); // Adjust to your variable names
        });
    },

    // Use multer middleware for file uploads
    addMusic: upload.single('mp3'), // Process the file upload
    addMusicHandler: (req, res) => {
        const musicData = {
            title: req.body.title,
            artist: req.body.artist,
            file_path: req.file.filename // Get the path from the uploaded file
        };
        
        Music.addMusic(musicData, (err) => {
            if (err) throw err;
            res.redirect('/'); // Redirect to index or wherever you want after adding
        });
    },

    deleteMusic: (req, res) => {
        const id = req.params.id;
        Music.deleteMusic(id, (err) => {
            if (err) throw err;
            res.redirect('/'); // Redirect after deletion
        });
    }
};

module.exports = MusicController;
