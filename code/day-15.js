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
			let label = str.split("-")[0];
			let hashVal = hash(label);
			let box = boxes[hashVal];
			displayInstruction(label, hashVal);
			box.delete(label);
		} else {
			let info = str.split("=");
			let label = info[0];
			let focal = +(info[1]);
			let hashVal = hash(label);
			let box = boxes[hashVal];
			displayInstruction(label, hashVal, focal);
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
	displayCaption(`The actions taken are shown.`);
	displayCaption(`Instructions that do nothing are removed for brevity.`);
	displayCaption(`After that, the boxes in their final state are shown.`);
	displayCaption(`The lenses are in the correct order, with each lens showing their label and their focal length.`);

	function displayInstruction(word, hash, focal) {
		if(focal !== undefined) {
			if(boxes[hash].has(word)) {
				displayText(`Word ${word}: Change lens to length ${focal} in box ${hash}.`);
			} else {
				displayText(`Word ${word}: Add lens of length ${focal} to box ${hash}.`);
			}
		} else {
			if(boxes[hash].has(word)) {
				displayText(`Word ${word}: Remove lens (length ${boxes[hash].get(word)}) from box ${hash}.`);
			} else {
				//displayText(`Word ${word}: Do nothing.`);
			}
		}
	}

	function displayBoxes() {
		for(let i = 0; i < boxes.length; i++) {
			let finalText = `Box ${i}: `;
			let box = boxes[i];
			for(let lens of box.entries()) {
				finalText += `[${lens[0]} ${lens[1]}] `;
			}
			displayText(finalText);
		}
	}
	displayText();
	displayText(`Final box configuration:`);
	displayBoxes();
}