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

	let max = 0;
	for(let i = 0; i < grid.length; i++) {
		move([-1, i], [1, 0]);
		let sum = -1;
		for(let entry of ENERGIZED.values()) {
			sum++;
		}
		max = Math.max(max, sum);
		ENERGIZED.clear();
		VISITED.clear();
		if(i === 0)
			displayCaption(`The sum is ${sum}.`);
	}

	for(let i = 0; i < grid.length; i++) {
		move([grid[i].length, i], [-1, 0]);
		let sum = -1;
		for(let entry of ENERGIZED.values()) {
			sum++;
		}
		max = Math.max(max, sum);
		ENERGIZED.clear();
		VISITED.clear();
	}

	for(let i = 0; i < grid[0].length; i++) {
		move([i, -1], [0, 1]);
		let sum = -1;
		for(let entry of ENERGIZED.values()) {
			sum++;
		}
		max = Math.max(max, sum);
		ENERGIZED.clear();
		VISITED.clear();
	}

	for(let i = 0; i < grid[0].length; i++) {
		move([grid.length, i], [0, -1]);
		let sum = -1;
		for(let entry of ENERGIZED.values()) {
			sum++;
		}
		max = Math.max(max, sum);
		ENERGIZED.clear();
		VISITED.clear();
	}

	displayCaption(`The max is ${max}.`);
}