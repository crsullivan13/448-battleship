/**
 * THIS IS ALL JUST BRAINSTORMING!! FEEL FREE TO REJECT OR IMPROVE ON THE IDEAS
 */

class Gameboard {
    m_testBoard = new Array(10);
    constructor (numShips) {
        this.m_numOfShips = numShips;
        let arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']; 

        for (let i = 0; i < 10; i++){
            this.m_testBoard[i] = new Array(11);
        }

        for (let i = 0; i < 10; i++){
            for (let j = 0; j < 11; j++){
                if(j != 0){
                    this.m_testBoard[i][j] = 'NA';
                } else {
                    this.m_testBoard[i][j] = arr[i];
                }
            }
        }

        //console.log(this.m_testBoard); for testing
    }


    /**
     * @pre Gameboard must be created, must not overlap other ship and must be within board
     * @param coord starting coord of the ship
     * @param ship must pass in ship to be placed
     * @post returns true if ship placed, false if pre not met and prints error to console
     */
    placeShip(ship, coord, orientation) {
        let arr = coord.split(' ');
        let numCoord = Number(arr[1]);
        let counter = 0;

        if((9- numCoord - ship.getSize()) >= 0) {
            while(this.m_testBoard[counter][0] !== arr[0]){
                counter++;
            }

            for (let i = 0; i < ship.getSize(); i++){
                if(this.m_testBoard[counter][numCoord + i] === 'S'){
                    console.log("Invalid ship placement: Overlap")
                    return [false, null]
                }
            }

            for (let i = 0; i < ship.getSize(); i++){
                    this.m_testBoard[counter][numCoord + i] = 'S';
            }
        } else {
            console.log("Invalid ship placement: Off board");
            return [false, null];
        }
        return [true, coord];
    }

    /**
     * @pre Gameboard must have battleships set out
     * @param position coordinates the other playes will provide
     * @post returns true if the positon holds an 'S', false otherwise, if true, calls Ship's hit function
     */
    isAHit(coord) {
        let arr = coord.split(' ');
        let numCoord = Number(arr[1]);
        let counter = 0;
        while(this.m_testBoard[counter][0] !== arr[0]){
            counter++;
        }
        if (this.m_testBoard[counter][numCoord] == 'S') {            
            return true
        }
        else {
            return false
        }
    }

    /**
     * @pre Gamboard must be set up, and ships must be placed
     * @post Iterates through gameboard and if there are no more 'S', then it returns true, false otherwise
     */
    checkIfAllHit() {
        let lost = true
        for (let i = 0; i < 10; i++){
            for (let j = 0; j < 11; j++){
                if (this.m_testBoard[i][j] == 'S'){
                    lost = false
                }
            }
        }
        return lost
    }
}

class Ship{
    m_size;
    m_body = [];
    m_health;
    constructor(size) {
        this.m_size = size;
        this.m_health = size;
        for (let i = 0; i < this.m_size; i++){
            this.m_body[i] = 'O' //'O' means that there is no hit, 'X' means there is a hit
        }
    }

    /**
     * @pre m_size must have valid value
     * @post returns m_size
     */
    getSize() {
        return this.m_size;
    }

    /**
     * @pre gameboard must be set up
     * @post positions the ship on gameboard
     * @param startPos starting position of ship
     * @param endPos ending position of ship
     */
    setPosition(startPos) {
        let startArr = startPos.split(' ');
        //let endArr = endPos.split('');
        for (let i = 0; i < this.m_size; i++){
            this.m_body[i] = startArr[0] + (Number(startArr[1]) + i);
        }
        console.log(this.m_body);
    
    }

    /**
     * @pre m_body must be set up
     * @post replaces 'O' with 'X' in m_body n relation to position
     * @param marked position where m_body is to be hit
     */
    hit(marked) {
        let arr = marked.split(' ');
        
    }
}

class Player {
    constructor(numOfShips, name) {
        this.m_name = name;
        this.m_numShips = numOfShips;
        this.m_otherPlayerBoard = new Gameboard(m_numShips)
    }

    /**
     * @pre None
     * @post Sets the battleship of other player. Basically each player plays with their own boards, set up by the other. They just take turns
     */
    setBattleShips() {
        console.log("Welcome " + this.m_name + "! Let's have the other player set up their battleship!\n")

        let prevChoice = 'Z0'
        for (let i = 1; i <= this.m_numShips; i++) {
            for (let pos = 1; pos <= i; pos++) {
                //The prompting for a choice will change depending on how we decide to do it
                let choice = window.prompt("For ship #" + i + ", which fills " + i + " squares, what is the position for square #" + pos +": ")
                let valid = false
                while (valid === false) {
                    if (pos === 1){
                        /*
                        *calls Ship's or Gameboard's position function.
                        */
                    prevChoice = choice
                    valid = true
                    }
                    else {
                        //The following just seperates the letter and numbers in the choice i.e. B10 just becomes 10
                        let pre = prevChoice.split(prevChoice[0])
                        let ch = choice.split(choice[0])
                        pre = pareseInt(pre[1],10)
                        ch = parseInt(ch[1],10)

                        if (Math.abs(alert(prevChoice.charCodeAt(0) - choice.charCodeAt(0))) === 1 &&  Math.abs(pre - ch) === 1) {
                            /**
                             * calls Ship's or Gameboard's position functions.
                             */
                            valid = true
                        }
                        else {
                            console.log("\nInvalid position! Try Again!\n")
                            choice = window.prompt("For ship #" + i + ", which fills " + i + " squares, what is the position for square #" + pos +": ")
                        }
                }
                }
            }
        }

    }

    /**
     * @pre Player's gameboard and ships must be set up
     * @post prompts player for a position and calls Gameboard's isAHit(), then calls checkIfAllHit()
     */
    takeATurn() {
        //The prompting for a choice will change depending on how we decide to do it
        let choice = window.prompt("What's your guess?: ")
        if (this.m_otherPlayerBoard.isAHit(choice)){
            console.log("\nIt was a hit!\n") //Have function that determines if a battleship has been sunken
            if (this.m_otherPlayerBoard.checkIfAllHit()){
                console.log("\nCongratulations, " + m_name + "! You have sunk all your enemy's battleships! You won!\n")
            }
        }
        else{
            console.log("\nYou missed!\n")
        }
    }

    /**
     * @pre Game is set up and has started or about to start
     * @post returns true if all other player's ships have been sunk
     */
    hasWon() {
        return (this.m_otherPlayerBoard.checkIfAllHit())
    }
}

// let Ship1 = new Ship(1);
// let Ship2 = new Ship(2);
// let board = new Gameboard();
// let place = board.placeShip(Ship1, 'A 5');
// if(place[0]===true){
//     Ship1.setPosition(place[1]);
// }
// place = board.placeShip(Ship2, 'A 6');
// if(place[0]===true){
//     Ship2.setPosition(place[1]);
// }
// console.log(board.m_testBoard);
// console.log(board.isAHit('A 1'));


//Let's start the game from here

//This part will change depending on how we prompt the users
let play1 = window.prompt("Player1, what is your name?: ")
let play2 = window.prompt("Player2, what is your name? :")
console.log("Let's play BattleShip!\n")
console.log("Depending on how many ships you pick, the type of ships you have will differ.\n")
console.log("If you choose 1 ship, you will get 1 ship of 1x1. If you choose 2 ships, you will get 1 ship that is 1x1 and another that is 1x2.\n")
let numShips = window.prompt("How many ships will both players have? ")

let Player1 = new Player(numShips,play1)
let PLayer2 = new Player(numShips, play2)

Player1.setBattleShips()
PLayer2.setBattleShips()

//This is the game. Each Player Takes turns
let i = 1
while(!Player1.hasWon() || !PLayer2.hasWon()) {
    if (i%2 == 1 ){
        console.log("\nIt is " + Player1.m_name + "'s turn! Don't look " + Player2.m_name)
        //Are we showing Player1's board here so they can see where they've been hit?
        Player1.takeATurn()
    }
    else{
        console.log("\nIt is " + Player2.m_name + "'s turn! Don't look " + Player1.m_name)
        //Are we showing Player1's board here so they can see where they've been hit?
        Player2.takeATurn()
    }
}