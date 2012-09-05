var mongoose = require('mongoose'),
	db = require('./db');

module.exports = {
	position: function(n, fn) {
		var l = this.notes.length,
			c = this.notes[n];
		
		n = n % 12;
		
		var arr = this.notes.map(function(v, i, notes) {
			return (notes[(i + n) % l] + 12 - c) % 12;
		});
		
		if (this.positions[n]) {
			fn && fn(this.positions[n]);
		}
		
		var Mode = this.model('Mode');
		
		Mode.findOne({ notes: arr }, function(error, mode) {
			if (!mode) {
				// Create a new mode
				mode = new Mode({
					name: 'major',
					notes: [0,2,4,5,7,9,11]
				});
				
				mode.save();
			}
			
			fn && fn(mode);
		});
	}
};