"use strict";

function day01(input) {
	const FILE_REGEX = /.+/g;
	let entry;
	let sum = 0;
	while(entry = FILE_REGEX.exec(input)) {
		let NUM_REGEX = /[0-9]/g;
		let firstIndex = NUM_REGEX.exec(entry);
		let lastIndex = firstIndex;
		let trueLastIndex = NUM_REGEX.exec(entry);
		while(trueLastIndex !== null) {
			lastIndex = trueLastIndex;
			trueLastIndex = NUM_REGEX.exec(entry);
		}
		let num = +(firstIndex[0] + lastIndex[0]);
		sum += num;
	}
	displayCaption(`The sum is ${sum}.`);
}