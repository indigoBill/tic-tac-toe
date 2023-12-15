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
        console.log(getBoard());
        
    }

    return {getBoard, resetBoard, addMark};
})();

const createPlayer = function(name = 'Player'){
    let marker;

    const board = gameBoard.getBoard();

    function getName(){
        return name;
    }

    function setName(newName){
        name = newName;
    }

    function setMarker(playerMarker){
        marker = playerMarker;
    }

    function getMarker(){
        return marker;
    }

    function getPlayerMove(){
        const gameSquares = document.querySelectorAll('.game-square');
        gameSquares.forEach((square) => square.addEventListener('click', displayGame.updateBoardPlayer));
    }

    return {getName, setName, getMarker, setMarker, getPlayerMove};
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

    function getComputerMove(){
        let availablePositions = [];

        board.forEach((element, index) => {
            if(element === ''){
                availablePositions.push(index);
            }
        });

        const getRandomPositionIndex = () => Math.floor(Math.random() * availablePositions.length);

        let squareIndex = availablePositions[getRandomPositionIndex()];

        gameBoard.addMark(gameFlow.getActiveMarker(), squareIndex);
        displayGame.displayMoves();
        gameFlow.checkForWinner(squareIndex);
        gameFlow.switchPlayer();
        gameFlow.playGame();
    }

    return {getName, getMarker, setMarker, getComputerMove};
}

const displayGame = (function(){
    const board = gameBoard.getBoard();

    function displayMoves(){
        for(let i = 0; i < board.length; i++){
            const uiSquare = document.querySelector(`.index-${i}`);

            uiSquare.textContent = board[i];
        }
    }
    
    function updateBoardPlayer(event){
        const square = event.target;
        const squareClassName = event.target.className;
        const squareIndex = Number(squareClassName.charAt(squareClassName.length - 1));
        
        if(square.textContent == ''){
            square.textContent = gameFlow.getActiveMarker();
            gameBoard.addMark(gameFlow.getActiveMarker(), squareIndex);

            gameFlow.checkForWinner(squareIndex);
            gameFlow.switchPlayer();
            gameFlow.playGame();
        }else{
            console.log('NOPE.CHOOSE ANOTHER SPOT');
        }
    }
/*
    function updateBoardComputer(computerMove){
        const boardSquares = document.querySelectorAll('.game-square');
        boardSquares.forEach((square) => {
            let selectedClass = square.className;
            let squareIndex = selectedClass.charAt(selectedClass.length - 1)

            if(computerMove = squareIndex){
                square.textContent = gameFlow.getActiveMarker();
            }
        });
    }
*/
    return {displayMoves, updateBoardPlayer};

})();

const gameFlow = (function(){
    let player1;
    let player2;
    let activePlayer;
    let activeMarker;
    let isWinner = false;
    
    const board = gameBoard.getBoard();

    function getActiveMarker(){
        return activeMarker;
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
            console.log('PLAYERS CREATED');
            assignFirstMarker();
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

            console.log(`${player1.getName()} : ${player1.getMarker()}`);
            console.log(`${player2.getName()} : ${player2.getMarker()}`);

            playXFirst();
        }
    }

    function assignSecondMarker(){
        const mark = player1.getMarker() === 'X' ? 'O' : 'X';
        player2.setMarker(mark);
    }

    function playXFirst(){
        if(player1.getMarker() === 'X'){
            activePlayer = player1.getName();
            activeMarker = player1.getMarker();
            
            player1.getPlayerMove();
        } else{
            activePlayer = player2.getName();
            activeMarker = player2.getMarker();

            if(player2.hasOwnProperty('getComputerMove')){
                player2.getComputerMove();
            }else{
                player2.getPlayerMove();
            }
        }
    }

    function switchPlayer(){
        activePlayer = activePlayer == player1.getName() ? player2.getName() : player1.getName();
        activeMarker = activeMarker == player1.getMarker() ? player2.getMarker() : player1.getMarker();
    }

    function checkForEmptySpaces(positionValue){
        return positionValue !== '';
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
                console.log(`${activePlayer} WINS!`);
                /*
                gameBoard.resetBoard();
                console.log(board);
                */
            }
        })
    }

    function checkForTie(){
        if(board.every(checkForEmptySpaces)){
            console.log('IT\'S A TIE!');
            /*
            gameBoard.resetBoard();
            console.log(board);
            */
        }
    }

    function playGame(){

        if(isWinner == false){
            checkForTie();
        }

        if(activePlayer === player1.getName()){
            player1.getPlayerMove();
        }else{
            if(player2.hasOwnProperty('getComputerMove')){
                player2.getComputerMove();
            }else{
                player2.getPlayerMove();
            }
        }
    
    }

    

    chooseOpponent();

    return {getActiveMarker, switchPlayer, playGame, checkForWinner};    
})();





