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
}


let start = () => {
	let elements = document.querySelectorAll('[data-fetch]');
	let queuedBlocks = buildQueue(elements);
	// @TODO add fetch logic
	// for (i)
	// fetch(`localhost:8999/block?blockname=${blockname}`)


}




document.addEventListener('DOMContentLoaded', function(){
	start();
});

