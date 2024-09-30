const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const path = require('path'); // Import path module

const app = express();
const port = 3000;

// Set the view engine
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/', routes);

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);


app.use('/uploads', express.static('uploads'));

});
