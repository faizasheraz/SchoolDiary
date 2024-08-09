const passport  = require('../config/passport');
const router = require('express').Router();
require('../models/Posts')
const mongoose = require('mongoose'); 
var Post = mongoose.model('Post');


router.get('/', async function(req, res){

	var all_posts = await Post.find();
	console.log("posts are:", all_posts);
	
	var  all_descriptions = [];
	for(let post of all_posts){
		all_descriptions.push(post.description);
	}

	console.log("all posts", all_descriptions);

	res.render('deletePost', {posts: all_descriptions} )
})

router.post('/delete-post', async function(req, res){
	var description = req.body.description;

	try {
		var prom = await Post.deleteOne({description: description});
		res.redirect('/posts');

	}catch (err) {
		console.err("Post cannot be deleted...", err);
	}
	
})

module.exports = router