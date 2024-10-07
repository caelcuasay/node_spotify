const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Music = require('../models/Music');

// Configure multer for both music and image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = file.fieldname === 'mp3' ? 'uploads/music' : 'uploads/covers';
        // Create directories if they don't exist
        fs.mkdirSync(dest, { recursive: true });
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'mp3') {
        // Allow only mp3 files
        cb(null, file.mimetype === 'audio/mpeg');
    } else if (file.fieldname === 'album_cover') {
        // Allow common image formats
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
        cb(null, allowedMimes.includes(file.mimetype));
    } else {
        cb(null, false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

const MusicController = {
    index: (req, res) => {
        Music.getAllMusic((err, results) => {
            if (err) {
                console.error('Error in index controller:', err);
                return res.status(500).send('Error loading music list');
            }
            res.render('index', { musicList: results });
        });
    },

    // Handle multiple file uploads
    addMusic: upload.fields([
        { name: 'mp3', maxCount: 1 },
        { name: 'album_cover', maxCount: 1 }
    ]),

    addMusicHandler: (req, res) => {
        if (!req.files || !req.files.mp3) {
            return res.status(400).send('No music file uploaded');
        }

        const musicData = {
            title: req.body.title,
            artist: req.body.artist,
            file_path: req.files.mp3[0].filename,
            album_cover: req.files.album_cover ? req.files.album_cover[0].filename : 'default-album.jpg'
        };
        
        Music.addMusic(musicData, (err) => {
            if (err) {
                console.error('Error in addMusicHandler:', err);
                return res.status(500).send('Error adding music');
            }
            res.redirect('/');
        });
    },

    deleteMusic: (req, res) => {
        const id = req.params.id;
        
        if (!id) {
            return res.status(400).send('No ID provided');
        }

        Music.deleteMusic(id, (err, deleteResult, files) => {
            if (err) {
                console.error('Error in deleteMusic:', err);
                return res.status(500).send('Error deleting music');
            }

            // Delete the actual files
            if (files) {
                if (files.file_path) {
                    fs.unlink(path.join(__dirname, '../uploads/music', files.file_path), (err) => {
                        if (err) console.error('Error deleting music file:', err);
                    });
                }
                if (files.album_cover && files.album_cover !== 'default-album.jpg') {
                    fs.unlink(path.join(__dirname, '../uploads/covers', files.album_cover), (err) => {
                        if (err) console.error('Error deleting cover image:', err);
                    });
                }
            }

            res.redirect('/');
        });
    }
};

module.exports = MusicController;