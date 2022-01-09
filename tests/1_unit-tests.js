const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
var string = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
var invalid_string = '.f9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
var puzzleArrValid = solver.convertStringtoArr(string);
		
suite('UnitTests', () => {
	// Test 1
	test('Puzzle String of 81 Chars', function(done) {
		assert.equal(solver.validate(string), true)
		done()
	})
	// Test 2
	test('Puzzle string with invalid chars', function(done) {
		let puzzleArr = solver.convertStringtoArr(invalid_string);
		let solvedArr = solver.sudokuSolver(puzzleArr);
		let solvedString = solver.arrToString(puzzleArr);

		assert.equal(!/^[0-9]+$/.test(solvedString), true)
		done()
	})
	// Test 3
	test('Puzzle string less than 81 chars', function(done) {
		assert.equal(solver.validate('.56465'), false)
		done()
	})
	// Test 4
	test('Valid row placement', function(done) {
		assert.equal(solver.checkRowPlacement(puzzleArrValid, 0, 1, "6"), true)
		done()
	})
	// Test 5
	test('Invalid row placement', function(done) {
		assert.equal(solver.checkRowPlacement(puzzleArrValid, 0, 0, "1"), false)
		done()
	})
	// Test 6
	test('Valid column placement', function(done) {
		assert.equal(solver.checkRowPlacement(puzzleArrValid, 0, 0, "2"), true)
		done()
	})
	// Test 7
	test('Invalid column placement', function(done) {
		assert.equal(solver.checkRowPlacement(puzzleArrValid, 0, 0, "1"), false)
		done()
	})
	// Test 8
	test('Valid region placement', function(done) {
		assert.equal(solver.checkRegionPlacement(puzzleArrValid, 0, 0, "1"), true)
		done()
	})
	// Test 9
	test('Invalid region placement', function(done) {
		assert.equal(solver.checkRegionPlacement(puzzleArrValid, 0, 0, "9"), false)
		done()
	})
	// Test 10
	test('Valid puzzle strings pass the solver', function(done) {
		let validString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
		let puzzleArr = solver.convertStringtoArr(validString);
		let solvedArr = solver.sudokuSolver(puzzleArr);
		assert.equal(solvedArr, true)
		done()
	})
	// Test 11
	test('Invalid puzzle strings fail the solver', function(done) {
		let invalidString = '1.2222.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
		let puzzleArr = solver.convertStringtoArr(invalidString);
		let solvedArr = solver.sudokuSolver(puzzleArr);
		assert.equal(solvedArr, false)
		done()
	})
	// Test 12
	test('Solver returns the expected solution for an incomplete puzzle', function(done) {
		let validString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
		let puzzleArr = solver.convertStringtoArr(validString);
		let solvedArr = solver.sudokuSolver(puzzleArr);
		let solvedString = solver.arrToString(puzzleArr);
		assert.equal(solvedString, '135762984946381257728459613694517832812936745357824196473298561581673429269145378')
		done()
	})
});
