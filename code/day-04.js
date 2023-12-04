"use strict";

function day04(input) {
	const FILE_REGEX = /Card +(\d+): (.+) \| (.+)/g;
	let entry;
	let cards = [];
	while(entry = FILE_REGEX.exec(input)) {
		let winning = entry[2].split(" ");
		winning = winning.filter(e => e !== "");
		winning = winning.map(e => +e);
		let nums = entry[3].split(" ");
		nums = nums.filter(e => e !== "");
		nums = nums.map(e => +e);
		cards[entry[1]] = [winning, nums];
	}

	let sum = 0;
	for(let i = 1; i < cards.length; i++) {
		let winners = 1/2;
		for(let num of cards[i][1]) {
			if(cards[i][0].includes(num)) {
				winners *= 2;
			}
		}
		winners = Math.floor(winners);
		sum += winners;
	}
	displayCaption(`The sum is ${sum}.`);
}