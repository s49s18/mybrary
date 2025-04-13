if (process.env.NODE_ENV !== 'production') { //wenn wir nicht im production code sind, möchten wir, dass die environment variables aus dem file .env geladen werden
    require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {})
const db = mongoose.connection
db.on('error', (err) => {console.log(err)})
db.once('open', (conn) => {console.log(`Connected to Mongoose ${conn}.`)});

app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)

app.listen(process.env.PORT || 3003 )