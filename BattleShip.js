/**
 * THIS IS ALL JUST BRAINSTORMING!! FEEL FREE TO REJECT OR IMPROVE ON THE IDEAS
 */

class Gameboard {
    constructor (numShips) {
        let m_numOfSchips = numShips
        let m_board = {} //creates a dictionary for the board
        m_board['A'] = {'1' : 'NA', '2' : 'NA', '3' : 'NA', '4' : 'NA', '5' : 'NA',
        '6' : 'NA', '7' : 'NA', '8' : 'NA', '9' : 'NA', '10' : 'NA'} // 'NA' woudl be no ship, 'S' means a ship is there
        m_board['B'] = {'1' : 'NA', '2' : 'NA', '3' : 'NA', '4' : 'NA', '5' : 'NA',
        '6' : 'NA', '7' : 'NA', '8' : 'NA', '9' : 'NA', '10' : 'NA'}
        m_board['C'] = {'1' : 'NA', '2' : 'NA', '3' : 'NA', '4' : 'NA', '5' : 'NA',
        '6' : 'NA', '7' : 'NA', '8' : 'NA', '9' : 'NA', '10' : 'NA'}
        //This would go all the way down to J. I'm not sure if there was an implicit way to do this
    }

    /**
     * @pre Gameboard must have battleships set out
     * @param position coordinates the other playes will provide
     * @post returns true if the positon holds an 'S', false otherwise, if true, calls Ship's hit function
     */
    isAHit(position) {
        if (m_board[position[0]][position[1]] == 'S') {
            
            return true
        }
        else {
            return false
        }
    }
}

class Fleet{
    constructor(size) {
        let m_size = size
        let m_ships = {}
        for (let i = 1; i <= m_size; i++){
            m_body[i] = 'O' //'O' means that there is no hit, 'X' means there is a hit
        }
        let m_position = {}
    }

    /**
     * @pre m_size must have valid value
     * @post returns m_size
     */
    getSize() {
        return m_size
    }

    /**
     * @pre gameboard must be set up
     * @post positions the ship on gameboard
     * @param startPos starting position of ship
     * @param endPos ending position of ship
     */
    setPosition(startPos, endPos) {

    }

    /**
     * @pre m_body must be set up
     * @post replaces 'O' with 'X' in m_body n relation to position
     * @param marked position where m_body is to be hit
     */
    hit(marked) {

    }
}

let Ship1 = Fleet(6)
