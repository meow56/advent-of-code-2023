"use strict";

function day08(input) {
	function Node(name, left, right) {
		this.name = name;
		this.left = left;
		this.right = right;
	}

	Node.prototype.initialize = function() {
		for(let i = 0; i < nodes.length; i++) {
			let node = nodes[i];
			if(node.name === this.left) this.left = i;
			if(node.name === this.right) this.right = i;
		}
	}

	const INST_REGEX = /([LR]+)\n/g;
	const NODE_REGEX = /([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)/g;
	let entry;
	let instructions = INST_REGEX.exec(input)[1];
	let nodes = [];
	while(entry = NODE_REGEX.exec(input)) {
		nodes.push(new Node(entry[1], entry[2], entry[3]));
	}
	let currNode;
	for(let node of nodes) {
		node.initialize();
		if(node.name === "AAA") currNode = node;
	}
	let currInst = 0;
	let steps = 0;
	while(currNode.name !== "ZZZ") {
		if(instructions[currInst] === "L") currNode = nodes[currNode.left];
		else currNode = nodes[currNode.right];
		currInst = (currInst + 1) % instructions.length;
		steps++;
	}

	displayCaption(`The number of steps is ${steps}.`);
}