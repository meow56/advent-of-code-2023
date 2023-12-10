"use strict";

function day10(input) {

	const FILE_REGEX = /.+/g;
	let pipeGrid = [];
	let entry;
	let s;
	while(entry = FILE_REGEX.exec(input)) {
		pipeGrid.push(entry[0].split(""));
		if(entry[0].includes("S")) {
			s = [entry[0].indexOf("S"), pipeGrid.length - 1];
		}
	}
	let upS = pipeGrid[s[1] - 1][s[0]];
	let downS = pipeGrid[s[1] + 1][s[0]];
	let leftS = pipeGrid[s[1]][s[0] - 1];
	let rightS = pipeGrid[s[1]][s[0] + 1];



	let exits = [];
	let startPoss = [];
	if(leftS === "-" || leftS === "F" || leftS === "L") {
		exits.push([s[0] - 1, s[1]]);
		startPoss.push(["-", "J", "7"]);
	}
	if(upS === "|" || upS === "F" || upS === "7") {
		exits.push([s[0], s[1] - 1]);
		startPoss.push(["|", "J", "L"]);
	}
	if(downS === "|" || downS === "J" || downS === "L") {
		exits.push([s[0], s[1] + 1]);
		startPoss.push(["|", "F", "7"]);
	}
	if(rightS === "-" || rightS === "7" || rightS === "J") {
		exits.push([s[0] + 1, s[1]]);
		startPoss.push(["-", "F", "L"]);
	}
	let trueStart;
	for(let poss of startPoss[0]) {
		if(startPoss[1].includes(poss)) {
			trueStart = poss;
			break;
		}
	}

	function travel(currLoc, prevLoc) {
		let tile = pipeGrid[currLoc[1]][currLoc[0]];
		let prevDir = [currLoc[0] - prevLoc[0], currLoc[1] - prevLoc[1]];
		// [ 1,  0] = came in from left
		// [-1,  0] = came in from right
		// [ 0,  1] = came in from up
		// [ 0, -1] = came in from bottom
		switch(tile) {
		case "-":
			if(prevDir[0] === 1) return [[currLoc[0] + 1, currLoc[1]], currLoc];
			else return [[currLoc[0] - 1, currLoc[1]], currLoc];
			break;
		case "|":
			if(prevDir[1] === 1) return [[currLoc[0], currLoc[1] + 1], currLoc];
			else return [[currLoc[0], currLoc[1] - 1], currLoc];
			break;
		case "J":
			if(prevDir[0] === 1) return [[currLoc[0], currLoc[1] - 1], currLoc];
			else return [[currLoc[0] - 1, currLoc[1]], currLoc];
			break;
		case "7":
			if(prevDir[0] === 1) return [[currLoc[0], currLoc[1] + 1], currLoc];
			else return [[currLoc[0] - 1, currLoc[1]], currLoc];
			break;
		case "F":
			if(prevDir[0] === -1) return [[currLoc[0], currLoc[1] + 1], currLoc];
			else return [[currLoc[0] + 1, currLoc[1]], currLoc];
			break;
		case "L":
			if(prevDir[0] === -1) return [[currLoc[0], currLoc[1] - 1], currLoc];
			else return [[currLoc[0] + 1, currLoc[1]], currLoc];
			break;
		}
	}

	let loop = [s, exits[0], exits[1]];
	let steps = 1;
	let currLeft = exits[0];
	let currRight = exits[1];
	let prevLeft = s;
	let prevRight = s;
	while(currLeft[0] !== currRight[0] || currLeft[1] !== currRight[1]) {
		steps++;
		[currLeft, prevLeft] = travel(currLeft, prevLeft);
		[currRight, prevRight] = travel(currRight, prevRight);

		loop.push(currLeft);
		loop.push(currRight);
	}

	displayCaption(`The number of steps is ${steps}.`);



	function Node(location) {
		this.location = location;
		this.tile = zoomIn[this.location[1]][this.location[0]];
		this.explored = false;
		this.neighbors = [];
	}

	Node.prototype.initialize = function() {
		let upNeigh = [this.location[0], this.location[1] - 1];
		let leftNeigh = [this.location[0] - 1, this.location[1]];
		let downNeigh = [this.location[0], this.location[1] + 1];
		let rightNeigh = [this.location[0] + 1, this.location[1]];

		if(upNeigh[1] !== -1) {
			this.neighbors.push(find(upNeigh));
		}
		if(leftNeigh[0] !== -1) {
			this.neighbors.push(find(leftNeigh));
		}
		if(downNeigh[1] !== zoomIn.length) {
			this.neighbors.push(find(downNeigh));
		}
		if(rightNeigh[0] !== zoomIn[this.location[0]].length) {
			this.neighbors.push(find(rightNeigh));
		}
	}

	// Time to plagiarize from my 2022 day 18 solution.
	function BFS(start) {
		let connected = [start.location];
		let queue = [start];
		while(queue.length !== 0) {
			let next = queue.shift();
			console.log(`Exploring from (${next.location[0]}, ${next.location[1]})`);
			for(let path of next.neighbors) {
				if(!path.explored) {
					path.explored = true;
					queue.push(path);
					connected.push(path.location);
				}
			}
		}
		return connected;
	}

	function find(coord) {
		return nodes[coord[1] * zoomIn[0].length + coord[0]];
		for(let node of nodes) {
			if(node.location[0] === coord[0] && node.location[1] === coord[1]) {
				return node;
			}
		}
	}

	function inLoop(coord) {
		return newLoop.some(e => e[0] === coord[0] && e[1] === coord[1]);
	}

	// [x, y] => [3x + 1, 3y + 1]
	let zoomIn = [];
	for(let y = 0; y < pipeGrid.length; y++) {
		let line = pipeGrid[y];
		let topLine = "";
		let midLine = "";
		let botLine = "";
		for(let x = 0; x < line.length; x++) {
			let tile = line[x];
			if(tile === "S") {
				tile = trueStart;
			}
			switch(tile) {
			case "-":
				topLine += "...";
				midLine += "---";
				botLine += "...";
				break;
			case "|":
				topLine += ".|.";
				midLine += ".|.";
				botLine += ".|.";
				break;
			case "F":
				topLine += "...";
				midLine += ".F-";
				botLine += ".|.";
				break;
			case "L":
				topLine += ".|.";
				midLine += ".L-";
				botLine += "...";
				break;
			case "J":
				topLine += ".|.";
				midLine += "-J.";
				botLine += "...";
				break;
			case "7":
				topLine += "...";
				midLine += "-7.";
				botLine += ".|.";
				break;
			case ".":
				topLine += "...";
				midLine += "...";
				botLine += "...";
				break;
			}
		}
		zoomIn.push(topLine.split(""));
		zoomIn.push(midLine.split(""));
		zoomIn.push(botLine.split(""));
	}


	let newLoop = [];
	for(let coord of loop) {
		newLoop.push([coord[0] * 3 + 1, coord[1] * 3 + 1]);
		let temp = pipeGrid[coord[1]][coord[0]];
		if(temp === "S") temp = trueStart;
		switch(temp) {
		case "-":
			newLoop.push([coord[0] * 3 + 0, coord[1] * 3 + 1]);
			newLoop.push([coord[0] * 3 + 2, coord[1] * 3 + 1]);
			break;
		case "|":
			newLoop.push([coord[0] * 3 + 1, coord[1] * 3 + 0]);
			newLoop.push([coord[0] * 3 + 1, coord[1] * 3 + 2]);
			break;
		case "F":
			newLoop.push([coord[0] * 3 + 2, coord[1] * 3 + 1]);
			newLoop.push([coord[0] * 3 + 1, coord[1] * 3 + 2]);
			break;
		case "L":
			newLoop.push([coord[0] * 3 + 2, coord[1] * 3 + 1]);
			newLoop.push([coord[0] * 3 + 1, coord[1] * 3 + 0]);
			break;
		case "J":
			newLoop.push([coord[0] * 3 + 0, coord[1] * 3 + 1]);
			newLoop.push([coord[0] * 3 + 1, coord[1] * 3 + 0]);
			break;
		case "7":
			newLoop.push([coord[0] * 3 + 0, coord[1] * 3 + 1]);
			newLoop.push([coord[0] * 3 + 1, coord[1] * 3 + 2]);
			break;
		}
	}


	let nodes = [];
	for(let y = 0; y < zoomIn.length; y++) {
		for(let x = 0; x < zoomIn[y].length; x++) {
			nodes.push(new Node([x, y]));
		}
	}

	for(let node of nodes) {
		node.initialize();
	}

	for(let coord of newLoop) {
		let loopNode = find(coord);
		loopNode.explored = true;
		for(let neighbor of loopNode.neighbors) {
			neighbor.neighbors.splice(neighbor.neighbors.findIndex(e => e === loopNode), 1);
		}
		loopNode.neighbors = [];
	}

	let regions = [];
	while(nodes.some(e => !e.explored)) {
		let newStart = nodes.find(e => !e.explored);
		regions.push(BFS(newStart));
	}

	//display(0);
	function display(y) {
		if(y === zoomIn.length) return;
		let finalLine = "";
		for(let x = 0; x < zoomIn[y].length; x++) {
			if(regions[0].some(n => n[0] === x && n[1] === y) && inLoop([x, y])) {
				finalLine += `<span class="red">${zoomIn[y][x]}</span>`;
			} else if(inLoop([x, y])) {
				finalLine += `<span class="green">${zoomIn[y][x]}</span>`;
			} else {
				finalLine += `${zoomIn[y][x]}`;
			}
		}
		displayText(finalLine);
		setTimeout(display, 0, y + 1);
	}

	let outside = [];
	let inside = [];
	for(let region of regions) {
		if(region.some(e => e[0] === 0 || e[0] === zoomIn[0].length - 1 || e[1] === 0 || e[1] === zoomIn.length - 1)) {
			outside.push(region);
		} else {
			inside.push(region);
		}
	}

	let actualTileCount = 0;

	for(let region of inside) {
		for(let tile of region) {
			if(tile[0] % 3 === 1 && tile[1] % 3 === 1) {
				actualTileCount++;
			}
		}
	}
	displayCaption(`The inside tile count is ${actualTileCount}.`);
}