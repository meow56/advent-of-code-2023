"use strict";

function day02(input) {
	const FILE_REGEX = /Game ([0-9]+): (.+)/g;
	let entry;
	let games = [];
	while(entry = FILE_REGEX.exec(input)) {
		let pulls = entry[2].split("; ");
		pulls = pulls.map(function(elem) {
			elem = elem.split(", ");
			elem = elem.map(function(group) {
				let temp = group.split(" ");
				temp[0] = +(temp[0]);
				return temp;
			});
			return elem;
		});
		games[entry[1]] = pulls;
	}

	let isPossible = [false];
	let power = [0];
	let sum = 0;
	let sum2 = 0;
	for(let i = 1; i < games.length; i++) {
		let game = games[i];
		let red = 0;
		let green = 0;
		let blue = 0;
		for(let pull of game) {
			for(let group of pull) {
				if(group[1] === "red") {
					if(group[0] > 12) {
						console.log(`Game ${i} is impossible, we pulled ${group[0]} red.`);
						isPossible[i] = false;
					}
					red = Math.max(group[0], red);
				}
				if(group[1] === "green") {
					if(group[0] > 13) {
						console.log(`Game ${i} is impossible, we pulled ${group[0]} green.`);
						isPossible[i] = false;
					}
					green = Math.max(group[0], green);
				}
				if(group[1] === "blue") {
					if(group[0] > 14) {
						console.log(`Game ${i} is impossible, we pulled ${group[0]} blue.`);
						isPossible[i] = false;
					}
					blue = Math.max(group[0], blue);
				}
			}
		}
		if(isPossible[i] === false) {

		} else {
			console.log(`Game ${i} is possible.`);
			isPossible[i] = true;
			sum += i;
		}
		sum2 += red * green * blue;
	}
	displayCaption(`The sum of possible games is ${sum}.`);
	displayCaption(`The power sum is ${sum2}.`);
}