var express = require('express');
var app = express();
var blocks = require('./blocks');

app.get('/', (req, res) => {
	return blocks.default(res);
});

app.set('view engine', 'pug');

app.listen(8999, () => console.log('Server started on port 8999'));