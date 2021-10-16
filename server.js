// Get dependencies
const express = require('express');
const path = require('path')
const http = require('http')

// Get our API routes
const api = require('./routes/api')

const app = express()

// Parsers for POST data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')))

// Set our api routes
app.use('/api', api)

// Catch all other routes and return the index file
app.get('*', (req, res) => {
	res.send('FenixNegra is running!')
})

// Set the port
const port = '3000'
app.set('port', port)

// Create the http server.
const server = http.createServer(app)

// Listen
server.listen(port, () => console.log(`Running on localhost:${port}`))