"use strict";

function day22(input) {
	function Brick(pos) {
		this.pos = pos;
		if(this.pos[0][2] > this.pos[1][2]) {
			this.pos = [this.pos[1], this.pos[0]];
		}
		this.type;
		if(pos[0][2] === pos[1][2]) {
			if(pos[0][1] === pos[1][1]) {
				this.type = "X";
			} else {
				this.type = "Y";
			}
		} else {
			this.type = "Z";
		}

		this.atRest = false;
		this.restsOn = [];
	}

	Brick.prototype.intersects = function(pos, type) {
		if(this.pos[1][2] < pos[0][2] || this.pos[0][2] > pos[1][2]) return false;
		if(this.type === "Z" && type === "Z") return this.pos[1][2] === pos[0][2] && this.pos[0][0] === pos[0][0] && this.pos[0][1] === pos[0][1];
		if(this.type === "Z" && type === "Y") return this.pos[0][0] === pos[0][0] && (this.pos[0][1] >= pos[0][1] && this.pos[0][1] <= pos[1][1]);
		if(this.type === "Z" && type === "X") return (this.pos[0][0] >= pos[0][0] && this.pos[0][0] <= pos[1][0]) && this.pos[0][1] === pos[0][1];

		if(this.pos[0][2] !== pos[0][2]) return false;
		if(this.type === "Y" && type === "Z") return this.pos[0][0] === pos[0][0] && (pos[0][1] >= this.pos[0][1] && pos[0][1] <= this.pos[1][1]);
		if(this.type === "Y" && type === "Y") return this.pos[0][0] === pos[0][0] && ((pos[0][1] >= this.pos[0][1] && pos[0][1] <= this.pos[1][1]) || (pos[1][1] >= this.pos[0][1] && pos[1][1] <= this.pos[1][1]) || (pos[0][1] <= this.pos[0][1] && pos[1][1] >= this.pos[1][1]));
		if(this.type === "Y" && type === "X") return (this.pos[0][0] >= pos[0][0] && this.pos[0][0] <= pos[1][0]) && (pos[0][1] >= this.pos[0][1] && pos[0][1] <= this.pos[1][1]);

		if(this.pos[1][1] < pos[0][1] || this.pos[0][1] > pos[1][1]) return false;
		if(this.type === "X" && type === "Z") return (pos[0][0] >= this.pos[0][0] && pos[0][0] <= this.pos[1][0]);
		if(this.type === "X" && type === "Y") return (pos[0][0] >= this.pos[0][0] && pos[0][0] <= this.pos[1][0]);
		if(this.type === "X" && type === "X") return !(pos[1][0] < this.pos[0][0] || pos[0][0] > this.pos[1][0]);

	}

	const FILE_REGEX = /(\d+),(\d+),(\d+)~(\d+),(\d+),(\d+)/g;
	let bricks = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		bricks.push(new Brick([[+entry[1], +entry[2], +entry[3]], [+entry[4], +entry[5], +entry[6]]]));
	}

	bricks.sort(function(a, b) {
		return a.pos[0][2] - b.pos[0][2];
	});

	for(let brick of bricks) {
		if(brick.atRest) continue;
		console.log(`Doing ${brick.pos.map(e => e.join()).join("~")}`);
		while(brick.pos[0][2] > 1) {
			let newPos = [[brick.pos[0][0], brick.pos[0][1], brick.pos[0][2] - 1], [brick.pos[1][0], brick.pos[1][1], brick.pos[1][2] - 1]];
			let collision = false;
			let colliders = [];
			for(let interBrick of bricks) {
				if(interBrick !== brick && interBrick.intersects(newPos, brick.type)) {
					collision = true;
					colliders.push(interBrick);
				}
			}
			if(collision) {
				brick.atRest = true;
				brick.restsOn = colliders;
				break;
			} else {
				brick.pos = newPos;
			}
		}
	}

	let invalid = [];
	for(let brick of bricks) {
		if(brick.restsOn.length === 1) {
			if(!invalid.includes(brick.restsOn[0])) {
				invalid.push(brick.restsOn[0]);
			}
			displayCaption(`${brick.restsOn[0].pos.map(e => e.join()).join("~")} is invalid since ${brick.pos.map(e => e.join()).join("~")} only rests on it.`);
		}
	}


	displayCaption(`The number of removable bricks is ${bricks.length - invalid.length}.`);
}