import * as fs from 'fs';

fs.readFile('input/day11input.txt', 'utf8', (err, rawInput) => {
    if (err) {
        console.error(err);
        return;
    }
    
    const rawRowsOfSeats = 
        rawInput
            .replace(/\r/g, '')
            .split('\n')
            .filter(x => x != null && x !== '')
            .map(x => x.trim());
    
    const rowsOfSeats = rawRowsOfSeats.map(rawSeatRow => rawSeatRow.split('').map(rawSeat => new SeatSpace(rawSeat === 'L')));
    const seatLayoutHelper = new SeatLayoutHelper();
    
    let previousNumberOfOccupiedSeats = null;
    let currentNumberOfOccupiedSeats = seatLayoutHelper.getOccupiedSeats(rowsOfSeats).length;
    let newRowOfSeats: SeatSpace[][] = rowsOfSeats;
    while(previousNumberOfOccupiedSeats !== currentNumberOfOccupiedSeats) {
        previousNumberOfOccupiedSeats = currentNumberOfOccupiedSeats;
        // newRowOfSeats = seatLayoutHelper.doTickWithNeighbors(newRowOfSeats);
        newRowOfSeats = seatLayoutHelper.doTickWithVisibleSeats(newRowOfSeats);
        currentNumberOfOccupiedSeats = seatLayoutHelper.getOccupiedSeats(newRowOfSeats).length;
    }
    
    seatLayoutHelper.printSeats(newRowOfSeats);
    console.log('number of occupiedSeats:', currentNumberOfOccupiedSeats);
});

class SeatLayoutHelper {
    doTickWithNeighbors(seatRows: SeatSpace[][]): SeatSpace[][] {
        const newSeatRows = seatRows.map(row => row.map(seat => new SeatSpace(seat.hasSeat)));
        
        for (let currentRow = 0; currentRow < seatRows.length; ++currentRow) {
            for (let currentColumn = 0; currentColumn < seatRows[currentRow].length; ++currentColumn) {
                const currentSeat = seatRows[currentRow][currentColumn];
                const newSeat = newSeatRows[currentRow][currentColumn];
                if (!currentSeat.hasSeat) {
                    // no point evaluating space without seat, skip to the next seat
                    continue;
                }
                
                const countOfOccupiedNeighbors = this.countOccupiedNeighbors(seatRows, currentRow, currentColumn);
                
                if (currentSeat.isOccupied && countOfOccupiedNeighbors >= 4) {
                    newSeat.isOccupied = false;
                } else if (currentSeat.isOccupied === false && countOfOccupiedNeighbors === 0) {
                    newSeat.isOccupied = true;
                } else {
                    newSeat.isOccupied = currentSeat.isOccupied;
                }
            }
        }
        
        return newSeatRows;
    }
    
    doTickWithVisibleSeats(seatRows:SeatSpace[][]): SeatSpace[][] {
        const newSeatRows = seatRows.map(row => row.map(seat => new SeatSpace(seat.hasSeat)));
        
        for (let currentRow = 0; currentRow < seatRows.length; ++currentRow) {
            for (let currentColumn = 0; currentColumn < seatRows[currentRow].length; ++currentColumn) {
                const currentSeat = seatRows[currentRow][currentColumn];
                const newSeat = newSeatRows[currentRow][currentColumn];
                if (!currentSeat.hasSeat) {
                    // no point evaluating space without seat, skip to the next seat
                    continue;
                }
                
                const countOfOccupiedVisibleSeats = this.countOccupiedVisibleSeats(seatRows, currentRow, currentColumn);
                
                if (currentSeat.isOccupied && countOfOccupiedVisibleSeats >= 5) {
                    newSeat.isOccupied = false;
                } else if (currentSeat.isOccupied === false && countOfOccupiedVisibleSeats === 0) {
                    newSeat.isOccupied = true;
                } else {
                    newSeat.isOccupied = currentSeat.isOccupied;
                }
            }
        }
        
        return newSeatRows;
    }
    
    printSeats(rowsOfSeats: SeatSpace[][]) {
        rowsOfSeats.forEach(rowOfSeats => {
            const parsedRowOfSeats = rowOfSeats.map(seat => {
                if (!seat.hasSeat) {
                    return '.';
                }
                if (seat.isOccupied) {
                    return '#';
                }
                return 'L';
            }).join('');
            console.log(parsedRowOfSeats);
        });
    }
    
    getOccupiedSeats(rowOfSeats: SeatSpace[][]) : SeatSpace[][] {
        let occupiedSeats = [];
        rowOfSeats.forEach(row => {
            occupiedSeats = occupiedSeats.concat(row.filter(seat => seat.isOccupied));
        });
        return occupiedSeats
    }
    
    private countOccupiedNeighbors(listOfSeats: SeatSpace[][], currentRow: number, currentColumn: number): number {
        const rowBefore = currentRow - 1;
        const rowAfter = currentRow + 1;
        const columnBefore = currentColumn - 1;
        const columnAfter = currentColumn + 1;
        
        return [
            this.tryGetSeat(listOfSeats,rowBefore,columnBefore), // top-left
            this.tryGetSeat(listOfSeats,rowBefore,currentColumn), // top
            this.tryGetSeat(listOfSeats,rowBefore,columnAfter), // top-right
            this.tryGetSeat(listOfSeats,currentRow,columnBefore), // left
            this.tryGetSeat(listOfSeats,currentRow,columnAfter), // right
            this.tryGetSeat(listOfSeats,rowAfter,columnBefore), // bottom-left
            this.tryGetSeat(listOfSeats,rowAfter,currentColumn), // bottom
            this.tryGetSeat(listOfSeats,rowAfter,columnAfter), // bottom-right
        ].filter(x => x != null && x.isOccupied).length;
    }
    
    private countOccupiedVisibleSeats(listOfSeats: SeatSpace[][], currentRow: number, currentColumn: number): number {
        let occupiedVisibleSeats = 0;
        
        let topLeftSeat:SeatSpace = null;
        for (
            let skippedSeats = 1;
            (topLeftSeat = this.tryGetSeat(listOfSeats, currentRow - skippedSeats, currentColumn - skippedSeats)) != null && topLeftSeat.hasSeat === false;
            ++skippedSeats
        ) { }
        
        if (topLeftSeat != null && topLeftSeat.isOccupied) {
            occupiedVisibleSeats += 1;
        }
        
        let topSeat:SeatSpace = null;
        for (
            let skippedSeats = 1;
            (topSeat = this.tryGetSeat(listOfSeats, currentRow - skippedSeats, currentColumn)) != null && topSeat.hasSeat === false;
            ++skippedSeats
        ) { }
        
        if (topSeat != null && topSeat.isOccupied) {
            occupiedVisibleSeats += 1;
        }
        
        let topRightSeat:SeatSpace = null;
        for (
            let skippedSeats = 1;
            (topRightSeat = this.tryGetSeat(listOfSeats, currentRow - skippedSeats, currentColumn + skippedSeats)) != null && topRightSeat.hasSeat === false;
            ++skippedSeats
        ) { }
        
        if (topRightSeat != null && topRightSeat.isOccupied) {
            occupiedVisibleSeats += 1;
        }
        
        let leftSeat:SeatSpace = null;
        for (
            let skippedSeats = 1;
            (leftSeat = this.tryGetSeat(listOfSeats, currentRow, currentColumn - skippedSeats)) != null && leftSeat.hasSeat === false;
            ++skippedSeats
        ) { }
        
        if (leftSeat != null && leftSeat.isOccupied) {
            occupiedVisibleSeats += 1;
        }
        
        let rightSeat:SeatSpace = null;
        for (
            let skippedSeats = 1;
            (rightSeat = this.tryGetSeat(listOfSeats, currentRow, currentColumn + skippedSeats)) != null && rightSeat.hasSeat === false;
            ++skippedSeats
        ) { }
        
        if (rightSeat != null && rightSeat.isOccupied) {
            occupiedVisibleSeats += 1;
        }
        
        let bottomLeftSeat:SeatSpace = null;
        for (
            let skippedSeats = 1;
            (bottomLeftSeat = this.tryGetSeat(listOfSeats, currentRow + skippedSeats, currentColumn - skippedSeats)) != null && bottomLeftSeat.hasSeat === false;
            ++skippedSeats
        ) { }
        
        if (bottomLeftSeat != null && bottomLeftSeat.isOccupied) {
            occupiedVisibleSeats += 1;
        }
        
        let bottomSeat:SeatSpace = null;
        for (
            let skippedSeats = 1;
            (bottomSeat = this.tryGetSeat(listOfSeats, currentRow + skippedSeats, currentColumn)) != null && bottomSeat.hasSeat === false;
            ++skippedSeats
        ) { }
        
        if (bottomSeat != null && bottomSeat.isOccupied) {
            occupiedVisibleSeats += 1;
        }
        
        let bottomRightSeat:SeatSpace = null;
        for (
            let skippedSeats = 1;
            (bottomRightSeat = this.tryGetSeat(listOfSeats, currentRow + skippedSeats, currentColumn + skippedSeats)) != null && bottomRightSeat.hasSeat === false;
            ++skippedSeats
        ) { }
        
        if (bottomRightSeat != null && bottomRightSeat.isOccupied) {
            occupiedVisibleSeats += 1;
        }
        
        return occupiedVisibleSeats;
    }
    
    private tryGetSeat(listOfSeats: SeatSpace[][], row: number, column: number): SeatSpace {
        if (row < 0 || row >= listOfSeats.length) {
            return null;
        }
        
        if (column < 0 || column >= listOfSeats[row].length) {
            return null;
        }
        
        return listOfSeats[row][column];
    }
}

class SeatSpace {
    hasSeat: boolean;
    
    isOccupied = false;
    
    constructor(hasSeat: boolean) {
        this.hasSeat = hasSeat;
    }
}