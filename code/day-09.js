"use strict";

function day09(input) {
	function fact(n) {
		if(n === 0) return 1;
		return n * fact(n - 1);
	}

	const FILE_REGEX = /(.+)/g;
	let entry;
	let sequences = [];
	while(entry = FILE_REGEX.exec(input)) {
		sequences.push(entry[1].split(" ").map(e => +e));
	}

	let derivatives = [];
	let sum = 0;
	for(let sequence of sequences) {
		let der = [sequence];

		let currSeq = sequence.slice();
		while(!currSeq.every(e => e === 0)) {
			let temp = [];
			for(let i = 0; i < currSeq.length - 1; i++) {
				temp.push(currSeq[i + 1] - currSeq[i]);
			}
			der.push(temp);
			currSeq = temp;
		}

		// der: [f(0), f'(0), f''(0), f'''(0), ...]
		// f(x) = a_n x^n + a_(n-1) x^(n-1) + ... + a_1 x + a_0
		// f'(x) = n a_n x^(n-1) + ... + a_1
		// f''(x) = n a_n x^(n-1) + ... + 2 a_2
		// f(i)(x) = ... + i! a_i
		// So f(x) = f^(n)(0) x^n + f^(n-1)(0) x^(n-1) + ... + f'(0) x + f(0).
		// let testX = 5;
		// let nextX = sequence.length;
		// let testF = 0;
		// let nextF = 0;
		// for(let i = 0; i < der.length; i++) {
		// 	nextF += der[i] * (nextX ** i) / fact(i);
		// 	testF += der[i] * (testX ** i) / fact(i);
		// }
		// sum += nextF;
		// if(testF !== sequence[testX]) {
		// 	console.log("Good job buddy.");
		// }

		der.reverse();
		let curr = 0;
		for(let i = 0; i < der.length; i++) {
			let currDer = der[i];
			curr = currDer[currDer.length - 1] + curr;
		}
		sum += curr;

	}
	displayCaption(`The sum is ${sum}.`);
}