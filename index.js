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

function base64_encode(file) {
	// read binary data
	var bitmap = fs.readFileSync(file);
	// convert binary data to base64 encoded string
	return new Buffer(bitmap).toString('base64');
}


// var PngImg = fs.readFile('image.jpg', function (err,data) {
//   if (err) {
//     return console.log(err);
//   }

//   var base64str = base64_encode('image.jpg');
//  // console.log(base64str);

//   var formData = {
//   	//75765aae-8a65-4eeb-9ada-d026ed5c0291

// 	apikey: 'dd5e679c-3e9b-4ee6-ab4c-9db34501fb66',
//  	mode: 'document_photo',
//  	file: base64str
//   };

//   var options = {
//     url: 'http://api.havenondemand.com/1/api/sync/ocrdocument/v1',
//     method: 'POST',
//     headers: {
//     'Content-Type': 'multipart/form-data'
//   	},
//   	formData: formData
//   };

//   function callback(error, response, body) {
// 	console.log(response.statusCode)
// 	var info = JSON.parse(body);
//     if (!error && response.statusCode == 200) {
//         //console.log(body);
//          console.log('Enviado OCR')
//         // console.log(info)
//         console.log(body)
//     } else {
//     	 console.log('Problema no OCR')
//     }


//   }

// request(options, callback);

// });


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
		say.speak('Hello, how are you today?', (err) => {
    if (err) {
        return console.error(err);
    }

    console.log('Text has been spoken.');
});
	} else {
		console.log('Problema no OCR')
	}
}

request(options, callback);

// var options2 = {
//   url: 'https://api.github.com/repos/request/request',
//   headers: {
//     'User-Agent': 'request'
//   }
// };

// function callback2(error, response, body) {
//   if (!error && response.statusCode == 200) {
//     var info = JSON.parse(body);
//     console.log(info.stargazers_count + " Stars");
//     console.log(info.forks_count + " Forks");
//   }
// }

// request(options2, callback2);

// // function to encode file data to base64 encoded string
// function base64_encode(file) {
//     // read binary data
//     var bitmap = fs.readFileSync(file);
//     // convert binary data to base64 encoded string
//     return new Buffer(bitmap).toString('base64');
// }



// request.post({url:'http://service.com/upload', formData: formData}, function optionalCallback(err, httpResponse, body) {
//   if (err) {
//     return console.error('upload failed:', err);
//   }
//   console.log('Upload successful!  Server responded with:', body);
// });
// var fd = new FormData();
//        fd.append("apikey", "dd5e679c-3e9b-4ee6-ab4c-9db34501fb66");
//        fd.append("mode", "document_scan");
//        fd.append("file", result);



// var options = {
//   url: 'https://api.github.com/repos/request/request',
//   headers: {
//     'User-Agent': 'request'
//   }
// };



// Index Route
app.get('/', function(req, res) {
	res.send('Olá, Eu sou um bot')
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