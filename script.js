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

(function gameFlow(){

    const board = gameBoard.getBoard();
    let playerMark;
    let computerMark;
    let activeMarker;

    function getPlayerMark(){
        const mark = prompt('CHOOSE A MARK: X OR O').toUpperCase();

        if(mark == 'X' || mark == 'O'){
            playerMark = mark;
            getComputerMark();
            console.log(`THE PLAYER IS ${playerMark}`);
            console.log(`THE COMPUTER IS ${computerMark}`);
        }else{
            console.log('PLEASE CHOOSE EITHER X OR O');
        }
    }

    function getComputerMark(){
        computerMark = playerMark == 'X' ? 'O' : 'X';
    }

    function getComputerPlay(){
        let availablePositions = [];

        board.forEach((element, index) => {
            if(element == ''){
                availablePositions.push(index);
            }
        });

        const getRandomPositionIndex = () => Math.floor(Math.random() * availablePositions.length);

        return availablePositions[getRandomPositionIndex()];
    }

    function initMove(){
        if(playerMark == 'X'){
            let position = Number(prompt('PLACE YOUR 1ST MARK'));
            
            if(position >= 0 || position <= 8){
                gameBoard.addMark(playerMark, position);
                activeMarker = playerMark;
            }
            
        }else{
            gameBoard.addMark(computerMark, getComputerPlay());
            activeMarker = computerMark;
        }
    }

    function playMove(){
        
        switchPlayer();


        
        
    }

    function switchPlayer(){
        activeMarker = activeMarker == playerMark ? computerMark : playerMark;
    }

    function checkForWinner(){
        const possibleWins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[2,4,6],[0,4,8]];
    }

    function checkForTie(){

    }

    function startGame(){
        getPlayerMark();
        initMove();
        playMove();
    }

    startGame();
    

})();



