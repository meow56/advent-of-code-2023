"use strict";

function day06(input) {
	const TIME_REGEX = /Time: +(.+)/g;
	const DIST_REGEX = /Distance: +(.+)/g;
	let entry;
	let times;
	let distances;
	entry = TIME_REGEX.exec(input)
	times = entry[1].split(" ").filter(e => e !== "").map(e => +e);
	entry = DIST_REGEX.exec(input)
	distances = entry[1].split(" ").filter(e => e !== "").map(e => +e);
	function calcPossible(time, distance) {
		for(let i = 0; i < time; i++) {
			if(i * (time - i) > distance) {
				return time - i - i + 1;
			}
		}
	}

	let product = 1;
	for(let i = 0; i < times.length; i++) {
		product *= calcPossible(times[i], distances[i]);
	}
	let numWaysToWin = calcPossible(+(times.join("")), +(distances.join("")));
	displayCaption(`The product is ${product}.`);
	displayCaption(`The number of ways to win is ${numWaysToWin}.`);
}