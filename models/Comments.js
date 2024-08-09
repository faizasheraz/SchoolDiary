const mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	description: {type:String},
	user: {type:mongoose.Schema.Types.ObjectId, ref:"User"}
}, {timestamps:true});

module.exports = mongoose.model("Comment", CommentSchema);