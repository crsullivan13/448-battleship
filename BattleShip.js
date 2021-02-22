/**
     * @description checks input format
     * @returns true if the input is correct, false othetwise
     * @param {string} code the input given by user
     */
function isValidCode(code){
    code = code.toString()
    let num = code.split(code[0])
    num = parseInt(num[1],10)
    let less10 = (num > 0 && num < 11)
    return ((/^[A-J]\d+$/.test(code)) && less10);
}

/**
 *  @description mapper to handle cols
 */
//const prompt = require('prompt-sync')(); used for console testing
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

        //window.alert(this.m_testBoard); //for testing
    }

    /**
     * @param {number} coordinate coordinate to be placed at
     * @param {object} ship ship to be placed
     * @returns returns true if out of bounds, false otherwise
     */
    checkOutOfBound(ship, coordinate, orientation) { 
        coordinate = coordinate.toString();
        let coord = coordinate.split(coordinate[0]);
        let outOfBound = true
        let letterASCII = coordinate[0].charCodeAt(0)
        coord = parseInt(coord[1],10)
        //window.alert(coord);
        if (orientation == 'H' || orientation == 'h'){ //I'm assuming that columns are A-J. This only works for capital letters
            if (letterASCII >=65 && letterASCII <=74){
                if (letterASCII + ship.getSize() <=75){  //74 is not a typo
                    outOfBound = false
                }
            }
        }
        else if (orientation == 'V' || orientation == 'v'){ //Rows are 1-10
            if (10 - coord - (ship.getSize()-1) >= 0){
                outOfBound = false
            }
        }

        return outOfBound
    } //Check if ship out of bound or not

    /**
     * @description places a ship inside of the board array
     * @param {string} coord starting coord of the ship
     * @param {object} ship must pass in ship to be placed
     * @param {string} orientation must pass in either vertical or horizontal to orient ship
     * @returns returns true if ship placed, false if invalid ship placement and prints error to console
     */
    placeShip(ship, coord, orientation) {
        coord = coord.toString()
        let arr = coord.split(coord[0]) //no spaces needed for coordinate
        const row = coord[0];
        const colNum = Number(arr[1]) - 1;

        if(!this.checkOutOfBound(ship, coord, orientation)){
          for (let i = 0; i < ship.getSize(); i++){
            // whether a ship is already there on the coord
            if (orientation === 'V' || orientation === 'v') { //I changed vertical to 'V' or 'v' in other function
              if(this.m_testBoard[colNum + i][Number(mapper[row])] === 'S'){
                window.alert("Invalid ship placement: Overlap")
                return false
              }
            } else if(this.m_testBoard[colNum][Number(mapper[row]) + i] === 'S'){
              window.alert("Invalid ship placement: Overlap")
              //window.alert(this.m_testBoard)
              return false
            }
          }

        
          for (let i = 0; i < ship.getSize(); i++){
            if (orientation === 'V' || orientation === 'v') { //I changed vertical to 'V' or 'v' in other function
              this.m_testBoard[colNum + i][Number(mapper[row])] = 'S';
            } else {
              this.m_testBoard[colNum][Number(mapper[row]) + i] = 'S';
            }
            
          }
          
        } else {
            window.alert("Invalid ship placement: Off board");
            return false;
        }
        return true;
    }

    /**
     * @description checks to see if the fired shot is a hit on the board, marks misses on the board
     * @param {string} coord coordinates the other playes will provide
     * @returns returns true if the positon holds an 'S', false otherwise (and adds white space to board css), if true, calls Ship's hit function
     */
    isAHit(coord, player) {
        coord = coord.toString();
        const arr = coord.split(coord[0]) //no spaces needed for coordinate
        const row = coord[0];
        const colNum = Number(arr[1]) - 1;

        if (this.m_testBoard[colNum][Number(mapper[row])] == 'S') {   
          this.m_testBoard[colNum][Number(mapper[row])] = 'X'
          return true
        } else {
          this.m_testBoard[colNum][Number(mapper[row])] = 'M'
          let letterASCII = coord[0].charCodeAt(0);
          let id;
  
          if(player == 1) {
              id = 'c' + String.fromCharCode(letterASCII) + Number(arr[1]);
          } else {
              id = 'o' + String.fromCharCode(letterASCII) + Number(arr[1]);
          }
          document.getElementById(id.toString()).style['background-color'] = "white";
          //window.alert("You Missed!\n")
          return false
        }
    }


    /**
     * @description Checks if a position has already been shot by a player
     * @returns {boolean} true if it has been which allows them to try again, false if not
     */
    isAlreadyShot(coord) {
        coord = coord.toString();
        const arr = coord.split(coord[0]) //no spaces needed for coordinate
        const row = coord[0];
        const colNum = Number(arr[1]) - 1;

        if(this.m_testBoard[colNum][Number(mapper[row])] === 'M' || this.m_testBoard[colNum][Number(mapper[row])] === 'X') {
            window.alert("You've already shot at this location! Try again!\n");
            return true;
        }
        return false;

    }

    /**
     * @description Used to check for win state, iterates through every position on the board looking for 'S'
     * @returns {boolean} if there are no more 'S', then it returns true, false otherwise
     */
    checkIfAllHit() {
      let lost = true
      for (let i = 0; i < 10; i++){
          for (let j = 0; j < 10; j++){
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
     * @description checks if ships health is zero
     * @returns true if zero, false otherwise
     */
    isSunk() {
        return this.m_health === 0;
    }

    /*
    sink (player) {
        let marked 
        let arr;
        let letterASCII;
        let id;
        for(let i = 0; i < this.m_size; i++) {
            
            if(this.m_body[i] == 'X'){
                marked = (this.m_body[i]).toString();
                arr = marked.split(marked[0]);
                letterASCII = marked[0].charCodeAt(0);
                if(player == 1) {
                    //window.alert("here C")
                    id = 'c' + String.fromCharCode(letterASCII) + (Number(arr[1]));
                } else {
                    //window.alert("here")
                    id = 'o' + String.fromCharCode(letterASCII) + (Number(arr[1]));
                }
                document.getElementById(id.toString()).style['background-color'] = "rgb(85, 86, 86)";
            }
        }

    }
    */

    /**
     * @description places the coordinates in the ship body starting at the initial coordinate, also adds css styling for ship on board
     * @returns none
     * @param {string} startPos starting position of ship
     */
    setPosition(startPos, orientation, turn) {
        startPos = startPos.toString()
        orientation = orientation.toString()
        let arr = startPos.split(startPos[0]);
        let letterASCII = startPos[0].charCodeAt(0);
        let id;

        if (orientation === 'H' || orientation === 'h'){
            for (let i = 0; i < this.m_size; i++){
                this.m_body[i] = String.fromCharCode(letterASCII + i) + Number(arr[1]);
                if(turn == 1) {
                    //window.alert("here C")
                    id = 'c' + String.fromCharCode(letterASCII + i) + Number(arr[1]);
                } else {
                    //window.alert("here")
                    id = 'o' + String.fromCharCode(letterASCII + i) + Number(arr[1]);
                }
                document.getElementById(id.toString()).style['background-color'] = "black";
            }
        } else {
            for (let i = 0; i < this.m_size; i++){
                this.m_body[i] = startPos[0] +  (Number(arr[1]) + i);
                if(turn == 1) {
                    //window.alert("here C")
                    id = 'c' + String.fromCharCode(letterASCII) + (Number(arr[1])+i);
                } else {
                    //window.alert("here")
                    id = 'o' + String.fromCharCode(letterASCII) + (Number(arr[1])+i);
                }
                document.getElementById(id.toString()).style['background-color'] = "black";
            }
        }
        console.log(this.m_body);
    }

    /**
     * @description replaces 'O' with 'X' in m_body n relation to position, used to see if this ship has the shot coord in the fleet, puts red mark on board
     * @param {string} marked position where m_body is to be hit
     * @returns true if this ship is hit false if not
     */
    hit(marked, player) {
        marked = marked.toString()
        let arr = marked.split(marked[0]);
        let letterASCII = marked[0].charCodeAt(0);
        let id;

        for (let i = 0; i < this.m_size; i++) {
            if(this.m_body[i] === marked) {
                this.m_body[i] = 'X';
                this.m_health--;
                console.log(this.m_body);
                if(player == 1) {
                    //window.alert("here C")
                    id = 'c' + String.fromCharCode(letterASCII) + Number(arr[1]);
                } else {
                    //window.alert("here")
                    id = 'o' + String.fromCharCode(letterASCII) + Number(arr[1]);
                }
                document.getElementById(id.toString()).style['background-color'] = "red";
                return true;
                
            }
        }
        return false;
    }

    /**
     * @description Hides the ships from the non-active player
     * @returns none
     * @param {number} player whose turn it is to determine what board to change
     */
    hide(player) {
        console.log("Hidden")
        let marked 
        let arr;
        let letterASCII;
        let id;
        for(let i = 0; i < this.m_size; i++) {
            
            if(this.m_body[i] != 'X'){
                marked = (this.m_body[i]).toString();
                arr = marked.split(marked[0]);
                letterASCII = marked[0].charCodeAt(0);
                if(player == 1) {
                    //window.alert("here C")
                    id = 'c' + String.fromCharCode(letterASCII) + (Number(arr[1]));
                } else {
                    //window.alert("here")
                    id = 'o' + String.fromCharCode(letterASCII) + (Number(arr[1]));
                }
                document.getElementById(id.toString()).style['background-color'] = "rgb(26,102,153)";
            }
        }
        
    }

    /**
     * @description Shows the ships from the active player
     * @returns none
     * @param {number} player whose turn it is to determine what board to change
     */
    show(player){
        let marked 
        let arr;
        let letterASCII;
        let id;
        for(let i = 0; i < this.m_size; i++) {
            if(this.m_body[i] !== 'X'){
                marked = (this.m_body[i]).toString();
                arr = marked.split(marked[0]);
                letterASCII = marked[0].charCodeAt(0);
                if(player == 1) {
                    //window.alert("here C")
                    id = 'o' + String.fromCharCode(letterASCII) + (Number(arr[1]));
                } else {
                    //window.alert("here")
                    id = 'c' + String.fromCharCode(letterASCII) + (Number(arr[1]));
                }
                document.getElementById(id.toString()).style['background-color'] = "black";
            }
        }
    }


     /**
     * @description checks the coordinates in ship's body to see if it includes the hit coord
     * @returns true if contains coord, flase otherwise
     * @param {string} coord coord to be hit
     */
    checkCoords(coord) {
        coord = coord.toString()
        return this.m_body.includes(coord);
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
        this.m_otherPlayerBoard = new Gameboard(this.m_numShips)
        this.m_fleet = new Array(this.m_numShips) //holds all the created ships
  
    }

     /**
     * @description checks all of the ships in the players fleet to find one that was hit
     * @returns returns ship object that had coordinate in it that was hit
     * @param {string} coord coord to be hit
     * @param {number} player either a 1 or a 2 to denote active player
     */
    checkFleet(coord, player) {
        for (let i = 0; i < this.m_numShips; i++) {
            if(this.m_fleet[i].checkCoords(coord)) {
                this.m_fleet[i].hit(coord, player);
                return this.m_fleet[i];
            }
        }
        //this.m_fleet[i].hit(coord, player);
    }
    

    /**
     * @description takes a starting postions
     * @param {Ship} ship object to be "stored"
     */
    addToFleet(ship){
        this.m_fleet[ship.getSize()-1] = ship
    }

    /**
     * @description allows other player to place ships, I.E. player1's board is in player2's class, this is where ships are created, also adds to fleet array
     * @returns true if ship placed
     * @param {number} player either a 1 or a 2 to denote active player, this is just being passed through
     * */
    setBattleShips(player) {
        window.alert("Welcome " + this.m_name + "! Let's have the other player set up their battleship!\n")
        for (let i = 1; i <= this.m_numShips; i++) {
            //The prompting for a choice will change depending on how we decide to do it
            let cochoice = window.prompt("For ship #" + i + ", what coordinate would you like it to start: ") //asks for coordinates
            cochoice = cochoice.toUpperCase()
            while (!isValidCode(cochoice)){
                cochoice = window.prompt("\nYour coordinate is invalid. Try again: ")
                cochoice = cochoice.toUpperCase()
            }
            let orchoice = window.prompt("\nWhat orientation ('V' for vertical(Vertical upwards) 'H' for horizontal) would you like for this ship: ") //asks for orientation
            while ((orchoice != 'H' && orchoice != 'h') && (orchoice != 'V' && orchoice != 'v')){
                orchoice = window.prompt("\nYour choice of orientation was invalid. Try again: ")
            }

            let valid = false
            while (valid === false) {
                let temp = new Ship(i)
 
                if (isValidCode(cochoice) && this.m_otherPlayerBoard.placeShip(temp, cochoice, orchoice)){
                    temp.setPosition(cochoice, orchoice, player)
                    this.addToFleet(temp)
                    valid = true
                }
                else{
                    cochoice = window.prompt("\nTry Again! For ship #" + i + ", what coordinate would you like it to start: ")
                    cochoice = cochoice.toUpperCase();
                    orchoice = window.prompt("\nWhat orientation('V' for vertical 'H' for horizontal) would you like for this ship: ")
                }
            }
 
        }

    }

    /**
     * @description calls hide ships on each ship in fleet array
     * @returns none
     * @param {number} player whose not currently active player
     */
    hideShips(player) {
        
        for(let i = 0; i < this.m_numShips; i++) {
            console.log("hide")
            this.m_fleet[i].hide(player);
        }
    }

    /**
     * @description calls show ships on each ship in fleet array
     * @returns none
     * @param {number} player whose turn is coming up
     */
    showShips(player) {
        for(let i = 0; i < this.m_numShips; i++) {
            this.m_fleet[i].show(player);
        }
    }

    /**
     * @description prompts player for a position and calls Gameboard's isAHit(), then calls checkIfAllHit(), if a player wins it says and then reloads
     * @returns returns a message that is then displayed to the player, message says what there hit was and if they have won that is also printed out
     * @param {number} player whose shooting
     * @param {string} choice shot coordinate
     */
    takeATurn(player, choice) {
        //The prompting for a choice will change depending on how we decide to do it
        console.log(choice)
        choice = choice.toUpperCase();
        let tookATurn = false
        while(tookATurn == false){
            if (isValidCode(choice)){
                if (this.m_otherPlayerBoard.isAlreadyShot(choice)) {
                    choice = window.prompt("What's your guess?: ")
                    choice = choice.toUpperCase()
                    tookATurn = false
                } else {
                    if (this.m_otherPlayerBoard.isAHit(choice, player)){
                    
                        window.alert("\nIt was a hit!\n")
                        tookATurn = true
                        let holder = this.checkFleet(choice, player);
                    
                        if(holder.isSunk()){
                            //holder.sink(player);
                            window.alert("Player '" + this.m_name + "' sank opponent's: " + holder.getSize() + " length ship!\n")
                        }

                        if (this.m_otherPlayerBoard.checkIfAllHit()){
                            window.alert("\nCongratulations, " + this.m_name + "! You have sunk all your enemy's battleships! You won! Reload to play again!\n")
                            //object.reload(forcedReload)
                            window.location.reload() //forces page to reload on win so the game ends
                        }
                    }  else{
                        window.alert("\nYou missed!\n")
                        console.log("monke")
                        this.checkFleet(choice, player)
                        tookATurn = true
                    }
                
                }
            }
            else {
                window.alert("\nERROR: The coordinate you input was wrong. Try again!\n")
                choice = window.prompt("What's your guess?: ")
                choice = choice.toUpperCase()
            }
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



//Let's start the game from here

//This part will change depending on how we prompt the users

class Game {
    /**
     * @constructor
     * @description this constructor is called to start the game, facilitates game setup and main game loop, holds event listeners for input button
     * @returns none
     */
    constructor() {
        let play1 = window.prompt("Player1, what is your name?: ")
        let play2 = window.prompt("Player2, what is your name?: ")
        window.alert("Let's play BattleShip!\n")
        window.alert("Depending on how many ships you pick, the type of ships you have will differ. You can choose between 1 to 6 ships.\n")
        window.alert("If you choose 1 ship, you will get 1 ship of 1x1. If you choose 2 ships, you will get 1 ship that is 1x1 and another that is 1x2 and so on.\n")
        let numShips = window.prompt("How many ships will both players have? ")
        numShips = Number(numShips)

        while (numShips <=0 || numShips > 6 || isNaN(numShips)){
            numShips = window.prompt('\nYou gave an invalid amount of ships. Try again: ')
        }

        let Player1 = new Player(numShips,play1)
        let Player2 = new Player(numShips, play2)

        Player1.setBattleShips(1)
        Player1.hideShips(1);
        Player2.setBattleShips(2)
        Player2.hideShips(2);

        //window.alert(Player1.m_otherPlayerBoard);
        //window.alert(Player2.m_otherPlayerBoard);

        //This is the game. Each Player Takes turns
        let i = 1
                
        //Are we showing Player1's board here so they can see where they've been hit?
        Player2.showShips(1)
        alert("\nIt is " + Player1.m_name + "'s turn! Don't look " + Player2.m_name)
        alert("On your turn enter shot coordinate into input box and press confirm")
        document.getElementById("confirmInput").addEventListener('click' , function() {
            if(i%2 == 1) {
                //window.alert("\nIt is " + Player1.m_name + "'s turn! Don't look " + Player2.m_name)
                Player1.takeATurn(1, document.querySelector('#input').value);
                alert("\nIt is " + Player2.m_name + "'s turn! Don't look " + Player1.m_name)
                Player2.hideShips(2)
                Player1.showShips(2)
            } else {
                //window.alert("\nIt is " + Player2.m_name + "'s turn! Don't look " + Player1.m_name)
                Player2.takeATurn(2, document.querySelector('#input').value)
                alert("\nIt is " + Player1.m_name + "'s turn! Don't look " + Player2.m_name)
                Player1.hideShips(1)
                Player2.showShips(1)
            }
            i++
        })
      
    }
}


/**
 * @description event listener callback that makes sure the page is loaded before the game starts
 */
window.addEventListener("load", () => {
    let start = new Game();
});

//Game End Message

