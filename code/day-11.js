"use strict";

function day11(input) {
	const FILE_REGEX = /(.+)/g;
	let grid = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		grid.push(entry[0].split(""));
	}

	let newGrid = [];
	for(let row of grid) {
		if(!row.includes("#")) {
			newGrid.push(row.slice());
			newGrid.push(row.slice());
		} else {
			newGrid.push(row.slice());
		}
	}

	let changes = 0;
	for(let x = 0; x < grid[0].length; x++) {
		let isEmpty = true;
		for(let y = 0; y < grid.length; y++) {
			if(grid[y][x] === "#") {
				isEmpty = false;
			}
		}
		if(isEmpty) {
			for(let y = 0; y < newGrid.length; y++) {
				newGrid[y].splice(x + changes, 0, ".");
			}
			changes++;
		}
	}

	for(let row of newGrid) {
		displayText(row.join(""));
	}

	let galaxies = [];
	for(let y = 0; y < newGrid.length; y++) {
		for(let x = 0; x < newGrid[y].length; x++) {
			if(newGrid[y][x] === "#") {
				galaxies.push([x, y]);
			}
		}
	}

	function manhattan(point1, point2) {
		return Math.abs(point2[1] - point1[1]) + Math.abs(point2[0] - point1[0]);
	}

	let sum = 0;
	for(let i = 0; i < galaxies.length; i++) {
		for(let j = i + 1; j < galaxies.length; j++) {
			let dist = manhattan(galaxies[i], galaxies[j]);
			console.log(`dist(${i + 1}, ${j + 1}): ${dist}`);
			sum += dist;
		}
	}
	displayCaption(`The sum is ${sum}.`);
}