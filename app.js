const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./config/passport');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
const router = require('./routes');
require('./models/Users');
require('./models/Posts');
const configurations= require('./config/index');
const flash = require('connect-flash');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production'

// create global app object
const app = express();

app.use(flash());

//express configuration setting
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({secret: 'Its a secret!', 
                 saveUninitialized:true, 
                 resave:false}));


app.use(passport.initialize());
app.use(passport.session());


if (!isProduction){
	app.use(errorHandler())
	mongoose.connect('mongodb://localhost/schooldiary_db');
	mongoose.set('debug', true);
}
else {
	mongoose.connect(process.env.MONGODB_URI);
}


// Serve static files from the "public upload directory" directory
staticPath =path.join(__dirname, configurations.uploadDir);
app.use( configurations.uploadDir , express.static(staticPath));

//set templating engine
app.set('view engine', 'pug')
app.set('views', './views')

app.use(router);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
  });
  
  /// error handlers
  
  // development error handler will print stacktrace
  if (!isProduction) {
	app.use(function(err, req, res, next) {
	  console.log(err.stack);
  
	  res.status(err.status || 500);
  
	  res.json({'errors': {
		message: err.message,
		error: err
	  }});
	});
  }
  
  // production error handler no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
	res.json({'errors': {
	  message: err.message,
	  error: {}
	}});
  });
  
  // finally, let's start our server...
  var server = app.listen( process.env.PORT || 3000, function(){
	console.log('Listening on port ' + server.address().port);
  });
