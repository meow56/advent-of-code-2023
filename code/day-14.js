"use strict";

function day14(input) {
	const FILE_REGEX = /(.+)/g;
	let entry;
	let rocks = [];
	const NORTH_MAP = new Map();
	while(entry = FILE_REGEX.exec(input)) {
		rocks.push(entry[0].split(""));
	}

	let rockPos = [];
	for(let col = 0; col < rocks[0].length; col++) {
		let mapArr = [];
		let thisColRocks = [];
		let firstStop = 0;
		for(let row = 0; row < rocks.length; row++) {
			if(rocks[row][col] === "#") {
				firstStop = row + 1;
			} else {
				if(rocks[row][col] === "O") thisColRocks.push(row);
				mapArr[row] = firstStop;
			}
		}
		rockPos.push(thisColRocks); // But is it really that cool?
		NORTH_MAP.set(col, mapArr);
	}

	function north() {
		for(let col = 0; col < rocks[0].length; col++) {
			let thisRocks = rockPos[col];
			let colMap = NORTH_MAP.get(col);
			let ghostRockPos = thisRocks.map(e => colMap[e]);
			let prevPos = -1;
			for(let i = 0; i < ghostRockPos.length; i++) {
				if(ghostRockPos[i] <= prevPos) {
					ghostRockPos[i] = prevPos + 1;
				}
				prevPos = ghostRockPos[i];
			}
			rockPos[col] = ghostRockPos.slice();
		}
	}

	function display() {
		let newRocks = rocks.slice().map(e => e.slice());
		for(let i = 0; i < newRocks.length; i++) {
			for(let j = 0; j < newRocks[i].length; j++) {
				if(newRocks[i][j] === "O") newRocks[i][j] = ".";
			}
		}

		for(let i = 0; i < rockPos.length; i++) {
			for(let j = 0; j < rockPos[i].length; j++) {
				newRocks[rockPos[i][j]][i] = "O";
			}
		}
		for(let i = 0; i < newRocks.length; i++) {
			let row = newRocks[i];
			displayText(`${i.toString().padStart(3, " ")} ${row.join("")}`);
		}
	}

	function count() {
		return rockPos.reduce(function(acc, val) {
			return acc + val.reduce(function(a, v) {
				return a + rocks.length - v;
			}, 0);
		}, 0);
	}

	north();
	displayCaption(`The sum is ${count()}.`);
	display();

}