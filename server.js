var express = require('express');
var path = require('path')
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');

// define routers here
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var cdnRouter = require('./routes/cdn');
var printRouter = require('./routes/prints');
var contactRouter = require('./routes/contact');

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({limit: '200mb', extended: true })); // support encoded bodies

// view engine setup
app.engine('hbs', hbs({
    extname: '.hbs', 
    defaultLayout: 'layout',
    helpers: require("./helpers/handlebarHelper.js").helpers,
    layoutsDir: path.join(__dirname, 'views'
    )}));
app.set('view engine', 'hbs');

// static assets setup
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/jquery/dist'));
app.use(express.static(__dirname + '/node_modules/masonry-layout/dist'));
app.use(express.static(__dirname + '/node_modules/dm-file-uploader/dist'));
app.use(express.static(__dirname + '/assets'));

// routes setup
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/cdn', cdnRouter);
app.use('/prints', printRouter);
app.use('/contact', contactRouter);

module.exports = app;