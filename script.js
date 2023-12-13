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


const Player = function(name = 'Player'){
    let marker;

    const board = GameBoard.getBoard();

    const getName = function(){
        return name;
    }

    const setMarker = function(playerMarker){
        marker = playerMarker;
    }

    const getMarker = function(){
        return marker;
    }

    const getPlayerMove = function(){
        let boardPosition = Number(prompt('YOUR TURN. PICK A POSITION'));

        if(board[boardPosition] === ''){
            console.log(`SUCCESS: ${boardPosition}`);
            return boardPosition;
        }else{
            return getPlayerMove();
        }
    }

    return {getName, setMarker, getMarker, getPlayerMove};
}

const Computer = function(name = 'Computer'){
    let marker;

    const board = GameBoard.getBoard();

    const getName = function(){
        return name;
    }

    const setMarker = function(computerMarker){
        marker = computerMarker;
    }

    const getMarker = function(){
        return marker;
    }

    const getComputerMove = function(){
        let availablePositions = [];

        board.forEach((element, index) => {
            if(element === ''){
                availablePositions.push(index);
            }
        });

        const getRandomPositionIndex = () => Math.floor(Math.random() * availablePositions.length);

        return availablePositions[getRandomPositionIndex()];
    }

    return {getName, setMarker, getMarker, getComputerMove};
}

const GameFlow = (function(){

    const board = GameBoard.getBoard();
    let playerMark;
    let computerMark;
    let activeMarker;
    let isWinner = false;

    let activePlayer;

    const player = new Player();
    const computer = new Computer();

    function assignPlayerMarker(){
        const mark = prompt('CHOOSE A MARK: X OR O').toUpperCase();

        if(mark === 'X' || mark === 'O'){
            player.setMarker(mark);
            assignComputerMarker();

            console.log(`${player.getName()} : ${player.getMarker()}`);
            console.log(`${computer.getName()} : ${computer.getMarker()}`);
          
        }else{
            console.log('PLEASE CHOOSE EITHER X OR O');
            assignPlayerMarker();
        }
    }

    function assignComputerMarker(){
        const mark = player.getMarker() === 'X' ? 'O' : 'X';
        computer.setMarker(mark);
    }

    function playXFirst(){
        if(player.getMarker() === 'X'){
            GameBoard.addMark(player.getMarker(), player.getPlayerMove());
            activePlayer = player.getName();
        } else{
            GameBoard.addMark(computer.getMarker(), computer.getComputerMove());
            activePlayer = computer.getName();
        }
    }

    //FUNCTIONS ABOVE ALREADY EDITTED
    //CHECK FUNCTIONS BELOW

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
        assignPlayerMarker();
        playXFirst();
        playGame();
    }

    startGame();
})();



