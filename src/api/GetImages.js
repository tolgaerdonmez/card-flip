import API from "./ImageApi";

export default function getImages(words) {
	return new Promise((res, rej) => {
		let images = [];
		let promises = [];
		words.forEach(word => {
			const p = API.byQueryPixabay(word)
				.catch(err =>
					console.log(`Error in word: ${word}
			\nError is: ${err}`)
				)
				.then(({ data }) => {
					const { hits, total } = data;
					if (total >= 1) images.push({ word, img: hits[0].webformatURL });
					else console.log(hits);
				});
			promises.push(p);
		});
		Promise.all(promises)
			.then(() => {
				const data = { length: images.length, images };
				res(data);
			})
			.catch(err => rej(err));
	});
}
