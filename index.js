const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const xml = require('./server/xml');
const port = 9090;
const multer = require('multer');
const upload = multer({ dest: 'jsonFiles/' });
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use('/xml', xml);

app.post('/upload', upload.any(), (req, res) => {
	res.send(req.files[0].filename);
});

app.use('/', express.static(__dirname + '/view'))
app.listen(port, (err) => {
	if(err) {
		console.log(err)
	}
	console.log('server running on ', port)
})
