"use strict";

function day19(input) {
	const WORKFLOW_REGEX = /(.+){(.+)}/g;
	let workflows = new Map();
	let entry;
	while(entry = WORKFLOW_REGEX.exec(input)) {
		let workflowName = entry[1];
		let wfFunc = entry[2].split(",");
		let funcBody = `return "${wfFunc[wfFunc.length - 1]}";`;
		for(let i = wfFunc.length - 2; i >= 0; i--) {
			let splitCond = wfFunc[i].split(":");
			funcBody = `if(${splitCond[0]}) { return "${splitCond[1]}"; } else { ${funcBody} }`;
		}
		workflows.set(workflowName, new Function("x", "m", "a", "s", funcBody));
	}

	const PART_REGEX = /{x=(\d+),m=(\d+),a=(\d+),s=(\d+)}/g;
	let parts = [];
	while(entry = PART_REGEX.exec(input)) {
		parts.push([+entry[1], +entry[2], +entry[3], +entry[4]]);
	}

	let sum = 0;
	for(let part of parts) {
		let currFunc = "in";
		while(currFunc !== "A" && currFunc !== "R") {
			currFunc = workflows.get(currFunc)(...part);
		}
		if(currFunc === "A") {
			sum += part.reduce((acc, val) => acc + val);
		}
	}

	displayCaption(`The sum is ${sum}.`);
}