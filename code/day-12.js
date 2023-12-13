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
	let displayThingy = [];
	for(let i = 0; i < rows.length; i++) {
		let split = rows[i][0].split(".").filter(e => e.length !== 0).join(".");
		let clues = rows[i][1];
		let temp = getPoss(split, clues);
		sum += temp;
		displayThingy[i] = [rows[i][0], clues, temp];
	}
	let otherSum = 0;
	for(let i = 0; i < unfolded.length; i++) {
		let split = unfolded[i][0].split(".").filter(e => e.length !== 0).join(".");
		let clues = unfolded[i][1];
		let temp = getPoss(split, clues);
		otherSum += temp;
		displayThingy[i].push(temp);
	}
	displayCaption(`The sum is ${sum}.`);
	displayCaption(`Oops! The actual sum is ${otherSum}.`);

	let maxInputLength = Math.max(...displayThingy.map(e => `${e[0]} ${e[1].join(", ")}`.length));
	let maxPart1Length = Math.max(...displayThingy.map(e => e[2].toString().length));
	for(let line of displayThingy) {
		let inputLine = `${line[0]} ${line[1].join(", ")}`.padEnd(maxInputLength, " ");
		displayText(`${inputLine} => ${line[2].toString().padStart(maxPart1Length, " ")}; x5 => ${line[3]}`);
	}
}