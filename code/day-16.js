"use strict";

function day16(input) {
	const FILE_REGEX = /.+/g;
	let grid = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		grid.push(entry[0].split(""));
	}

	const VISITED = new Map();
	const ENERGIZED = new Map();
	function move(currPos, dir) {
		let MAP_KEY = `${currPos};${dir}`;
		let otherMapKey = currPos.join();
		ENERGIZED.set(otherMapKey, 1);
		if(VISITED.has(MAP_KEY)) return;
		let nextPos = [currPos[0] + dir[0], currPos[1] + dir[1]];
		if(grid[nextPos[1]] === undefined) return;
		if(grid[nextPos[1]][nextPos[0]] === undefined) return;
		VISITED.set(MAP_KEY);
		let nextTile = grid[nextPos[1]][nextPos[0]];
		switch(nextTile) {
		case ".":
			move(nextPos, dir);
			break;
		case "/":
			if(dir[1] === 1) move(nextPos, [-1, 0]);
			else if(dir[1] === -1) move(nextPos, [1, 0]);
			else if(dir[0] === 1) move(nextPos, [0, -1]);
			else move(nextPos, [0, 1]);
			break;
		case "\\":
			if(dir[1] === 1) move(nextPos, [1, 0]);
			else if(dir[1] === -1) move(nextPos, [-1, 0]);
			else if(dir[0] === 1) move(nextPos, [0, 1]);
			else move(nextPos, [0, -1]);
			break;
		case "-":
			if(dir[1] === 0) move(nextPos, dir);
			else {
				move(nextPos, [-1, 0]);
				move(nextPos, [1, 0]);
			}
			break;
		case "|":
			if(dir[0] === 0) move(nextPos, dir);
			else {
				move(nextPos, [0, -1]);
				move(nextPos, [0, 1]);
			}
			break;
		}
	}

	move([-1, 0], [1, 0]);

	let sum = -1;
	for(let entry of ENERGIZED.values()) {
		sum++;
	}
	displayCaption(`The sum is ${sum}.`);
}