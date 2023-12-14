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

        /*
        let boardPosition = Number(prompt(`${name}: YOUR TURN. PICK A POSITION`));

        

        if(board[boardPosition] === ''){
            console.log(`SUCCESS: ${boardPosition}`);
            return boardPosition;
        }else{
            return getPlayerMove();
        }
        */
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

        return availablePositions[getRandomPositionIndex()];
    }

    return {getName, getMarker, setMarker, getComputerMove};
}

const displayGame = (function(){
    const board = gameBoard.getBoard();
    const body = document.querySelector('body');

    //RENDER CONTENTS OF ARRAY TO UI
    function displayMoves(){
        for(let i = 0; i < board.length; i++){
            const uiSquare = document.querySelector(`.index-${i}`);

            uiSquare.textContent = board[i];
        }
    }

    function updateBoardPlayer(event){
        const square = event.target;
        const squareClassName = event.target.className;
        const squareIndex = squareClassName.charAt(squareClassName.length - 1);
        
        if(square.textContent == ''){
            square.textContent = gameFlow.getActiveMarker();
            gameBoard.addMark(gameFlow.getActiveMarker(), squareIndex);
            console.log(board);
        }else{
            console.log('NOPE.CHOOSE ANOTHER SPOT');
        }
    }

    function updateBoardComputer(){
        //CREATE A FUNCTION THAT WILL DISPLAY THE COMPUTERS PLAY ON THE UI
    }

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
        const opponent = prompt('TYPE \'C\' TO PLAY AGAINST THE COMPUTER OR \'P\' TO PLAY AGAINST ANOTHER PLAYER').toUpperCase();

        if(opponent === 'C'){
            player1 = createPlayer();
            player2 = createComputer();
        }else if(opponent === 'P'){
            player1 = createPlayer('Player 1');
            player2 = createPlayer('Player 2');
        }else{
            console.log('ENTER VALID VALUE');
            chooseOpponent();
        }   
    }

    function assignFirstMarker(){
        const mark = prompt('CHOOSE A MARK: X OR O').toUpperCase();

        if(mark === 'X' || mark === 'O'){
            player1.setMarker(mark);
            assignSecondMarker();

            console.log(`${player1.getName()} : ${player1.getMarker()}`);
            console.log(`${player2.getName()} : ${player2.getMarker()}`);
        }else{
            console.log('PLEASE CHOOSE EITHER X OR O');
            assignFirstMarker();
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
                gameBoard.addMark(player2.getMarker(), player2.getComputerMove());
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

        while(!(board.every(checkForEmptySpaces)) && isWinner == false){
            let currentMove;
            switchPlayer();

            if(activePlayer == player1.getName()){
                currentMove = player1.getPlayerMove();
                //gameBoard.addMark(player1.getMarker(), currentMove);
            }else{
                if(player2.hasOwnProperty('getComputerMove')){
                    currentMove = player2.getComputerMove();
                    //gameBoard.addMark(player2.getMarker(), currentMove);
                }else{
                    currentMove = player2.getPlayerMove();
                    //gameBoard.addMark(player2.getMarker(), currentMove);
                }
            }
            checkForWinner(currentMove);
        }
        
        if(isWinner == false){
            checkForTie();
        }
    }

    function startGame(){
        chooseOpponent();
        assignFirstMarker();
        playXFirst();
        //playGame();
        displayGame.displayMoves();
    }

    startGame();

    return {getActiveMarker};    
})();





