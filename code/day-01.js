"use strict";

function day01(input) {
	const FILE_REGEX = /.+/g;
	let entry;
	let sum = 0;
	let sum2 = 0;
	let wordToNum = new Map([
		["zero", 0],
		["one", 1],
		["two", 2],
		["three", 3],
		["four", 4],
		["five", 5],
		["six", 6],
		["seven", 7],
		["eight", 8],
		["nine", 9],
	]);
	let lineData = [];
	while(entry = FILE_REGEX.exec(input)) {
		entry = entry[0];
		let reversedLine = entry.split("").toReversed().join("");

		let NUM_REGEX = /[0-9]/g;
		let NUM_REGEX_REV = /[0-9]/g;
		let firstDigit = NUM_REGEX.exec(entry);
		let lastDigit = NUM_REGEX_REV.exec(reversedLine);
		let firstIndex = firstDigit.index;
		let lastIndex = entry.length - 1 - lastDigit.index;
		let num = +(firstDigit[0] + lastDigit[0]);
		sum += num;

		let NUM_REGEX_2 = /[0-9]|one|two|three|four|five|six|seven|eight|nine|zero/g;
		let NUM_REGEX_2_REV = /[0-9]|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin|orez/g;
		let firstDigit2 = NUM_REGEX_2.exec(entry);
		let lastDigit2 = NUM_REGEX_2_REV.exec(reversedLine);
		let firstIndex2 = firstDigit2.index;
		let firstLength2 = firstDigit2[0].length;
		let lastLength2 = lastDigit2[0].length;
		let lastIndex2 = entry.length - lastDigit2.index - lastLength2;
		if(Number.isNaN(+(firstDigit2[0]))) {
			firstDigit2 = wordToNum.get(firstDigit2[0]);
		} else {
			firstDigit2 = +(firstDigit2[0]);
		}
		if(Number.isNaN(+(lastDigit2[0]))) {
			lastDigit2 = wordToNum.get(lastDigit2[0].split("").toReversed().join(""));
		} else {
			lastDigit2 = +(lastDigit2[0]);
		}
		sum2 += firstDigit2 * 10 + lastDigit2;

		lineData.push([entry, firstIndex, lastIndex, firstIndex2, lastIndex2, firstLength2, lastLength2]);
	}
	displayCaption(`The sum is ${sum}.`);
	displayCaption(`The other sum is ${sum2}.`);
	displayCaption(`The lines are all displayed, with various numbers highlighted.`);
	displayCaption(`The first digit for part 1 is highlighted in red.`);
	displayCaption(`The last digit for part 1 is highlighted in yellow.`);
	displayCaption(`If these are identical, the digit is highlighted in orange instead.`);
	displayCaption(`The first digit for part 2 has an overline.`);
	displayCaption(`The last digit for part 2 has an underline.`);

	displayLine(0);
	function displayLine(i) {
		if(i === lineData.length) return;
		let [entry, firstIndex, lastIndex, firstIndex2, lastIndex2, firstLength2, lastLength2] = lineData[i];
		let finalString = [];
		let first2Counter = 0;
		let last2Counter = 0;
		let styles = [];
		for(let i = 0; i < entry.length; i++) {
			styles.push([0, 0, 0, 0]);
		}
		styles[firstIndex][0] = 1;
		styles[lastIndex][1] = 1;
		for(let i = 0; i < firstLength2; i++) {
			styles[firstIndex2 + i][2] = 1;
		}
		for(let i = 0; i < lastLength2; i++) {
			styles[lastIndex2 + i][3] = 1;
		}
		for(let i = 0; i < styles.length; i++) {
			if(styles[i].every(e => e === 0)) {
				finalString.push(entry[i]);
			} else {
				let highlight = styles[i][0];
				let highlight2 = styles[i][1];
				let overline = styles[i][2];
				let underline = styles[i][3];
				let currentIndex = i;
				let check = styles[i].join(", ");
				for(; styles[currentIndex] && styles[currentIndex].join(", ") === check; currentIndex++) {

				}
				let text = entry.slice(i, currentIndex);
				let styling = `style="`;
				if(overline && underline) {
					styling += `text-decoration: overline underline 2px;`;
				} else if(overline) {
					styling += `text-decoration: overline 2px;`;
				} else if(underline) {
					styling += `text-decoration: underline 2px;`;
				}

				if(highlight && highlight2) {
					styling += `background-color: orange;`;
				} else if(highlight) {
					styling += `background-color: red;`;
				} else if(highlight2) {
					styling += `background-color: yellow;`;
				}

				finalString.push(`<span ${styling}">${text}</span>`);
				i = currentIndex - 1;
			}
		}
		displayText(finalString.join(""));
		displayText();
		setTimeout(displayLine, 0, i + 1);
	}
}