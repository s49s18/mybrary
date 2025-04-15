const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const imageMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];

// All Books route
router.get('/', async (req, res) => {
    let query = Book.find()
    if (req.query.title != null && req.query.title !== ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore !== ""){
        query = query.lte('publishDate', req.query.publishedBefore); //lte = less than before
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter !== ""){
        query = query.gte('publishDate', req.query.publishedAfter); //gte = greater than before
    }
    try{
        const books = await query.exec()
        res.render('books/index.ejs', {
            books: books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }

})

// New Books route, display Author
router.get('/new', async(req, res) => {
    renderNewPage(res, new Book())
})

// Create Books route
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate), //date is in body as String so we have to convert it with new Date()
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(book, req.body.cover)

    try{
        const newBook = await book.save()
        res.redirect('books');
        //res.redirect(`books/${newBook.id}`)
    } catch (err) {
        console.error(err);
        renderNewPage(res, book, true)
    }
})
// since we use Mongoose we need to call that asynchronous

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) {
            params.errorMessage = "Error while creating the book";
        }
        res.render('books/new', params);
    } catch {
        res.redirect('/books');
    }
}

function saveCover(book, coverEncoded){
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64') //convert String to base64 coverted Buffer
        book.coverImageType = cover.type
    }
}


module.exports = router;