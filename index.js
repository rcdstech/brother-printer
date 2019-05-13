const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const xml = require('./server/xml');
const port = 8081;
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'jsonFiles/' });
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use('/xml', xml);

app.post('/upload', upload.any(), (req, res) => {
	res.send(req.files[0].filename);
});

app.post('/scanToEmail', (req, res) => {
	console.log(req.body.data)
	fs.writeFile(__dirname + '/server/scanToEmail.json', req.body.data, (err) => {
		if (err) res.send(err);
		res.send("Successfully Written to File.");
	});
});

app.use('/', express.static(__dirname + '/view'))
app.listen(port, (err) => {
	if(err) {
		console.log(err)
	}
	console.log('server running on ', port)
})
