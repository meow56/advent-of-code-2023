"use strict";

function day17(input) {
	function Heap() {
		this.elems = [];
	}

	Heap.prototype.insert = function(key) {
		this.elems.push(key);
		let currIndex = this.elems.length - 1;
		for(; currIndex >= 1 && this.elems[Math.floor(currIndex / 2)].depth > key.depth; currIndex = Math.floor(currIndex / 2)) {
			this.elems[currIndex] = this.elems[Math.floor(currIndex / 2)];
			this.elems[currIndex].index = currIndex;
		}
		this.elems[currIndex] = key;
		this.elems[currIndex].index = currIndex;
	}

	Heap.prototype.remove = function() {
		let returnVal = this.elems[0];
		let replace = this.elems.pop();
		this.elems[0] = replace;
		let currIndex = 0;
		while(currIndex * 2 < this.elems.length) {
			let left = this.elems[currIndex * 2];
			let right = this.elems[currIndex * 2 + 1];
			if(right === undefined) {
				if(left.depth < replace.depth) {
					this.elems[currIndex] = left;
					left.index = currIndex;
					currIndex *= 2;
					continue;
				} else {
					break;
				}
			}

			let min = Math.min(left.depth, right.depth);
			let minIndex = left.depth < right.depth ? currIndex * 2 : currIndex * 2 + 1;

			if(min < replace.depth) {
				this.elems[currIndex] = this.elems[minIndex];
				this.elems[currIndex].index = currIndex;
				currIndex = minIndex;
			} else {
				break;
			}
		}
		this.elems[currIndex] = replace;
		this.elems[currIndex].index = currIndex;
		return returnVal;
	}

	Heap.prototype.updateKey = function(key, newValue) {
		let currIndex = key.index;
		key.depth = newValue;
		for(; currIndex >= 1 && this.elems[Math.floor(currIndex / 2)].depth > key.depth; currIndex = Math.floor(currIndex / 2)) {
			this.elems[currIndex] = this.elems[Math.floor(currIndex / 2)];
			this.elems[currIndex].index = currIndex;
		}
		this.elems[currIndex] = key;
		this.elems[currIndex].index = currIndex;
	}


	function Node(pos, universe, value) {
		this.pos = pos;
		this.universe = universe;
		this.value = value;
		this.edges = [];
		this.depth = Infinity;
		this.index;
	}

	Node.prototype.initialize = function(universe) {
		this.universe = universe;
		let upNode = find([this.pos[0], this.pos[1] - 1], universe, 0);
		let leftNode = find([this.pos[0] - 1, this.pos[1]], universe, 1);
		let downNode = find([this.pos[0], this.pos[1] + 1], universe, 2);
		let rightNode = find([this.pos[0] + 1, this.pos[1]], universe, 3);

		// 0 = up, 1 = left, 2 = down, 3 = right
		if(rightNode) this.edges.push([rightNode, 3]);
		if(downNode) this.edges.push([downNode, 2]);
		if(leftNode) this.edges.push([leftNode, 1]);
		if(upNode) this.edges.push([upNode, 0]);
	}

	Node.prototype.copy = function() {
		return new Node(this.pos.slice(), this.universe.slice(), this.value);
	}

	function find(pos, universe, direction) {
		if(universe[1] === direction && universe[0] === 3) return undefined;
		if((universe[1] + 2) % 4 === direction) return undefined;
		let grid;
		if(universe[1] === direction) {
			grid = multiverse[universe[1]][universe[0] + 1];
		} else {
			grid = multiverse[direction][1];
		}

		if(grid[pos[1]] === undefined) return undefined;
		return grid[pos[1]][pos[0]];
	}

	// multiverse[direction][straight][y][x]
	const FILE_REGEX = /.+/g;
	let multiverse = [];
	let grid = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		grid.push([]);
		for(let i = 0; i < entry[0].length; i++) {
			grid[grid.length - 1][i] = new Node([i, grid.length - 1], [0, 0], +(entry[0][i]));
		}
	}

	for(let i = 0; i < 4; i++) {
		let dirVerses = [];
		for(let j = 0; j < 4; j++) {
			let newUniverse;
			newUniverse = grid.map(e => e.map(a => a.copy()));
			dirVerses.push(newUniverse);
		}
		multiverse.push(dirVerses);
	}

	for(let i = 0; i < 4; i++) {
		for(let j = 0; j < 4; j++) {
			let universe = multiverse[i][j];
			for(let k = 0; k < universe.length; k++) {
				for(let l = 0; l < universe[k].length; l++) {
					universe[k][l].initialize([j, i]);
				}
			}
		}
	}

	let finalNode = [grid[0].length - 1, grid.length - 1];

	function djikstra() {
		let s = [];
		// node, depth
		let toAdd = new Heap();
		multiverse[2][0][0][0].depth = 0;
		for(let i = 0; i < multiverse.length; i++) {
			for(let j = 0; j < multiverse[i].length; j++) {
				for(let k = 0; k < multiverse[i][j].length; k++) {
					for(let l = 0; l < multiverse[i][j][k].length; l++) {
						toAdd.insert(multiverse[i][j][k][l]);
					}
				}
			}
		}

		while(s.every(e => e.pos[0] !== finalNode[0] || e.pos[1] !== finalNode[1])) {
			let next = toAdd.remove();
			let nextDepth = next.depth;
			let nextNode = next;
			s.push(next);
			for(let edge of next.edges) {
				let node = edge[0];
				if(node.depth > next.depth + edge[0].value) {
					toAdd.updateKey(node, next.depth + edge[0].value);
				}
			}
		}
		return s[s.length - 1];
	}

	//let heatLoss = minWeight(find([0, 0]), 0, undefined, 0, [find([0, 0])]);
	let heatLoss = djikstra();
	displayCaption(`The heat loss is ${heatLoss.depth}.`);

	function display(path) {
		for(let i = 0; i < grid.length; i++) {
			let finalLine = ``;
			for(let j = 0; j < grid[i].length; j++) {
				if(path.includes(grid[i][j])) {
					// heatLoss[1].findIndex((e) => e === grid[i][j]) % 10
					finalLine += `<span class="black">${grid[i][j].value}</span>`;
				} else {
					finalLine += grid[i][j].value;
				}
			}
			displayText(finalLine);
		}
	}
	//display(heatLoss[1]);
}