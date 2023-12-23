"use strict";

function day23(input) {
	function Node(pos, type) {
		this.pos = pos;
		this.exits = [];
		this.type = type;

		this.depth = Infinity;
		this.explored = false;

		this.targetDepths = [];
	}

	Node.prototype.initialize = function() {
		if(this.type === "#") return;
		//if(grid[this.pos[0]][this.pos[1]] === ">") {
		//	this.exits.push(find([this.pos[0], this.pos[1] + 1]));
		//} else if(grid[this.pos[0]][this.pos[1]] === "v") {
		//	this.exits.push(find([this.pos[0] + 1, this.pos[1]]));
		//} else {
			let upNeigh = find([this.pos[0] - 1, this.pos[1]]);
			let leftNeigh = find([this.pos[0], this.pos[1] - 1]);
			let downNeigh = find([this.pos[0] + 1, this.pos[1]]);
			let rightNeigh = find([this.pos[0], this.pos[1] + 1]);

			if(upNeigh !== undefined && upNeigh.type !== "#") this.exits.push(upNeigh);
			if(leftNeigh !== undefined && leftNeigh.type !== "#") this.exits.push(leftNeigh);
			if(downNeigh !== undefined && downNeigh.type !== "#") this.exits.push(downNeigh);
			if(rightNeigh !== undefined && rightNeigh.type !== "#") this.exits.push(rightNeigh);

			let slopeCount = 0;
			for(let neighbor of this.exits) {
				if(neighbor.type !== ".") slopeCount++;
			}
			if(slopeCount > 1) {
				this.type = "X";
				targetNodes.push(this);
			}
		//}
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

	let targetNodes = [];

	for(let row of nodes) {
		for(let node of row) {
			node.initialize();
		}
	}
	targetNodes.push(nodes[0][1]);
	targetNodes.push(nodes[nodes.length - 1][nodes[nodes.length - 1].length - 2]);

	// Time to plagiarize from my 2023 day 21 (plagiarization)^2 of my 2023 day 10 plagiarization of my 2022 day 18 solution.
	function BFS(...start) {
		let queue = start;
		for(let row of nodes) {
			for(let node of row) {
				node.depth = Infinity;
				node.explored = false;
			}
		}
		for(let node of start) {
			node.depth = 0;
			node.explored = true;
		}
		while(queue.length !== 0) {
			let next = queue.shift();
			for(let path of next.exits) {
				if(!path.explored) {
					path.explored = true;
					path.depth = next.depth + 1;
					if(path.type !== "X") queue.push(path);
				}
			}
		}
	}

	for(let node of targetNodes) {
		BFS(node);
		for(let neighNode of targetNodes) {
			if(neighNode !== node && neighNode.depth < 1000000) {
				node.targetDepths.push([neighNode, neighNode.depth]);
			}
		}
	}

	function hike2(visited, length = 0) {
		let currNode = visited[visited.length - 1];
		if(currNode === targetNodes[targetNodes.length - 1]) {
			return length;
		}
		let lengths = [];
		for(let neighbor of currNode.targetDepths) {
			if(!visited.includes(neighbor[0])) {
				lengths.push(hike2([...visited, neighbor[0]], length + neighbor[1] ));
			}
		}
		if(lengths.length === 0) {
			return 0;
		}
		return Math.max(...lengths);
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
		if(lengths.length === 0) {
			return 0;
		}
		return Math.max(...lengths);
	}

	let trail = hike2([nodes[0][1]]);
	displayCaption(`The max length is ${trail}.`);
}