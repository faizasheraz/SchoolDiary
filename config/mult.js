const multer = require('multer');
const path = require('path');
const fs = require('fs');
const configs = require('./index.js');

const uploadDir = "." + configs.uploadDir

if(!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, {recursive:true});
}

// multer setup for handling file uploads
const storage = multer.diskStorage({
	destination: uploadDir,
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

const upload = multer({storage: storage});

module.exports = upload;