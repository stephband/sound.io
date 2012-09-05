var mongoose = require('mongoose'),
	db = require('./db'),
	prototype = require('./mode_prototype.js'),
	Schema = mongoose.Schema;

var modeSchema = new Schema({
		name: { type: String, unique: true },
		symbol: { type: String },
		notes: { type: [Number], required: true },
		positions: { type: [Schema.Types.ObjectId], default: [] },
		key: { type: String, unique: true }
	});


modeSchema.pre('save', function(next) {
	// Generate unique key from array
	this.key = this.notes.join(',');
	console.log('Generating unique key', this.key);
	next();
});

modeSchema.methods = prototype;

module.exports = db.model('Mode', modeSchema);