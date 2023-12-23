"use strict";

function day23(input) {
	function Node(pos, type) {
		this.pos = pos;
		this.exits = [];
		this.type = type;

		this.depth = Infinity;
	}

	Node.prototype.initialize = function() {
		if(this.type === "#") return;
		if(grid[this.pos[0]][this.pos[1]] === ">") {
			this.exits.push(find([this.pos[0], this.pos[1] + 1]));
		} else if(grid[this.pos[0]][this.pos[1]] === "v") {
			this.exits.push(find([this.pos[0] + 1, this.pos[1]]));
		} else {
			let upNeigh = find([this.pos[0] - 1, this.pos[1]]);
			let leftNeigh = find([this.pos[0], this.pos[1] - 1]);
			let downNeigh = find([this.pos[0] + 1, this.pos[1]]);
			let rightNeigh = find([this.pos[0], this.pos[1] + 1]);

			if(upNeigh !== undefined && upNeigh.type !== "#") this.exits.push(upNeigh);
			if(leftNeigh !== undefined && leftNeigh.type !== "#") this.exits.push(leftNeigh);
			if(downNeigh !== undefined && downNeigh.type !== "#") this.exits.push(downNeigh);
			if(rightNeigh !== undefined && rightNeigh.type !== "#") this.exits.push(rightNeigh);
		}
	}

	function find(pos) {
		if(nodes[pos[0]] === undefined) return undefined;
		return nodes[pos[0]][pos[1]];
	}

	const FILE_REGEX = /.+/g;
	let grid = [];
	let nodes = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		grid.push(entry[0].split(""));
	}


	for(let i = 0; i < grid.length; i++) {
		let nodeRow = [];
		for(let j = 0; j < grid[i].length; j++) {
			nodeRow.push(new Node([i, j], grid[i][j]));
		}
		nodes.push(nodeRow);
	}

	for(let row of nodes) {
		for(let node of row) {
			node.initialize();
		}
	}

	function hike(visited) {
		let currNode = visited[visited.length - 1];
		if(currNode.pos[0] === nodes.length - 1) {
			return visited.length;
		}
		let lengths = [];
		for(let neighbor of currNode.exits) {
			if(!visited.includes(neighbor)) {
				lengths.push(hike([...visited, neighbor]));
			}
		}
		return Math.max(...lengths);
	}

	let trail = hike([nodes[0][1]]);
	displayCaption(`The max length is ${trail - 1}.`);
}