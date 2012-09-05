function offset(array, offset) {
	return array.map(function(v, i, array) {
		return v + offset;
	});
}

function intersection(arr1, arr2, fn) {
	return arr1.filter(function(v, i) {
		return arr2.indexOf(v) !== -1;
	});
}

function difference(arr1, arr2) {
	return arr1.filter(function(v, i) {
		return arr2.indexOf(v) === -1;
	});
}

function union(arr1, arr2) {
	return arr1.concat(arr2).sort(sortBySize);
}

function sortBySize(v1, v2) {
	return v1 > v2;
}

function square(n) {
	return n * n;
}


function order(arr1, arr2, fn) {
	// Calls the function with (longer array, shorter array).
	return arr2.length > arr1.length ?
		fn(arr2, arr1) :
		fn(arr1, arr2) ;
}

function divide(arr1, arr2) {
	return arr2.length / arr1.length;
}

function rateLength(arr1, arr2) {
	return order(arr1, arr2, divide);
}



var // Weight for how much contrary motion is allowed to complement
	// parallel motion.
	contraryWeight = 0.8;


function contraryMotion(arr1, arr2, matched, interval, score) {
	// No parallel motion was found on the first pass, so there's
	// no point trying it again.
	if (score === 0) { return score; }
	
	// Now the thing is, we might have some contrary motion going
	// on. Yes. Contrary motion. That would be good, wouldn't it?
	// Contrary motion gets big brownie points.
	var arr3 = difference(arr1, matched),
		arr4 = [];
	
	// Find values in arr2 that are not already matched
	arr2.forEach(function(v, i) {
		if (matched.indexOf(v + interval) === -1) {
			arr4.push(arr2[i]);
		}
	});
		
	if (arr1.length > 1 && arr3.length > 1) {
		console.log('Sub:', arr3, arr4);
		// Call rateChromaticParralelism recursively with the new
		// arrays.
		return score + chromaticParallels(arr3, arr4, contraryMotion) * (1 - score) * contraryWeight;
	}
	
	return score;
}

function chromaticParallels(arr1, arr2, fn) {
	var n = 0,
		limit = 12,
		runScore = 0,
		outScore = 0,
		runArray, offArray, off2, m,
		length = arr2.length > arr1.length ?
			arr2.length :
			arr1.length ;
	
	// The brute force approach. Try every offset n and see how
	// large the intersection is. Use the largest matching result
	// that has the smallest interval. Loop over -ve and +ve values
	// of n in a way that prefers smaller, descending intervals.
	while ( n = (n < 0 ? -n : -n - 1), Math.abs(n) < limit ) {
		offArray = offset(arr2, n);
		runArray = intersection(offArray, arr1);
		
		// No points for the first parallel note. One note is
		// not parallelism.
		runScore = runArray.length === 1 ?
			0 :
			runArray.length / length;
		
		if (runScore > outScore) {
			outScore = runScore;
			outArray = runArray;
			m = n;
			console.log('Hit:', n, arr1, offArray, outArray, runScore);
		}
	}
	
	return fn ?
		fn(arr1, arr2, outArray, m, outScore) :
		outScore ;
}


function rateChromaticParallelism(arr1, arr2) {
	return chromaticParallels(arr1, arr2, contraryMotion);
}




// Tests
var assert = require('assert');

function equal(v1, v2, str) {
	str = '\nreturned: {0}\nexpected: {1}\n' + (str || '');
	
	if (v1 !== v2) {
		throw new Error(
			str.replace(/\{0\}/g, v1).replace(/\{1\}/g, v2)
		);
	}
}

assert.deepEqual(
	offset([1,4], 3),
	[4,7],
	'offset() is not properly offseting.'
);

assert.deepEqual(
	intersection([0,4,8,12], [1,5,11,78,2]),
	[],
	'intersection() expected no intersection.'
);

assert.deepEqual(
	intersection([0,4,8,12], [1,4,8]),
	[4,8],
	'intersection([0,4,8,12], [1,4,8]) expected intersection [4,8]'
);

assert.deepEqual(
	difference([0,4,9,14], [1,4,14]),
	[0,9],
	'intersection([0,4,9,14], [1,4,8]) expected intersection [0,9,14]'
);

assert.equal(
	rateLength([0,1,2,3], [0,1,2,3]),
	1,
	'rateLength(arr1, arr2) Arrays of the same length should return 1.'
);

assert.equal(
	rateLength([0,1,2,3], [0,1]),
	0.5,
	'rateLength(arr1, arr2) Second array of half length should return 0.5.'
);

assert.equal(
	rateLength([0,1], [0,1,2,3]),
	0.5,
	'rateLength(arr1, arr2) First array of half length should return 0.5.'
);

equal(
	rateChromaticParallelism([0,2,5,7], [1,3,6,8]),
	1,
	'All notes in chromatic parallel should return {1}.'
);

equal(
	rateChromaticParallelism([0,2,5,11,12,13], [10,12,15,21,22]),
	5/6,
	'5 out of 6 notes in parallel must return {1}.'
);

equal(
	rateChromaticParallelism([0,2,5], [0,2,4,7]),
	0.75,
	'Because 0,2,5 maps to 2,4,7, and that is 3 notes out of 4'
);

equal(
	rateChromaticParallelism([0,1,2], [0,3,6,9]),
	0,
	'rateChromaticParallelism([0,1,2], [0,2,4,6])'
);

equal(
	rateChromaticParallelism([0,1,2], [0,3,6,9]),
	0,
	'rateChromaticParallelism([0,1,2], [0,2,4,6])'
);

equal(
	rateChromaticParallelism([0,1,3,6,9], [1,2,4,6,9]),
	0.6,
	'Because 0,1,3 maps to 1,2,4 but 6,9 does not move'
);

equal(
	rateChromaticParallelism([0,3,6,9], [1,4,5,8]),
	0.9,
	'Becuase 0,3 maps to 1,4 and we score a weighted 0.9 x contrary motion from 6,9 to 5,8'
);

equal(
	rateChromaticParallelism([0,1,3,5,7], [1,3,5,10,11]),
	0.92,
	'Because 3,5,7 maps to 1,3,5, while 0,1 maps to 10,11 with a 0.9 x weight'
);

equal(
	rateChromaticParallelism([0,1,2,3], [11,12,13]),
	0.75,
	'Because 0,1,2 maps to 11,12,13 and that is 3 notes out of 4'
);