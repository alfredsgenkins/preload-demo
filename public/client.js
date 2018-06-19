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


let lookupForImages = (text, callback) => {
	let res = text.match(/<img\ssrc=["|']([^"|^']\S+)["|']/ig),
		imagesLoaded = 0;

	if (res) {
		res.forEach(el => {
			let imageSource = el.match(/<img\ssrc=["|']([^"|^']\S+)["|']/i)[1],
				fakeImage = new Image();
	
			fakeImage.src = imageSource;
			fakeImage.onload = () => {
				++imagesLoaded;
				
				if (imagesLoaded === res.length) {
					callback();
				}
			};
		});
	} else {
		callback();
	}
};


let start = () => {
	let queuedBlocks = buildQueue(document.querySelectorAll('[data-fetch]'));

	fetchContent(queuedBlocks, (element, text) => {
		lookupForImages(text, () => {
			let elements = document.querySelectorAll(`[data-fetch='${element}']`);
			
			elements.forEach(elem => {
				// elem.innerHTML = text;
				// elem.classList.remove('block--loading');
				// elem.classList.add('block--loaded');			
			});
		});		
	});
};

document.addEventListener('DOMContentLoaded', function(){
	start();
});
