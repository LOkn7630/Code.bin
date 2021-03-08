const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const app = express();
const crypto = require('crypto');
const path = require('path');
const dotenv = require('dotenv')
const { ensureAuthenticated } = require('./config/auth');
var filesdes = require('./model/filesdes');
dotenv.config({ path: './config/config.env' })
var MongoClient = require('mongodb').MongoClient;
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        a = file.originalname
        a = a.split(" ").join("")
        cb(null, new Date().toISOString().replace(/:/g, '-') + a)
    }
});
const upload = multer({ storage: storage });
app.use(methodOverride('_method'));


const mongoURI = 'mongodb+srv://Test:Test@cluster0.xck0h.mongodb.net/ABC?retryWrites=true&w=majority';
const conn = mongoose.createConnection(mongoURI, (error, client) => {
    if (error)
        console.log(err);

    else {
        console.log("Connected to db");
    }
});

//GFS




//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));



//BodyParser

app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
    session({
        secret: 'secrettexthere',
        resave: true,
        saveUninitialized: true
    })
);

const t = require('./config/passport');
t.method(passport);


app.use(passport.initialize());
app.use(passport.session());

// connect flash 

app.use(flash());





// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
const PORT = process.env.PORT || 5000;


app.get('/upload', (req, res) => res.render('upload'));
app.get('/showall', (req, res) => res.render('show_files'));
app.post('/users/upload', upload.single('fileupload'), (req, res, next) => {
    //  console.log(req.body.name);
    const des = req.body.name;
    const tags = req.body.email;
    var a = req.session.passport;
    //console.log(des);
    //  console.log(tags);
    //  console.log(a.user);
    // console.log(req.file);


    if (des.length == 0) {
        req.flash('error_msg', 'Please enter description');
        res.redirect('/upload');
    }
    if (tags.length == 0) {
        req.flash('error_msg', 'Please enter tags');
        res.redirect('/upload');
    }




    const filesdes1 = new filesdes({
        _id: new mongoose.Types.ObjectId(),
        user: a.user,
        name: req.file.filename,
        description: des,
        tags: tags,
        url: "http://localhost:5000/uploads/" + req.file.filename
    });

    filesdes1.save();



    res.redirect('/upload');
});

/*
app.get('/:id', (req, res) => {
    console.log(req.params.id);
    res.redirect('/dashboard');

})
*/
app.listen(PORT, console.log("server is started on port 5000"));
