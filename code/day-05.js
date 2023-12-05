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

	/**
	 * Range = [int, int]
	 *       | [Range, Range]
	 */
	NotMap.prototype.convertRange = function(range) {
		console.groupCollapsed(`${this.source}-to-${this.destination}: ${display(range)}`);
		if(typeof range[0] === "number") {
			for(let testRange of this.ranges) {
				if(range[0] >= testRange[0] && range[1] < testRange[1]) {
					// The seed range is fully enclosed
					console.log(`Fully enclosed`);
					console.groupEnd();
					return range.map(e => e + testRange[2]);
				} else if(range[0] >= testRange[0] && range[0] < testRange[1]) {
					// The lower half of the seed range overlaps this part.
					console.log(`${range[0]} to ${testRange[1] - 1} enclosed`);
					let temp = merge([range[0] + testRange[2], testRange[1] + testRange[2] - 1], this.convertRange([testRange[1], range[1]]));
					console.groupEnd();
					return temp;
				} else if(range[1] < testRange[1] && range[1] >= testRange[0]) {
					// The upper half of the seed range overlaps the tested range.
					console.log(`${testRange[0]} to ${range[1]} enclosed`);
					let temp = merge(this.convertRange([range[0], testRange[0] - 1]), [testRange[0] + testRange[2], range[1] + testRange[2]]);
					console.groupEnd();
					return temp;
				} else {
					// Entirely outside it.
				}
			}
			// Completely outside of every tested range.
			console.log(`Not applicable`);
			console.groupEnd();
			return range;
		} else {
			let firstRange = this.convertRange(range[0]);
			let secondRange = this.convertRange(range[1]);
			let temp = merge(firstRange, secondRange);
			console.log(`Final result: ${display(temp)}`);
			console.groupEnd();
			return temp;
		}
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

	function getMin(range) {
		if(typeof range[0] === "number") return range[0];
		return getMin(range[0]);
	}

	function getMax(range) {
		if(typeof range[1] === "number") return range[1];
		return getMin(range[1]);
	}

	function display(range) {
		if(typeof range[0] === "number") return `[${range.join(", ")}]`;
		return `[${display(range[0])}, ${display(range[1])}]`;
	}

	function merge(firstRange, secondRange) {
		console.log(`Comparing ${display(firstRange)} and ${display(secondRange)}...`);
		if(typeof firstRange[0] === "number" && typeof secondRange[0] === "number") {
			if(firstRange[0] >= secondRange[0] && firstRange[1] <= secondRange[1]) {
				// First range is entirely enclosed by second range.
				console.log(`First enclosed`);
				return secondRange;
			} else if(firstRange[0] <= secondRange[0] && firstRange[1] >= secondRange[1]) {
				// Second range entirely enclosed by first range.
				console.log(`Second enclosed`);
				return firstRange;
			} else if(firstRange[0] >= secondRange[0] && firstRange[0] <= secondRange[1] + 1) {
				// The lower part of firstRange overlaps secondRange.
				console.log(`First < Second`);
				return [secondRange[0], firstRange[1]];
			} else if(firstRange[1] >= secondRange[0] - 1 && firstRange[1] <= secondRange[1]) {
				// The upper part of firstRange overlaps secondRange.
				console.log(`Second < First`);
				return [firstRange[0], secondRange[1]];
			} else {
				// No overlap.
				console.log(`No overlap`);
				if(firstRange < secondRange) return [firstRange, secondRange];
				return [secondRange, firstRange];
			}
		} else if(typeof firstRange[0] === "number" || typeof secondRange[0] === "number") {
			let numRange = typeof firstRange[0] === "number" ? firstRange : secondRange;
			let rangeRange = typeof firstRange[0] === "number" ? secondRange : firstRange;
			if(numRange[1] < getMin(rangeRange[0]) - 1) {
				// They're entirely separate.
				return [numRange, rangeRange];
			} else if(numRange[1] <= getMax(rangeRange[0])) {
				// There's some kind of overlap between numRange and the lower
				// of the two ranges in rangeRange...
				return [merge(numRange, rangeRange[0]), rangeRange[1]];
			} else if(numRange[1] < getMin(rangeRange[1]) - 1) {
				if(numRange[0] <= getMin(rangeRange[0])) {
					// numRange entirely covers the lower of rangeRange.
					return [numRange, rangeRange[1]];
				} else if(numRange[0] <= getMax(rangeRange[0]) + 1) {
					// There's another overlap of a different kind
					// with the lower range.
					return [merge(numRange, rangeRange[0]), rangeRange[1]];
				} else {
					// They're entirely separate again, but differently.
					return [rangeRange[0], [numRange, rangeRange[1]]];
				}
			} else if(numRange[1] <= getMax(rangeRange[1])) {
				if(numRange[0] <= getMin(rangeRange[0])) {
					// numRange entirely covers the lower range and overlaps with the higher range.
					return merge(numRange, rangeRange[1]);
				} else if(numRange[0] <= getMax(rangeRange[0]) + 1) {
					// numRange closes the gap between the lower and higher ranges.
					return merge(rangeRange[0], merge(numRange, rangeRange[1]));
				} else if(numRange[0] < getMin(rangeRange[1])) {
					// There's some overlap with the upper range.
					return [rangeRange[0], merge(numRange, rangeRange[1])];
				} else {
					// Same deal.
					return [rangeRange[0], merge(numRange, rangeRange[1])];
				}
			} else {
				if(numRange[0] <= getMin(rangeRange[0])) {
					// rangeRange is fully enclosed by numRange.
					return numRange;
				} else if(numRange[0] <= getMax(rangeRange[0]) + 1) {
					// There's some kind of overlap with the lower range.
					// The upper range is fully enclosed.
					return merge(rangeRange[0], numRange);
				} else if(numRange[0] < getMin(rangeRange[1])) {
					// The upper range is fully enclosed.
					return [rangeRange[0], numRange];
				} else if(numRange[0] <= getMax(rangeRange[1]) + 1) {
					// There's some kind of overlap with the upper range.
					return [rangeRange[0], merge(rangeRange[1], numRange)];
				} else {
					// They're all separate for the third time.
					return [rangeRange[0], [rangeRange[1], numRange]];
				}
			}
		} else {
			return merge(firstRange[0], merge(firstRange[1], secondRange));
		}
	}

	const FILE_REGEX = /seeds: (.+)/g;
	let seeds = FILE_REGEX.exec(input)[1].split(" ").map(e => +e);
	let seedRanges = [];
	for(let i = 0; i < seeds.length; i += 2) {
		seedRanges.push([seeds[i], seeds[i] + seeds[i + 1] - 1]);
	}
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

	let lowestLocalRange = Number.MAX_SAFE_INTEGER;
	for(let seedRange of seedRanges) {
		let step = "seed";
		let range = seedRange;
		while(step !== "location") {
			range = maps[getSource(step)].convertRange(range);
			step = maps[getSource(step)].destination;
		}
		lowestLocalRange = Math.min(lowestLocalRange, getMin(range));
	}

	displayCaption(`The lowest location number is ${lowestLocal}.`);
	displayCaption(`The REAL lowest location number is ${lowestLocalRange}.`);
}