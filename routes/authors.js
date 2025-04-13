const express = require('express');
const router = express.Router();
const Author = require('../models/Author');

// All Authors route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name && req.query.name.length !== "") { // here we need to access the query, since GET posts the parameters in the query ?name=john, POST sends them through the body
        searchOptions.name = new RegExp(req.query.name, "i"); //i = not case sensitive
    }
    try{
        const authors = await Author.find(searchOptions);
        res.render('authors/index', {authors: authors,
            searchOptions: req.query
        });
    } catch {
        res.redirect('/');
    }
    //res.send("Hello World - Anything")
})

// New Author route, display Author
router.get('/new', (req, res) => {
    res.render('authors/new', {author: new Author()})
})

// Create Author route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    });
// since we use Mongoose we need to call that asynchronous
    try {
        const newAuthor = await author.save();
        res.redirect('authors');
        // Oder, wenn du auf die Detailseite willst:
        // res.redirect(`authors/${newAuthor.id}`);
    } catch (err) {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating an author!'
        });
    }
});



module.exports = router;