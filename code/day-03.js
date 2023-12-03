"use strict";

function day03(input) {
	

	const FILE_REGEX = /.+/g;
	let grid = [];
	let parts = [];
	let numbers = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		const PART_REGEX = /[^0-9.\n]/g;
		const NUM_REGEX = /[0-9]+/g;
		grid.push(entry[0].split(""));
		let partEntry;
		while(partEntry = PART_REGEX.exec(entry)) {
			parts.push([grid.length - 1, partEntry.index]);
		}
		let numEntry;
		while(numEntry = NUM_REGEX.exec(entry)) {
			let temp = [grid.length - 1, numEntry.index, numEntry.index + numEntry[0].length - 1, +(numEntry[0]), false];
			numbers.push(temp);
		}
	}

	for(let part of parts) {
		for(let i = 0; i < numbers.length; i++) {
			if(numbers[i][0] < part[0] - 1) continue;
			if(numbers[i][0] > part[0] + 1) continue;
			if(numbers[i][2] >= part[1] - 1 && numbers[i][2] <= part[1] + 1) {
				numbers[i][4] = true;
			}
			if(numbers[i][1] >= part[1] - 1 && numbers[i][1] <= part[1] + 1) {
				numbers[i][4] = true;
			}
		}
	}

	let partSum = numbers.reduce(function(acc, val) {
		return val[4] ? acc + val[3] : acc;
	}, 0);
	displayCaption(`The sum is ${partSum}.`);
}