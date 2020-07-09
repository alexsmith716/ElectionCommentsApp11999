// cd documents/oldss/electioncommentsapp1999
var express 		= require('express');
var path 			= require('path');
var logger 			= require("morgan");
var bodyParser 		= require('body-parser');
//var cookieParser = require("cookie-parser");
var methodOverride 	= require('method-override');
var parseurl 		= require('parseurl');
var flash 		= require('connect-flash');
var passport 		= require('passport');
var session 		= require('express-session');
//var MongoStore 		= require('connect-mongo')(session);
var mongoose 		= require('mongoose');
//require('./theAPI/model/dbConnector');
var setUpPassport = require('./theAPI/model/setuppassport');

var serverRoutes = require('./theServer/routes/serverRoutes');
var apiRoutes = require('./theAPI/routes/apiRoutes');
var app       = express();
module.exports    = app;

var uri 			= 'mongodb://localhost/ElectionComments2016';
mongoose.Promise = global.Promise;
mongoose.connect(uri);
//global.db 			= mongoose.createConnection(uri);
setUpPassport();

app.set("port", process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'theServer', 'views'));
app.set('view engine', 'jade');

var handleProcessTermination;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(logger('short'));

app.use(session({
  secret: '5hu80@c73+g7A*k1l',
  saveUninitialized: false,
  resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
  console.log("In comes a " + req.method + " to " + req.url);
  //res.locals.currentUserX = req.user;
  //console.log('####### > apiRoutes.js > router.use ++++++++++++++++++++++++++++++++++1', req)
  console.log('####### > app.js > app.use ++++++++++++++++++++++++++++++++++2', req)
  console.log('####### > app.js > app.use ++++++++++++++++++++++++++++++++++2', res)
  next();
});

app.use('/', function (req, res, next) {
  next()
});

app.use('/:commentid', function (req, res, next) {
  //console.log('####### > app.js > app.use > /:commentid: ', req.method)
  next();
});

app.use('/', serverRoutes);
app.use('/api', apiRoutes);

app.listen(3000, function() {
  console.log('listening on http://localhost:3000');
});

