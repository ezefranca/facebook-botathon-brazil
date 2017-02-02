'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const fs = require('fs')
const say = require('say');
const http = require('http');
const Bot = require('messenger-bot');



app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: false
}))

// Process application/json
app.use(bodyParser.json())

//Teste do OCR
var carajo;

function base64_encode(file) {
	// read binary data
	var bitmap = fs.readFileSync(file);
	// convert binary data to base64 encoded string
	return new Buffer(bitmap).toString('base64');
}


var formData = {
	//75765aae-8a65-4eeb-9ada-d026ed5c0291

	apikey: 'dd5e679c-3e9b-4ee6-ab4c-9db34501fb66',
	mode: 'document_photo',
	file: fs.createReadStream('image.jpg')
};

var options = {
	url: 'http://api.havenondemand.com/1/api/sync/ocrdocument/v1',
	method: 'POST',
	headers: {
		'Content-Type': 'multipart/form-data'
	},
	formData: formData
};

function callback(error, response, body) {
	console.log(response.statusCode)
	var info = JSON.parse(body);
	if (!error && response.statusCode == 200) {
		//console.log(body);
		console.log('Enviado OCR')
			// console.log(info)
		console.log(body)
		carajo = body

	} else {
		carajo = "Erro nessa porra";
		console.log('Problema no OCR')
	}
}

request(options, callback);




// Index Route
app.get('/', function(req, res) {
	//res.send('Olá, Eu sou um bot' + body)
	res.send(carajo);
})

// para verificacao do Facebook
app.get('/webhook/', function(req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})

