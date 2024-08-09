const passport  = require('../config/passport');
const router = require('express').Router();
require('../models/Users')
const mongoose = require('mongoose'); 
var User = mongoose.model('User');


router.get('/', async function(req, res){
	var all_users = await User.find();
	//console.log("users are:", all_users);
	
	var  all_emails = [];
	for(let user of all_users){
		all_emails.push(user.email);
	}

	console.log("all usernames", all_emails);

	res.render('users', {users: all_emails} )
})

router.post('/delete-user', async function(req, res){
	var email = req.body.email;

	try {
		var prom = await User.deleteOne({email: email});
		res.redirect('/users');

	}catch (err) {
		console.err("User cannot be deleted...", err);
	}
	
})

module.exports = router