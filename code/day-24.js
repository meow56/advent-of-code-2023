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
		lines.push([BigInt(entry[1]), BigInt(entry[2]), BigInt(entry[3]), BigInt(entry[4]), BigInt(entry[5]), BigInt(entry[6])]);
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
			let dx1 = first[3];
			let dy1 = first[4];
			let x02 = second[0];
			let y02 = second[1];
			let dx2 = second[3];
			let dy2 = second[4];

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

	function intersects(first, second) {
		let x01 = first[0];
		let y01 = first[1];
		let z01 = first[2];
		let dx1 = first[3];
		let dy1 = first[4];
		let dz1 = first[5];
		let x02 = second[0];
		let y02 = second[1];
		let z02 = second[2];
		let dx2 = second[3];
		let dy2 = second[4];
		let dz2 = second[5];

		if(dx1 * dy2 - dx2 * dy1 === 0n) {
			return false;
		}

		let t1 = new Rational(((dx2 * (y02 - y01)) + (dy2 * (x01 - x02))), ((dy1 * dx2) - (dx1 * dy2)));
		let t2 = new Rational(((dx1 * (y01 - y02)) + (dy1 * (x02 - x01))), ((dx1 * dy2) - (dx2 * dy1)));

		let intY1 = t1.copy().multiply(dy1).add(y01);
		let intY2 = t2.copy().multiply(dy2).add(y02);
		let intX1 = t1.copy().multiply(dx1).add(x01);
		let intX2 = t2.copy().multiply(dx2).add(x02);
		let intZ1 = t1.copy().multiply(dz1).add(z01);
		let intZ2 = t2.copy().multiply(dz2).add(z02);

		if(!intY1.equals(intY2) || !intX1.equals(intX2)) {
			throw "Good one buddy";
		}

		if(!intZ1.equals(intZ2)) return false;
		if(t1.intDenominator !== 1n || t2.intDenominator !== 1n) return false;

		// if(t1.intNumerator < 0 || t2.intNumerator < 0) {
		// 	//console.log(`At least one of ${first}, ${second} intersect in the past`);
		// 	continue;
		// }

		//console.log(`Intersect within range.`);
		return t1;
	}

	// For line 3: t ~= 12.34 * 10^10
	// For line 0: t ~= 34.72 * 10^10
	// For line 1: t ~= 84.92 * 10^10

	let first = lines[9];
	let second = lines[3];
	let third = lines[1];
	let fourth = lines[2];
	//            101381675887
	let tGuess1 = 124900000000n;
	let tGuess2 =  65600000000n;
	let tGuess3 = 870000000000n;
	let step =       100000000n;

	// 10000 * 1e10 < x < 20000 * 1e10
	// 10000 * 1e10 < y < 20000 * 1e10
	// z < 10000 * 1e10
	// vx ~= 150
	// vy ~= 160
	// vz ~= 250

	// x = x0r + t * vxr
	// y = y0r + t * vyr
	// z = z0r + t * vzr

	// x = x01 + t * vx1
	// y = y01 + t * vy1
	// z = z01 + t * vz1

	// x = x02 + t * vx2
	// y = y02 + t * vy2
	// z = z02 + t * vz2

	// x0r + t1 * vxr = x01 + t1 * vx1
	// x0r + t2 * vxr = x02 + t2 * vx2
	// (t1 - t2) * vxr = x01 - x02 + t1vx1 - t2vx2
	// t1(vxr - vx1) = x01 - x02 + t2(vxr - vx2)
	// (t1 - t2) * vyr = y01 - y02 + t1vy1 - t2vy2
	// (((x01 - x02 + t2(vxr - vx2)) / (vxr - vx1)) - t2) * vyr
	// = y01 - y02 + ((x01 - x02 + t2(vxr - vx2)) / (vxr - vx1))vy1 - t2vy2
	// (x01 - x02 + t2(vxr - vx2) - t2(vxr - vx1)) * vyr
	// = (y01 - y02)(vxr - vx1) + (x01 - x02 + t2(vxr - vx2))vy1 - t2(vxr - vx1)vy2
	// (x01 - x02)vyr + t2(vx1 - vx2)vyr
	// = (y01 - y02)(vxr - vx1) + (x01 - x02)vy1 + t2(vxr - vx2)vy1 - t2(vxr - vx1)vy2
	// t2(vx1 - vx2)vyr + t2(vxr - vx1)vy2 - t2(vxr - vx2)vy1
	// = (y01 - y02)(vxr - vx1) + (x01 - x02)(vy1 - vyr)
	// t2((vx1 - vx2)vyr + (vxr - vx1)vy2 - (vxr - vx2)vy1)
	// = (y01 - y02)(vxr - vx1) + (x01 - x02)(vy1 - vyr)
	// t2 = ((y01 - y02)(vxr - vx1) + (x01 - x02)(vy1 - vyr))
	//    / ((vx1 - vx2)vyr + (vxr - vx1)vy2 - (vxr - vx2)vy1)
	// t1 = (x01 - x02 + t2(vxr - vx2)) / (vxr - vx1)

	// x0r = x01 + t1 (vx1 - vxr)
	// y0r = y01 + t1 (vy1 - vyr)
	// z0r = z01 + t1 (vz1 - vzr)

	for(let vxr = 140n; vxr < 160n; vxr++) {
		for(let vyr = 150n; vyr < 170n; vyr++) {
			for(let vzr = 240n; vzr < 260n; vzr++) {
				let first = lines[0];
				let second = lines[1];
				let x01 = first[0];
				let y01 = first[1];
				let z01 = first[2];
				let vx1 = first[3];
				let vy1 = first[4];
				let vz1 = first[5];
				let x02 = second[0];
				let y02 = second[1];
				let vx2 = second[3];
				let vy2 = second[4];

				let t2 = new Rational(((y01 - y02) * (vxr - vx1) + (x01 - x02) * (vy1 - vyr)), ((vx1 - vx2) * vyr + (vxr - vx1) * vy2 - (vxr - vx2) * vy1));
				let t1 = t2.copy().multiply(vxr - vx2).add(x01 - x02).multiply(new Rational(1n, vxr - vx1));
				if(t2.intDenominator !== 1n || t1.intDenominator !== 1n) continue;
				t2 = t2.intNumerator;
				t1 = t1.intNumerator;
				let x0r = x01 + t1 * (vx1 - vxr);
				let y0r = y01 + t1 * (vy1 - vyr);
				let z0r = z01 + t1 * (vz1 - vzr);

				if(lines.every(function(line) {
					let t1 = new Rational(x0r - line[0], line[3] - vxr);
					if(t1.intDenominator !== 1n) return false;
					let y = t1.copy().multiply(line[4]).add(line[1]);
					let rY = t1.copy().multiply(vyr).add(y0r);
					if(y.intNumerator !== rY.intNumerator) return false;

					let z = t1.copy().multiply(line[5]).add(line[2]);
					let rZ = t1.copy().multiply(vzr).add(z0r);
					if(z.intNumerator !== rZ.intNumerator) return false;
					return true;
				})) {
					displayCaption(`The sum of start positions is ${x0r + y0r + z0r}.`);
				}
			} 
		}
	}

	// We can define two lines with
	// A = line from point on first to point on second
	// B = line from point on second to point on third
	// And attempt to get equal slopes.
	let x1 = first[0] + first[3] * tGuess1;
	let y1 = first[1] + first[4] * tGuess1;
	let z1 = first[2] + first[5] * tGuess1;
	let x2 = second[0] + second[3] * tGuess2;
	let y2 = second[1] + second[4] * tGuess2;
	let z2 = second[2] + second[5] * tGuess2;
	let vx12 = new Rational((x2 - x1), (tGuess2 - tGuess1));
	let vy12 = new Rational((y2 - y1), (tGuess2 - tGuess1));
	let vz12 = new Rational((z2 - z1), (tGuess2 - tGuess1));
	let x3 = third[0] + third[3] * tGuess3;
	let y3 = third[1] + third[4] * tGuess3;
	let z3 = third[2] + third[5] * tGuess3;
	let vx23 = new Rational((x3 - x2), (tGuess3 - tGuess2));
	let vy23 = new Rational((y3 - y2), (tGuess3 - tGuess2));
	let vz23 = new Rational((z3 - z2), (tGuess3 - tGuess2));
	let diffs = [vx23.copy().sub(vx12), vy23.copy().sub(vy12), vz23.copy().sub(vz12)];
	console.log(diffs);
	if(diffs.every(e => e.intNumerator === 0n)) {
		console.log(`${tGuess1}, ${tGuess2}, ${tGuess3}`);
	}

	let prevDist = Infinity;
	while(false) {
		let x1 = first[0] + first[3] * tGuess1;
		let y1 = first[1] + first[4] * tGuess1;
		let z1 = first[2] + first[5] * tGuess1;
		let x2 = second[0] + second[3] * tGuess2;
		let y2 = second[1] + second[4] * tGuess2;
		let z2 = second[2] + second[5] * tGuess2;

		let vx = (x2 - x1) / (tGuess2 - tGuess1);
		let vy = (y2 - y1) / (tGuess2 - tGuess1);
		let vz = (z2 - z1) / (tGuess2 - tGuess1);

		let bSquare = vx * vx + vy * vy + vz * vz;
		let dSquare = third[3] * third[3] + third[4] * third[4] + third[5] * third[5];
		let bd = vx * third[3] + vy * third[4] + vz * third[5];
		let A = -bSquare * dSquare + bd * bd;
		let e = [x1 - third[0], y1 - third[1], z1 - third[2]];
		let de = third[3] * e[0] + third[4] * e[1] + third[5] * e[2];
		let be = vx * e[0] + vy * e[1] + vz * e[2];
		let s = (-bSquare * de + be * bd) / A;
		let t = (dSquare * be + de * bd) / A;

		let dist = x1 + vx * t + y1 + vy * t + z1 + vz * t - (third[0] + third[3] * s + third[1] + third[4] * s + third[2] + third[5] * s)
		if(dist === 0) {
			console.log(`${tGuess1}, ${tGuess2}`);
			break;
		}


		// We want to minimize distance between 
		// R = (x1, y1, z1) + t * (vx, vy, vz) and
		// H = (x3, y3, z3) + s * (third[3], third[4], third[5]) also
		// J = (x4, y4, z4) + r * (f[3], f[4], f[5]).
		// The distance is (kinda) |((vx, vy, vz) x (third[3], third[4], third[5])) * (x1 - x3, y1 - y3, z1 - z3)|.
		// + |((vx, vy, vz) x (f[3:5])) * (x1 - x4, y1 - y4, z1 - z4)|
		// So we need to modify (vx, vy, vz)...
		// v(t1, t2) = (x02 + vx2t2 - x01 - vx1t1, y02 + vy2t2 - y01 - vy1t1, z02 + vz2t2 - z01 - vz1t1) / (t2 - t1)
		// Cross3: (vy * third[5] - vz * third[4], -(vx * third[5] - vz * third[3]), vx * third[4] - vy * third[3])
		// d~t1(C3) = ((y02 + t2(vy2 - vy1) - y01) / (t2 - t1)^2 * third[5] - (z02 + t2(vz2 - vz1) - z01) / (t2 - t1)^2 * third[4]), 
		//            -((x02 + t2(vx2 - vx1) - x01) / (t2 - t1)^2 * third[5] - (z02 + t2(vz2 - vz1) - z01) / (t2 - t1)^2 * third[3]), 
		//            (x02 + t2(vx2 - vx1) - x01) / (t2 - t1)^2 * third[4] - (y02 + t2(vy2 - vy1) - y01) / (t2 - t1)^2 * third[3])
		// d~t2(C3) = (vy2 * third[5] - vz2 * third[4], -(vx2 * third[5] - vz2 * third[3]), vx2 * third[4] - vy2 * third[3])
		// Cross4: (vy * f[5] - vz * f[4], -(vx * f[5] - vz * f[3]), vx * f[4] - vy * f[3])
		// d~t1(C4) = (-vy1 * f[5] + vz1 * f[4], -(-vx1 * f[5] + vz1 * f[3]), -vx1 * f[4] + vy1 * f[3])
		// d~t2(C4) = (vy2 * f[5] - vz2 * f[4], -(vx2 * f[5] - vz2 * f[3]), vx2 * f[4] - vy2 * f[3])
		// 
		// D = (vy * third[5] - vz * third[4]) * (x1 - x3) - (vx * third[5] - vz * third[3]) * (y1 - y3) + (vx * third[4] - vy * third[3]) * (z1 - z3)
		//   + ((vy * f[5] - vz * f[4]) * (x1 - x4) - (vx * f[5] - vz * f[3]) * (y1 - y4) + (vx * f[4] - vy * f[3]) * (z1 - z4)
		// So gradient is kinda <d~t1(C3) + d~t1(C4), d~t2(C3) + d~t2(C4)>
		// Mult each term by relevant (x1 - x, y1 - y, z1 - z) term
		// x1 = x01 + vx1 * t1

		// y02 = 272655040388795
		// vy2 = -98
		// vy1 = -490
		// y01 = 262965089923292
		// z02 = 179982504986147 
		// vz2 = 166
		// vz1 = -114
		// z01 = 196011482381270
		// x02 = 233210433951170
		// vx2 = 39
		// vx1 = 92
		// x01 = 201717428991179

		// second: 233210433951170, 272655040388795, 179982504986147 @ 39, -98, 166
		// third: 385274025881243, 351578921558552, 375160114124378 @ -71, -36, -9
		// fourth: 298962016918939, 322446494312107, 293073189215975 @ 36, 8, 96
		// first: 201717428991179, 262965089923292, 196011482381270 @ 92, -490, -114

		// D = (vy * -9 - vz * -36) * (-183556596890064 + 92 * t1) - (vx * -9 - vz * -71) * (y1 - 351578921558552) + (vx * -36 - vy * -71) * (z1 - 375160114124378)
		//   + ((vy * 96 - vz * 8) * (-97244587927760 + 92 * t1) - (vx * 96 - vz * 36) * (y1 - 322446494312107) + (vx * 8 - vy * 36) * (z1 - 293073189215975)

		// D = (vy * -9 - vz * -36) * (-183556596890064 + 92 * t1) - (vx * -9 - vz * -71) * (-88613831635260 - 490 t1) + (vx * -36 - vy * -71) * (-179148631743108 + 92 t1)
		//   + ((vy * 96 - vz * 8) * (-97244587927760 + 92 * t1) - (vx * 96 - vz * 36) * (-59481404388815 - 490 t1) + (vx * 8 - vy * 36) * (-97061706834705 + 92 t1)

		// d/dt2 v = ((53 t1 - 31493004959991) / (t2 - t1)^2,
		//           (-392 t1 - 9689950465503) / (t2 - t1)^2,
		//           (-280 t1 + 16028977395123) / (t2 - t1)^2)

		// d/dt2 D = ((-392 t1 - 9689950465503) / (t2 - t1)^2 * -9 - (-280 t1 + 16028977395123) / (t2 - t1)^2 * -36) * (-183556596890064 + 92 * t1) - ((53 t1 - 31493004959991) / (t2 - t1)^2 * -9 - (-280 t1 + 16028977395123) / (t2 - t1)^2 * -71) * (-88613831635260 - 490 t1) + ((53 t1 - 31493004959991) / (t2 - t1)^2 * -36 - (-392 t1 - 9689950465503) / (t2 - t1)^2 * -71) * (-179148631743108 + 92 t1)
		//   + (((-392 t1 - 9689950465503) / (t2 - t1)^2 * 96 - (-280 t1 + 16028977395123) / (t2 - t1)^2 * 8) * (-97244587927760 + 92 * t1) - ((53 t1 - 31493004959991) / (t2 - t1)^2 * 96 - (-280 t1 + 16028977395123) / (t2 - t1)^2 * 36) * (-59481404388815 - 490 t1) + ((53 t1 - 31493004959991) / (t2 - t1)^2 * 8 - (-392 t1 - 9689950465503) / (t2 - t1)^2 * 36) * (-97061706834705 + 92 t1)

		// 0 = ((-392 t1 - 9689950465503) * -9 - (-280 t1 + 16028977395123) * -36) * (-183556596890064 + 92 * t1) - ((53 t1 - 31493004959991) * -9 - (-280 t1 + 16028977395123) * -71) * (-88613831635260 - 490 t1) + ((53 t1 - 31493004959991) * -36 - (-392 t1 - 9689950465503) * -71) * (-179148631743108 + 92 t1)
		//   + (((-392 t1 - 9689950465503) * 96 - (-280 t1 + 16028977395123) * 8) * (-97244587927760 + 92 * t1) - ((53 t1 - 31493004959991)  * 96 - (-280 t1 + 16028977395123) * 36) * (-59481404388815 - 490 t1) + ((53 t1 - 31493004959991) * 8 - (-392 t1 - 9689950465503) * 36) * (-97061706834705 + 92 t1)

		// 0 = -448379322839365533766694372484 + 6605643570828210500 t1 - 7800226 t1^2

		// v(t1, t2) = (31493004959991 + 39 t2 - 92 t1, 
		//			    9689950465503 - 98 t2 + 490 t1, 
		//				-16028977395123 + 166 t2 + 114 t1) / (t2 - t1)

		// 0 = (y02 + t2(vy2 - vy1) - y01) / (t2 - t1)^2 * -9 - (z02 + t2(vz2 - vz1) - z01) / (t2 - t1)^2 * -36
		// 0 = y02 + t2(vy2 - vy1) - y01 - (z02 + t2(vz2 - vz1) - z01) * 4
		// 0 = 272655040388795 + t2(vy2 - vy1) - 262965089923292 - (z02 + t2(vz2 - vz1) - z01) * 4
		// 0 = 9689950465503 + 392 * t2 - (-64115909580492 + 1120 t2)
		// 0 = 73805860045995 - 728 t2

		// => * 
		// t2 ~= 101381675887

		// 0 = (31493004959991 - 53 t2) * 9 - (-16028977395123 + 280 t2) * 71
		// 0 = 1421494439693652 - 20357 t2
		// t2 ~= 69828287060
	}




	displayCaption(`The number of intersections in the region is ${intersections}.`);
}