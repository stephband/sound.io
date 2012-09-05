var mongoose = require('mongoose'),
	db = require('./models/db'),
	Mode = require('./models/mode');

var major = new Mode({
		name: 'major',
		symbol: '∆',
		notes: [0,2,4,5,7,9,11]
	}),
	
	melodic = new Mode({
		name: 'melodic',
		symbol: '-∆7',
		notes: [0,2,3,5,7,9,11]
	});

function position(mode, n, name) {
	var notes = mode.notes,
		positions = mode.positions,
		l = notes.length,
		c = notes[n],
		arr, mode;
	
	n = n % 12;
	
	mode = new Mode({
		name: name,
		notes: notes.map(function(v, i, notes) {
			return (notes[(i + n) % l] + 12 - c) % 12;
		}),
		positions: positions
	});
	
	positions[n] = mode.id;
//	mode.save(function(error, mode) {
//		if (error) { console.log(error.err); }
//	});
}

db.once('open', function () {
//	major.save(function(error, mode) {
//		if (error) { console.log(error.err); }
//	});
	
	major.positions[0] = major.id;
	
	position(major, 1, 'dorian', '-7');
	position(major, 2, 'phrygian', 'sus♭9');
	position(major, 3, 'lydian', '∆♯11');
	position(major, 4, 'mixolydian', '7');
	position(major, 5, 'aeolian', '-♭6');
	position(major, 6, 'locrian', 'ø');
	
//	melodic.save(function(error, mode) {
//		if (error) { console.log(error.err); }
//	});
	
	position(melodic, 1, '', 'sus♭9');
	position(melodic, 2, '', '∆♯5');
	position(melodic, 3, 'lydian dominant', '7♯11');
	position(melodic, 4, '', '7♭13');
	position(melodic, 5, 'locrian', 'ø');
	position(melodic, 6, 'altered', '7alt');
	
	major.save(function(error, mode) {
		if (error) { console.log('ERROR:', error); }
	});

	Mode.find(function(error, mode){
		console.log(error);
		console.log(mode);
	});
	
	Mode.findOne({ name: 'altered' }, function(error, mode){
		console.log(error);
		console.log(mode);
	});
});