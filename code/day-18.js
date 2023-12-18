"use strict";

function day18(input) {
	const FILE_REGEX = /(.) (\d+) \(#([a-z0-9]{6})\)/g;
	let instructions = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		instructions.push([entry[1], +(entry[2]), entry[3]]);
	}

	let grid = [["#"]];
	let currCoord = [0, 0];
	for(let inst of instructions) {
		let direction;
		switch(inst[0]) {
		case "U":
			direction = [0, -1];
			for(let i = 0; i < inst[1]; i++) {
				currCoord = [currCoord[0] + direction[0], currCoord[1] + direction[1]];
				if(grid[currCoord[1]] === undefined) {
					let temp = (new Array(grid[0].length)).fill(".");
					grid.unshift(temp);
					currCoord[1]++;
				}
				grid[currCoord[1]][currCoord[0]] = "#";
			}
			break;
		case "L":
			direction = [-1, 0];
			for(let i = 0; i < inst[1]; i++) {
				currCoord = [currCoord[0] + direction[0], currCoord[1] + direction[1]];
				if(grid[currCoord[1]][currCoord[0]] === undefined) {
					for(let j = 0; j < grid.length; j++) {
						grid[j].unshift(".");
					}
					currCoord[0]++;
				}
				grid[currCoord[1]][currCoord[0]] = "#";
			}
			break;
		case "D":
			direction = [0, 1];
			for(let i = 0; i < inst[1]; i++) {
				currCoord = [currCoord[0] + direction[0], currCoord[1] + direction[1]];
				if(grid[currCoord[1]] === undefined) {
					let temp = (new Array(grid[0].length)).fill(".");
					grid.push(temp);
				}
				grid[currCoord[1]][currCoord[0]] = "#";
			}
			break;
		case "R":
			direction = [1, 0];
			for(let i = 0; i < inst[1]; i++) {
				currCoord = [currCoord[0] + direction[0], currCoord[1] + direction[1]];
				if(grid[currCoord[1]][currCoord[0]] === undefined) {
					for(let j = 0; j < grid.length; j++) {
						grid[j].push(".");
					}
				}
				grid[currCoord[1]][currCoord[0]] = "#";
			}
			break;
		}
	}

	display();
	displayText();
	let newGrid = [];
	for(let i = 0; i < grid.length; i++) {
		newGrid.push(grid[i].slice());
	}
	for(let i = -grid[0].length; i < grid.length; i++) {
		let parity = false;
		for(let j = 0; j < grid[0].length; j++) {
			let coord = [j, i + j];
			if(newGrid[coord[1]] === undefined) continue;
			if(newGrid[coord[1]][j] === "#") {
				if((!newGrid[coord[1] - 1] || newGrid[coord[1] - 1][j] === ".") && (!newGrid[coord[1]][j + 1] || newGrid[coord[1]][j + 1] === ".")) {

				} else if((!newGrid[coord[1] + 1] || newGrid[coord[1] + 1][j] === ".") && (!newGrid[coord[1]][j - 1] || newGrid[coord[1]][j - 1] === ".")) {

				} else {
					parity = !parity;	
				}
			}
			if(parity) {
				grid[coord[1]][coord[0]] = "#";
			}
		}
	}

	// for(let i = 0; i < grid.length; i++) {
	// 	let row = grid[i];
	// 	let parity = false;
	// 	let streak = false;
	// 	for(let j = 0; j < row.length; j++) {
	// 		if(row[j] === "#" && !streak) {
	// 			parity = !parity;
	// 			streak = true;
	// 		}
	// 		if(row[j] === ".") {
	// 			streak = false;
	// 		}
	// 		if(parity) {
	// 			grid[i][j] = "#";
	// 		}
	// 	}
	// }

	let volume = grid.reduce((acc, val) => acc + val.reduce((a, v) => a + +(v === "#"), 0), 0);
	displayCaption(`The volume is ${volume}.`);

	function display() {
		for(let line of grid) {
			displayText(line.join(""));
		}
	}
	display();
}