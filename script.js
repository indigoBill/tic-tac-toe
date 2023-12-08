const gameBoardLayout = (function(){
    const gameBoard = ['','','','','','','','',''];

    const resetGame = () => gameboard.splice(0, gameboard.length);

    const addPlayToGameBoard = (gameBoardPosition, playerMark) => {
    
        gameBoard.splice(gameBoardPosition, 1, playerMark);
        console.table(gameBoard);
        //gameFlow.displayPlayerTurn();
    }

    const getGameBoard = () => gameBoard;

    return {addPlayToGameBoard, getGameBoard};
})();


const gamePlayer = function(name, playerMark){

    function playGame(gameBoardPosition){
        const currentGameBoard = gameBoardLayout.getGameBoard();

        const isIndexValid = gameBoardPosition >= 0 && gameBoardPosition <= 8;
        const isPositionEmpty = currentGameBoard[gameBoardPosition] === '';

        if(isIndexValid && isPositionEmpty){
            gameBoardLayout.addPlayToGameBoard(gameBoardPosition, playerMark);
        }else{
            console.log('CHOOSE ANOTHER POSITION');
        }
    }

    return {name, playerMark, playGame};
}

const player1 = gamePlayer('player1', 'X');
const player2 = gamePlayer('player2', 'O');

player1.playGame(2);
player2.playGame(3);


const gameFlow = (function(){

    const currentGameBoard = gameBoardLayout.getGameBoard();

    const displayPlayerTurn = (playerName) => {
        console.log(`IT'S ${playerName}'S TURN.`);
    }
    
    return {displayPlayerTurn};
})();

