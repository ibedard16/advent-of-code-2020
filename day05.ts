import * as fs from 'fs';

fs.readFile('input/day5input.txt', 'utf8', (err, rawInput) => {
    if (err) {
        console.error(err);
        return;
    }
    
    const unprocessedSeats = 
        rawInput
            .replace(/\r/g, '')
            .split('\n')
            .filter(x => x != null && x !== '')
            .map(x => x.trim());
    
    const seats = unprocessedSeats.map(x => new Seat(x)).sort((x,y) => x.id - y.id);
    
    let mySeat = null;
    for (let i = 0; i < seats.length; ++i) {
        if (mySeat == null || mySeat === seats[i].id - 1) {
            mySeat = seats[i].id;
        } else {
            console.log('my seat is', mySeat + 1);
            break;
        }
    }
});

class Seat {
    row: number;
    column: number;
    id: number;
    
    constructor(rawSeat: string) {
        let minRow = 0;
        let maxRow = 127;
        for (let char = 0; char < 7; ++char) {
            const countOfHalfSeats = (maxRow - minRow + 1) / 2;
            if (rawSeat[char] === 'B') {
                minRow = countOfHalfSeats + minRow;
            } else if (rawSeat[char] === 'F') {
                maxRow = countOfHalfSeats + minRow - 1;
            }
        }
        
        if(minRow !== maxRow) {
            console.error('something went wrong!');
        }
        
        this.row = minRow;
        
        let minColumn = 0;
        let maxColumn = 7;
        for (let char = 7; char < rawSeat.length; ++char) {
            const countOfHalfSeats = (maxColumn - minColumn + 1) / 2;
            if (rawSeat[char] === 'R') {
                minColumn = countOfHalfSeats + minColumn;
            } else if (rawSeat[char] === 'L') {
                maxColumn = countOfHalfSeats + minColumn - 1;
            }
        }
        
        if(minColumn !== maxColumn) {
            console.error('something went wrong!');
        }
        
        this.column = minColumn;
        
        this.id = (this.row * 8) + this.column;
    }
}

