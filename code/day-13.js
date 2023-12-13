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
			let symm = reflection.every(function(e) {
				let temp = e.length !== 2 || field[e[0]].join("") === field[e[1]].join("");
				if(temp) return temp;
				if(madeCorrection) return false;
				for(let i = 0; i < field[e[0]].length; i++) {
					if(field[e[0]][i] !== field[e[1]][i]) {
						if(madeCorrection) return false;
						madeCorrection = true;
					}
				}
				return true;
			});
			if(symm && madeCorrection) return row;
		}
		return -1;
	}

	let sum = 0;
	let otherSum = 0;
	for(let i = 0; i < fields.length; i++) {
		let field = fields[i].slice();
		let horizSymm = checkSymmetry(field.slice());
		let horizWrongSymm = getOneOffs(field.slice());
		if(horizSymm !== -1) {
			sum += 100 * (horizSymm + 1);
		}
		if(horizWrongSymm !== -1) {
			otherSum += 100 * (horizWrongSymm + 1);
		}
		let vertSymm = checkSymmetry(fieldsByRows[i].slice());
		let vertWrongSymm = getOneOffs(fieldsByRows[i].slice());
		if(vertSymm !== -1) {
			sum += vertSymm + 1;
		}
		if(vertWrongSymm !== -1) {
			otherSum += (vertWrongSymm + 1);
		}
	}

	displayCaption(`The sum is ${sum}.`);
	displayCaption(`The other sum is ${otherSum}.`);
}