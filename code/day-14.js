"use strict";

function day14(input) {
	const FILE_REGEX = /(.+)/g;
	let entry;
	let rocks = [];
	const NORTH_MAP = new Map();
	const SOUTH_MAP = new Map();
	const EAST_MAP = new Map();
	const WEST_MAP = new Map();
	while(entry = FILE_REGEX.exec(input)) {
		rocks.push(entry[0].split(""));
	}

	let rockPos = [];
	for(let col = 0; col < rocks[0].length; col++) {
		let northMapArr = [];
		let firstStopNorth = 0;
		for(let row = 0; row < rocks.length; row++) {
			if(rocks[row][col] === "#") {
				firstStopNorth = row + 1;
			} else {
				if(rocks[row][col] === "O") rockPos.push([row, col]);
				northMapArr[row] = firstStopNorth;
			}
		}
		let southMapArr = [];
		let firstStopSouth = rocks.length;
		for(let row = rocks.length - 1; row >= 0; row--) {
			if(rocks[row][col] === "#") {
				firstStopSouth = row - 1;
			} else {
				southMapArr[row] = firstStopSouth;
			}
		}
		NORTH_MAP.set(col, northMapArr);
		SOUTH_MAP.set(col, southMapArr);
	}

	for(let row = 0; row < rocks.length; row++) {
		let eastMapArr = [];
		let firstStopEast = rocks[row].length;
		for(let col = rocks[row].length - 1; col >= 0; col--) {
			if(rocks[row][col] === "#") {
				firstStopEast = col - 1;
			} else {
				eastMapArr[col] = firstStopEast;
			}
		}
		let westMapArr = [];
		let firstStopWest = 0;
		for(let col = 0; col < rocks.length; col++) {
			if(rocks[row][col] === "#") {
				firstStopWest = col + 1;
			} else {
				westMapArr[col] = firstStopWest;
			}
		}
		EAST_MAP.set(row, eastMapArr);
		WEST_MAP.set(row, westMapArr);
	}

	function north() {
		for(let col = 0; col < rocks[0].length; col++) {
			let thisRocks = [];
			for(let i = 0; i < rockPos.length; i++) {
				if(rockPos[i][1] === col) {
					thisRocks.push(rockPos.splice(i, 1)[0]);
					i--;
				}
			}
			if(thisRocks.length === 0) continue;
			let colMap = NORTH_MAP.get(col);
			let ghostRockPos = thisRocks.map(e => [colMap[e[0]], col]);
			let prevPos = -1;
			for(let i = 0; i < ghostRockPos.length; i++) {
				if(ghostRockPos[i][0] <= prevPos) {
					ghostRockPos[i][0] = prevPos + 1;
				}
				prevPos = ghostRockPos[i][0];
			}
			rockPos.push(...ghostRockPos);
		}
	}

	function south() {
		for(let col = 0; col < rocks[0].length; col++) {
			let thisRocks = [];
			for(let i = 0; i < rockPos.length; i++) {
				if(rockPos[i][1] === col) {
					thisRocks.push(rockPos.splice(i, 1)[0]);
					i--;
				}
			}
			if(thisRocks.length === 0) continue;
			let colMap = SOUTH_MAP.get(col);
			let ghostRockPos = thisRocks.map(e => [colMap[e[0]], col]);
			let prevPos = rocks.length;
			for(let i = ghostRockPos.length - 1; i >= 0; i--) {
				if(ghostRockPos[i][0] >= prevPos) {
					ghostRockPos[i][0] = prevPos - 1;
				}
				prevPos = ghostRockPos[i][0];
			}
			rockPos.push(...ghostRockPos);
		}
	}


	function east() {
		for(let row = 0; row < rocks.length; row++) {
			let thisRocks = [];
			for(let i = 0; i < rockPos.length; i++) {
				if(rockPos[i][0] === row) {
					thisRocks.push(rockPos.splice(i, 1)[0]);
					i--;
				}
			}
			if(thisRocks.length === 0) continue;
			let rowMap = EAST_MAP.get(row);
			let ghostRockPos = thisRocks.map(e => [row, rowMap[e[1]]]);
			let prevPos = rocks[0].length;
			for(let i = ghostRockPos.length - 1; i >= 0; i--) {
				if(ghostRockPos[i][1] >= prevPos) {
					ghostRockPos[i][1] = prevPos - 1;
				}
				prevPos = ghostRockPos[i][1];
			}
			rockPos.push(...ghostRockPos);
		}
	}

	function west() {
		for(let row = 0; row < rocks.length; row++) {
			let thisRocks = [];
			for(let i = 0; i < rockPos.length; i++) {
				if(rockPos[i][0] === row) {
					thisRocks.push(rockPos.splice(i, 1)[0]);
					i--;
				}
			}
			if(thisRocks.length === 0) continue;
			let rowMap = WEST_MAP.get(row);
			let ghostRockPos = thisRocks.map(e => [row, rowMap[e[1]]]);
			let prevPos = -1;
			for(let i = 0; i < ghostRockPos.length; i++) {
				if(ghostRockPos[i][1] <= prevPos) {
					ghostRockPos[i][1] = prevPos + 1;
				}
				prevPos = ghostRockPos[i][1];
			}
			rockPos.push(...ghostRockPos);
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
			newRocks[rockPos[i][0]][rockPos[i][1]] = "O";
		}
		for(let i = 0; i < newRocks.length; i++) {
			let row = newRocks[i];
			displayText(`${row.join("")}`);
		}
	}

	function count(arr = rockPos) {
		return arr.reduce(function(acc, val) {
			return acc + rocks.length - val[0];
		}, 0);
	}

	const ROCK_MAP = new Map();
	for(let i = 1; i <= 1000000000; i++) {
		north();
		if(i === 1) {
			displayCaption(`The total load is ${count()}.`);
		}
		west();
		south();
		east();
		let mapKey = rockPos.map(e => `${e.join(", ")}`).join(";");
		if(ROCK_MAP.has(mapKey)) {
			let cycleLength = i - ROCK_MAP.get(mapKey);
			let offset = ROCK_MAP.get(mapKey);
			console.log(`Repeats every ${cycleLength}, starting at ${offset}`);
			
			let billOff = (1000000000 - offset) % cycleLength + offset;
			for(let entry of ROCK_MAP.entries()) {
				if(entry[1] === billOff) {
					rockPos = entry[0].split(";").map(e => e.split(", ").map(n => +n));
					break;
				}
			}


			break;
		}
		ROCK_MAP.set(mapKey, i);
	}
	displayCaption(`The final total load is ${count()}.`);
	displayCaption(`The grid as it appears after the 1000000000th cycle is shown.`);
	display();
}