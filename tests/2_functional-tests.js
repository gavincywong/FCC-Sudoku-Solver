const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
	// Test 1
	test('Valid puzzle string', function(done) {
		chai.request(server)
		.post("/api/solve")
		.send({ puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'})
		.end(function(err, res) {
			assert.equal(res.status, 200)
			assert.equal(res.body.solution, '568913724342687519197254386685479231219538467734162895926345178473891652851726943')
			done()
		})
	})
	// Test 2
	test('Missing puzzle string', function(done) {
		chai.request(server)
		.post("/api/solve")
		.send({})
		.end(function(err, res) {
			assert.equal(res.status, 200)
			assert.equal(res.body.error, 'Required field missing')
			done()
		})
	})
	// Test 3
	test('String has invalid characters', function(done) {
		chai.request(server)
		.post("/api/solve")
		.send({ puzzle: '5@.91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'})
		.end(function(err, res) {
			assert.equal(res.status, 200)
			assert.equal(res.body.error, 'Invalid characters in puzzle')
			done()
		})
	})
	// Test 4
	test('String has incorrect length', function(done) {
		chai.request(server)
		.post("/api/solve")
		.send({ puzzle: '.72...3'})
		.end(function(err, res) {
			assert.equal(res.status, 200)
			assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
			done()
		})
	})
	// Test 5
	test('Puzzle cannot be solved', function(done) {
		chai.request(server)
		.post("/api/solve")
		.send({ puzzle: '1.2222.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'})
		.end(function(err, res) {
			assert.equal(res.status, 200)
			assert.equal(res.body.error, 'Puzzle cannot be solved')
			done()
		})
	})
	// Test 6
	test('Check puzzle placement with all fields', function(done) {
		chai.request(server)
		.post("/api/check")
		.send({ 
			puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
			coordinate: 'A5',
			value: "2"
		})
		.end(function(err, res) {
			assert.equal(res.status, 200)
			assert.equal(res.body.valid, true)
			done()
		})
	})
	// Test 7
	test('Check puzzle placement with a single placement conflict', function(done) {
		chai.request(server)
		.post("/api/check")
		.send({ 
			puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
			coordinate: 'A4',
			value: "1"
		})
		.end(function(err, res) {
			assert.equal(res.status, 200)
			assert.equal(res.body.valid, false)
			assert.deepEqual(res.body.conflict, ["row"])
			done()
		})
	})
	// Test 8
	test('Check puzzle placement with multiple placement conflicts', function(done) {
		chai.request(server)
		.post("/api/check")
		.send({ 
			puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
			coordinate: 'A1',
			value: "1"
		})
		.end(function(err, res) {
			assert.equal(res.status, 200)
			assert.equal(res.body.valid, false)
			assert.deepEqual(res.body.conflict, ["row", "column"])
			done()
		})
	})
	// Test 9
	test('Check puzzle placement with all placement conflicts', function(done) {
		chai.request(server)
		.post("/api/check")
		.send({ 
			puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
			coordinate: 'A1',
			value: "5"
		})
		.end(function(err, res) {
			assert.equal(res.status, 200)
			assert.equal(res.body.valid, false)
			assert.deepEqual(res.body.conflict, ["row", "column", "region"])
			done()
		})
	})
	// Test 10
	test('Check puzzle placement with missing required fields', function(done) {
		chai.request(server)
		.post("/api/check")
		.send({ 
			puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
		})
		.end(function(err, res) {
			assert.equal(res.status, 200)
			assert.equal(res.body.error, "Required field(s) missing")
			done()
		})
	})
	// Test 11
	test('Check puzzle placement with invalid characters', function(done) {
		chai.request(server)
		.post("/api/check")
		.send({ 
			puzzle: '..9..5.1.85.4....2432...@..1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
			coordinate: 'A1',
			value: "5"
		})
		.end(function(err, res) {
			assert.equal(res.status, 200)
			assert.equal(res.body.error, "Invalid characters in puzzle")
			done()
		})
	})
	// Test 12
	test('Check puzzle placement with incorrect length', function(done) {
		chai.request(server)
		.post("/api/check")
		.send({ 
			puzzle: '.6.62.71...9....1945....4.37.4.3..6..',
			coordinate: 'A1',
			value: "5"
		})
		.end(function(err, res) {
			assert.equal(res.status, 200)
			assert.equal(res.body.error, "Expected puzzle to be 81 characters long")
			done()
		})
	})
	// Test 13
	test('Check puzzle placement with invalid placement coordinate', function(done) {
		chai.request(server)
		.post("/api/check")
		.send({ 
			puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
			coordinate: 'Z1',
			value: "5"
		})
		.end(function(err, res) {
			assert.equal(res.status, 200)
			assert.equal(res.body.error,  "Invalid coordinate" )
			done()
		})
	})
	// Test 14
	test('Check puzzle placement with invalid placement value', function(done) {
		chai.request(server)
		.post("/api/check")
		.send({ 
			puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
			coordinate: 'A1',
			value: "10"
		})
		.end(function(err, res) {
			assert.equal(res.status, 200)
			assert.equal(res.body.error, "Invalid value")
			done()
		})
	})
});

