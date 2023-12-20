const gameBoard = (function(){

    const board = ['','','','','','','','',''];

    function getBoard(){
        return board;
    }

    function resetBoard(){
        board.fill('');
    }

    function addMark(mark, boardIndex){
        board.splice(boardIndex, 1, mark);
    }

    return {getBoard, resetBoard, addMark};
})();

const createPlayer = function(name = 'Player'){
    let marker;

    function getName(){
        return name;
    }

    function setMarker(playerMarker){
        marker = playerMarker;
    }

    function getMarker(){
        return marker;
    }

    function addPlayerMove(){
        const gameSquares = document.querySelectorAll('.game-square');

        function updateBoard(event){
            const square = event.target;
            const squareClassName = event.target.className;
            const squareIndex = Number(squareClassName.charAt(squareClassName.length - 1));
            
            if(square.textContent == '' && !(gameFlow.getGameStatus())){
                gameBoard.addMark(gameFlow.getActiveMarker(), squareIndex);
                displayUi.displayMoves();
    
                gameFlow.checkForWinner(squareIndex);
                gameFlow.playRound();
            }

            gameSquares.forEach((square) => square.removeEventListener('click', updateBoard));
        }

        gameSquares.forEach((square) => square.addEventListener('click', updateBoard));
        

    }

    return {getName, getMarker, setMarker, addPlayerMove};
}

const createComputer = function(name = 'Computer'){
    let marker;

    const board = gameBoard.getBoard();

    function getName(){
        return name;
    }

    function setMarker(computerMarker){
        marker = computerMarker;
    }

    function getMarker(){
        return marker;
    }

    function addComputerMove(){
        let availablePositions = [];

        board.forEach((element, index) => {
            if(element === ''){
                availablePositions.push(index);
            }
        });

        const getRandomAvailablePositionIndex = () => Math.floor(Math.random() * availablePositions.length);

        let squareIndex = availablePositions[getRandomAvailablePositionIndex()];
        
        if(!(gameFlow.getGameStatus())){
            gameBoard.addMark(gameFlow.getActiveMarker(), squareIndex);
            displayUi.displayMoves();

            gameFlow.checkForWinner(squareIndex);
            gameFlow.playRound();
        };
    }

    return {getName, getMarker, setMarker, addComputerMove};
}

const displayUi = (function(){
    const board = gameBoard.getBoard();
    const opponentModal = document.querySelector('.opponent-modal-content');
    const markerModal = document.querySelector('.marker-modal-content');
    const gameOverModal = document.querySelector('.game-over-modal-content');

    function displayMoves(){
        for(let i = 0; i < board.length; i++){
            const uiSquare = document.querySelector(`.index-${i}`);

            uiSquare.textContent = board[i];
        }
    }

    function displayOpponentModal(){
        function showModal(){
            opponentModal.classList.add('show-modal-animation');
            opponentModal.classList.remove('hide-modal-animation');
        }

        window.addEventListener('load', showModal);

        const playAgainBtn = document.querySelector('.play-again-btn');
        playAgainBtn.addEventListener('click', () => {
            showModal();
            hideGameOverModal();
            gameFlow.restartGame();
        });
    }

    function hideOpponentModal(){
        opponentModal.classList.remove('show-modal-animation');
        opponentModal.classList.add('hide-modal-animation');
    }

    function displayMarkerModal(){
        markerModal.classList.add('show-modal-animation');
        markerModal.classList.remove('hide-modal-animation');
    }

    function hideMarkerModal(){
        markerModal.classList.remove('show-modal-animation');
        markerModal.classList.add('hide-modal-animation');
    }

    function toggleModalBackground(){
        const background = document.querySelector('.modal-background');
        background.classList.toggle('hide-modal-background');
    }

    function displayGameOverModal(){
        gameOverModal.classList.add('show-modal-animation');
        gameOverModal.classList.remove('hide-modal-animation');
    }

    function hideGameOverModal(){
        gameOverModal.classList.remove('show-modal-animation');
        gameOverModal.classList.add('hide-modal-animation');
    }
    
    displayOpponentModal();

    return {displayMoves, hideOpponentModal, displayMarkerModal, hideMarkerModal, displayGameOverModal, toggleModalBackground};

})();

const gameFlow = (function(){
    let player1;
    let player2;
    let activePlayer;
    let activeMarker;
    let isWinner = false;
    let gameOver = false;
    
    const board = gameBoard.getBoard();

    function getActiveMarker(){
        return activeMarker;
    }

    function getGameStatus(){
        return gameOver;
    }

    function assignSecondMarker(){
        const mark = player1.getMarker() === 'X' ? 'O' : 'X';
        player2.setMarker(mark);
    }

    function playXFirst(){
        if(player1.getMarker() === 'X'){
            activePlayer = player1.getName();
            activeMarker = player1.getMarker();
            
            player1.addPlayerMove();
        } else{
            activePlayer = player2.getName();
            activeMarker = player2.getMarker();

            if(player2.hasOwnProperty('addComputerMove')){
                setTimeout(() => {
                    player2.addComputerMove();
                }, 500);
            }else{
                
                player2.addPlayerMove();
            }
        }
    }

    function assignFirstMarker(){
        const markerButtons = document.querySelectorAll('.marker');
        markerButtons.forEach((markerButton) => markerButton.addEventListener('click', selectMarkers));

        function selectMarkers(event){
            if(event.target.textContent === 'X'){
                player1.setMarker('X');
            }else{
                player1.setMarker('O');
            }
            
            assignSecondMarker();
            displayUi.hideMarkerModal();
            displayUi.toggleModalBackground();

            playXFirst();

            markerButtons.forEach((markerButton) => markerButton.removeEventListener('click', selectMarkers));
        }
    }

    function chooseOpponent(){
        const opponentsButtons = document.querySelectorAll('.opponent');
        opponentsButtons.forEach((opponentButton) => opponentButton.addEventListener('click', createPlayers));

        function createPlayers(event){
            if(event.target.textContent === 'COMPUTER'){
                player1 = createPlayer();
                player2 = createComputer();
            }else{
                player1 = createPlayer('Player 1');
                player2 = createPlayer('Player 2');
            }
            assignFirstMarker();
            displayUi.hideOpponentModal();
            displayUi.displayMarkerModal();
        }
    }

    function switchPlayer(){
        activePlayer = activePlayer == player1.getName() ? player2.getName() : player1.getName();
        activeMarker = activeMarker == player1.getMarker() ? player2.getMarker() : player1.getMarker();
    }

    function checkForWinner(currentPlayerMove){
   
        const possibleWins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[2,4,6],[0,4,8]];

        const filteredPossibleWins = possibleWins.filter((subArray) => subArray.includes(currentPlayerMove));
        
        function checkForMarker(position){
            return board[position] === activeMarker;
        }
        
        filteredPossibleWins.forEach((array) => {
            if(array.every(checkForMarker)){
                isWinner = true;
                gameOver = true;
                
                const results = document.querySelector('.results');
                results.textContent = `${activePlayer} (${activeMarker}) WINS!`;
                displayUi.toggleModalBackground();
                displayUi.displayGameOverModal();
            }
        });
    }

    function checkForTie(){
        function checkForEmptySpaces(positionValue){
            return positionValue !== '';
        }    

        if(board.every(checkForEmptySpaces)){
            gameOver = true;

            const results = document.querySelector('.results');
            results.textContent = 'IT\'S A TIE!';
            displayUi.toggleModalBackground();
            displayUi.displayGameOverModal();
        }
    }

    function restartGame(){
        gameBoard.resetBoard();
        isWinner = false;
        gameOver = false;
        displayUi.displayMoves();
    }

    function playRound(){
        if(isWinner == false){
            checkForTie();
        }
        
        switchPlayer();

        if(gameOver == false){

            if(activePlayer === player1.getName()){
                player1.addPlayerMove();
            }else{
                if(player2.hasOwnProperty('addComputerMove')){
                    player2.addComputerMove();
                }else{
                    player2.addPlayerMove();
                }
            }
        }
    }

    chooseOpponent();

    return {getActiveMarker, getGameStatus, playRound, checkForWinner, restartGame};    
})();





