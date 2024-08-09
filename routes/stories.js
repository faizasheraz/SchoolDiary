const passport  = require('../config/passport');
const upload = require('../config/mult');
const router = require('express').Router();
require('../models/Users');
require('../models/Posts');
const mongoose = require('mongoose'); 
var User = mongoose.model('User');
const Post = mongoose.model('Post');
const flash = require('connect-flash');
const moment = require('moment');

function authenticationMiddleware () {
	console.log("in authentication middleware")
	return function (req, res, next) {
	  if (req.isAuthenticated()) {
		return next()
	  }
	  res.redirect('/login')
	}
  }

router.get('/login', function(req, res){
	let err = req.flash('error');
	console.log("error message is:", err);
	res.render('login', {messages: err});
});

router.post('/login', passport.authenticate('local', {
	successRedirect : '/',
	failureRedirect : '/login',
	failureFlash : "Invalid Credentials!"
}));

router.get('/signup', function(req, res){
	res.render('signup');
})

router.post('/signup', async function(req, res, next){

	if (!req.body.password){
		res.render('signup', {message: "Password cannot be blank"});
	}

	try {
		var newUser = User();
		newUser.username = req.body.username;
		newUser.email = req.body.email;
		newUser.password = await newUser.setPassword(req.body.password);
	    console.log("pasword hash is", newUser.password);
		await newUser.save();
		console.log("after saving")
		res.redirect('/successfulSignup');
	} catch(err) {
		res.status(400).send(err.message);
	}
})

router.get('/successfulSignup', function(req, res){
	res.render('successfulSignup');
});

function renderStories() {
	return async function (req, res) {
		console.log("inside render stories");

		try{
			var posts = await Post.find().populate('user','username');
		const user = req.user.username;
		console.log("posts are:", posts);

				
		let display_posts = posts.map(post => ({
			description: post.description,
			user: post.user.username,
			imgurl: post.imgurl,
			likes: post.likes,
			comments: post.comments,
			createdAt: moment(post.createdAt).fromNow()
		}));

		display_posts = display_posts.reverse();
		res.render('stories', {stories: display_posts, username:user});
		}catch (err){
			console.error('Error retrieving posts ', err);
			res.status(500).send('Internal Server error');
		}

	}
}

router.get('/', authenticationMiddleware(), renderStories());

router.get('/createPost', authenticationMiddleware(), function(req, res){
	res.render('createPost');
});

router.post('/createPost', authenticationMiddleware(), upload.single('image'), async function(req, res){
	console.log("inside createPost post route...");

	if (req.body.action == "cancel"){
		res.redirect('/');
	}
	else if (req.body.action == 'save'){
		
		if (!req.body.description){
			return res.status(400).send("Description cannot be blank");
		}
		
		const description = req.body.description;
		const author = req.user;
	
		let imagePath = null;
		if (req.file){
			imagePath = req.file.path;
			console.log("image path is :",  imagePath);
		}
		
		console.log("Author of post is: ", author.username);
		console.log("description", description);
		console.log("image path", imagePath);
	
		try {
			var newPost = Post();
			newPost.description = description;
			newPost.imgurl = imagePath;
			newPost.user = author;
			console.log("image url is : ", newPost.imgurl);
			await newPost.save();
			res.redirect('/');
		}catch (err) {
			console.error("Error saving post:", err);
			res.status(400).send(err.message);
		}
	} else {
		res.redirect('/');
	}
	
});

router.get('/logout', function(req, res, next){
	req.logout(function(err) {
		if (err) { return next(err); }
	});
	console.log("Logged out.. ");
	res.redirect('/login');
});

module.exports = router