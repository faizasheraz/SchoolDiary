// initial setup of passport js

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
require('../models/Users');
var User = mongoose.model('User');

passport.use(new LocalStrategy({usernameField: 'email'}, async function(email, password, done){
	try {
		console.log("inside passport.use function...........");
	    const user = await User.findOne({email})
	    
		if (!user || !(await user.validPassword(password))){
				console.log("email or password is invalid");
				return done(null, false, {errors: 'Email or password is invalid'});
			}
			console.log("returning user");
			return done(null, user);
	} catch (err) {
			return done(err);
	}
}));

passport.serializeUser(function(user, done){
	console.log('inside serialize user');
	done(null, user.id);
	console.log("ending serialize user");
});

passport.deserializeUser(async function(id, done){
	try{
		console.log("inside deserialize");
		const user = await User.findById(id);
		console.log('got user')
		done(null, user);
	}catch (err){
		console.err("error in deserialized user");
		done(err, null);
	}
});

module.exports = passport;