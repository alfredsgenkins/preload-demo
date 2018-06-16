let buildQueue = (elements) => {
	let elementCount = elements.length;
	let queue = [];

	for (let i = 0; i < elementCount; i++) {
		let blockName = elements[i].getAttribute('data-fetch');
		if (queue.indexOf(blockName) === -1) {
			queue.push(blockName);
		}
	}

	return queue;
};

let fetchContent = (queuedBlocks, callback) => {
	let queueLength = queuedBlocks.length;
	let content = {};
	// @TODO add fetch logic
	for (let i = 0; i < queueLength; i++) {
		let current = queuedBlocks[i];
		fetch(`/block?blockname=${current}`).then(
			(res) => {
				if (res.status !== 200) {
					console.error('Error fetching');
				}

				res.text().then((text)=> {
					callback(current, text);
				});
			}
		).catch((err) => {
			console.log(err);
		});
	}

	return content;
};


let start = () => {
	let queuedBlocks = buildQueue(document.querySelectorAll('[data-fetch]'));
	fetchContent(queuedBlocks, (element, text) => {
		console.log(element, text);
		let elements = document.querySelectorAll(`[data-fetch='${element}']`);
		// you may have the same blocks within the page you are fetching once but need to propagate all
		elements.forEach((elem) => {
			elem.classList.add('block--loaded');
			elem.classList.remove('block--loading');
			elem.innerHTML = text;
		});
	});
};



document.addEventListener('DOMContentLoaded', function(){
	start();
});
