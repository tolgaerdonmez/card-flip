const axios = require("axios").default;
const { PEXEL, PIXABAY, TOKEN_PEXEL, TOKEN_PIXABAY } = require("./config");

const pexel = axios.create({
	baseURL: PEXEL,
	headers: { Authorization: "Bearer " + TOKEN_PEXEL },
});

const pixabay = axios.create({
	baseURL: PIXABAY,
});

const byQueryPexel = (query, per_page, page) => pexel.get(`/search?query=${query}&per_page=${per_page}&page=${page}`);
const byCategoryPixabay = category =>
	pixabay.get(`/?key=${TOKEN_PIXABAY}&category=${category}&safesearch=true&order=popular`);
const byQueryPixabay = q =>
	pixabay.get(
		`/?key=${TOKEN_PIXABAY}&q=${q}&safesearch=true&order=popular&orientation=horizontal&editors_choice=false`
	);

module.exports = { byQueryPexel, byCategoryPixabay, byQueryPixabay };
