class Preload {
	constructor() {
		this.fetchBlocks({}).then(blocks => {	
			for (let blockName in blocks) {
				blocks[blockName].elements.forEach(element => {
					blocks[blockName].render.then(text => {
						element.dispatchEvent(new CustomEvent('blockContentLoaded', { 
							bubbles: true,
							detail: {
								content: text
							}
						}));
					});
				});
			}
		}).catch(err => {
			console.log(err);
		});
	}

	fetchBlocks(blocks) {
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
		let res = text.match(/<img\ssrc=["|']([^"|^']\S+)["|']/ig);
		
		if (!res) { 
			return text;
		}

		return Promise.all(res.map((el) => {
			return new Promise ((resolve, reject) => {
				let imageSource = el.match(/src=["|']([^"|^']\S+)["|']/i)[1], fakeImage = new Image();
				fakeImage.src = imageSource;
				fakeImage.onload = () => resolve();
			});
		})).then(() => text);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new Preload();
});

document.addEventListener('blockContentLoaded', (event) => {
	let element = event.target;

	element.innerHTML = event.detail.content;
	element.classList.remove('block--loading');
	element.classList.add('block--loaded');	
});
