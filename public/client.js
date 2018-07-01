document.addEventListener('DOMContentLoaded', () => {
	new Preload('/block?blockname=');
});

document.addEventListener('allBlocksLoaded', () => {
	console.log('All blocks are loaded!');
});

document.addEventListener('blockContentLoaded', (event) => {
    let element = event.target;

	element.innerHTML = event.detail.content;
	element.classList.remove('block--loading');
    element.classList.add('block--loaded');	
});
