"use strict";

function day12(input) {
	const FILE_REGEX = /(.+) (.+)/g;
	let rows = [];
	let unfolded = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		rows.push([entry[1], entry[2].split(",").map(e => +e)]);
		let realRow = new Array(5).fill(entry[1]).join("?");
		let realClue = new Array(5).fill(entry[2]).join(",").split(",").map(e => +e);
		unfolded.push([realRow, realClue]);
	}

	function count(string, char) {
		let result = 0;
		for(let i = 0; i < string.length; i++) {
			if(string[i] === char) result++;
		}
		return result;
	}

	function generateClue(poss) {
		let newClue = [];
		let currGroup = 0;
		for(let char of poss) {
			if(currGroup > 0 && char === ".") {
				newClue.push(currGroup);
				currGroup = 0;
			} else if(char === "#") {
				currGroup++;
			}
		}
		if(currGroup !== 0) newClue.push(currGroup);
		return newClue;
	}

	function compare(a, b) {
		let minLength = Math.min(a.length, b.length);
		for(let i = 0; i < minLength; i++) {
			if(a[i] !== b[i]) {
				return a[i] - b[i];
			}
		}
		if(a.length !== b.length) return a.length - b.length;
		return 0;
	}



	const POSS_MAP = new Map();
	// There are two cases.
	// Case 1: We don't use the current character to fulfill a clue.
	// Then getPoss(row, clues) = getPoss(row[1:], clues);
	// Case 2: The current character is the start of a new clue.
	// Then getPoss(row, clues) = getPoss(row[clues[0]:], clues[1:]);
	function getPoss(row, clues) {
		if(clues.length === 0) return +(row.split("").every(e => e !== "#"));
		if(row.length < clues.reduce((acc, val) => acc + val, 0)) return 0;

		let MAP_KEY = row + " " + clues.join();
		if(POSS_MAP.has(MAP_KEY)) {
			return POSS_MAP.get(MAP_KEY);
		}

		if(row[0] === ".") {
			let temp = getPoss(row.slice(1), clues);
			POSS_MAP.set(MAP_KEY, temp);
			return temp;
		}
		if(row[0] === "#") {
			let clueLength = clues[0];
			for(let i = 0; i < clueLength; i++) {
				if(row[i] === ".") return 0; // Not happening.
			}
			if(row[clueLength] === "#") return 0; // Not happening.
			let temp = getPoss(row.slice(clueLength + 1), clues.slice(1));
			POSS_MAP.set(MAP_KEY, temp);
			return temp;
		}

		let noUse = getPoss(row.slice(1), clues);
		let clueLength = clues[0];
		let yesUse;
		for(let i = 0; i < clueLength; i++) {
			if(row[i] === ".") return noUse; // Not happening.
		}
		if(clueLength < row.length && row[clueLength] === "#") return noUse; // Not happening.
		yesUse = getPoss(row.slice(clueLength + 1), clues.slice(1));
		POSS_MAP.set(MAP_KEY, noUse + yesUse);
		return noUse + yesUse;
	}

	let sum = 0;
	for(let i = 0; i < rows.length; i++) {
		let split = rows[i][0].split(".").filter(e => e.length !== 0).join(".");
		let clues = rows[i][1];
		let temp = getPoss(split, clues);
		sum += temp;
	}
	let otherSum = 0;
	for(let i = 0; i < unfolded.length; i++) {
		let split = unfolded[i][0].split(".").filter(e => e.length !== 0).join(".");
		let clues = unfolded[i][1];
		let temp = getPoss(split, clues);
		otherSum += temp;
	}
	displayCaption(`The sum is ${sum}.`);
	displayCaption(`The other sum is ${otherSum}.`);
}