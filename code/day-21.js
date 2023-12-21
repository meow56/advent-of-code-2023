"use strict";

function day21(input) {
	function Node(pos, type) {
		this.pos = pos;
		this.type = type;
		this.neighbors = [];
		this.depth = Infinity;
		this.explored = false;
	}

	Node.prototype.initialize = function() {
		let upNeigh = find([this.pos[0], this.pos[1] - 1]);
		let leftNeigh = find([this.pos[0] - 1, this.pos[1]]);
		let downNeigh = find([this.pos[0], this.pos[1] + 1]);
		let rightNeigh = find([this.pos[0] + 1, this.pos[1]]);

		if(upNeigh && upNeigh.type !== "#") this.neighbors.push(upNeigh);
		if(leftNeigh && leftNeigh.type !== "#") this.neighbors.push(leftNeigh);
		if(downNeigh && downNeigh.type !== "#") this.neighbors.push(downNeigh);
		if(rightNeigh && rightNeigh.type !== "#") this.neighbors.push(rightNeigh);
	}

	const FILE_REGEX = /.+/g;
	let nodes = [];
	let entry;
	let startNode;
	let index = 0;
	while(entry = FILE_REGEX.exec(input)) {
		let nodeRow = [];
		for(let i = 0; i < entry[0].length; i++) {
			nodeRow.push(new Node([i, index], entry[0][i]));
			if(entry[0][i] === "S") startNode = nodeRow[nodeRow.length - 1];
		}
		nodes.push(nodeRow);
		index++;
	}

	function find(pos) {
		if(!nodes[pos[1]]) return undefined;
		return nodes[pos[1]][pos[0]];
	}

	for(let row of nodes) {
		for(let node of row) {
			node.initialize();
		}
	}
	startNode.depth = 0;

	// Time to plagiarize from my 2023 day 10 plagiarization of my 2022 day 18 solution.
	function BFS(start) {
		let queue = [start];
		while(queue.length !== 0) {
			let next = queue.shift();
			for(let path of next.neighbors) {
				if(!path.explored) {
					path.explored = true;
					path.depth = next.depth + 1;
					queue.push(path);
				}
			}
		}
	}

	BFS(startNode);
	let reachable = 0;
	for(let row of nodes) {
		for(let node of row) {
			if(node.depth <= 64 && node.depth % 2 === 0) {
				reachable++;
			}
		}
	}
	displayCaption(`Surely the answer is ${reachable}...`);
}