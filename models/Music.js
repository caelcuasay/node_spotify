const db = require('../config/db');

const Music = {
    getAllMusic: (callback) => {
        const query = 'SELECT * FROM music ORDER BY created_at DESC';
        db.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching music:', error);
            }
            callback(error, results);
        });
    },

    addMusic: (data, callback) => {
        const query = 'INSERT INTO music (title, artist, file_path, album_cover) VALUES (?, ?, ?, ?)';
        db.query(query, [data.title, data.artist, data.file_path, data.album_cover], (error, results) => {
            if (error) {
                console.error('Error adding music:', error);
            }
            callback(error, results);
        });
    },

    deleteMusic: (id, callback) => {
        // First get the file paths to delete the actual files
        const getPathsQuery = 'SELECT file_path, album_cover FROM music WHERE id = ?';
        db.query(getPathsQuery, [id], (error, results) => {
            if (error) {
                return callback(error);
            }
            
            const deleteQuery = 'DELETE FROM music WHERE id = ?';
            db.query(deleteQuery, [id], (error, deleteResults) => {
                callback(error, deleteResults, results[0]);
            });
        });
    }
};

module.exports = Music;