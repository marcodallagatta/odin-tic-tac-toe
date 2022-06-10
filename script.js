({plugins:['jsdom-quokka-plugin']})
console.clear();

const boardDOM = document.querySelector('.gameboard');
const cellsDOM = boardDOM.querySelectorAll('.cell');
const turnDOM = document.querySelector('.turn');

const ticTacToe = (() => {
	const gameData = {
		gameboard: ['','','','','','','','',''],

		solutions: [
			'123',
			'456',
			'789',
			'147',
			'258',
			'369',
			'951',
			'357'
		],

		players: [],

		createPlayer(name) {
			if (this.players.length < 2) {
				const player = {
					name,
					sign: 'X',
					turn: true
				}
				if (this.players.length === 1) {
					player.turn = false;
					player.sign = 'O';
				}
				this.players.push(player);
			}
		},

		play(cell) {
			if (cell.innerText === '') {
				let sign = gameData.nextInLine().sign;
				let name = gameData.nextInLine().name;
				let cellNum = window.getComputedStyle(cell, '::before')
											.getPropertyValue('content')
											.replaceAll('"','');
				cell.innerText = sign;
				gameData.nextTurn();
				gameData.updateGameboard(cellNum-1, sign);
				const score = gameData.keepScore(gameData.gameboard);
				gameData.isThereWinner(score);
			}
		},

		updateGameboard(cell, symbol) {
			this.gameboard[cell] = symbol;
		},

		nextInLine() {
			return this.players.find(e => e.turn === true);
		},

		nextTurn() {
			if (this.players[0].turn === true) {
				this.players[0].turn = false;
				this.players[1].turn = true;
			} else {
				this.players[0].turn = true;
				this.players[1].turn = false;
			}
		},

		keepScore(obj) {
			let res = ['',''];
			obj.forEach( (elem, index) => {
				if (elem === 'X') {
					res[0] += (index+1).toString();
				} else if (elem === 'O') {
					res[1] += (index+1).toString();
				}
			})
			return res;
		},

		isThereWinner(array,name) {
			if (array.join('').length === 9) {
					displayController.playerWon(2);
					return;
			}
			this.solutions.forEach(sol => {
				if (
					array[0].includes(sol[0]) &&
					array[0].includes(sol[1]) &&
					array[0].includes(sol[2])) {
						let winningCells = `${sol[0]}${sol[1]}${sol[2]}`;
						displayController.playerWon(0, winningCells);
				}
				if (
					array[1].includes(sol[0]) &&
					array[1].includes(sol[1]) &&
					array[1].includes(sol[2])) {
					let winningCells = `${sol[0]}${sol[1]}${sol[2]}`;
					displayController.playerWon(1, winningCells);
				}
			})
			displayController.showturn(name);
		}
	}

	const displayController = {
		addListeners() {
			cellsDOM.forEach(cell => {
				cell.addEventListener('click', gameData.play.bind(null, cell))
			})
		},

		showturn() {
			const next = gameData.nextInLine().name;
			turnDOM.innerText = `It's ${next} turn!`;
		},

		removeListeners() {
			window.addEventListener('click', function (event) {
				event.stopPropagation();
			}, true);
		},

		playerWon(player, winningCells = '') {
			this.removeListeners();
			let color = '';
			if (player === 2) {
				boardDOM.style.backgroundColor = 'grey';
				turnDOM.innerText = "It's a tie!";
				return;
			}
			player === 0 ? color = 'red' : color = 'blue';
			winningCells.split('').forEach(e => {
				cellsDOM[parseInt(e)-1].style.backgroundColor = color;
			})
		}
	}

	return {
		displayController,
		gameData
	}

})();

ticTacToe.displayController.addListeners();
ticTacToe.gameData.createPlayer('Marco', 'X');
ticTacToe.gameData.createPlayer('MD', 'O');
ticTacToe.displayController.showturn();