"use strict";

function day09(input) {
	function fact(n) {
		if(n === 0) return 1;
		return n * fact(n - 1);
	}

	function tri(n) {
		if(n === 0) return 0;
		return n * (n + 1) / 2;
	}

	function displayFunc(der) {
		let finalString = `f(x) = `;
		for(let i = der.length - 1; i >= 0; i--) {
			if(der[i] === 0) continue;
			if(i === 0) {
				finalString += `${der[i]}`;
			} else if(i === 1) {
				finalString += `${der[i]}x + `;
			} else {
				finalString += `(${der[i]} / ${fact(i)})x^${i} + `;
			}
		}
		return finalString;
	}

	const FILE_REGEX = /(.+)/g;
	let entry;
	let sequences = [];
	while(entry = FILE_REGEX.exec(input)) {
		sequences.push(entry[1].split(" ").map(e => +e));
	}

	let derivatives = [];
	let sum = 0;
	let otherSum = 0;
	for(let sequence of sequences) {
		let der = [sequence[0]];

		let currSeq = sequence.slice();
		while(!currSeq.every(e => e === 0)) {
			let temp = [];
			for(let i = 0; i < currSeq.length - 1; i++) {
				temp.push(currSeq[i + 1] - currSeq[i]);
			}
			der.push(temp[0]);
			currSeq = temp;
		}

		//der = der.map((e, i) => e / fact(i));

		// der: [f(0), f'(0), f''(0), f'''(0), ...]
		// f(x) = a_n x^n + a_(n-1) x^(n-1) + ... + a_1 x + a_0
		// f'(x) = n a_n x^(n-1) + ... + a_1
		// f''(x) = n a_n x^(n-1) + ... + 2 a_2
		// f(i)(x) = ... + i! a_i
		// So f(x) = f^(n)(0) x^n + f^(n-1)(0) x^(n-1) + ... + f'(0) x + f(0).

		// seq: [0, 1, 4, 9, 16, ...] = x^2
		// der: [0, 1, 2, 0]
		// => f(x) = x^2 + x?
		// extra: x

		// seq: [4, 11, 22, ...] = 2x^2 + 5x + 4
		// der: [4, 7, 4, 0]
		// => f(x) = 2x^2 + 7x + 4?
		// extra: 2x

		// seq: [2, 9, 44, 131, ...] = 4x^3 + 2x^2 + x + 2
		// der: [2, 7, 28, 24]
		// => f(x) = 4x^3 + 14x^2 + 7x + 2?
		// extra: 12x^2 + 6x

		// seq: [0, 1, 8, 27, ...] = x^3
		// der: [0, 1, 6, 6, 0]
		// => f(x) = x^3 + 3x^2 + x?
		// extra: 3x^2 + x
		// correct x^2 by subtracting 3 * coeff. x^3?
		// correct x by subtracting coeff. x^3?

		// seq: [0, 2, 16, 54, ...] = 2x^3
		// der: [0, 2, 12, 12, 0]
		// => f(x) = 2x^3 + 6x^2 + 2x?
		// extra: 6x^2 + 2x
		// correct x^2 by subtracting 3 * coeff. x^3?
		// correct x by subtracting coeff. x^3?

		// seq: [0, 2, 10, 30, ...] = x^3 + x
		// der: [0, 2, 6, 6, 0]
		// => f(x) = x^3 + 3x^2 + 2x?
		// hypothesis: x does not add any error
		// extra: 3x^2 + x
		// correct x^2 by subtracting 3 * coeff. x^3?
		// correct x by subtracting coeff. x^3?

		// seq: [0, 2, 12, 36, ...] = x^3 + x^2
		// der: [0, 2, 8, 6, 0]
		// => f(x) = x^3 + 4x^2 + 2x?
		// extra: 3x^2 + 2x
		// correct x^2 by subtracting 3 * coeff. x^3?
		// correct x by subtracting coeff. x^3?

		// seq: [1, 3, 13, 37, ...] = x^3 + x^2 + 1
		// der: [1, 2, 8, 6, 0]
		// => f(x) = x^3 + 4x^2 + 2x + 1?
		// extra: 3x^2 + 2x
		// correct x^2 by subtracting 3 * coeff. x^3?
		// correct x by subtracting coeff. x^3?

		// hypothesis: for all i, correct lower term j (down to j = 1) by
		// subtracting a_i * fact(i) / fact(i - j) from it.

		// seq: [0, 1, 16, 81, 256, 625, ...] = x^4
		//   -1    1  15 65  175  369
		//      2  14  50 110  194
		//        12  36  60  84
		//          24  24  24
		//            0   0
		// der: [0, 1, 14, 36, 24, 0]
		// => f(x) = x + 7x^2 + 6x^3 + x^4
		// extra: 6x^3 + 7x^2 + x
		// => cor 4: 6x^3 + 2x^2 + x?

		// seq: [0, 3, 6, 9, 12, 15] = 3x
		// der: [0, 3, 0]
		// => f(x) = 3x

		// seq 1 3 6 10 15 21 = (1/2)x^2 + (3/2)x + 1
		// der [1, 2, 1, 0]
		// => f(x) = (1/2)x^2 + 2x + 1? 
		// hypothesis: correct x by subtracting coeff. x^2?
		// 10 13 16 21 30 45

		// seq [10, 16, 34, 81, 191, 420, 848, 1578, 2732, 4444, 6850, 10075, 14217, 19328, 25392, 32300, 39822, 47576, 54994, 61285, 65395]
		// der [10, 6, 12, 17, 17, 5, -3, 0]
		// => f(x) = 

		// 

		// 2     9      44     131    294
		//    7      35    87     163
		//       28     52    76
		//           24     24
		// der[6] -= der[7] / 5040 * 15120; // / 720 => 21
		// der[5] -= der[7] / 5040 * 16800; // / 120 => 140
		// der[4] -= der[7] / 5040 * 8400; // / 24 => 350
		// der[3] -= der[7] / 5040 * 1806; // / 6 => 301
		// der[5] -= der[6] / 720 * 1800; // / 120 => 15
		// der[4] -= der[6] / 720 * 1560; // / 24 => 65
		// der[3] -= der[6] / 720 * 540;  // / 6 => 90
		// der[4] -= der[5] / 120 * 240;  // / 24 => 10
		// der[3] -= der[5] / 120 * 150;  // / 6 => 25
		// der[3] -= der[4] / 24 * 36;    // / 6 => 6
		// der[1] = [1, 1, 1, 1, 1, 1] = 1
		// der[2] = [3, 7, 15, 31, 62] = [3, der[2][0] * 2 + der[1][1], ...]
		// der[3] = [6, 25, 90, 301] => [6, der[3][0] * 3 + der[2][1], der[3][1] * 3 + der[2][2]]
		// der[4] = [10, 65, 350] = 5 * [2, 13, 70]
		// der[5] = [15, 140]
		// der[6] = [21]

		// SO:
		// error[0][j] = 0
		// error[i][0] = tri[i]
		// error[i][j] = error[i][j - 1] * i + error[i - 1][j]

		// error[0] = 0
		// error[1] = 1
		// error[2] = 2^n - 1
		// error[3][j] = error[3][j - 1] * 3 + 2^
		let error = [];
		for(let i = 0; i < der.length - 1; i++) {
			error[i] = [];
			error[i][0] = tri(i);
			for(let j = 1; j < der.length - 1; j++) {
				if(i === 0) {
					error[i][j] = 0;
				} else {
					error[i][j] = error[i][j - 1] * i + error[i - 1][j];
				}
			}
		}

		for(let i = der.length - 1; i >= 0; i--) {
			for(let j = der.length - 1; j > i; j--) {
				der[i] -= (der[j] / fact(j) * error[i][j - i - 1] * fact(i));
			}
		}
		let nextX = sequence.length;
		let nextF = 0;
		for(let i = 0; i < der.length; i++) {
			nextF += der[i] * (nextX ** i) / fact(i);
		}
		sum += nextF;

		// for(let i = der.length - 1; i > 2; i--) {
		// 	der[2] -= der[i] / fact(i) * (2 ** i - 2);
		// }
		// der[2] -= der[6] / 720 * 62;   // / 2 => 31
		// der[2] -= der[5] / 120 * 30;   // / 2 => 15
		// der[2] -= der[4] / 24 * 14;    // / 2 => 7
		// der[2] -= der[3] / 6 * 6;      // / 2 => 3

		// for(let i = der.length - 1; i > 1; i--) {
		// 	der[1] -= der[i] / fact(i);
		// }
		// der[1] -= der[6] / 720;
		// der[1] -= der[5] / 120;
		// der[1] -= der[4] / 24;
		// der[1] -= der[3] / 6;
		// der[1] -= der[2] / 2;
		// der[2] => 2^(diff + 1) - 1
		// der[3] => 
		//             1
		//            1 1
		//           1 2 1
		//          1 3 3 1
		//         1 4 6 4 1
		//        1 5 A A 5 1
		//       1 6 E a E 6 1
		// console.log(`Actual: ${displayFunc(der)}`);
		// let diff = [];
		// for(let i = 0; i < der.length; i++) {
		// 	let theDer = der[i] || 0;
		// 	let theExp = expected[i] || 0;
		// 	diff[i] = theDer - theExp;
		// }
		// console.log(`Diff: ${displayFunc(diff)}`);

		// der.reverse();
		// let curr = 0;
		// let otherCurr = 0;
		// for(let i = 0; i < der.length; i++) {
		// 	let currDer = der[i];
		// 	curr = currDer[currDer.length - 1] + curr;
		// 	otherCurr = currDer[0] - otherCurr;
		// }
		// sum += curr;
		// otherSum += otherCurr;
	}
	displayCaption(`The sum is ${sum}.`);
	displayCaption(`The other sum is ${otherSum}.`);
}