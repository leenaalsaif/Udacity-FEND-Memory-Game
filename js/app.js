//Selecting all the cards and adding them to the variable allCards so I can use them
let allCards = document.querySelectorAll('.card');

//Creats an empty cardTypes array to store the card types
let cardTypes = [];

//Tracks the number of moves
let numOfMoves = 0;

//variable contains the number of stars
let numOfStars = 3;

//timer variables
let seconds = 0;
let minutes = 0;
let timerHandler;

//Initialize the game
gameInitialization();
restartingGame();


//a function that collects all the card types and stores them in an array called cardTypes
function gameInitialization() {
	allCards.forEach(card => {
		let cardClass = card.children[0];
		cardTypes.push(cardClass.className);

		//listens for the user's clicks and calls the function clickingCard()
		card.addEventListener("click", clickingCard);
	});

	//add event listeners to the buttons in the message box
	document.getElementById("play-again").addEventListener("click", restartingGame);
	document.getElementById("cancel-game").addEventListener("click", closeMessage);

	//restarts game using the button at the top
	document.querySelector(".restart").addEventListener("click", restartingGame);

}

//assign the cards to the html code
let i = 0;
allCards.forEach(card => {
	let cardClass = card.children[0];
	cardClass.className = cardTypes[i];
	i++;
});

//Stores the indivisual cards into an array so no more than two unmached cards can be opened at the same time
let openedCards = [];

//restarts the game from the beginning by reseting the moves, stars, timer, and flipping the cards
function restartingGame() {
	cardsShuffling();
	seconds = 0;
	minutes = 0;
	numOfMoves = 0;
	numOfStars = 3;
	closeMessage();
	amountOfMoves();
	amountOfStars();
	flippingTheCards();
	timerStart();
}

//starts the timer
function timerStart() {
	if (!timerHandler) {
		timerHandler = setInterval(function () {
			seconds += 1;
			if (seconds > 59) {
				seconds = 0;
				minutes += 1;
			}
			document.querySelector(".timer").innerText = `${minutes}:${seconds}`;
		}, 1000);
	}
}

//stops the timer
function timerStop() {
	clearInterval(timerHandler);
	timerHandler = null;
}

//when the card is clicked, this function gets called
function clickingCard() {
	//shows the card after checking that no more than two cards are opened at the same time
	if (!this.classList.contains('open') && !this.classList.contains('show') && !this.classList.contains('match') && openedCards.length < 2) {
		this.classList.toggle("show");
		this.classList.toggle("open");

		openedCards.push(this);


		//check if the opened cards match or not and waits for 1 second before resetting
		setTimeout(function () {
			if (openedCards.length == 2) {
				//create variables to hold the opened cards seperately
				let card1 = openedCards[0];
				let card2 = openedCards[1];

				//stores each card's type in a variable so we can compare them
				let firstCardType = card1.children[0].className;
				let secondCardType = card2.children[0].className;

				if (firstCardType == secondCardType) {
					card1.classList.add("match");
					card2.classList.add("match");

				} else {
					card1.classList.remove("open", "show");
					card2.classList.remove("open", "show");
				}
				//empties the array
				openedCards = [];

				//increment the moves and update them in the html file
				numOfMoves += 1;
				amountOfMoves();
				amountOfStars();

				//shows the message at the end
				let numOfMatchedCards = document.querySelectorAll('.match');
				if (numOfMatchedCards.length == 16) {
					let score = document.getElementById("span-stars");
					if (numOfStars > 1) {
						score.innerHTML = numOfStars + " Stars!";
					} else {
						score.innerHTML = numOfStars + " Star!";
					}
					timerStop();
					let finalTime = document.getElementById("span-timer");
					finalTime.innerText = `${minutes}:${seconds}`;
					showMessage();
				}
			}
		}, 1000);
	}
}

//updates the amount of moves in the html file
function amountOfMoves() {
	let move = document.querySelector(".moves");
	move.innerText = numOfMoves;
}

//update the amount of stars in the html file
function amountOfStars() {
	//update the number of stars
	let stars = document.querySelector(".stars");
	//resets the number of stars in the html file
	stars.innerHTML = "";

	if (numOfMoves <= 13) {
		//if the player finishes the game in 8 moves the player gets 3 stars
		numOfStars = 3;
	} else if (numOfMoves >= 13 && numOfMoves <= 20) {
		//if the payer finishes the game in less the 13 moves the player gets 2 stars
		numOfStars = 2;
	} else {
		//if the player finishes the game in more that 13 moves the player gets 1 star
		numOfStars = 1;
	}
	//sets the number of stars using a for-loop to add a list item for each star
	for (let i = 0; i < numOfStars; i++) {
		let star = "<li><i class = 'fa fa-star'></i></li>";
		stars.innerHTML += star;
	}
}

//Shuffling the cards using the provided shuffle function
function cardsShuffling() {
	cardTypes = shuffle(cardTypes);

	//re-assign the cards to the html code
	let i = 0;
	allCards.forEach(card => {
		let cardClass = card.children[0];
		cardClass.className = cardTypes[i];
		i++;
	});

}


//function to flip the cards over
function flippingTheCards() {
	allCards.forEach(card => {
		card.classList.remove("open", "show", "match");
	});
}

//closes the message box at the end of the game
function closeMessage() {
	document.getElementById("message-box").close();
}

//opens the message box
function showMessage() {
	let message = document.getElementById("message-box");
	message.showModal();
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}
