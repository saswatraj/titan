var express = require('express');
var path = require('path')
var hbs = require('express-handlebars');

// define routers here
var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.engine('hbs', hbs({extname: '.hbs', defaultLayout: 'layout', layoutsDir: path.join(__dirname, 'views')}));
app.set('view engine', 'hbs');

// static assets setup
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/assets'));

// routes setup
app.use('/', indexRouter);

module.exports = app;