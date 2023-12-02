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

	let isPossible = [[]];
	let maxCubeI = [[0, 0, 0]];
	let sum = 0;
	let sum2 = 0;
	for(let i = 1; i < games.length; i++) {
		isPossible[i] = [];
		let game = games[i];
		let red = 0;
		let rI;
		let green = 0;
		let gI;
		let blue = 0;
		let bI;
		for(let j = 0; j < game.length; j++) {
			let pull = game[j];
			for(let k = 0; k < pull.length; k++) {
				let group = pull[k];
				if(group[1] === "red") {
					if(group[0] > 12) {
						console.log(`Game ${i} is impossible, we pulled ${group[0]} red.`);
						isPossible[i].push([j, k]);
					}
					if(group[0] > red) {
						red = group[0];
						rI = [j, k];
					}
				}
				if(group[1] === "green") {
					if(group[0] > 13) {
						console.log(`Game ${i} is impossible, we pulled ${group[0]} green.`);
						isPossible[i].push([j, k]);
					}
					if(group[0] > green) {
						green = group[0];
						gI = [j, k];
					}
				}
				if(group[1] === "blue") {
					if(group[0] > 14) {
						console.log(`Game ${i} is impossible, we pulled ${group[0]} blue.`);
						isPossible[i].push([j, k]);
					}
					if(group[0] > blue) {
						blue = group[0];
						bI = [j, k];
					}
				}
			}
		}
		if(isPossible[i].length === 0) {
			console.log(`Game ${i} is possible.`);
			sum += i;
		}
		maxCubeI[i] = [rI, gI, bI];
		sum2 += red * green * blue;
	}
	displayCaption(`The sum of possible games is ${sum}.`);
	displayCaption(`The power sum is ${sum2}.`);
	displayCaption(`All of the games are displayed, along with their power.`);
	displayCaption(`Impossible games have their id and power in a span with class 'wrong'.`);
	displayCaption(`All of the impossible pulls are crossed out.`);
	displayCaption(`The largest pull of every color in that game is highlighted in its color.`);

	for(let i = 1; i < games.length; i++) {
		let game = games[i];
		let finalText = `Game ${i.toString().padStart(3, "0")}, `;
		let textGroups = [];
		let power = maxCubeI[i].reduce((acc, val) => acc * game[val[0]][val[1]][0], 1);
		finalText += `power ${power.toString().padStart(4, "0")}:`;
		if(isPossible[i].length > 0) {
			finalText = `<span class="wrong">${finalText}</span>`;
		}
		finalText += " ";
		for(let j = 0; j < game.length; j++) {
			let pulls = game[j];
			let interGroup = [];
			for(let k = 0; k < pulls.length; k++) {
				let group = pulls[k];
				interGroup.push(`${group[0]} ${group[1]}`);
			}
			textGroups.push(interGroup);
		}

		for(let inv of isPossible[i]) {
			textGroups[inv[0]][inv[1]] = `<span style="text-decoration: line-through #FFFFFF">${textGroups[inv[0]][inv[1]]}</span>`;
		}
		let maxCubes = maxCubeI[i];
		textGroups[maxCubes[0][0]][maxCubes[0][1]] = `<span class="red">${textGroups[maxCubes[0][0]][maxCubes[0][1]]}</span>`;
		textGroups[maxCubes[1][0]][maxCubes[1][1]] = `<span class="green">${textGroups[maxCubes[1][0]][maxCubes[1][1]]}</span>`;
		textGroups[maxCubes[2][0]][maxCubes[2][1]] = `<span class="blue">${textGroups[maxCubes[2][0]][maxCubes[2][1]]}</span>`;
		textGroups = textGroups.map(e => e.join(", "));
		finalText += textGroups.join("; ");
		displayText(finalText);
	}
}