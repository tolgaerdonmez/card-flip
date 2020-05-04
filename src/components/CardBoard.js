import React, { Component } from "react";
import Card from "./Card";

class CardBoard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ready: false,
			finished: false,
			cards: [],
			firstSelected: null,
			deselect: null,
			pairs: {},
			imagePairs: [],
			found: [],
		};
	}

	componentDidMount() {
		this.createCards(this.props.size ? this.props.size : 4);
	}

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
			imagePairs[pOne] = images[imageIndex];
			imagePairs[pTwo] = images[imageIndex];
			picks = picks.filter(id => id !== pOne).filter(id => id !== pTwo); // deleting the selected pTwo from picks

			if (index > picks.length) index = 0;
			else index++;
			imageIndex++;
		}
		return { pairs, imagePairs };
	};

	createImgList = size => {
		let imgs = [];
		let picks = [...new Array(size ** 2)].map((x, index) => index + 1);
		while (imgs.length < size ** 2 / 2) {
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
		const { pairs, imagePairs } = this.createPairs(cards, images);
		this.setState({ cards, pairs, imagePairs, ready: true });
	};

	isFound = id => {
		const { found } = this.state;
		if (found.filter(x => x === id).length) return true;
		return false;
	};

	selectCard = (id, deselect) => {
		if (this.state.firstSelected === null) this.setState({ firstSelected: id, deselect });
		else {
			if (
				this.state.pairs[this.state.firstSelected] === id ||
				this.state.pairs[id] === this.state.firstSelected
			) {
				// if user founds a pair
				if (this.state.found.length + 2 === this.props.size ** 2) {
					const successsound = new Audio("sound/success.wav");
					successsound.play();
				} else {
					const pairfoundsound = new Audio("sound/pair_found.wav");
					pairfoundsound.play();
				}
				this.setState(prevState => {
					// add them to founds
					let { found } = prevState;
					found = [...found, this.state.firstSelected, id];
					return { found, firstSelected: null, finished: found.length === this.props.size ** 2 };
				});
			} else {
				setTimeout(() => {
					deselect();
					if (this.state.deselect) this.state.deselect();
					this.setState({ firstSelected: null, deselect: null });
				}, 1000);
			}
		}
	};

	render() {
		return (
			<>
				{this.state.finished ? (
					<div class="finish-message">
						<h1>Success</h1>
						<p>Want to play again ?</p>
						<button
							onClick={() => {
								window.location.reload();
							}}>
							Play Again
						</button>
					</div>
				) : null}
				<div className={`cards ${this.state.finished ? "finished" : ""}`}>
					{this.state.ready
						? this.state.cards.map((row, rowIndex) => (
								<div key={rowIndex} className="row">
									{row.map(id => (
										<Card
											imageIndex={this.state.imagePairs[id]}
											found={this.isFound(id)}
											id={id}
											key={id}
											selectCard={this.selectCard}></Card>
									))}
								</div>
						  ))
						: "Setting the game up!!"}
				</div>
			</>
		);
	}
}

export default CardBoard;
