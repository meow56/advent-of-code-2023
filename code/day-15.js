"use strict";

function day15(input) {
	const FILE_REGEX = /.+/g;
	let words = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		words = entry[0].split(",");
	}

	function hash(str) {
		let currVal = 0;
		for(let i = 0; i < str.length; i++) {
			let code = str.charCodeAt(i);
			currVal += code;
			currVal *= 17;
			currVal %= 256;
		}
		return currVal;
	}
	let sum = words.map(e => hash(e)).reduce((acc, val) => acc + val);
	displayCaption(`The sum is ${sum}.`);
}