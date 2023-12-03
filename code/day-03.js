"use strict";

function day03(input) {
	function MaybePartNumber(y, xStart, xEnd, value) {
		this.y = y;
		this.xStart = xStart;
		this.xEnd = xEnd;
		this.value = value;
		this.isPartNumber = false;
		this.adjacentPart;
	}

	function Part(y, x, isMaybeGear) {
		this.y = y;
		this.x = x;
		this.isMaybeGear = isMaybeGear;
		this.adjacentLabels = [];
		this.color = [randInt(128, 255), randInt(128, 255), randInt(128, 255)];
	}

	const FILE_REGEX = /.+/g;
	let grid = [];
	let parts = [];
	let numbers = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		const PART_REGEX = /[^0-9.\n]/g;
		const NUM_REGEX = /[0-9]+/g;
		grid.push(entry[0].split(""));
		let partEntry;
		while(partEntry = PART_REGEX.exec(entry)) {
			parts.push(new Part(grid.length - 1, 
				partEntry.index, 
				partEntry[0] === "*"));
		}
		let numEntry;
		while(numEntry = NUM_REGEX.exec(entry)) {
			let temp = new MaybePartNumber(grid.length - 1, 
				numEntry.index, 
				numEntry.index + numEntry[0].length - 1, 
				+(numEntry[0]));
			numbers.push(temp);
		}
	}

	for(let part of parts) {
		for(let number of numbers) {
			if(number.y < part.y - 1) continue;
			if(number.y > part.y + 1) continue;
			if(number.xStart >= part.x - 1 && number.xStart <= part.x + 1) {
				number.isPartNumber = true;
				number.adjacentPart = part;
				if(part.isMaybeGear) part.adjacentLabels.push(number);
			} else if(number.xEnd >= part.x - 1 && number.xEnd <= part.x + 1) {
				number.isPartNumber = true;
				number.adjacentPart = part;
				if(part.isMaybeGear) part.adjacentLabels.push(number);
			}
		}
	}

	let partSum = numbers.reduce(function(acc, val) {
		return val.isPartNumber ? acc + val.value : acc;
	}, 0);
	let gearRatioSum = parts.reduce(function(acc, val) {
		return val.isMaybeGear && val.adjacentLabels.length === 2 ? 
			acc + val.adjacentLabels[0].value * val.adjacentLabels[1].value 
			: acc;
	}, 0);
	displayCaption(`The sum is ${partSum}.`);
	displayCaption(`The gear ratio sum is ${gearRatioSum}.`);
	displayCaption(`The blueprint is shown.`);
	displayCaption(`All gears and their gear ratio are shown with a black background.`);
	displayCaption(`All non-gear parts and their part number are shown with a non-black, non-white background.`);
	displayCaption(`Numbers that are not associated with a part are shown with a white background.`);

	for(let part of parts) {
		if(part.isMaybeGear && part.adjacentLabels.length === 2) {
			part.color = "black";
		}
	}
	for(let i = 0; i < grid.length; i++) {
		let initialLine = new Array(grid[i].length).fill(" ");
		for(let part of parts) {
			if(part.y !== i) continue;
			if(part.color === "black") {
				initialLine[part.x] = `<span class="black">${grid[i][part.x]}</span>`;
			} else {
				initialLine[part.x] = `<span style="background-color: rgb(${part.color.join(", ")});">${grid[i][part.x]}</span>`;
			}
		}
		for(let number of numbers) {
			if(number.y !== i) continue;
			if(!number.isPartNumber) {
				let dummy = new Array(number.value.toString().length - 1).fill("");
				initialLine.splice(number.xStart, number.value.toString().length, number.value, ...dummy);
			} else {
				let dummy = new Array(number.value.toString().length - 1).fill("");
				if(number.adjacentPart.color === "black") {
					initialLine.splice(number.xStart, number.value.toString().length, `<span class="black">${number.value}</span>`, ...dummy);
				} else {
					initialLine.splice(number.xStart, number.value.toString().length, `<span style="background-color: rgb(${number.adjacentPart.color.join(", ")});">${number.value}</span>`, ...dummy);
				}
			}
		}
		displayText(initialLine.join(""));
	}
}