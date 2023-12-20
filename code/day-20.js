"use strict";

function day20(input) {	
	function Node(name, destinations) {
		this.name = name.slice(1);
		this.type = name[0];
		this.dests = destinations;

		if(this.type === "&") {
			this.state = new Map();
		} else if(this.type === "%") {
			this.state = false;
		}
	}

	Node.prototype.initialize = function() {
		let newDest = [];
		for(let node of nodes) {
			if(this.dests.includes(node.name)) {
				newDest.push(node);
			}
		}
		this.dests = newDest;
		if(this.type === "&") {
			for(let node of nodes) {
				if(node.dests.includes(this) || node.dests.includes(this.name)) {
					this.state.set(node.name, 0);
				}
			}
		}
	}

	const FILE_REGEX = /(broadcaster|%[a-z]+|&[a-z]+) -> ((?:[a-z]+,? ?)+)/g;
	let entry;
	let nodes = [];
	while(entry = FILE_REGEX.exec(input)) {
		nodes.push(new Node(entry[1], entry[2].split(", ")));
	}

	nodes.push(new Node("rrx", []));

	for(let node of nodes) {
		node.initialize();
	}

	function find(name) {
		for(let node of nodes) {
			if(node.name === name) {
				return node;
			}
		}
	}

	let totals = [0, 0];
	let iters = 0;
	while(iters !== 1000) {
		iters++;
		let pulseCount = [0, 0];
		let pulses = [["button", 0]];
		while(pulses.length > 0) {
			let nextPulse = pulses.shift();
			//console.log(`Doing [${nextPulse[0] === "button" ? "button" : nextPulse[0].name}, ${nextPulse[1]}, ${nextPulse[2]}]`);
			if(nextPulse[0] === "button") {
				pulseCount[nextPulse[1]]++;
				pulses.push([find("roadcaster"), nextPulse[1], "button"]);
			} else {
				let nextNode = nextPulse[0];
				switch(nextNode.type) {
				case "b":
					for(let node of nextNode.dests) {
						pulseCount[nextPulse[1]]++;
						pulses.push([node, nextPulse[1], nextNode.name]);
					}
					break;
				case "%":
					if(!nextPulse[1]) {
						nextNode.state = !nextNode.state;
						for(let node of nextNode.dests) {
							pulseCount[+nextNode.state]++;
							pulses.push([node, +nextNode.state, nextNode.name]);
						}
					}
					break;
				case "&":
					nextNode.state.set(nextPulse[2], nextPulse[1]);
					let pulseOut = 0;
					for(let value of nextNode.state.values()) {
						if(!value) {
							pulseOut = 1;
						}
					}
					for(let node of nextNode.dests) {
						pulseCount[pulseOut]++;
						pulses.push([node, pulseOut, nextNode.name]);
					}
					break;
				}
			}
		}

		totals[0] += pulseCount[0];
		totals[1] += pulseCount[1];
	}

	displayCaption(`The product is ${totals[0] * totals[1]}.`);
}