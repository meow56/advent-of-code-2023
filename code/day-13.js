"use strict";

function day13(input) {
	const FILE_REGEX = /(?:.+\n)+/g;
	let entry;
	let fields = [];
	while(entry = FILE_REGEX.exec(input)) {
		fields.push(entry[0].trim().split("\n").map(e => e.split("")));
	}

	let fieldsByRows = [];
	for(let field of fields) {
		let newArr = [];
		for(let i = 0; i < field[0].length; i++) {
			let row = [];
			for(let j = 0; j < field.length; j++) {
				row.push(field[j][i]);
			}
			newArr.push(row);
		}
		fieldsByRows.push(newArr);
	}

	function checkSymmetry(field) {
		for(let row = 0; row < field.length - 1; row++) {
			let reflection = [];
			for(let j = 0; j <= row; j++) {
				reflection[j] = [j];
			}
			for(let j = row + 1; j < field.length; j++) {
				let mirrorIndex = row - (j - row - 1);
				if(reflection[mirrorIndex]) reflection[mirrorIndex].push(j);
			}

			let symm = reflection.every(e => e.length !== 2 || field[e[0]].join("") === field[e[1]].join(""));
			if(symm) return row;
		}
		return -1;
	}

	function getOneOffs(field) {
		for(let row = 0; row < field.length - 1; row++) {
			let reflection = [];
			for(let j = 0; j <= row; j++) {
				reflection[j] = [j];
			}
			for(let j = row + 1; j < field.length; j++) {
				let mirrorIndex = row - (j - row - 1);
				if(reflection[mirrorIndex]) reflection[mirrorIndex].push(j);
			}

			let madeCorrection = false;
			let correctionAt;
			let symm = reflection.every(function(e, ind) {
				let temp = e.length !== 2 || field[e[0]].join("") === field[e[1]].join("");
				if(temp) return temp;
				if(madeCorrection) return false;
				for(let i = 0; i < field[e[0]].length; i++) {
					if(field[e[0]][i] !== field[e[1]][i]) {
						if(madeCorrection) return false;
						madeCorrection = true;
						correctionAt = [i, e[0]];
					}
				}
				return true;
			});
			if(symm && madeCorrection) return [row, correctionAt];
		}
		return [-1, []];
	}

	let displayStuff = [];
	let sum = 0;
	let otherSum = 0;
	for(let i = 0; i < fields.length; i++) {
		let forDisplay = [];
		let field = fields[i].slice();
		let horizSymm = checkSymmetry(field.slice());
		let horizWrongSymm = getOneOffs(field.slice());
		if(horizSymm !== -1) {
			sum += 100 * (horizSymm + 1);
			forDisplay.push(["H", horizSymm]);
		}
		if(horizWrongSymm[0] !== -1) {
			otherSum += 100 * (horizWrongSymm[0] + 1);
			forDisplay.push(["h", horizWrongSymm]);
		}
		let vertSymm = checkSymmetry(fieldsByRows[i].slice());
		let vertWrongSymm = getOneOffs(fieldsByRows[i].slice());
		if(vertSymm !== -1) {
			sum += vertSymm + 1;
			forDisplay.push(["V", vertSymm]);
		}
		if(vertWrongSymm[0] !== -1) {
			otherSum += (vertWrongSymm[0] + 1);
			forDisplay.push(["v", vertWrongSymm]);
		}
		displayStuff.push(forDisplay);
	}

	displayCaption(`The sum is ${sum}.`);
	displayCaption(`The other sum is ${otherSum}.`);
	displayCaption(`The images are shown.`);
	displayCaption(`On the left is part 1, on the right is part 2.`);
	displayCaption(`Both parts show where the mirror is with two arrows, either >< or v^.`);
	displayCaption(`Part 2 also shows where the smudge is, with class "wrong".`);
	displayCaption(`The character shown should be the other one in order to get the mirror to line up.`);

	function displayWrongHoriz(lines, second, i) {
		let offset = +(lines[0][1] === " " || lines[0][3] === " ");
		for(let j = 0; j < lines.length - 2 * offset; j++) {
			let newJ = j + offset;
			lines[newJ] += `        `;
			let nextLine = ``;
			if(second[1][1][1] === j) {
				nextLine = [];
				for(let char of fields[i][j]) {
					nextLine.push(char);
				}
				nextLine[second[1][1][0]] = `<span class="wrong">${nextLine[second[1][1][0]]}</span>`;
				nextLine = nextLine.join("");
			} else {
				nextLine = fields[i][j].join("");
			}

			if(second[1][0] === j) {
				nextLine = `v${nextLine}v`;
			} else if(second[1][0] + 1 === j) {
				nextLine = `^${nextLine}^`;
			} else {
				nextLine = ` ${nextLine} `;
			}

			lines[newJ] += nextLine;
		}
		return lines;
	}

	function displayWrongVerti(lines, second, i) {
		let currLength = lines[1].length + 8;
		let offset = +(lines[0][1] === " " || lines[0][3] === " ");
		for(let j = 0; j < lines.length - 2 * offset; j++) {
			let newJ = j + offset;
			lines[newJ] += `        `;
			let nextLine = ``;
			if(second[1][1][0] === j) {
				nextLine = [];
				for(let char of fields[i][j]) {
					nextLine.push(char);
				}
				nextLine[second[1][1][1]] = `<span class="wrong">${nextLine[second[1][1][1]]}</span>`;
				nextLine = nextLine.join("");
			} else {
				nextLine = fields[i][j].join("");
			}

			lines[newJ] += nextLine;
		}
		if(lines[0][1] === " " || lines[0][3] === " ") {
			lines[0] = lines[0].join("").padEnd(currLength + fields[i][0].length, " ");
			lines[0] = lines[0].split("");
			lines[0][currLength + second[1][0]] = ">";
			lines[0][currLength + second[1][0] + 1] = "<";
			lines[0] = lines[0].join("");
			lines[lines.length - 1] = lines[0];
		} else {
			let newLine = (new Array(currLength + fields[i][0].length).fill(" "));
			newLine[currLength + second[1][0]] = ">";
			newLine[currLength + second[1][0] + 1] = "<";
			newLine = newLine.join("");
			lines.push(newLine);
			lines.unshift(newLine);
		}
		return lines;
	}

	for(let i = 0; i < displayStuff.length; i++) {
		let first = displayStuff[i][0];
		let second = displayStuff[i][1];
		if(first[0] === "H") {
			let lines = [];
			for(let line of fields[i]) {
				lines.push(` ${line.join("")} `);
			}
			lines[first[1]] = `v${lines[first[1]].trim()}v`;
			lines[first[1] + 1] = `^${lines[first[1] + 1].trim()}^`;
			if(second[0] === "h") {
				displayWrongHoriz(lines, second, i);
			} else {
				displayWrongVerti(lines, second, i);
			}
			for(let line of lines) {
				displayText(line);
			}
		} else if(first[0] === "h") {
			// Then second[0] === "V"
			let lines = [];
			for(let line of fields[i]) {
				lines.push(`${line.join("")}`);
			}
			let newLine = (new Array(lines[0].length)).fill(" ");
			newLine[second[1]] = ">";
			newLine[second[1] + 1] = "<";
			lines.push(newLine);
			lines.unshift(newLine);
			displayWrongHoriz(lines, first, i);
			lines[0] = lines[0].join("");
			lines[lines.length - 1] = lines[0];
			for(let line of lines) {
				displayText(line);
			}
		} else {
			// It's "V" and "v"
			let lines = [];
			for(let line of fields[i]) {
				lines.push(` ${line.join("")} `);
			}
			let newLine = (new Array(lines[0].length)).fill(" ");
			newLine[first[1]] = ">";
			newLine[first[1] + 1] = "<";
			lines.push(newLine);
			lines.unshift(newLine);
			displayWrongVerti(lines, second, i);
			//lines[0].join("");
			//lines[lines.length - 1].join("");
			for(let line of lines) {
				displayText(line);
			}
		}
		displayText();
	}
}