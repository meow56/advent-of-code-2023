"use strict";

function day23(input) {
	function Node(pos, type) {
		this.pos = pos;
		this.exits = [];
		this.type = type;

		this.depth = Infinity;
		this.explored = false;
		this.predecessor;

		this.targetDepths = [];
	}

	Node.prototype.initialize = function(nodes, part2) {
		if(this.type === "#") return;
		if(!part2 && grid[this.pos[0]][this.pos[1]] === ">") {
			this.exits.push(find([this.pos[0], this.pos[1] + 1], nodes));
		} else if(!part2 && grid[this.pos[0]][this.pos[1]] === "v") {
			this.exits.push(find([this.pos[0] + 1, this.pos[1]], nodes));
		} else {
			let upNeigh = find([this.pos[0] - 1, this.pos[1]], nodes);
			let leftNeigh = find([this.pos[0], this.pos[1] - 1], nodes);
			let downNeigh = find([this.pos[0] + 1, this.pos[1]], nodes);
			let rightNeigh = find([this.pos[0], this.pos[1] + 1], nodes);

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
				if(!part2) {
					targetNodes.push(this);
				} else {
					targetNodes2.push(this);
				}
			}
		}
	}


	function find(pos, nodes) {
		if(nodes[pos[0]] === undefined) return undefined;
		return nodes[pos[0]][pos[1]];
	}

	const FILE_REGEX = /.+/g;
	let grid = [];
	let nodes = [];
	let nodes2 = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		grid.push(entry[0].split(""));
	}


	for(let i = 0; i < grid.length; i++) {
		let nodeRow = [];
		let node2Row = [];
		for(let j = 0; j < grid[i].length; j++) {
			nodeRow.push(new Node([i, j], grid[i][j]));
			node2Row.push(new Node([i, j], grid[i][j]));
		}
		nodes.push(nodeRow);
		nodes2.push(node2Row);
	}

	let targetNodes = [];
	let targetNodes2 = [];

	for(let row of nodes) {
		for(let node of row) {
			node.initialize(nodes, false);
		}
	}
	targetNodes.push(nodes[0][1]);
	targetNodes.push(nodes[nodes.length - 1][nodes[nodes.length - 1].length - 2]);

	for(let row of nodes2) {
		for(let node of row) {
			node.initialize(nodes2, true);
		}
	}
	targetNodes2.push(nodes2[0][1]);
	targetNodes2.push(nodes2[nodes2.length - 1][nodes2[nodes2.length - 1].length - 2]);

	// Time to plagiarize from my 2023 day 21 (plagiarization)^2 of my 2023 day 10 plagiarization of my 2022 day 18 solution.
	function BFS(nodes, ...start) {
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
					path.predecessor = next;
					if(path.type !== "X") queue.push(path);
				}
			}
		}
	}

	for(let node of targetNodes) {
		BFS(nodes, node);
		for(let neighNode of targetNodes) {
			if(neighNode !== node && neighNode.depth < 1000000) {
				let path = [neighNode];
				while(path[path.length - 1] !== node) {
					path.push(path[path.length - 1].predecessor);
				}
				node.targetDepths.push([neighNode, neighNode.depth, path]);
			}
		}
	}
	for(let node of targetNodes2) {
		BFS(nodes2, node);
		for(let neighNode of targetNodes2) {
			if(neighNode !== node && neighNode.depth < 1000000) {
				let path = [neighNode];
				while(path[path.length - 1] !== node) {
					path.push(path[path.length - 1].predecessor);
				}
				node.targetDepths.push([neighNode, neighNode.depth, path]);
			}
		}
	}

	function hike2(targetNodes, visited, length = 0) {
		let currNode = visited[visited.length - 1];
		if(currNode === targetNodes[targetNodes.length - 1]) {
			return [length, visited];
		}
		let lengths = [];
		for(let neighbor of currNode.targetDepths) {
			if(!visited.includes(neighbor[0])) {
				lengths.push(hike2(targetNodes, [...visited, neighbor[0]], length + neighbor[1]));
			}
		}
		if(lengths.length === 0) {
			return [0, []];
		}
		let currMax = [0, []];
		for(let len of lengths) {
			if(len[0] > currMax[0]) {
				currMax = len;
			}
		}
		return currMax;
	}

	let trail = hike2(targetNodes, [nodes[0][1]]);
	let trail2 = hike2(targetNodes2, [nodes2[0][1]]);
	displayCaption(`The max length is ${trail[0]}.`);
	displayCaption(`The surprisingly dry max length is ${trail2[0]}.`);
	displayCaption(`The longest trail is shown.`);
	displayCaption(`The walls are shown as █, while the trail taken is shown as ▒.`);
	displayCaption(`Use the button to switch between parts.`);

	function display(nodes, trail) {
		let visited = [];
		for(let i = 0; i < trail[1].length - 1; i++) {
			for(let node of trail[1][i].targetDepths) {
				if(node[0] === trail[1][i + 1]) {
					visited.push(...node[2]);
				}
			}
		}

		for(let i = 0; i < nodes.length; i++) {
			let displayLine = "";
			for(let j = 0; j < nodes.length; j++) {
				if(visited.includes(nodes[i][j])) {
					displayLine += "▒";
				} else if(nodes[i][j].type === "X" || nodes[i][j].type === ".") {
					displayLine += " ";
				} else if(nodes[i][j].type === "#") {
					displayLine += "█";
				} else {
					displayLine += nodes[i][j].type;
				}
			}
			displayText(displayLine);
		}
	}

	function closure() {
		let part2 = false;
		display(nodes, trail);

		function switchPart() {
			part2 = !part2;
			clearText();
			if(!part2) {
				display(nodes, trail);
			} else {
				display(nodes2, trail2);
			}
		}

		return switchPart;
	}

	assignButton(closure(), "Switch part");
}