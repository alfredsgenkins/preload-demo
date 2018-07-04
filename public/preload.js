/**
 * @class Preload
 * @author Alfreds Genkins, Ilja Lapkovskis
 * @version 0.0.1
 */
class Preload {
    /**
	 * Asynchronous block loading script
	 * @param {string} handlerURL URL to fetch blocks
	 * @param {string} dataAttribute data attribute to query blocks
	 * @event allBlocksLoaded fires when all blocks are loaded
	 * @event blockContentLoaded fires when a block is loaded
	 */
    constructor(handlerURL, dataAttribute = 'data-fetch') {
        this.fetchBlocks(handlerURL, dataAttribute)
            .then(() => document.dispatchEvent(new CustomEvent('allBlocksLoaded'))) // dispatch all elements load event
            .catch(err => console.error('Preload', err));
    }

    /**
	 * Fetch blocks (query & fetch content)
	 * @param {string} handlerURL 
	 * @param {string} dataAttribute 
	 */
    fetchBlocks(handlerURL, dataAttribute) {
        let renders = {}; // to collect all renders by key (for elements)

        document.querySelectorAll('[' + dataAttribute + ']').forEach(element => {
            let blockName = element.getAttribute(dataAttribute);

            if (!renders.hasOwnProperty(blockName)) { // fetch content of the block if it is not present
                renders[blockName] = fetch(handlerURL + blockName)
                    .then(res => res.status === 200 && // if response status 200 – fetch content
						res.text().then(text => this.fetchContent(text)) || 
						console.error('Preload', 'Error fetching') 
                    ).catch(err => console.error('Preload', err));
            }

            renders[blockName]
                .then(text => 
                    element.dispatchEvent(
                        new CustomEvent('blockContentLoaded', { // dispatch element content load event
                            bubbles: true, 
                            detail: { 
                                content: text
                            } 
                        })
                    )
                ).catch(err => console.error('Preload', err));
        });

        return Promise.all(Object.values(renders)); // return promise waiting for every element to resolve
    }

    /**
	 * Fetch content (lazy load images, before show)
	 * @param {string} text 
	 */
    fetchContent(text) {
        try { // try matching regex
            return Promise.all( // make a promise waiting for other promises to resolve
                text.match(/<img\ssrc=["|']([^"|^']\S+)["|']/ig).map( // map regex to a promise
                    el => new Promise ((resolve) => {
                        let imageSource = el.match(/src=["|']([^"|^']\S+)["|']/i)[1], 
                            fakeImage = new Image();
							
                        fakeImage.onload = () => resolve();
                        fakeImage.onerror = () => resolve();
                        fakeImage.src = imageSource;
                    })
                )
            ).then(() => text);
        } catch (error) {
            return text;
        }
    }
}
