import React, { Component } from "react";
import Card from "./Card";
import { images as IMAGES } from "../imagewordlist.json";

class CardBoard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ready: false,
			finished: false,
			cards: [],
			firstSelected: null,
			deselect: null,
			selectable: true,
			pairs: {},
			imagePairs: [],
			found: [],
			time: 0,
			start: 0,
		};
	}

	componentDidMount() {
		this.createCards(this.props.size ? this.props.size : 4);
	}

	startTimer = () => {
		this.setState({
			time: this.state.time,
			start: Date.now(),
		});
		this.timer = setInterval(
			() =>
				this.setState({
					time: Date.now() - this.state.start,
				}),
			1
		);
	};

	stopTimer = () => {
		clearInterval(this.timer);
	};

	createPairs = (cards, images) => {
		let pairs = {};
		let imagePairs = {};
		cards = cards.flat(Infinity);
		let picks = [...cards];
		let index = 0;
		let imageIndex = 0;
		while (picks.length >= 2) {
			let randomIndex = 0;
			let pOne = picks[index];
			let pTwo = null;
			while (true) {
				randomIndex = Math.floor(Math.random() * picks.length);
				pTwo = picks[randomIndex];
				if (pOne !== pTwo) break;
			}

			pairs[pOne] = pTwo;
			try {
				imagePairs[pOne] = images[imageIndex].word;
				imagePairs[pTwo] = images[imageIndex].img;
			} catch (err) {
				console.log(err, imageIndex, images, picks, index);
			}
			picks = picks.filter(id => id !== pOne).filter(id => id !== pTwo); // deleting the selected pTwo from picks

			if (index > picks.length) index = 0;
			else index++;
			imageIndex++;
		}
		return { pairs, imagePairs };
	};

	createImgList = size => {
		let imgs = [];
		let picks = [...IMAGES];
		console.log("image list", size ** 2 / 2);
		while (imgs.length <= size ** 2 / 2) {
			let randomIndex = 1;
			let pick;
			while (true) {
				randomIndex = Math.floor(Math.random() * picks.length);
				pick = picks[randomIndex];
				// eslint-disable-next-line no-loop-func
				const exists = imgs.filter(x => x === pick).length;
				if (!exists) break;
			}
			imgs.push(pick);
			picks = picks.filter(x => x !== pick);
		}
		return imgs;
	};

	createCards = size => {
		let cards = [];
		for (let index = 0; index < size; index++) {
			cards.push([...new Array(size)].map((card, colIndex) => colIndex + size * index));
		}
		const images = this.createImgList(size);
		console.log(images);
		const { pairs, imagePairs } = this.createPairs(cards, images);
		console.log(pairs, imagePairs);
		this.setState({ cards, pairs, imagePairs });
	};

	isFound = id => {
		const { found } = this.state;
		if (found.filter(x => x === id).length) return true;
		return false;
	};

	selectCard = (id, deselect) => {
		if (this.state.firstSelected === null) this.setState({ firstSelected: id, deselect });
		else {
			this.setState({ selectable: false });
			if (
				this.state.pairs[this.state.firstSelected] === id ||
				this.state.pairs[id] === this.state.firstSelected
			) {
				// if user founds a pair
				if (this.state.found.length + 2 === this.props.size ** 2) {
					const successsound = new Audio("sound/success.wav");
					successsound.play();
					this.stopTimer();
				} else {
					const pairfoundsound = new Audio("sound/pair_found.wav");
					pairfoundsound.play();
				}
				this.setState(prevState => {
					// add them to founds
					let { found } = prevState;
					found = [...found, this.state.firstSelected, id];
					return {
						found,
						firstSelected: null,
						finished: found.length === this.props.size ** 2,
						selectable: true,
					};
				});
			} else {
				setTimeout(() => {
					deselect();
					if (this.state.deselect) this.state.deselect();
					this.setState({ firstSelected: null, deselect: null, selectable: true });
				}, 1000);
			}
		}
	};

	render() {
		return (
			<>
				{this.state.finished ? (
					<div class="finish-message">
						<h1>Success </h1>
						<p>Finished in {(this.state.time / 1000).toString()} seconds</p>
						<p>Want to play again ?</p>
						<button
							className="button"
							onClick={() => {
								window.location.reload();
							}}>
							Play Again
						</button>
					</div>
				) : null}
				<div className="timer">
					<p>Timer: {(this.state.time / 1000).toString().split(".")[0]}</p>
				</div>
				<div className={`cards ${this.state.finished ? "finished" : ""}`}>
					{this.state.ready ? (
						this.state.cards.map((row, rowIndex) => (
							<div key={rowIndex} className="row">
								{row.map(id => (
									<Card
										selectable={this.state.selectable}
										backData={this.state.imagePairs[id]}
										found={this.isFound(id)}
										id={id}
										key={id}
										selectCard={this.selectCard}></Card>
								))}
							</div>
						))
					) : (
						<button
							className="button start-button"
							onClick={() => {
								this.setState({ ready: true });
								this.startTimer();
							}}>
							Start
						</button>
					)}
				</div>
			</>
		);
	}
}

export default CardBoard;
