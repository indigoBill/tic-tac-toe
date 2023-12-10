const gameBoardLayout = (function(){
    const gameBoard = ['','','','','','','','',''];

    function resetGame(){
        gameBoard.fill('', 0);
    }

    function addPlayToGameBoard(gameBoardPosition, playerMark){
        gameBoard.splice(gameBoardPosition, 1, playerMark);
    }

    function getGameBoard(){
        return gameBoard;
    }

    return {addPlayToGameBoard, getGameBoard, resetGame};
})();


const gamePlayer = function(name, playerMark){
    const currentGameBoard = gameBoardLayout.getGameBoard();

    function playGame(gameBoardPosition){
        const isIndexValid = gameBoardPosition >= 0 && gameBoardPosition <= 8;
        const isPositionEmpty = currentGameBoard[gameBoardPosition] === '';

        if(isIndexValid && isPositionEmpty){
            gameBoardLayout.addPlayToGameBoard(gameBoardPosition, playerMark);
            gameFlow.checkForWinner(gameBoardPosition, playerMark, name);
        }else{
            console.log('CHOOSE ANOTHER POSITION');
        }
    }

    return {name, playerMark, playGame};
}

const gameFlow = (function(){
    const currentGameBoard = gameBoardLayout.getGameBoard();
    
    function displayPlayerTurn(playerName){
        console.log(`IT'S ${playerName}'S TURN.`);
    }

    function checkForWinner(gameBoardPosition, playerMark, playerName){
        console.log(currentGameBoard);

        const possibleWaysToWin = [[0, 1, 2],[3, 4, 5],[6, 7, 8],[0, 3, 6],[1, 4, 7],[2, 5, 8],[2, 4, 6],[0, 4, 8]];
        const filteredWaysToWin = possibleWaysToWin.filter((subArray) => subArray.includes(gameBoardPosition));

        function checkEquality(element){
            return currentGameBoard[element] === playerMark;
        }

        filteredWaysToWin.forEach((array) => {
            if(array.every((checkEquality))){
                console.log(`${playerName} IS THE WINNER!`);

                gameBoardLayout.resetGame();
                console.log(currentGameBoard);
            }
        })
    }
    
    return {displayPlayerTurn, checkForWinner};
})();


const player1 = gamePlayer('player1', 'X');
const player2 = gamePlayer('player2', 'O');

player1.playGame(2);
player1.playGame(0);
player1.playGame(1);


