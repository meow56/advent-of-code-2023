"use strict";

function day25(input) {
	function Node(name, neighbors) {
		this.name = name;
		this.tempNeighbors = neighbors;
		this.neighbors = [];
	}

	Node.prototype.initialize = function() {
		for(let neighbor of this.tempNeighbors) {
			this.neighbors.push(find(neighbor));
		}
	};
	const FILE_REGEX = /([a-z]+): (?:[a-z]+ ?)+/g;
	let nodes = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		let neighbors = entry[0].split(": ")[1].split(" ");
		if(find(entry[1]) === undefined) {
			nodes.push(new Node(entry[1], neighbors));
		} else {
			let node = find(entry[1]);
			for(let neighbor of neighbors) {
				if(!node.tempNeighbors.includes(neighbor)) {
					node.tempNeighbors.push(neighbor);
				}
			}
		}
		for(let neighbor of neighbors) {
			if(find(neighbor) === undefined) {
				nodes.push(new Node(neighbor, [entry[1]]));
			} else {
				let neigh = find(neighbor);
				if(!neigh.tempNeighbors.includes(entry[1])) {
					neigh.tempNeighbors.push(entry[1]);
				}
			}
		}
	}

	function find(name) {
		for(let node of nodes) {
			if(node.name === name) return node;
		}
	}

	for(let node of nodes) {
		node.initialize();
	}

	console.log(nodes);

	// For one last time, it's time to plagiarize from my 2023 day 24 (plagiarization)^3 of my 2023 day 21 (plagiarization)^2 of my 2023 day 10 plagiarization of my 2022 day 18 solution.
	function BFS(...start) {
		let queue = start;
		for(let node of nodes) {
			node.depth = Infinity;
			node.explored = false;
			node.predecessor = [];
		}
		for(let node of start) {
			node.depth = 0;
			node.explored = true;
			node.predecessor = [];
		}
		while(queue.length !== 0) {
			let next = queue.shift();
			for(let path of next.neighbors) {
				if(!path.explored) {
					path.explored = true;
					path.depth = next.depth + 1;
					path.predecessor = [...next.predecessor, next];
					queue.push(path);
				}
			}
		}
	}

	let frequencies = [];
	let freqIMap = new Map();
	for(let node of nodes) {
		for(let neighbor of node.neighbors) {
			let names = [node.name, neighbor.name];
			names.sort();
			if(!freqIMap.has(names.join("-"))) {
				frequencies.push([names.join("-"), 0]);
				freqIMap.set(names.join("-"), frequencies.length - 1);
			}
		}
	}

	for(let node of nodes) {
		BFS(node);
		for(let node2 of nodes) {
			for(let i = 0; i < node2.predecessor.length - 1; i++) {
				let names = [node2.predecessor[i].name, node2.predecessor[i + 1].name];
				names.sort();
				frequencies[freqIMap.get(names.join("-"))][1]++;
			}
		}
	}

	frequencies.sort((a, b) => b[1] - a[1]);

	let edge1 = frequencies[0][0].split("-");
	let edge2 = frequencies[1][0].split("-");
	let edge3 = frequencies[2][0].split("-");

	edge1 = edge1.map(e => find(e));
	edge2 = edge2.map(e => find(e));
	edge3 = edge3.map(e => find(e));

	edge1[0].neighbors.splice(edge1[0].neighbors.findIndex(e => e === edge1[1]), 1);
	edge1[1].neighbors.splice(edge1[1].neighbors.findIndex(e => e === edge1[0]), 1);
	edge2[0].neighbors.splice(edge2[0].neighbors.findIndex(e => e === edge2[1]), 1);
	edge2[1].neighbors.splice(edge2[1].neighbors.findIndex(e => e === edge2[0]), 1);
	edge3[0].neighbors.splice(edge3[0].neighbors.findIndex(e => e === edge3[1]), 1);
	edge3[1].neighbors.splice(edge3[1].neighbors.findIndex(e => e === edge3[0]), 1);

	BFS(nodes[0]);
	let cut = [];
	for(let node of nodes) {
		if(node.explored) {
			cut.push(node);
		}
	}

	displayCaption(`The product is ${cut.length * (nodes.length - cut.length)}.`);

	displayCaption(`Merry Christmas!`);
}