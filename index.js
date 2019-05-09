const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const xml = require('./server/xml');
const port = 8081;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use('/xml', xml);
app.listen(port, (err) => {
	if(err) {
		console.log(err)
	}
	console.log('server running on ', port)
})
