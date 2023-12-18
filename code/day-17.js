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

	Heap.prototype.updateKey = function(key, newValue, predecessor) {
		key.predecessor = predecessor;
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
		this.predecessor;
	}

	Node.prototype.initialize = function(universe, part2) {
		this.universe = universe;
		let upNode = find([this.pos[0], this.pos[1] - 1], universe, 0, part2);
		let leftNode = find([this.pos[0] - 1, this.pos[1]], universe, 1, part2);
		let downNode = find([this.pos[0], this.pos[1] + 1], universe, 2, part2);
		let rightNode = find([this.pos[0] + 1, this.pos[1]], universe, 3, part2);

		// 0 = up, 1 = left, 2 = down, 3 = right
		if(rightNode) this.edges.push([rightNode, 3]);
		if(downNode) this.edges.push([downNode, 2]);
		if(leftNode) this.edges.push([leftNode, 1]);
		if(upNode) this.edges.push([upNode, 0]);
	}

	Node.prototype.copy = function() {
		return new Node(this.pos.slice(), this.universe.slice(), this.value);
	}

	function find(pos, universe, direction, part2) {
		if(universe[1] === direction && universe[0] === (part2 ? 10 : 3)) return undefined;
		if((universe[1] + 2) % 4 === direction) return undefined;
		if(part2 && universe[1] !== direction && universe[0] < 4 && universe[0] > 0) return undefined;
		let grid;
		let verse = part2 ? multiverse2 : multiverse;
		if(universe[1] === direction) {
			grid = verse[universe[1]][universe[0] + 1];
		} else {
			grid = verse[direction][1];
		}

		if(grid[pos[1]] === undefined) return undefined;
		return grid[pos[1]][pos[0]];
	}

	// multiverse[direction][straight][y][x]
	const FILE_REGEX = /.+/g;
	let multiverse = [];
	let multiverse2 = [];
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
		let dirVerses2 = [];
		for(let j = 0; j < 4; j++) {
			let newUniverse;
			newUniverse = grid.map(e => e.map(a => a.copy()));
			dirVerses.push(newUniverse);
		}
		for(let j = 0; j < 11; j++) {
			let newUniverse;
			newUniverse = grid.map(e => e.map(a => a.copy()));
			dirVerses2.push(newUniverse);
		}
		multiverse.push(dirVerses);
		multiverse2.push(dirVerses2);
	}

	for(let i = 0; i < multiverse.length; i++) {
		for(let j = 0; j < multiverse[i].length; j++) {
			let universe = multiverse[i][j];
			for(let k = 0; k < universe.length; k++) {
				for(let l = 0; l < universe[k].length; l++) {
					universe[k][l].initialize([j, i], false);
				}
			}
		}
	}

	let finalNode = [grid[0].length - 1, grid.length - 1];

	function djikstra(part2) {
		let s;
		// node, depth
		let toAdd = new Heap();
		let verse = part2 ? multiverse2 : multiverse;
		verse[2][0][0][0].depth = 0;
		for(let i = 0; i < verse.length; i++) {
			for(let j = 0; j < verse[i].length; j++) {
				for(let k = 0; k < verse[i][j].length; k++) {
					for(let l = 0; l < verse[i][j][k].length; l++) {
						toAdd.insert(verse[i][j][k][l]);
					}
				}
			}
		}

		while(s === undefined || !(s.pos[0] === finalNode[0] && s.pos[1] === finalNode[1] && (!part2 || s.universe[0] >= 4))) {
			let next = toAdd.remove();
			s = next;
			for(let edge of next.edges) {
				let node = edge[0];
				if(node.depth > next.depth + edge[0].value) {
					toAdd.updateKey(node, next.depth + edge[0].value, s);
				}
			}
		}
		return s;
	}

	let heatLoss = djikstra(false);
	displayCaption(`The heat loss with crucibles is ${heatLoss.depth}.`);

	let path = [];
	let currNode = heatLoss;
	let forDisplay = [];
	while(currNode.pos[0] !== 0 || currNode.pos[1] !== 0) {
		path.push(currNode.pos.join());
		currNode = currNode.predecessor;
	}
	path.push("0,0");
	forDisplay.push(display(path));


	multiverse = [];
	for(let i = 0; i < 4; i++) {
		let dirVerses2 = [];
		for(let j = 0; j < 11; j++) {
			let newUniverse;
			newUniverse = grid.map(e => e.map(a => a.copy()));
			dirVerses2.push(newUniverse);
		}
		multiverse2.push(dirVerses2);
	}

	for(let i = 0; i < multiverse2.length; i++) {
		for(let j = 0; j < multiverse2[i].length; j++) {
			let universe = multiverse2[i][j];
			for(let k = 0; k < universe.length; k++) {
				for(let l = 0; l < universe[k].length; l++) {
					universe[k][l].initialize([j, i], true);
				}
			}
		}
	}
	let heatLoss2 = djikstra(true);
	displayCaption(`The heat loss with ultra crucibles is ${heatLoss2.depth}.`);

	let path2 = [];
	let currNode2 = heatLoss2;
	while(currNode2.pos[0] !== 0 || currNode2.pos[1] !== 0) {
		path2.push(currNode2.pos.join());
		currNode2 = currNode2.predecessor;
	}
	path2.push("0,0");
	forDisplay.push(display(path2));

	let displayMap = assignBlock("map");
	let displayMap2 = assignBlock("map2");
	function closure() {
		let showPart2 = false;
		for(let line of forDisplay[0]) {
			displayMap.displayText(line);
		}
		for(let line of forDisplay[1]) {
			displayMap2.displayText(line);
		}
		displayMap2.style = `display: none;`;
		displayMap.style = ``;


		function switchPart() {
			showPart2 = !showPart2;
			if(showPart2) {
				displayMap.style = `display: none;`;
				displayMap2.style = ``;
			} else {
				displayMap2.style = `display: none;`;
				displayMap.style = ``;
			}
		}

		return switchPart;
	}

	let switchPart = closure();
	let button = assignButton(switchPart, "Part 2");

	displayCaption(`The map is shown.`);
	displayCaption(`The path the (ultra) crucible takes is shown with black background.`);
	displayCaption(`Use the button to switch parts.`);

	function display(path) {
		let returnVal = [];
		for(let i = 0; i < grid.length; i++) {
			let finalLine = ``;
			for(let j = 0; j < grid[i].length; j++) {
				if(path.includes(`${j},${i}`)) {
					// heatLoss[1].findIndex((e) => e === grid[i][j]) % 10
					finalLine += `<span class="black">${grid[i][j].value}</span>`;
				} else {
					finalLine += grid[i][j].value;
				}
			}
			returnVal.push(finalLine);
		}
		return returnVal;
	}
}