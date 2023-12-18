"use strict";

function day18(input) {
	const FILE_REGEX = /(.) (\d+) \(#([a-z0-9]{6})\)/g;
	let instructions = [];
	let entry;
	const NUM_TO_DIR = ["R", "D", "L", "U"];
	while(entry = FILE_REGEX.exec(input)) {
		//instructions.push([entry[1], +(entry[2]), entry[3]]);
		let newInstruction = [];
		newInstruction[0] = NUM_TO_DIR[entry[3][5]];
		newInstruction[1] = parseInt(entry[3].slice(0, -1), 16);
		instructions.push(newInstruction);
	}

	let vertLines = [];
	let horiLines = [];
	let currCoord = [0, 0];
	for(let inst of instructions) {
		let direction;
		switch(inst[0]) {
		case "U":
			vertLines.push([[currCoord[0], currCoord[1] - inst[1]], currCoord.slice()]);
			currCoord[1] -= inst[1];
			break;
		case "L":
			horiLines.push([[currCoord[0] - inst[1], currCoord[1]], currCoord.slice()]);
			currCoord[0] -= inst[1];
			break;
		case "D":
			vertLines.push([currCoord.slice(), [currCoord[0], currCoord[1] + inst[1]]]);
			currCoord[1] += inst[1];
			break;
		case "R":
			horiLines.push([currCoord.slice(), [currCoord[0] + inst[1], currCoord[1]]]);
			currCoord[0] += inst[1];
			break;
		}
	}

	//display();
	//displayText();
	vertLines.sort((a, b) => a[0][1] - b[0][1]);
	let minValue = vertLines.reduce((acc, val) => Math.min(acc, val[0][1]), Infinity);
	let maxValue = vertLines.reduce((acc, val) => Math.max(acc, val[1][1]), 0);
	let volume = 0;


	for(let i = minValue; i <= maxValue; i++) {
		if(i % 1000000 === 0) console.log(`Doing ${i}`);
		let relevant = [];
		for(let line of vertLines) {
			if(line[0][1] <= i && line[1][1] >= i) {
				relevant.push(line);
			} else if(line[0][1] > i) {
				break;
			}
		}

		relevant.sort((a, b) => a[0][0] - b[0][0]);

		let parityCorrection = 0;
		for(let j = 0; j < relevant.length - 1; j++) {
			let first = relevant[j];
			let second = relevant[j + 1];
			if(first[0][1] === i && second[1][1] === i) {
				if(horiLines.findIndex(e => 
					((e[0][0] === first[0][0] && e[0][1] === first[0][1] 
					&& e[1][0] === second[1][0] && e[1][1] === second[1][1]))) !== -1) {
					volume += second[0][0] - first[0][0];
					parityCorrection++;
				} else if((j + parityCorrection) % 2 === 0) {
					volume += second[0][0] - first[0][0] + 1;
				}
			} else if(first[1][1] === i && second[0][1] === i) {
				if(horiLines.findIndex(e => 
					((e[0][0] === first[1][0] && e[0][1] === first[1][1] 
					&& e[1][0] === second[0][0] && e[1][1] === second[0][1]))) !== -1) {
					volume += second[0][0] - first[0][0];
					parityCorrection++;
				} else if((j + parityCorrection) % 2 === 0) {
					volume += second[0][0] - first[0][0] + 1;
				}
			} else if((first[0][1] === i && second[0][1] === i)) {
				if(horiLines.findIndex(e =>
					e[0][0] === first[0][0] && e[0][1] === first[0][1]  
					&& e[1][0] === second[0][0] && e[1][1] === second[0][1]) !== -1) {
					if((j + parityCorrection) % 2 === 0) {
						volume += second[0][0] - first[0][0] + 1;
					} else {
						volume += second[0][0] - first[0][0] - 1;
						if(j === relevant.length - 2 || j === 0) volume++;
					}
				} else if((j + parityCorrection) % 2 === 0) {
					volume += second[0][0] - first[0][0] + 1;
				}
			} else if(first[1][1] === i && second[1][1] === i) {
				if(horiLines.findIndex(e =>
					e[0][0] === first[1][0] && e[0][1] === first[1][1]  
					&& e[1][0] === second[1][0] && e[1][1] === second[1][1]) !== -1) {
					if((j + parityCorrection) % 2 === 0) {
						volume += second[0][0] - first[0][0] + 1;
					} else {
						volume += second[0][0] - first[0][0] - 1;
						if(j === relevant.length - 2 || j === 0) volume++;
					}
				} else if((j + parityCorrection) % 2 === 0) {
					volume += second[0][0] - first[0][0] + 1;
				}
			} else {
				if((j + parityCorrection) % 2 === 0) {
					volume += second[0][0] - first[0][0] + 1;
				}
			}
		}
	}

	displayCaption(`The volume is ${volume}.`);


	function display() {
		for(let line of grid) {
			displayText(line.join(""));
		}
	}
	//display();
}