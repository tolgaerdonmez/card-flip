import React, { useState, useEffect } from "react";

function Card({ id, selectCard, found, imageIndex, selectable }) {
	const [flipped, flip] = useState(false);
	const [isFound, setFound] = useState(false);

	useEffect(() => {
		if (found) {
			setFound(true);
		}
	}, [found]);

	return (
		<>
			<div
				className={`card ${flipped || isFound ? "flipped" : ""} ${isFound ? "found" : ""} ${
					selectable ? "selectable" : ""
				}`}
				onClick={
					!isFound && !flipped && selectable
						? () => {
								selectCard(id, () => {
									flip(false);
									const flipsound1 = new Audio("sound/card_flip2.wav");
									flipsound1.play();
								});
								flip(!flipped);
								const flipsound1 = new Audio("sound/card_flip1.wav");
								flipsound1.play();
						  }
						: null
				}>
				<img src={`img/cars/${imageIndex}.png`} alt="card img" />
			</div>
		</>
	);
}

export default Card;
