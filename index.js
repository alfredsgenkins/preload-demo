var express = require('express');
var app = express();
var blocks = require('./blocks');

app.get('/', (req, res) => {
	return blocks.default(res);
});

app.get('/block', (req, res) => {
	setTimeout(() => {
		blocks.single(req, res);
	}, Math.floor(Math.random() * 1000) + 1000) ;
});

app.set('view engine', 'pug');
app.use(express.static('public'));

app.listen(8999, () => console.log('Server started on port 8999'));