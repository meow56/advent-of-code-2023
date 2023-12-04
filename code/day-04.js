"use strict";

function day04(input) {
	const FILE_REGEX = /Card +(\d+): (.+) \| (.+)/g;
	let entry;
	let cards = [[0, 0, 0]];
	while(entry = FILE_REGEX.exec(input)) {
		let winning = entry[2].split(" ");
		winning = winning.filter(e => e !== "");
		winning = winning.map(e => +e);
		let nums = entry[3].split(" ");
		nums = nums.filter(e => e !== "");
		nums = nums.map(e => +e);
		cards[entry[1]] = [winning, nums, 1];
	}

	let sum = 0;
	for(let i = 1; i < cards.length; i++) {
		let winners = -1;
		for(let num of cards[i][1]) {
			if(cards[i][0].includes(num)) {
				winners++;
			}
		}
		for(let j = 1; j <= 10; j++) {
			if(winners >= j - 1) {
				if(i + j < cards.length) {
					cards[i + j][2] += cards[i][2];
				}
			}
		}
		sum += Math.floor(2 ** winners);
	}
	let scratchCount = cards.reduce(function(acc, val) {
		return acc + val[2];
	}, 0);
	displayCaption(`The sum is ${sum}.`);
	displayCaption(`The number of scratchcards is ${scratchCount}.`);
}