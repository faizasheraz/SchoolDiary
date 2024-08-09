const mongoose = require('mongoose');


var PostSchema = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	description: {type: String, required:[true, "can't be blank"]},
	imgurl: {type:String},
	likes: [{type:mongoose.SchemaTypes.ObjectId, ref:'User'}],
	comments: [{type:mongoose.SchemaTypes.ObjectId, ref:'Comment'}] 
}, {timestamps: true});

module.exports = mongoose.model("Post", PostSchema);