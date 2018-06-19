class Preload {
	constructor() {
		// TODO: Initialize params params here

		this.fetchBlocks().then(blocks => {	
			// TODO: Dispatch custom event here

			for (let blockName in blocks) {
				blocks[blockName].elements.forEach(element => {
					blocks[blockName].render.then(text => {
						element.innerHTML = text;
						element.classList.remove('block--loading');
						element.classList.add('block--loaded');	
					});
				});
			}
		}).catch(err => {
			console.log(err);
		});
	}

	fetchBlocks() {
		let blocks = {};

		return new Promise((resolve, reject) => {
			document.querySelectorAll('[data-fetch]').forEach(element => {
				let blockName = element.getAttribute('data-fetch');
	
				if (blockName in blocks) {
					blocks[blockName].elements.push(element);
				} else {
					blocks[blockName] = {
						elements: [element],
						render: fetch(`/block?blockname=${blockName}`)
							.then(res => res.status !== 200 && console.error('Error fetching') || res.text().then(text => this.fetchContent(text)))
							.catch(err => reject(err))
					};
				}
			});

			resolve(blocks);
		});
	}

	fetchContent(text) {
		// TODO: rewrite image source logic – I don't like 2 loops

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
						return text;
					}
				};
			});
		}

		return text;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new Preload();
});
