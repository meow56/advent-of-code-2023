"use strict";

function day05(input) {
	function NotMap(source, destination, ranges) {
		this.source = source;
		this.destination = destination;
		ranges = ranges.split("\n").filter(e => e.length > 0).map(e => e.split(" ").map(n => +n));
		this.ranges = ranges.map(e => [e[1], e[1] + e[2], e[0] - e[1]]);

	}

	NotMap.prototype.convert = function(num) {
		for(let range of this.ranges) {
			if(num >= range[0] && num < range[1]) {
				//console.log(`${this.source}-to-${this.destination}: ${num} to ${num + range[2]}`);
				return [num + range[2], this.destination];
			}
		}
		//console.log(`${this.source}-to-${this.destination}: ${num} to ${num}`);
		return [num, this.destination];
	}

	const SOURCE_MAP = new Map();
	function getSource(source) {
		if(SOURCE_MAP.has(source)) return SOURCE_MAP.get(source);
		for(let i = 0; i < maps.length; i++) {
			if(maps[i].source === source) {
				SOURCE_MAP.set(source, i);
				return i;
			}
		}
	}

	const FILE_REGEX = /seeds: (.+)/g;
	let seeds = FILE_REGEX.exec(input)[1].split(" ").map(e => +e);
	const MAP_REGEX = /(.+)-to-(.+) map:\n((?:(?:\d+ ?)+\n?)+)/g;
	let entry;
	let maps = [];
	while(entry = MAP_REGEX.exec(input)) {
		maps.push(new NotMap(entry[1], entry[2], entry[3]));
	}

	let lowestLocal = Number.MAX_SAFE_INTEGER;
	for(let seed of seeds) {
		let step = "seed";
		let number = seed;
		while(step !== "location") {
			[number, step] = maps[getSource(step)].convert(number);
		}
		lowestLocal = Math.min(lowestLocal, number);
	}

	displayCaption(`The lowest location number is ${lowestLocal}.`);
}