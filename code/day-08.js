"use strict";

function day08(input) {
	// 7309459565208 too high
	// 14618919050608 too high
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

	function exEuclid(a, b) {
		let r = [a, b];
		let s = [1n, 0n];
		let t = [0n, 1n];
		while(r[r.length - 1] !== 0n) {
			let i = r.length - 1;
			let q = r[i - 1] / r[i];
			r.push(r[i - 1] % r[i]);
			s.push(s[i - 1] - (q * s[i]));
			t.push(t[i - 1] - (q * t[i]));
		}
		let i = r.length - 2;
		if(BigInt(r[i]) !== (BigInt(a) * BigInt(s[i])) + (BigInt(b) * BigInt(t[i]))) {
			console.log(r);
			console.log(s);
			console.log(t);
			throw `You implemented the algorithm wrong mate`;
		}
		return [r[i], s[i], t[i]];
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
							console.log(cycles);
							console.log(firstEncounter.map(e => e[0]));
							let factoredCycles = cycles.map(cycle => factor(cycle));
							// Looking at my own input, I'm pretty sure every cycle
							// will have a common factor. So it's assumption time.
							// Update: CRM doesn't work out of the box with noncoprime
							// bases. Wikipedia saves the day with an extension!
							// We need to use Bezout's (accents) identity.
							let num = BigInt(cycles[0]);
							let lastDiv;
							let lastG;
							for(let j = 0; j < cycles.length - 1; j++) {
								let newNum = num;
								if(j !== 0) lastDiv = (num * BigInt(cycles[j]) / lastG);
								//while(newNum < 0) newNum += lastDiv;
								let [g, u, v] = exEuclid(newNum, BigInt(cycles[j + 1]));
								lastG = g;
								num = (BigInt(firstEncounter[j][0]) * v * BigInt(cycles[j + 1]) + BigInt(firstEncounter[j + 1][0]) * u * num) / g;
							}
							allSteps = num % lastDiv;
							while(allSteps < 0) allSteps += -1n * lastDiv;
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