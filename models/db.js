var mongoose = require('mongoose'),
	db = mongoose.createConnection('localhost', 'test5');

db.on('error', console.error.bind(console, 'connection error:'));

module.exports = db;