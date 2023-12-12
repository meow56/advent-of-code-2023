"use strict";

function day12(input) {	
	const FILE_REGEX = /(.+) (.+)/g;
	let rows = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		rows.push([entry[1], entry[2].split(",").map(e => +e)]);
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

	let sum = 0;
	for(let row of rows) {
		let clue = row[1];
		let clueCount = clue.reduce((acc, val) => acc + val, 0);
		let filter = row[0];
		let clueLength = clue.reduce((acc, val) => acc + val + 1, -1);
		let extraSpace = filter - clueLength;
		//console.log(`Now doing "${filter}".`);
		//console.log(`With clue "${clue.join(", ")}".`);
		let questions = count(filter, "?");
		let hexCount = count(filter, "#");
		let possibilities = [];
		for(let i = 0; i < 2 ** questions; i++) {
			let binaryForm = i.toString(2).padStart(questions, "0").split("");
			let numHex = count(binaryForm, "1");
			if(numHex + hexCount !== clueCount) continue;
			let newPoss = "";
			for(let j = 0; j < filter.length; j++) {
				if(filter[j] === "?") {
					if(binaryForm.pop() === "1") {
						newPoss += "#";
					} else {
						newPoss += ".";
					}
				} else {
					newPoss += filter[j];
				}
			}

			let newClue = generateClue(newPoss);
			//console.log(`Possibly "${newPoss}"?`);
			if(compare(clue, newClue) === 0) {
				possibilities.push(newPoss);
			}
		}
		sum += possibilities.length;
		for(let poss of possibilities) {
			//console.log(poss);
		}
	}
	displayCaption(`The sum is ${sum}.`);
}