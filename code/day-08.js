"use strict";

function day08(input) {
	function factor(n) {
		let factors = [];
		for(let i = 2; i < Math.sqrt(n); i++) {
			if(n % i === 0) {
				factors.push(i);
				n /= i;
				i = 2;
			}
		}
		factors.push(n);
		return factors.sort((a, b) => a - b);
	}
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
	const NODE_REGEX = /([A-Z0-9]{3}) = \(([A-Z0-9]{3}), ([A-Z0-9]{3})\)/g;
	let entry;
	let instructions = INST_REGEX.exec(input)[1];
	let nodes = [];
	while(entry = NODE_REGEX.exec(input)) {
		nodes.push(new Node(entry[1], entry[2], entry[3]));
	}
	let currNode;
	let startNodes = [];
	for(let node of nodes) {
		node.initialize();
		if(node.name === "AAA") currNode = node;
		if(node.name[2] === "A") startNodes.push(node);
	}
	let currInst = 0;
	let steps = 0;
	while(currNode.name !== "ZZZ") {
		if(instructions[currInst] === "L") currNode = nodes[currNode.left];
		else currNode = nodes[currNode.right];
		currInst = (currInst + 1) % instructions.length;
		steps++;
	}
	currInst = 0;
	let allSteps = 0;
	let firstEncounter = [];
	let cycles = [];
	let finished = false;
	while(!finished) {
		if(instructions[currInst] === "L") startNodes = startNodes.map(e => nodes[e.left]);
		else startNodes = startNodes.map(e => nodes[e.right]);
		for(let i = 0; i < startNodes.length; i++) {
			let sN = startNodes[i];
			if(sN.name[2] === "Z") {
				if(firstEncounter[i]) {
					let fE = firstEncounter[i];
					if(fE[1] === sN.name) {
						cycles[i] = allSteps - fE[0];
						let ready = true;
						for(let j = 0; j < startNodes.length; j++) {
							if(cycles[j] === undefined) {
								ready = false;
							}
						}
						if(ready) {
							// Find the smallest number N such that 
							// there exists n_1, n_2, ..., n_m
							// s.t. f[i] + n_i * cycles[i] = N for all i.
							
							// Time to plagiarize from my 2020 day 13 solution.
							let factoredCycles = cycles.map(cycle => factor(cycle));
							// Looking at my own input, I'm pretty sure every cycle
							// will have a common factor. So it's assumption time.
							let commonFactor;
							for(let testFactor of factoredCycles[0]) {
								if(factoredCycles.every(e => e.includes(testFactor))) {
									commonFactor = testFactor;
									break;
								}
							}
							let base = 1;
							let num = 0;
							for(let j = 0; j < startNodes.length; j++) {
								while((num + firstEncounter[j][0]) % cycles[j] !== 0) {
									num += base;
								}
								base *= cycles[j] / commonFactor;
								if(j === 0) base *= commonFactor;
							}
							allSteps = num - 1; // Why is it - 1? Don't ask.
							finished = true;
						}
					}
				} else {
					firstEncounter[i] = [allSteps, sN.name];
				}
			}
		}
		currInst = (currInst + 1) % instructions.length;
		if(!finished) allSteps++;
	}

	displayCaption(`The number of steps is ${steps}.`);
	displayCaption(`The number of ghost steps is ${allSteps}.`);
}