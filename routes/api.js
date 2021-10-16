const express = require('express');
const events = require('events')
const fs = require('fs');
const cvs = require('csv-parser');
const linearAlgebra = require('linear-algebra')()
const Vector = linearAlgebra.Vector
const Matrix = linearAlgebra.Matrix

const router = express.Router();
const eventEmitter = new events.EventEmitter()

router.get('/helloWorld', (req, res) => {
	res.send("Hello World")
})



router.get('/multiply', async (req, res) => {
	let params = new URLSearchParams(req.query);
	let matrixA = []
	let matrixB = []
	try {
		var fileA = './data/' + params.get('matrixA') + '.csv'
		var fileB = './data/' + params.get('matrixB') + '.csv'
	} catch {
		res.send("Wrong parameters")
	}
		
	let first = new Promise ((resolve) => {
		fs.createReadStream(fileA)
		.pipe(cvs(['line']))
		.on('data', (row) => {
			let line = row.line.split(";").map(Number)
			matrixA.push(line)
		})
		.on('end', () => {
			resolve()
		});
	})

	let second = new Promise ((resolve) => {
		fs.createReadStream(fileB)
		.pipe(cvs(['line']))
		.on('data', (row) => {
			let line = row.line.split(";").map(Number)
			matrixB.push(line)
		})
		.on('end', () => {
			resolve()
		});
	})
	
	await Promise.all([first, second])

	let m1 = new Matrix(matrixA)
	let m2 = new Matrix(matrixB)

	let result = m1.dot(m2).toArray()
	
	res.send(result)
})

module.exports = router;