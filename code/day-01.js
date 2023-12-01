"use strict";

function day01(input) {
	const FILE_REGEX = /.+/g;
	let entry;
	let sum = 0;
	let sum2 = 0;
	let wordToNum = new Map([
		["zero", 0],
		["one", 1],
		["two", 2],
		["three", 3],
		["four", 4],
		["five", 5],
		["six", 6],
		["seven", 7],
		["eight", 8],
		["nine", 9],
	]);
	while(entry = FILE_REGEX.exec(input)) {
		let NUM_REGEX = /[0-9]/g;
		let NUM_REGEX_2 = /[0-9]|one|two|three|four|five|six|seven|eight|nine|zero/g;
		let NUM_REGEX_2_REV = /[0-9]|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin|orez/g;
		let firstIndex = NUM_REGEX.exec(entry);
		let lastIndex = firstIndex;
		let trueLastIndex = NUM_REGEX.exec(entry);
		while(trueLastIndex !== null) {
			lastIndex = trueLastIndex;
			trueLastIndex = NUM_REGEX.exec(entry);
		}
		let firstIndex2 = NUM_REGEX_2.exec(entry);
		let lastIndex2 = NUM_REGEX_2_REV.exec(entry[0].split("").toReversed().join(""));
		let num = +(firstIndex[0] + lastIndex[0]);
		if(Number.isNaN(+(firstIndex2[0]))) {
			firstIndex2 = wordToNum.get(firstIndex2[0]);
		} else {
			firstIndex2 = +(firstIndex2[0]);
		}
		if(Number.isNaN(+(lastIndex2[0]))) {
			let temp = lastIndex2[0].split("");
			lastIndex2 = wordToNum.get(temp.toReversed().join(""));
		} else {
			lastIndex2 = +(lastIndex2[0]);
		}
		sum2 += firstIndex2 * 10 + lastIndex2;
		console.log(`${entry} : ${firstIndex2}${lastIndex2}`);
		sum += num;
	}
	displayCaption(`The sum is ${sum}.`);
	displayCaption(`The other sum is ${sum2}.`);
}