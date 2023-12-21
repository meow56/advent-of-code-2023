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

	// 202,300 full boards can be traversed in one direction.
	// So 202,299 boards in each direction are identical.
	// How many boards is that in total?
	// 1 + 2 + 3 + 4 + ... + 202298 + 202299
	// 1 + 2 + 3 + 4 + ... + 202297 + 202298
	// is 202299(202300)/2 + 202298(202299)/2
	// = 40924885401 * 2 = 81849770802
	// + 202299 * 2 = 81850175400 + 1
	// 81850175401
	// But since the board is 131 by 131.
	// Some of the boards are the opposite parity.
	// Note that the center, "original" board is EVEN parity.
	// Since the edges are even parity.
	// total: 1 + 3 + 5 + 7 + ... + 404599 + ... + 7 + 5 + 3 + 1
	// even: 1 + 2 + 3 + 4 + ... + 202300 + ... + 4 + 3 + 2 + 1
	// odd: 0 + 1 + 2 + 3 + ... + 202299 + ... + 3 + 2 + 1 + 0
	// So it should be (202299*202300/2) + (202298*202299/2) with odd,
	// (40924885401)
	// and (202300*202301/2) + (202299*202300/2) with even
	// (40925290000)
	
	// Special cases:
	// 1 copy of midUp at board (0, -202300)
	// 1 copy of midLeft at board (202300, 0)
	// 1 copy of midDown at board (0, 202300)
	// 1 copy of midRight at board (-202300, 0)
	// (1, 202299), (2, 202298), ... (202299, 1)
	// AND (1, 202300), (2, 202299), ... (202300, 1)
	// 202299 copies of Left + Down Major
	// 202300 copies of Left + Down minor
	// 202299 copies of Left + Up Major
	// 202300 copies of Left + Up minor
	// 202299 copies of Right + Down Major
	// 202300 copies of Right + Down minor
	// 202299 copies of Right + Up Major
	// 202300 copies of Right + Up minor

	let midUp = find([(nodes[0].length - 1) / 2, 0]);
	let midLeft = find([0, (nodes.length - 1) / 2]);
	let midDown = find([(nodes[0].length - 1) / 2, nodes.length - 1]);
	let midRight = find([nodes[0].length - 1, (nodes.length - 1) / 2]);
	let boardReachable = 0n;
	let evenReachable = 0n;
	for(let row of nodes) {
		for(let node of row) {
			if(node.depth < 1000000000 && node.depth % 2 === 1) {
				boardReachable++;
			} else if(node.depth < 1000000000) {
				evenReachable++;
			}
		}
	}
	boardReachable *= 40924885401n;
	boardReachable += evenReachable * 40925290000n;

	let edgeParity = 0;

	BFS(midUp);
	let upReach = 0n;
	let goodUpNodes = [];
	for(let row of nodes) {
		for(let node of row) {
			if(node.depth <= 130 && node.depth % 2 === edgeParity) {
				upReach++;
				goodUpNodes.push(node);
			}
		}
	}

	BFS(midLeft);
	let leftReach = 0n;
	let goodLeftNodes = [];
	for(let row of nodes) {
		for(let node of row) {
			if(node.depth <= 130 && node.depth % 2 === edgeParity) {
				leftReach++;
				goodLeftNodes.push(node);
			}
		}
	}

	BFS(midDown);
	let downReach = 0n;
	let goodDownNodes = [];
	for(let row of nodes) {
		for(let node of row) {
			if(node.depth <= 130 && node.depth % 2 === edgeParity) {
				downReach++;
				goodDownNodes.push(node);
			}
		}
	}

	BFS(midRight);
	let rightReach = 0n;
	let goodRightNodes = [];
	for(let row of nodes) {
		for(let node of row) {
			if(node.depth <= 130 && node.depth % 2 === edgeParity) {
				rightReach++;
				goodRightNodes.push(node);
			}
		}
	}

	BFS(midUp, midLeft);
	let goodUpLeftNodes = [];
	let upLeftReach = 0n;
	for(let row of nodes) {
		for(let node of row) {
			if(node.depth <= 130 && node.depth % 2 === edgeParity) {
				upLeftReach++;
				goodUpLeftNodes.push(node);
			}
		}
	}
	let goodDownRightMinorNodes = [];
	for(let row of nodes) {
		for(let node of row) {
			if(node.depth > 130 && node.type !== "#" && node.depth % 2 === +!edgeParity) {
				goodDownRightMinorNodes.push(node);
			}
		}
	}

	BFS(midLeft, midDown);
	let goodDownLeftNodes = [];
	let downLeftReach = 0n;
	for(let row of nodes) {
		for(let node of row) {
			if(node.depth <= 130 && node.depth % 2 === edgeParity) {
				downLeftReach++;
				goodDownLeftNodes.push(node);
			}
		}
	}
	let goodUpRightMinorNodes = [];
	for(let row of nodes) {
		for(let node of row) {
			if(node.depth > 130 && node.type !== "#" && node.depth % 2 === +!edgeParity) {
				goodUpRightMinorNodes.push(node);
			}
		}
	}

	BFS(midDown, midRight);
	let goodDownRightNodes = [];
	let downRightReach = 0n;
	for(let row of nodes) {
		for(let node of row) {
			if(node.depth <= 130 && node.depth % 2 === edgeParity) {
				downRightReach++;
				goodDownRightNodes.push(node);
			}
		}
	}
	let goodUpLeftMinorNodes = [];
	for(let row of nodes) {
		for(let node of row) {
			if(node.depth > 130 && node.type !== "#" && node.depth % 2 === +!edgeParity) {
				goodUpLeftMinorNodes.push(node);
			}
		}
	}

	BFS(midRight, midUp);
	let goodUpRightNodes = [];
	let upRightReach = 0n;
	for(let row of nodes) {
		for(let node of row) {
			if(node.depth <= 130 && node.depth % 2 === edgeParity) {
				upRightReach++;
				goodUpRightNodes.push(node);
			}
		}
	}
	let goodDownLeftMinorNodes = [];
	for(let row of nodes) {
		for(let node of row) {
			if(node.depth > 130 && node.type !== "#" && node.depth % 2 === +!edgeParity) {
				goodDownLeftMinorNodes.push(node);
			}
		}
	}

	display(goodUpLeftNodes);
	display(goodUpLeftMinorNodes);
	boardReachable += upReach + leftReach + downReach + rightReach + (202299n * upLeftReach) + (202299n * downLeftReach) + (202299n * downRightReach) + (202299n * upRightReach);
	boardReachable += BigInt(202300 * goodUpLeftMinorNodes.length)
		+ BigInt(202300 * goodDownLeftMinorNodes.length)
		+ BigInt(202300 * goodDownRightMinorNodes.length)
		+ BigInt(202300 * goodUpRightMinorNodes.length);

	displayCaption(`Surely the answer is ${reachable}...`);
	displayCaption(`Surely the other answer is ${boardReachable}...`);
	displayCaption(`Part of the diagonal is shown.`);
	displayCaption(`█ are the rocks, while ▒ are the valid stop positions.`)


	function display(nodeList) {
		for(let row of nodes) {
			let dispLine = ``;
			for(let node of row) {
				if(nodeList.includes(node)) {
					dispLine += "▒";
				} else if(node.type === "#") {
					dispLine += "█";
				} else if(node.type === "S") {
					dispLine += "S";
				} else {
					dispLine += " ";
				}
			}
			displayText(dispLine);
		}
	}
}