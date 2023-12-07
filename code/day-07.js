"use strict";

function day07(input) {
	const FILE_REGEX = /(.+) (.+)/g;
	const CARD_VAL = new Map([
		["A", 13],
		["K", 12],
		["Q", 11],
		["J", 10],
		["T",  9],
		["9",  8],
		["8",  7],
		["7",  6],
		["6",  5],
		["5",  4],
		["4",  3],
		["3",  2],
		["2",  1],
		]);
	const JOKE_CARD_VAL = new Map([
		["A", 13],
		["K", 12],
		["Q", 11],
		["T", 10],
		["9",  9],
		["8",  8],
		["7",  7],
		["6",  6],
		["5",  5],
		["4",  4],
		["3",  3],
		["2",  2],
		["J",  1],
		]);
	let handsAndBids = [];
	let jokeHands = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		let cards = entry[1].split("").map(e => CARD_VAL.get(e));
		let jokeCards = entry[1].split("").map(e => JOKE_CARD_VAL.get(e));
		handsAndBids.push([cards, +entry[2], getType(cards)]);
		jokeHands.push([jokeCards, +entry[2], getType(jokeCards, true)]);
	}

	function getType(cards, part2 = false) {
		let cardCounts = [0];
		for(let i = 1; i <= 13; i++) {
			cardCounts[i] = 0;
		}
		for(let card of cards) {
			cardCounts[card]++;
		}
		let jokers = cardCounts[1];
		if(!part2) {
			cardCounts.sort((a, b) => b - a); // sort descending
			if(cardCounts[0] === 5) return 6; // 5 of a kind
			if(cardCounts[0] === 4) return 5; // 4 of a kind
			if(cardCounts[0] === 3 && cardCounts[1] === 2) return 4; // Full house
			if(cardCounts[0] === 3) return 3; // 3 of a kind
			if(cardCounts[0] === 2 && cardCounts[1] === 2) return 2; // Two pair
			if(cardCounts[0] === 2) return 1; // One pair
			return 0; // High card
		}
		cardCounts[1] = 0;
		cardCounts.sort((a, b) => b - a); // sort descending

		if(cardCounts[0] + jokers === 5) return 6;
		if(cardCounts[0] + jokers === 4) return 5;
		if(cardCounts[0] + jokers === 3 && cardCounts[1] === 2) return 4;
		if(cardCounts[0] + jokers === 3) return 3;
		if(cardCounts[0] + jokers === 2 && cardCounts[1] === 2) return 2;
		if(cardCounts[0] + jokers === 2) return 1;
		return 0;
	}

	function compare(a, b) {
		let aType = a[2];
		let bType = b[2];
		if(aType !== bType) return aType - bType;
		for(let i = 0; i < a[0].length; i++) {
			if(a[0][i] !== b[0][i]) return a[0][i] - b[0][i];
		}
		return 0;
	}

	handsAndBids.sort(compare);
	let winnings = handsAndBids.reduce(function(acc, val, ind) {
		return acc + (val[1] * (ind + 1));
	}, 0);
	jokeHands.sort(compare);
	let jokeWinnings = jokeHands.reduce(function(acc, val, ind) {
		return acc + (val[1] * (ind + 1));
	}, 0);
	displayCaption(`The winnings are ${winnings}.`);
	displayCaption(`The 2nd round of winnings are ${jokeWinnings}.`);
}