const db = require('../config/db'); // Your database connection

const Music = {
    // Function to retrieve all music from the database
    getAllMusic: (callback) => {
        const query = 'SELECT * FROM music';
        db.query(query, callback);
    },

    // Function to add new music to the database
    addMusic: (data, callback) => {
        const query = 'INSERT INTO music (title, artist, file_path) VALUES (?, ?, ?)';
        db.query(query, [data.title, data.artist, data.file_path], callback);
    },

    // Function to delete a music entry by ID
    deleteMusic: (id, callback) => {
        const query = 'DELETE FROM music WHERE id = ?';
        db.query(query, [id], callback);
    }
};

module.exports = Music;
