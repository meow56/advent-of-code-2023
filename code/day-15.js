"use strict";

function day15(input) {
	const FILE_REGEX = /.+/g;
	let words = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		words = entry[0].split(",");
	}

	function hash(str) {
		let currVal = 0;
		for(let i = 0; i < str.length; i++) {
			let code = str.charCodeAt(i);
			currVal += code;
			currVal *= 17;
			currVal %= 256;
		}
		return currVal;
	}

	let boxes = [];
	for(let i = 0; i < 256; i++) {
		boxes.push(new Map());
	}
	
	function hashmap(str) {
		if(str.includes("-")) {
			let toHash = str.split("-")[0];
			let hashVal = hash(toHash);
			let box = boxes[hashVal];
			box.delete(toHash);
		} else {
			let info = str.split("=");
			let label = info[0];
			let focal = +(info[1]);
			let hashVal = hash(label);
			let box = boxes[hashVal];
			box.set(label, focal);
		}
	}
	let sum = words.map(e => hash(e)).reduce((acc, val) => acc + val);
	for(let i = 0; i < words.length; i++) {
		hashmap(words[i]);
	}
	let focusPowerSum = 0;
	for(let i = 0; i < boxes.length; i++) {
		let boxIndex = 1;
		let focusPowerBox = 0;
		for(let lens of boxes[i].values()) {
			focusPowerBox += (i + 1) * boxIndex * lens;
			boxIndex++;
		}
		focusPowerSum += focusPowerBox;
	}
	displayCaption(`The sum is ${sum}.`);
	displayCaption(`The focus power is ${focusPowerSum}.`);
}