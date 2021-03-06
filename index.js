// 'use strict'

// const express = require('express');
// const bodyParser = require('body-parser');
// const request = require('request');
// const app = express();
// const fs = require('fs')
// const say = require('say');
// const http = require('http');
// const Bot = require('messenger-bot');

// app.set('port', (process.env.PORT || 5000))

// // Process application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({
// 	extended: false
// }))

// // Process application/json
// app.use(bodyParser.json())

// //Teste do OCR
// //var carajo;

// // function base64_encode(file) {

// // 	// read binary data
// // 	var bitmap = fs.readFileSync(file);
// // 	// convert binary data to base64 encoded string
// // 	return new Buffer(bitmap).toString('base64');
// // }



// // Index Route
// app.get('/', function(req, res) {
// 	res.send('Olá, Eu sou um bot' + body)
// 	//res.send(carajo);
// })

// // para verificacao do Facebook
// app.get('/webhook/', function(req, res) {
// 	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
// 		res.send(req.query['hub.challenge'])
// 	}
// 	res.send('Error, wrong token')
// })

// // app.post('/webhook/', function (req, res) {
// //  //Getting the mesagess
// //  var messaging_events = req.body.entry[0].messaging;
// //   //Looping through all the messaging events
// //   for (var i = 0; i < messaging_events.length; i++) {
// //    var event = req.body.entry[0].messaging[i];
// //    //Checking for attachments
// //    if (event.message.attachments) {
// //     //Checking if there are any image attachments 
// //     if(event.message.attachments[0].type === "image"){
// //      var imageURL = event.message.attachments[0].payload.url;
// //      console.log(imageURL);
// //      sendTextMessage(sender, "Me mandou foto aqui ?" + imageURL)
// //     }
// //    }
// //   }      
// //  }

// app.post('/webhook/', function (req, res) {
// 	let messaging_events = req.body.entry[0].messaging
// 	for (let i = 0; i < messaging_events.length; i++) {
// 		let event = req.body.entry[0].messaging[i]
// 		let sender = event.sender.id
// 		carajo = sender
// 		if (event.message && event.message.text) {
// 			let text = event.message.text
// 			sendTextMessage(sender, "Texto recebido foi: " + text.substring(0, 200))
// 		} 
// 		else if (event.message.attachments) {
// 			if (event.message.attachments[0].type === "image"){
// 				var imageURL = event.message.attachments[0].payload.url;
// 				console.log(imageURL);
// 				//sendTextMessage(sender, "Me mandou foto aqui ?" + imageURL)
// 				//ocrDetector(imageURL)
// 			}
// 		}
// 	}
// 	res.sendStatus(200)
// })


// function sendTextMessage(sender, text) {
// 	let messageData = { text:text }
// 	request({
// 		url: 'https://graph.facebook.com/v2.6/me/messages',
// 		qs: {access_token:token},
// 		method: 'POST',
// 		json: {
// 			recipient: {id:sender},
// 			message: messageData,
// 		}
// 	}, function(error, response, body) {
// 		if (error) {
// 			console.log('Error sending messages: ', error)
// 		} else if (response.body.error) {
// 			console.log('Error: ', response.body.error)
// 		}
// 	})
// }

'use strict'


const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
var lampadaLigada = new Boolean(false);

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send(lampadaLigada)
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

function ocrDetector(imageURL) {
	
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

	request(options, callback);
}

function callback(error, response, body) {
	console.log(response.statusCode)
	var info = JSON.parse(body);
	if (!error && response.statusCode == 200) {
		//console.log(body);
		console.log('Enviado OCR')
			// console.log(info)
		console.log(body)
		sendTextMessage(carajo, body);
	} else {
			//carajo = "Erro nessa porra";
		console.log('Problema no OCR')
		sendTextMessage(carajo, "Deu erro na imagem");
	}
}

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id

        if (event.message && event.message.text) {
            let text = event.message.text
            if (text === 'Listar' || text === 'listar' ) {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "Não entendi o comando: " + text.substring(0, 200))
        }
        
        if (event.postback) {
        let text = JSON.stringify(event.postback)
        sendTextMessage(sender, "Medicamento escolhido: "+text.substring(0, 200), token)
        continue
      	
      	}

       if (event.message.attachments) {
			if (event.message.attachments[0].type === "image"){
				var imageURL = event.message.attachments[0].payload.url;
				console.log(imageURL);
				sendTextMessage(sender, "" + imageURL)
				//ocrDetector(imageURL)
			}
		}
    }
    res.sendStatus(200)
})

function sendStatus(status) {
    var fs = require('fs');
    var stream = fs.createWriteStream("status.txt");
    stream.once('open', function(fd) {
      stream.write(status);
      stream.end();
  });
}


function sendJsonData(req, res, status) {
    app.get('/', function (req, res) {
        let data = {"status" : status}
        res.send(data)
    })
}

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Medicamento 1",
                    "subtitle": "Seu primeiro medicamento",
                    "image_url": "http://2.bp.blogspot.com/-8UrxcjC4wW0/UfR8dlhbPBI/AAAAAAAAAzg/z6g2cY3mmkM/s1600/pro101.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Mais informações",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Medicamento 2",
                    "subtitle": "Seu segundo medicamento",
                    "image_url": "http://www.remediosanto.pt/product_images/f/597/ANSIOTINA__14213_zoom.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "Mais informações",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

const token = "EAAFbjmAUdLUBAPzqBqW8BiaW2K8HmpGL9vCMyEWHCAaBpQvmCdLgYgAKlC9gTUcfAO0z9geKQWgNTS2fUXLmbXIiKYCcxPJCjwJLEIic0kyFDwmFd1clecvztayXEdoYOx1TRnhA3QkXKhseoB9LTjafAHLG9cwIv6Ga0wZDZD"

// // Spin up the server
// app.listen(app.get('port'), function() {
// 	console.log('running on port', app.get('port'))
// })

