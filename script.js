const GameBoard = (function(){

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


const Player = function(marker, name = 'player1'){
    this.name = name;
    this.marker = marker;

    const board = GameBoard.getBoard();

    Player.prototype.getPlayerMove = function(){
        let boardPosition = Number(prompt('YOUR TURN. PICK A POSITION'));

        if(board[boardPosition] === ''){
            console.log(`SUCCESS: ${boardPosition}`);
            return boardPosition;
        }else{
            return getPlayerMove();
        }
    }
}

const GameFlow = (function(){

    const board = GameBoard.getBoard();
    let playerMark;
    let computerMark;
    let activeMarker;
    let isWinner = false;

    function getPlayerMark(){
        const mark = prompt('CHOOSE A MARK: X OR O').toUpperCase();

        if(mark === 'X' || mark === 'O'){
            playerMark = mark;
            getComputerMark();

            //const player = new Player(mark);

            console.log(`THE PLAYER IS ${playerMark}`);
            console.log(`THE COMPUTER IS ${computerMark}`);
        }else{
            console.log('PLEASE CHOOSE EITHER X OR O');
            getPlayerMark();
        }
    }

    function getComputerMark(){
        computerMark = playerMark == 'X' ? 'O' : 'X';
    }

    function getPlayerPlay(){
        let boardPosition = Number(prompt('YOUR TURN. PICK A POSITION'));

        if(board[boardPosition] === ''){
            console.log(`SUCCESS: ${boardPosition}`);
            return boardPosition;
        }else{
            return getPlayerPlay();
        }
    }

    function getComputerPlay(){
        let availablePositions = [];

        board.forEach((element, index) => {
            if(element === ''){
                availablePositions.push(index);
            }
        });

        const getRandomPositionIndex = () => Math.floor(Math.random() * availablePositions.length);

        return availablePositions[getRandomPositionIndex()];
    }

    function playXFirst(){
        if(playerMark == 'X'){
            GameBoard.addMark(playerMark, getPlayerPlay());
            activeMarker = playerMark;
        }else{
            GameBoard.addMark(computerMark, getComputerPlay());
            activeMarker = computerMark;
        }
    }

    function checkForEmptySpaces(positionValue){
        return positionValue !== '';
    }

    function playGame(){

        while(!(board.every(checkForEmptySpaces)) && isWinner == false){
            let currentMove;
            switchPlayer();

            if(activeMarker == playerMark){
                currentMove = getPlayerPlay();
                GameBoard.addMark(playerMark, currentMove);
            }else{
                currentMove = getComputerPlay();
                GameBoard.addMark(computerMark, currentMove);
            }
            checkForWinner(currentMove);
        }
        
        if(isWinner == false){
            checkForTie();
        }
    }

    function switchPlayer(){
        activeMarker = activeMarker == playerMark ? computerMark : playerMark;
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
                console.log(`${activeMarker} WINS!`);
                GameBoard.resetBoard();
                console.log(board);
            }
        })
    }

    function checkForTie(){
        if(board.every(checkForEmptySpaces)){
            console.log('IT\'S A TIE!');
            GameBoard.resetBoard();
            console.log(board);
        }
    }

    function startGame(){
        getPlayerMark();
        playXFirst();
        playGame();
    }

    startGame();
})();



