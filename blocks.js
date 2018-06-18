var defaultController = (res) => {
	res.render('layout', {
		title: 'Proof of concept',
		message: 'Prove of concept',
	});
}

var singleBlockController = (req, res) => {
	if (!req.query.blockname) {
		throw new Error('Blockname was not defined');
	}

	let block = req.query.blockname;
	res.render(`templates/${block}`, (err, html) => {
		if (err) {
			res.status(404);
			res.send('Template was not found');
		}
		res.send(html);
	});
}

module.exports = {
	default: defaultController,
	single: singleBlockController
}
