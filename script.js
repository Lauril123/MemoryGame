// Event listener that makes sure the DOM content has been loaded. The javascript code will only start when the HTML is ready.
document.addEventListener('DOMContentLoaded', () => {

    // Defines an immutable object of the different difficulty levels. Object.freeze makes sure that properties cant be changed. 
    const difficultyLevel = Object.freeze({
        simple: 0, 
        medium: 1,
        hard: 3,
    })

    /**
     * Creates AlphabetArray with different difficulty levels.
     * This function slices a predefined list of emojis and duplicates them to create matching sets.
     * 
     * @param {difficultyLevel} difficulty 
     * @returns {Array}
     */
    function createAlphabetArray (difficulty) {

        // List of letters (the alphabet)
        const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Æ', 'Ø', 'Å'];
        switch (difficulty) {
            case difficultyLevel.simple:
                const alpabethCardsSimple = alphabet.slice(0,6) 
                return [...alpabethCardsSimple, ...alpabethCardsSimple] // Duplicates the array, returns 6 + 6 = 12 cards
            case difficultyLevel.medium:
                const alpabethCardsMedium = alphabet.slice(0,8)
                return [...alpabethCardsMedium, ...alpabethCardsMedium]
            case difficultyLevel.hard:
                const alpabethCardsHard = alphabet.slice(0,10)
                return [...alpabethCardsHard, ...alpabethCardsHard]
        }  
    }

    /**
     * Creates EmojiArray with different difficulty levels. 
     * This function slices a predefined list of letters and duplicates them to create matching sets.
     * 
     * @param {difficultyLevel} difficulty 
     * @returns {Array}
     */
    function createEmojisArray (difficulty) {
        
        //List of emojis
        const emojis = ['😀', '❤️', '😈', '👻', '👽', '👨🏼‍🚀', '🚴🏿‍♀️', '🐒', '⚽️', '🎱', '🍒', '🌙'];
        switch (difficulty) {
            case difficultyLevel.simple:
                const emojiCardsSimple = emojis.slice(0,6)
                return [...emojiCardsSimple, ...emojiCardsSimple] 
            case difficultyLevel.medium:
                const emojiCardsMedium = emojis.slice(0,8) 
                return [...emojiCardsMedium, ...emojiCardsMedium] // Duplicates the array, returns 8 + 8 = 16 cards
            case difficultyLevel.hard:
                const emojiCardsHard = emojis.slice(0,10)
                return [...emojiCardsHard, ...emojiCardsHard]
        }  
    }

    // Selectors for all the DOM elements in index.html
    const gameBoard = document.querySelector('.game-board');
    const startButtonSimple = document.getElementById('start-button-simple')
    const startButtonMedium = document.getElementById('start-button-medium')
    const startButtonHard = document.getElementById('start-button-hard')
    const restartButton = document.getElementById('restartButton');
    const backToMenuButton = document.getElementById('backToMenuButton');
    const gameContainer = document.querySelector('.game-container');
    const flipContainer = document.querySelector ('.flip-container');
    const moveCountElement = document.getElementById('move-count')
    

    // Initialize the current game level
    let currentLevel = undefined;

    // Initiates empty arrays to be used in the game. 
    let cardsChosen = [];
    let cardsChosenId = [];
    let cardsMatched = [];
    let moveCount = 0;


    /**  function for creating the board.
    *    Checks for alphabet or emojis, then, creates CardArray based on difficultyLevel.
    *    Shuffle cards and dynamically generates HTML, adding event listeners for interactions.
    */
    function createBoard() {
        let cardArray = [];
        const selectedCardType = document.querySelector('input[name="card-type"]:checked');
        
        if (selectedCardType.value === 'alphabet') {
            cardArray = createAlphabetArray(currentLevel);
        } else {
            cardArray = createEmojisArray(currentLevel);
        }
        // Clears the game board
        gameBoard.innerHTML = ''; 
        // Shuffle cards
        cardArray.sort(() => 0.5 - Math.random()); 
        // For each loop to iterate over every card in cardArray, and creates a div element for each card.
        cardArray.forEach((card, index) => {  
            const cardElement = document.createElement('div');
            // CSS class card is added for styling
            cardElement.setAttribute('class', 'card'); 
            // Data ID for identifying the card
            cardElement.setAttribute('data-id', index); 
            cardElement.setAttribute('tabindex', index);
            cardElement.addEventListener('click', () => flipCard(cardArray, cardElement));
            cardElement.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    flipCard(cardArray, cardElement)
                }
            });
            gameBoard.appendChild(cardElement);
        });
    }

    /**
     * Handles flipping of the cards in the game.
     * When clicking a card, it reveals either a letter or emoji, and prevents the same card being chosen twice. 
     * If two cards are selected, the code initiates a check for match.
     * 
     * @param {Array} cardArray 
     * @param {HTMLElement} cardElement 
     */
    function flipCard(cardArray, cardElement) {
        // Get card ID from data-id attribute and converts to integer.
        let cardId = parseInt(cardElement.getAttribute('data-id'));

        // Checks if the card has been chosen and ensures that less than two cards are selected. 
        if (!cardsChosenId.includes(cardId) && cardsChosenId.length < 2) {

            // Reveals card content by setting inner text based on the cards ID in cardArray.
            cardElement.innerText = cardArray[cardId];
            // Add flipped css class for changing the appearance of the card.
            cardElement.classList.add('flipped');

            // Adds the chosen cards content and its ID to arrays.
            cardsChosen.push(cardArray[cardId]);
            cardsChosenId.push(cardId);
        }
        
        // Check for match if two cards are picked.
        if (cardsChosen.length === 2) {
            setTimeout(() => checkForMatch(cardArray), 500);
        }
    }

    /**
     * Checks if two selected cards are a match.
     * If two cards are a match, they will be marked with 'matched'. If not, the cards will be flipped back. 
     * The function also checks if all cards have been match.
     * 
     * @param {Array} cardArray 
     */
    function checkForMatch(cardArray) {

        // Get all card elements
        const cards = document.querySelectorAll('.card');

        if (cardsChosenId.length !== 2) {
            return;
        }

        // Destructure the first and second cards IDs for the cardsChosenId array.
        const [firstCardId, secondCardId] = cardsChosenId;

        // Get the card elements based on their ID.
        const firstCard = cards[firstCardId];
        const secondCard = cards[secondCardId];

        // Check if the content of the two chosen card is a match. 
        if (cardsChosen[0] === cardsChosen[1]) {
            
        // If they are a match, they are added to matched cards Array, will be visual.
            cardsMatched.push(...cardsChosen);
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
        } else {
        // If they dont match, they are reset and the flipped class is removed. 
            firstCard.innerText = '';
            secondCard.innerText = '';
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
        }

        // Clear the arrays before matching two new cards.
        cardsChosen.length = 0;
        cardsChosenId.length = 0;

        // Increment move counter
        updateMoveCount();

        // Check if all cards have been matched. If the length of the cardsMatched is equal to the length of cardArray. 
        if (cardsMatched.length === cardArray.length) {
            if (cardsMatched.length === cardArray.length) {
                setTimeout(() => {
                    alert(`Gratulerer! Du klarte å matche alle kortene! Du brukte ${moveCount} trekk.`);
                }, 500);
            }
    }   }

        /**
     * Starts a new game based on the difficultyLevel.
     * Sets the currentLevel, flips the container to display the game and calls createBoard, to create a new game.
     * 
     * @param {string} level 
     */
        const startGame = (level) => {
            currentLevel = level;
            flipContainer.classList.add('flipped');
            gameContainer.style.display = 'flex';
            createBoard();
        }

    /**
     * Resets the game state by clearing matched and chosen cards + IDs.
     * Reset moveCount to 0.
     * Resets and shuffles board by calling createBoard()
     */
    function resetGame() {
        cardsMatched.length = 0;
        cardsChosen.length = 0;
        cardsChosenId.length = 0;
        moveCount = 0;
        moveCountElement.innerText = moveCount;
        localStorage.removeItem('moveCount');
        createBoard(); // Reset and shuffle the cards
    }

    /**
     * Returns to menu by hiding the game board, by flipping the flipContainer (removing the 'flipped' class).
     * Resets the game.
     */

    const goToMenu = () => {
        flipContainer.classList.remove('flipped');
        resetGame();
    }

    /**
     * Increments the movecounter and updates the displayed movecounter.
     * Stores the updated movecount in local storage.
     */
    function updateMoveCount () {
        moveCount++;
        moveCountElement.innerText = moveCount;
        localStorage.setItem('moveCount', moveCount);
    }

    /**
     * Initalizes the movecounter when the game is started or reset. 
     * Retrieves movecount from local storage.
     * If no value is stored, the moveCount is set to 0.
     */
    function initializeMoveCount() {
        const storedMoveCount = localStorage.getItem('moveCount')
        if (storedMoveCount) {
            moveCount = parseInt (storedMoveCount, 10);
            moveCountElement.innerText = moveCount;
        } else {
            moveCount = 0;
            moveCountElement.innerText = moveCount;
        }
    }

    // Event listeners for buttons
    startButtonSimple.addEventListener('click', () => startGame(difficultyLevel.simple));
    startButtonMedium.addEventListener('click', () => startGame(difficultyLevel.medium));
    startButtonHard.addEventListener('click', () => startGame(difficultyLevel.hard));
    restartButton.addEventListener('click', resetGame);
    backToMenuButton.addEventListener('click', goToMenu);

    initializeMoveCount();
});

