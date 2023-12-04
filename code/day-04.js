"use strict";

function day04(input) {
	function ScratchCard(winning, numbers, index) {
		this.winning = winning;
		this.numbers = numbers;
		this.index = +index;
		this.multiplicity = 1;
		this.winIndices = [];
		this.score = 0;
	}

	ScratchCard.prototype.findWinners = function() {
		for(let i = 0; i < this.numbers.length; i++) {
			if(this.winning.includes(this.numbers[i])) {
				this.winIndices.push(i);
			}
		}
		this.score = this.winIndices.length === 0 ? 0 : 2 ** (this.winIndices.length - 1);
		
		for(let j = 1; j <= this.winIndices.length; j++) {
			if(this.index + j < cards.length) {
				cards[this.index + j].multiplicity += this.multiplicity;
			}
		}
	}

	ScratchCard.prototype.display = function() {
		let finalLine = `Card ${this.index.toString().padStart(3, " ")}: `;
		let displayWin = this.winning.map(e => e.toString().padStart(2, " ")).join(" ");
		finalLine += displayWin;
		finalLine += " | ";
		let displayNums = ``;
		for(let i = 0; i < this.numbers.length; i++) {
			let num = this.numbers[i].toString().padStart(2, " ");
			if(this.winIndices.includes(i)) {
				displayNums += `<span class="black">${num}</span>`;
			} else {
				displayNums += num;
			}
			displayNums += ` `;
		}
		finalLine += displayNums;
		finalLine += "   ";
		finalLine += `Wins: ${this.winIndices.length.toString().padStart(2, " ")} `;
		finalLine += `Score: ${this.score.toString().padStart(3, " ")} `;
		finalLine += `Multiplicity: ${this.multiplicity}`;
		displayText(finalLine);
	}

	const FILE_REGEX = /Card +(\d+): (.+) \| (.+)/g;
	let entry;
	let cards = [new ScratchCard([], [], 0)];
	while(entry = FILE_REGEX.exec(input)) {
		let winning = entry[2].split(" ");
		winning = winning.filter(e => e !== "");
		winning = winning.map(e => +e);
		let nums = entry[3].split(" ");
		nums = nums.filter(e => e !== "");
		nums = nums.map(e => +e);
		cards[entry[1]] = new ScratchCard(winning, nums, entry[1]);
	}
	cards[0].multiplicity = 0;

	let sum = 0;
	for(let i = 1; i < cards.length; i++) {
		cards[i].findWinners();
		sum += cards[i].score;
	}
	let scratchCount = cards.reduce(function(acc, val) {
		return acc + val.multiplicity;
	}, 0);
	displayCaption(`The sum is ${sum}.`);
	displayCaption(`The number of scratchcards is ${scratchCount}.`);
	displayCaption(`The scratchcards are shown.`);
	displayCaption(`Numbers we have that are winning are highlighted.`);
	displayCaption(`The number of wins, score, and multiplicity of each card is also displayed.`);

	for(let i = 1; i < cards.length; i++) {
		cards[i].display();
	}
}