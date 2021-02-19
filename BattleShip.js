/**
 * THIS IS ALL JUST BRAINSTORMING!! FEEL FREE TO REJECT OR IMPROVE ON THE IDEAS
 */
const mapper = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
    E: 4,
    F: 5,
    G: 6,
    H: 7,
    I: 8,
    J: 9
}//1-10 to A-J

class Gameboard {
    /**
     * @constructor
     * @description this builds each of the arrays that represent the game boards
     * @param {number} numShips the number of ships to be played 
     */
    constructor (numShips) {
        this.m_numOfShips = numShips;
        this.m_testBoard = new Array(10);
        
        for (let i = 0; i < 10; i++){
            this.m_testBoard[i] = new Array(10);
        }

        for (let i = 0; i < 10; i++){
            for (let j = 0; j < 10; j++){
                this.m_testBoard[i][j] = 'NA';
            }
        }

        //console.log(this.m_testBoard); for testing
    }

    /**
     * @param {number} coordinate coordinate to be placed at
     * @param {object} ship ship to be placed
     * @returns returns true if out of bounds, false otherwise
     */
    checkOutOfBound(coordinate, ship, orientation) {
        let coord = coordinate.split(coordinate[0])
        let outOfBound = true
        let letterASCII = coordinate[0].charCodeAt()
        coord = parseInt(coord[1],10)
        //This needs to also check vertically I think
        if (orientation == 'H' || orientation == 'h'){ //I'm assuming that columns are A-J. This only works for capital letters
            if (letterASCII >=65 && letterASCII <=73){
                if (letterASCII + ship.getSize() <=74){  //74 is not a typo
                    outOfBound = false
                }
            }
        }
        else if (orientation == 'V' || orientation == 'v'){ //Rows are 1-10
            if (10 - coord - (ship.getSize()-1) <= 0){
                outOfBound = false
            }
        }

        return outOfBound
    } //Check if ship out of bound or not

    /**
     * @description places a ship inside of the ship array
     * @param {string} coord starting coord of the ship
     * @param {object} ship must pass in ship to be placed
     * @param {string} orientation must pass in either vertical or horizontal to orient ship
     * @returns returns true if ship placed, false if invalid ship placement and prints error to console
     */
    placeShip(ship, coord, orientation) {
        let arr = coord.split(coord[0]) //no spaces needed for coordinate
        const row = arr[0];
        const colNum = Number(arr[1]) - 1;

        if(!checkOutOfBound(ship, coord, orientation)){
          for (let i = 0; i < ship.getSize(); i++){
            // whether a ship is already there on the coord
            if (orientation === 'V' || orientation === 'v') { //I changed vertical to 'V' or 'v' in other function
              if(this.m_testBoard[mapper[row] + i][colNum] === 'S'){
                console.log("Invalid ship placement: Overlap")
                return [false, null]
              }
            } else if(this.m_testBoard[mapper[row]][colNum + i] === 'S'){
              console.log("Invalid ship placement: Overlap")
              return [false, null]
            }
          }

          for (let i = 0; i < ship.getSize(); i++){
            if (orientation === 'V' || orientation === 'v') { //I changed vertical to 'V' or 'v' in other function
              this.m_testBoard[mapper[row] + i][colNum] = 'S';
            } else {
              this.m_testBoard[mapper[row]][colNum + i] = 'S';
            }
            
          }
        } else {
            console.log("Invalid ship placement: Off board");
            return [false, null];
        }
        return [true, coord];
    }

    /**
     * @param {string} coord coordinates the other playes will provide
     * @returns returns true if the positon holds an 'S', false otherwise, if true, calls Ship's hit function
     */
    isAHit(coord) {
        const arr = coord.split(coord[0]) //no spaces needed for coordinate
        const row = arr[0];
        const colNum = Number(arr[1]) - 1;

        if (this.m_testBoard[mapper[row]][colNum] == 'S') {    
          this.m_testBoard[mapper[row]][colNum] = 'X'
          return true
        } else {
          this.m_testBoard[mapper[row]][colNum] = 'M'
          return false
        }
    }

    /**
     * @description Used to check for win state, iterates through every position on the board looking for 'S'
     * @returns {boolean} if there are no more 'S', then it returns true, false otherwise
     */
    checkIfAllHit() {
      let lost = true
      for (let i = 0; i < 10; i++){
          for (let j = 0; j < 10; j++){
              if (this.m_testBoard[mapper[i]][j] == 'S'){
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

    /**
     * @constructor
     * @description this builds each individual ship that is placed
     * @param {number} size length of the ship
     */
    constructor(size) {
        this.m_size = size;
        this.m_health = size;
        for (let i = 0; i < this.m_size; i++){
            this.m_body[i] = 'O' //'O' means that there is no hit, 'X' means there is a hit
        }
    }

    /**
     * @returns returns m_size of the ship
     */
    getSize() {
        return this.m_size;
    }

    /**
     * @description places the coordinates in the ship body starting at the initial coordinate
     * @returns none
     * @param {string} startPos starting position of ship
     */
    setPosition(startPos) {
        let arr = startPos.split(startPos[0]);
        for (let i = 0; i < this.m_size; i++){
            this.m_body[i] = arr[0] +  (Number(arr[1]) + i);
        }

        //maybe return m_body
        //console.log(this.m_body);
    
    }

    /**
     * @description replaces 'O' with 'X' in m_body n relation to position, used to see if this ship has the shot coord in the fleet
     * @param {string} marked position where m_body is to be hit
     * @returns true if this ship is hit false if not
     */
    hit(marked) {
        for (let i = 0; i < this.m_size; i++) {
            if(this.m_body[i] === marked) {
                this.m_body[i] = 'X';
                this.m_health--;
                return true;
            }
        }
        return false;
    }

    
    checkCoords(coord) {
        return m_body.includes(coord);
    }
    
}

class Player {
    /**
     * @constructor
     * @description this creates each player
     * @param {number} numOfShips number of ships to played
     * @param {string} name name of the player
     */
    constructor(numOfShips, name) {
        this.m_name = name;
        this.m_numShips = numOfShips;
        this.m_otherPlayerBoard = new Gameboard(m_numShips)
        this.m_fleet = new Array(m_numShips) //holds all the created ships
        /* not sure how we want to actually check if the shot hits any of the ships that the player has
        * maybe have all of the placed ships in an array and then itterate through checking if one of them has the correct coords
        * if we do it this way then we will need some sort of checkHit inside of the player i think in order to iterate through the ships
        * maybe this.m_fleet = [], then when a ship is placed we (in the main game loop) add the ship object to the fleet
        */
    }

    //This is just an idea to discuss in meeting or imp if we think its a good idea
    
    checkFleet(coord) {
        for (let i = 0; i < m_numShips; i++) {
            if(m_fleet[i].checkCoords(coord)) {
                this.m_otherPlayerBoard.isAHit(coord);
                this.m_fleet[i].hit(coord);
            } else {
                this.m_otherPlayerBoard.isAHit(coord);
            }
        }
    }
    

    /**
     * @description takes a starting postions
     * @param {Ship} ship object to be "stored"
     */
    addToFleet(ship){
        this.m_fleet[ship.getSize()-1] = ship

        //let variable = startPos.split(startPos[0])
        // if (orientation == 'V' || orientation == 'v'){
        //     for (let i = 0; i < ship.getSize(); i++) {
        //         fleet[ship.getSize()-1][i] = String.fromCharCode(startPos.charCodeAt(0) + i) + variable[1]
        //     }
        // } else {
        //     for (let i = 0; i < ship.getSize(); i++) {
        //         fleet[ship.getSize()-1][i] = startPos[0] + String(Number(variable[1]+i))
        //     }
        // }
    }

    /**
     * @description allows other player to place ships, I.E. player1's board is in player2's class
     * @returns true if ship placed
     * */
    setBattleShips() {
        console.log("Welcome " + this.m_name + "! Let's have the other player set up their battleship!\n")
        for (let i = 1; i <= this.m_numShips; i++) {
            //The prompting for a choice will change depending on how we decide to do it
            let cochoice = window.prompt("For ship #" + i + ", what coordinate would you like it to start: ") //asks for coordinates
            let orchoice = window.prompt("\nWhat orientation ('V' for vertical 'H' for horizontal) would you like for this ship: ") //asks for orientation
            //need to add prompt for either vertical or horizontal
            //need to add checks to make sure the input is in the right format (what is the format we want coming in?)
            //I think we can remove the checks in this method that check if the placement is valid as that is done in the gameboard class
            //call the gameBoard place ship and if that's true then call the ships which returns the body and places it in the fleet
            let valid = false
            while (valid === false) {
                let temp = new Ship(i)
                temp.setPosition(cochoice)
                if (this.m_otherPlayerBoard.placeShip(temp, cochoice, orchoice)){
                    this.addToFleet(temp)
                    valid = true
                }
                else{
                    cochoice = window.prompt("\nTry Again! For ship #" + i + ", what coordinate would you like it to start: ")
                    orchoice = window.prompt("\nWhat orientation('V' for vertical 'H' for horizontal) would you like for this ship: ")
                }
                //The following just seperates the letter and numbers in the choice i.e. B10 just becomes 10, can still access the letter
                //let ch = cochoice.split(cochoice[0])
                //ch = parseInt(ch[1],10) //The second element is just the numbers, this turns it into numbers intead of strings
            }
 
        }

    }

    /**
     * @description prompts player for a position and calls Gameboard's isAHit(), then calls checkIfAllHit()
     * @returns returns a message that is then displayed to the player, message says what there hit was and if they have won that is also printed out
     */
    takeATurn() {
        //The prompting for a choice will change depending on how we decide to do it
        let choice = window.prompt("What's your guess?: ")
        if (this.m_otherPlayerBoard.isAHit(choice)){
            console.log("\nIt was a hit!\n") 
            //Have function that determines if a battleship has been sunken
            if (this.m_otherPlayerBoard.checkIfAllHit()){
                console.log("\nCongratulations, " + m_name + "! You have sunk all your enemy's battleships! You won!\n")
            }
        }
        else{
            console.log("\nYou missed!\n")
        }
    }

    /**
     * @description calls the checkIfAllHit in the gameBaord class
     * @returns true if all other player's ships have been sunk
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
console.log("Depending on how many ships you pick, the type of ships you have will differ. You can choose between 1 to 6 ships.\n")
console.log("If you choose 1 ship, you will get 1 ship of 1x1. If you choose 2 ships, you will get 1 ship that is 1x1 and another that is 1x2 and so on.\n")
let numShips = window.prompt("How many ships will both players have? ")

while (numShips <=0 || numShips > 6){
    numShips = window.prompt('\nYou gave an invalid amount of ships. Try again: ')
}

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
    i++
}

//Game End Message
if (Player1.hasWon()) {
  console.log('\nCongratulations! ' + Player1.m_name + " has won!\n")
} else {
  console.log('\nCongratulations! ' + Player2.m_name + " has won!\n")
}
