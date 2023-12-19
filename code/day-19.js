"use strict";

function day19(input) {
	const WORKFLOW_REGEX = /(.+){(.+)}/g;
	let workflows = new Map();
	let workflows2 = new Map();
	let entry;
	while(entry = WORKFLOW_REGEX.exec(input)) {
		let workflowName = entry[1];
		let wfFunc = entry[2].split(",");
		let funcBody = `return "${wfFunc[wfFunc.length - 1]}";`;
		let funcBody2 = `return [["x", [], "${wfFunc[wfFunc.length - 1]}"]];`;
		for(let i = wfFunc.length - 2; i >= 0; i--) {
			let splitCond = wfFunc[i].split(":");
			funcBody = `if(${splitCond[0]}) { return "${splitCond[1]}"; } else { ${funcBody} }`;
			let metric = splitCond[0][0];
			let rest = splitCond[0].slice(1);
			let num = +(splitCond[0].slice(2));
			funcBody2 = `if(${metric}[0]${rest} && !(${metric}[1]${rest})) { 
				return [["${metric}", [${metric}[0], ${num - 1}], "${splitCond[1]}"], [${num}, ${metric}[1]]]; 
			} else if(!(${metric}[0]${rest}) && ${metric}[1]${rest}) {
				return [["${metric}", [${num + 1}, ${metric}[1]], "${splitCond[1]}"], [${metric}[0], ${num}]];
			} else if(${metric}[0]${rest}) {
				return [["${metric}", ${metric}, "${splitCond[1]}"]];
			} else { 
				${funcBody2}
			}`;

		}
		console.log(funcBody2);
		workflows.set(workflowName, new Function("x", "m", "a", "s", funcBody));
		workflows2.set(workflowName, new Function("x", "m", "a", "s", funcBody2));
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

	let accepted = 0;

	let values = [{x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000]}];
	let funcs = ["in"];
	while(funcs.length > 0) {
		let currFunc = funcs.shift();
		let currVals = values.shift();
		if(currFunc === "A") {
			accepted += (currVals["x"][1] - currVals["x"][0] + 1)
			* (currVals["m"][1] - currVals["m"][0] + 1)
			* (currVals["a"][1] - currVals["a"][0] + 1)
			* (currVals["s"][1] - currVals["s"][0] + 1);
			continue;
		} else if(currFunc === "R") {
			continue;
		}

		let returnVal = workflows2.get(currFunc)(currVals["x"], currVals["m"], currVals["a"], currVals["s"]);
		if(returnVal.length === 2) {
			let newObj = {};
			let newObj2 = {};
			for(let key of Object.keys(currVals)) {
				newObj[key] = currVals[key];
				newObj2[key] = currVals[key];
			}
			newObj[returnVal[0][0]] = returnVal[0][1];
			newObj2[returnVal[0][0]] = returnVal[1];
			values.push(newObj);
			funcs.push(returnVal[0][2]);
			values.push(newObj2);
			funcs.push(currFunc);
		} else {
			let newObj = {};
			for(let key of Object.keys(currVals)) {
				newObj[key] = currVals[key];
			}
			values.push(newObj);
			funcs.push(returnVal[0][2]);
		}
	}
	displayCaption(`The number of accepts is ${accepted}.`);
}