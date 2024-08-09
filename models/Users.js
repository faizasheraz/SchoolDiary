const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10
const secret = require('../config').secret;

var UserSchema = new mongoose.Schema({
	username: {type: String, lowercase: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
	email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
	//role: {type: String}
	//child: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
	hash: String, // bcrypt adds salt in the hash string itself
}, {timestamps: true});

UserSchema.plugin(uniqueValidator, {message: 'is already taken'});

UserSchema.methods.setPassword = async function(password) {

	try{
		var hash = await bcrypt.hash(password, saltRounds);
		console.log('hash', hash);
		this.hash = hash;
		console.log("this.hash is: " , this.hash)
	} catch (err) {
		console.error(err.message)
	}
};

 UserSchema.methods.validPassword = async function(password) {
	console.log("password is: ", password);
	console.log("hash is: ", this.hash);
	try {
		const result = await bcrypt.compare(password, this.hash)
		console.log("result is: " , result);
		return result;
	}
	catch(err) {
		console.error(err.message)
		throw err;
	}
}

mongoose.model('User', UserSchema);