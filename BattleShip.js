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

}

let Ship1 = new Ship(1);
let Ship2 = new Ship(2);
let board = new Gameboard();
let place = board.placeShip(Ship1, 'A 5');
if(place[0]===true){
    Ship1.setPosition(place[1]);
}
place = board.placeShip(Ship2, 'A 6');
if(place[0]===true){
    Ship2.setPosition(place[1]);
}
console.log(board.m_testBoard);
console.log(board.isAHit('A 1'));
