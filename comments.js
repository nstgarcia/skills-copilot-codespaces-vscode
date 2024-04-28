// Create web server
const express = require('express');
const app = express();

// Use EJS as view engine
app.set('view engine', 'ejs');

// Use the express.static middleware to serve static files
app.use(express.static('public'));

// Use the body-parser middleware to parse the body of the POST request
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// Get the comments from the comments.json file
const fs = require('fs');
const comments = JSON.parse(fs.readFileSync('comments.json', 'utf8'));

// Use the express-session middleware
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// Use the express-messages middleware
const flash = require('express-flash');
app.use(flash());

// Use the express-validator middleware
const { check, validationResult } = require('express-validator');

// Add the following code to the comments.js file
app.post('/comments', [
    check('name').isLength({min: 1}).withMessage('Name is required'),
    check('message').isLength({min: 1}).withMessage('Message is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        res.redirect('/');
    } else {
        comments.push({
            name: req.body.name,
            message: req.body.message
        });
        fs.writeFileSync('comments.json', JSON.stringify(comments));
        req.flash('success', 'Comment added successfully');
        res.redirect('/');
    }
});

// Add the following code to the comments.js file
app.get('/comments', (req, res) => {
    res.render('comments', {comments: comments});
});

// Add the following code to the comments.js file
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});

// Path: views/comments.ejs
<!DOCTYPE html>
<html>
    <head>
        <title>Comments</title>
    </head>
    <body>
        <h1>Comments</h1>
        <ul>
            <% comments.forEach(function(comment) { %>
                <li><%= comment.name %>: <%= comment.message %></li>
            <% }); %>
        </ul>
    </body>
</html>

// Path: public