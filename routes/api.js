'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
			let {puzzle, coordinate, value} = req.body;

			if (!puzzle || !coordinate || !value) {
				res.json({ error: 'Required field(s) missing' });
				return;
			}

			let coord_row = solver.convertLetterToNumber(coordinate[0]);
			let coord_col = coordinate[1];

			if (puzzle.length != 81) {
				res.json({ error: 'Expected puzzle to be 81 characters long' });
				return;
			}

			if (!/^[.0-9]+$/.test(puzzle)) {
				res.json({ error: 'Invalid characters in puzzle' });
				return;
			}

			if (!/^[A-Ia-i][1-9]$/.test(coordinate)) {
				res.json({ error: 'Invalid coordinate' });
				return;
			}

			if (!/^[1-9]$/.test(value)) {
				res.json({ error: 'Invalid value' });
				return;
			}

			let conflicts = [];
			let puzzleArr = solver.convertStringtoArr(puzzle);

			if (!solver.checkRowPlacement(puzzleArr, coord_row - 1, coord_col - 1, value)) {
				conflicts.push("row")
			}

			if (!solver.checkColPlacement(puzzleArr, coord_row - 1, coord_col - 1, value)) {
				conflicts.push("column")
			}

			if (!solver.checkRegionPlacement(puzzleArr, coord_row - 1, coord_col - 1, value)) {
				conflicts.push("region")
			}

			if (conflicts.length > 0) {
				res.json({
					valid: false,
					conflict: conflicts
				})
			} else {
				res.json({ valid: true })
			}
    });
    
  app.route('/api/solve')
    .post((req, res) => {
				let puzzle = req.body.puzzle
				
				if (!puzzle) {
					res.json({ error: 'Required field missing' })
					return;
				}

				if (!/^[.0-9]+$/.test(puzzle)) {
					res.json({ error: 'Invalid characters in puzzle' });
					return;
				}

				if (puzzle.length != 81) {
					res.json({ error: 'Expected puzzle to be 81 characters long' });
					return;
				}

				let puzzleArr = solver.convertStringtoArr(puzzle);
				let solvedArr = solver.sudokuSolver(puzzleArr);
				let solvedString = solver.arrToString(puzzleArr);

				if (!/^[0-9]+$/.test(solvedString)) {
					res.json({ error: 'Puzzle cannot be solved' });
					return;
				} else {
					res.json({ solution: solvedString })
				}
				
    });
};
