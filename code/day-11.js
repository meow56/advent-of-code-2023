"use strict";

function day11(input) {
	const FILE_REGEX = /(.+)/g;
	let grid = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		grid.push(entry[0].split(""));
	}

	let newGrid = [];
	let emptyRows = [];
	for(let y = 0; y < grid.length; y++) {
		if(!grid[y].includes("#")) {
			emptyRows.push(y);
		}
	}

	let emptyColumns = [];
	for(let x = 0; x < grid[0].length; x++) {
		let isEmpty = true;
		for(let y = 0; y < grid.length; y++) {
			if(grid[y][x] === "#") {
				isEmpty = false;
			}
		}
		if(isEmpty) {
			emptyColumns.push(x);
		}
	}

	let galaxies = [];
	for(let y = 0; y < grid.length; y++) {
		for(let x = 0; x < grid[y].length; x++) {
			if(grid[y][x] === "#") {
				galaxies.push([x, y]);
			}
		}
	}

	function manhattan(point1, point2, part2 = false) {
		let uncorrectedDist = Math.abs(point2[1] - point1[1]) + Math.abs(point2[0] - point1[0]);
		let crossedX = 0;
		for(let row of emptyRows) {
			if(point1[1] < row && point2[1] > row) {
				crossedX++;
			} else if(point1[1] > row && point2[1] < row) {
				crossedX++;
			}
		}
		let crossedY = 0;
		for(let column of emptyColumns) {
			if(point1[0] < column && point2[0] > column) {
				crossedY++;
			} else if(point1[0] > column && point2[0] < column) {
				crossedY++;
			}
		}
		let correctionFactor = part2 ? (1000000 - 1) : (2 - 1);
		return uncorrectedDist + ((crossedX + crossedY) * correctionFactor);
	}

	let sum = 0;
	let sum2 = 0;
	for(let i = 0; i < galaxies.length; i++) {
		for(let j = i + 1; j < galaxies.length; j++) {
			let dist = manhattan(galaxies[i], galaxies[j]);
			let dist2 = manhattan(galaxies[i], galaxies[j], true);
			sum += dist;
			sum2 += dist2;
		}
	}
	displayCaption(`The sum is ${sum}.`);
	displayCaption(`The sum is ${sum2}.`);
}