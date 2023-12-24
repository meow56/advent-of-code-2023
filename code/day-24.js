"use strict";

function day24(input) {

	function intGCD(a, b) {
		if(a === 0n) return b;
		while(true) {
			b %= a;
			if(b === 0n) return a;
			a %= b;
			if(a === 0n) return b;
		}
	}

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
		if(this.intDenominator < 0) {
			this.intNumerator *= -1n;
			this.intDenominator *= -1n;
		}
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

	Rational.prototype.equals = function(n) {
		return n.intNumerator === this.intNumerator && n.intDenominator === this.intDenominator;
	}

	Rational.prototype.value = function() {
		return this.intNumerator / this.intDenominator;
	}

	Rational.prototype.toString = function() {
		let numerator = this.intNumerator;
		if(numerator === 0n) return "0";
		let denominator = this.intDenominator;
		if(denominator === 1n) return numerator.toString();
		return `${numerator.toString()} / ${denominator.toString()}`
	}

	const FILE_REGEX = /(-?\d+), +(-?\d+), +(-?\d+) @ +(-?\d+), +(-?\d+), +(-?\d+)/g;
	let entry;
	let lines = [];
	while(entry = FILE_REGEX.exec(input)) {
		// y = y0 + t(dy)
		// x = x0 + t(dx)
		lines.push([BigInt(entry[1]), BigInt(entry[2]), BigInt(entry[4]), BigInt(entry[5])]);
	}

	let intersections = 0;
	for(let i = 0; i < lines.length; i++) {
		for(let j = i + 1; j < lines.length; j++) {
			let first = lines[i];
			let second = lines[j];
			// y = y01 + t(dy1)
			// x = x01 + t(dx1)
			// y = y02 + t(dy2)
			// x = x02 + t(dx2)
			// Does there exist t1 and t2 st
			// y01 + t1(dy1) = y02 + t2(dy2) and 
			// x01 + t1(dx1) = x02 + t2(dx2)?
			// y01(dx1) + t1(dy1)(dx1) = y02(dx1) + t2(dy2)(dx1)
			// x01(dy1) + t1(dy1)(dx1) = x02(dy1) + t2(dx2)(dy1)
			// y01(dx1) - x01(dy1) = y02(dx1) + t2(dy2)(dx1) - x02(dy1) - t2(dx2)(dy1)
			// dx1(y01 - y02) + dy1(x02 - x01) = t2(dx1dy2 - dx2dy1)
			// (dx1(y01 - y02) + dy1(x02 - x01)) / (dx1dy2 - dx2dy1) = t2
			
			// y01(dx2) + t1(dy1dx2) - x01(dy2) - t1(dx1dy2) = y02(dx2) - x02(dy2)
			// t1(dy1dx2 - dx1dy2) = dx2(y02 - y01) + dy2(x01 - x02)
			// t1 = (dx2(y02 - y01) + dy2(x01 - x02)) / (dy1dx2 - dx1dy2)

			let x01 = first[0];
			let y01 = first[1];
			let dx1 = first[2];
			let dy1 = first[3];
			let x02 = second[0];
			let y02 = second[1];
			let dx2 = second[2];
			let dy2 = second[3];

			let t1;
			let t2;
			if(dx1 * dy2 - dx2 * dy1 !== 0n) {
				t2 = new Rational(((dx1 * (y01 - y02)) + (dy1 * (x02 - x01))), ((dx1 * dy2) - (dx2 * dy1)));
			} else {
				//console.log(`Lines are parallel.`);
				if(y01 - y02 === x01 - x02) {
					console.log(`Same line!`);
					intersections++;
				}
				continue;
			}
			if(dy1 * dx2 - dx1 * dy2 !== 0n) {
				t1 = new Rational(((dx2 * (y02 - y01)) + (dy2 * (x01 - x02))), ((dy1 * dx2) - (dx1 * dy2)));
			} else {
				//console.log(`Lines are parallel.`);
				if(y01 - y02 === x01 - x02) {
					console.log(`Same line!`);
					intersections++;
				}
				continue;
			}

			let intY1 = t1.copy().multiply(dy1).add(y01);
			let intY2 = t2.copy().multiply(dy2).add(y02);
			let intX1 = t1.copy().multiply(dx1).add(x01);
			let intX2 = t2.copy().multiply(dx2).add(x02);

			if(!intY1.equals(intY2) || !intX1.equals(intX2)) {
				throw "Good one buddy";
			}

			if(t1.intNumerator < 0 || t2.intNumerator < 0) {
				//console.log(`At least one of ${first}, ${second} intersect in the past`);
				continue;
			}
			let lowBound = 200000000000000n; // 200000000000000n
			let upperBound = 400000000000000n; // 400000000000000n
			if(intY1.intNumerator < lowBound * intY1.intDenominator || intY1.intNumerator > upperBound * intY1.intDenominator) {
				//console.log(`Intersect out of range`);
				continue;
			}
			if(intX1.intNumerator < lowBound * intX1.intDenominator || intX1.intNumerator > upperBound * intX1.intDenominator) {
				//console.log(`Intersect out of range`);
				continue;
			}

			//console.log(`Intersect within range.`);
			intersections++;
		}
	}

	displayCaption(`The number of intersections in the region is ${intersections}.`);
}