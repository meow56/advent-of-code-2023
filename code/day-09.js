"use strict";

function day09(input) {
	function Rational(numerator, denominator = 1n) {
		this.intNumerator = numerator;
		this.intDenominator = denominator;
		this.reduce();
	}

	Rational.prototype.copy = function() {
		let newCopy = new Rational(this.intNumerator, this.intDenominator);
		return newCopy;
	}

	Rational.prototype.reduce = function() {
		let iGCD;
		if(this.intNumerator < 0) {
			iGCD = intGCD(-this.intNumerator, this.intDenominator);
		} else {
			iGCD = intGCD(this.intNumerator, this.intDenominator);
		}
		this.intNumerator /= iGCD;
		this.intDenominator /= iGCD;
	}

	Rational.prototype.multiply = function(n) {
		if(typeof n === "bigint") {
			this.intNumerator *= n;
		} else {
			this.intNumerator *= n.intNumerator;
			this.intDenominator *= n.intDenominator;
		}
		this.reduce();
		return this;
	}

	Rational.prototype.add = function(n) {
		let numerator = this.intNumerator;
		let denominator = this.intDenominator;
		if(typeof n === "bigint") {
			n = new Rational(n, 1n);
		}
		let nNumerator = n.intNumerator;
		let nDenominator = n.intDenominator;
		let iGCD = intGCD(denominator, nDenominator);
		let toMultThis = nDenominator / iGCD;
		let toMultN = denominator / iGCD;
		//  a     c    a*d/GCD   c*b/GCD
		// --- + --- = ------- + -------
		//  b     d    b*d/GCD   b*d/GCD
		this.intNumerator = (numerator * toMultThis) + (nNumerator * toMultN);
		this.intDenominator *= toMultThis;
		this.reduce();
		return this;
	}

	Rational.prototype.sub = function(n) {
		if(typeof n === "bigint") return this.add(-n);
		let nCopy = n.copy();
		nCopy.intNumerator *= -1n;
		return this.add(nCopy);
	}

	Rational.prototype.toString = function() {
		let numerator = this.intNumerator;
		if(numerator === 0n) return "0";
		let denominator = this.intDenominator;
		if(denominator === 1n) return numerator.toString();
		return `${numerator.toString()} / ${denominator.toString()}`
	}

	function gcd(a, b) {
		let GCD = new Map();
		for(let entry of a.entries()) {
			if(entry[0] === 1n) continue;
			if(b.has(entry[0])) {
				let minVal = entry[1] < b.get(entry[0]) ? entry[1] : b.get(entry[0]);
				GCD.set(entry[0], minVal);
			}
		}
		return GCD;
	}

	function mult(base, n) {
		for(let entry of n.entries()) {
			if(entry[0] === 1n) continue;
			if(base.has(entry[0])) {
				base.set(entry[0], base.get(entry[0]) + entry[1]);
			} else {
				base.set(entry[0], entry[1]);
			}
		}
	}

	function toBigInt(map) {
		let result = 0n;
		for(let primeFactor of map.entries()) {
			if(result === 0n) result = 1n;
			result *= primeFactor[0] ** primeFactor[1];
		}
		return result;
	}

	function intGCD(a, b) {
		if(a === 0n) return b;
		while(true) {
			b %= a;
			if(b === 0n) return a;
			a %= b;
			if(a === 0n) return b;
		}
	}

	function mod_exp(base, exp, mod) {
		// More Wikipedia pseudocode.
		// Thanks Wikipedia.
		if(mod === 1n) return 0n;
		let result = 1n;
		base = base % mod;
		while(exp > 0) {
			if(exp % 2n === 1n) {
				result = (result * base) % mod;
			}
			exp = exp >> 1n;
			base = (base * base) % mod;
		}
		return result;
	}

	// Miller-Rabin primality test
	// Based off pseudocode on Wikipedia
	const somePrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n];
	function isPrime(n) {
		if(somePrimes.includes(n)) return true;
		if(n === 1n) return true;
		let d = n - 1n;
		let s = 0n;
		while(d % 2n === 0n) {
			s++;
			d /= 2n;
		}

		for(let k = 0; k < somePrimes.length; k++) {
			let a = somePrimes[k];
			let x = mod_exp(a, d, n);
			let y;
			for(let i = 0; i < s; i++) {
				y = (x ** 2n) % n;
				if(y === 1n && x !== 1n && x !== n - 1n) {
					return false;
				}
				x = y;
			}
			if(y !== 1n) return false;
		}
		return true;
	}


	const MAX_ITERS = 1000;
	function factor(n) {
		let primeFactors = new Map();
		if(n === 0n) {
			return primeFactors;
		} else if(n === 1n) {
			primeFactors.set(1n, 1n);
			return primeFactors;
		}
		//console.time("factor");
		//console.log(`Factoring ${n}`);

		for(let i = 0; i < somePrimes.length; i++) {
			let total = 0n;
			while(n % somePrimes[i] === 0n) {
				total++;
				n /= somePrimes[i];
			}
			if(total !== 0n) {
				primeFactors.set(somePrimes[i], total);
			}
		}
		//if(typeof n === "number") n = BigInt(n);
		let initX = 2n;
		let g = a => (a * a + 1n) % n;
		while(!isPrime(n)) {
			// Using Pollard's rho algorithm
			// Based off the pseudocode on Wikipedia
			let x = initX;
			let y = x;
			let d = 1n;

			let iterations = 0;
			while(d === 1n && iterations++ < MAX_ITERS) {
				x = g(x);
				y = g(g(y));
				let diff;
				if(x > y) diff = x - y;
				else diff = y - x;
				d = intGCD(diff, n);
			}

			if(d !== n && d !== 1n) {
				let total = 0n;
				while(n % d === 0n) {
					total++;
					n /= d;
				}
				primeFactors.set(d, total);
			} else {
				// abort!
				initX++;
				if(initX === 100n) {
					// Surely this is prime...
					console.error(`This is taking too long, surely ${n} is prime...`);
					break;
				}
				//throw `Help!`;
			}
		}

		if(primeFactors.has(n)) {
			primeFactors.set(n, primeFactors.get(n) + 1n);
		} else {
			primeFactors.set(n, 1n);
		}
		//console.timeEnd("factor");
		return primeFactors;
	}

	function fact(n) {
		if(n === 0n) return 1n;
		return n * fact(n - 1n);
	}

	const FACT_FACT_MAP = new Map([
		[0n, [[1n, 1n]]]
		]);
	function factFact(n) {
		if(FACT_FACT_MAP.has(n)) return new Map(FACT_FACT_MAP.get(n));
		let result = factFact(n - 1n);
		mult(result, factor(n));
		FACT_FACT_MAP.set(n, [...result.entries()]);
		return result;
	}

	function intFact(n) {
		if(n === 0) return 1;
		return n * intFact(n - 1);
	}

	function tri(n) {
		if(n === 0n) return 0n;
		return n * (n + 1n) / 2n;
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
		sequences.push(entry[1].split(" ").map(e => BigInt(+e)));
	}

	let derivatives = [];
	let sum = new Rational(0n);
	let otherSum = new Rational(0n);
	for(let sequence of sequences) {
		let der = [new Rational(BigInt(sequence[0]))];

		let currSeq = sequence.slice();
		while(!currSeq.every(e => e === 0n)) {
			let temp = [];
			for(let i = 0; i < currSeq.length - 1; i++) {
				temp.push(currSeq[i + 1] - currSeq[i]);
			}
			if(!temp.every(e => e === 0n)) {
				let factDer = new Rational(temp[0]);
				der.push(factDer);
			}
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
		for(let i = 0n; i < der.length - 1; i++) {
			error[i] = [];
			//error[i][0] = new Rational(tri(i));
			error[i][0] = tri(i);
			for(let j = 1; j < der.length - 1; j++) {
				if(i === 0n) {
					error[i][j] = 0n;
				} else {
					//error[i][j] = error[i][j - 1].copy().multiply(i).add(error[i - 1n][j]);
					error[i][j] = error[i][j - 1] * i + error[i - 1n][j];
				}
			}
		}

		for(let i = der.length - 1; i >= 0; i--) {
			for(let j = der.length - 1; j > i; j--) {
				let newRat = new Rational(fact(BigInt(i)), fact(BigInt(j)));
				der[i].sub(der[j].copy().multiply(error[i][j - i - 1]).multiply(newRat));
				//der[i] -= der[j] * error[i][j - i - 1] * fact(i) / fact(j);
			}
		}
		let nextX = BigInt(sequence.length);
		let nextF = new Rational(0n);
		let otherX = -1n;
		let otherF = new Rational(0n);
		for(let i = 0n; i < der.length; i++) {
			let xPowed = nextX ** i;
			let newRat = new Rational(xPowed, fact(i));
			let otherRat = new Rational(otherX ** i, fact(i));
			nextF.add(der[i].copy().multiply(newRat));
			otherF.add(der[i].copy().multiply(otherRat));
			//nextF += der[i] * xPowed / fact(i);
		}
		sum.add(nextF);
		otherSum.add(otherF);
		//console.warn(`We are done with ${sequence}!`);
		// 120658783446
		// 120659512109
		// 1637452029

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