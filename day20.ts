import * as fs from 'fs';

fs.readFile('input/day20input.txt', 'utf8', (err, rawInput) => {
    if (err) {
        console.error(err);
        return;
    }
    
    const rawTiles = 
        rawInput
            .replace(/\r/g, '')
            .split('\n\n')
            .filter(x => x != null && x !== '')
            .map(x => x.trim());
    
    const tiles = rawTiles.map(x => new Tile(x));
    tiles.forEach(outerTile => {
        tiles.forEach(innerTile => {
            outerTile.compareWithOtherTile(innerTile);
        });
    });
    
    const cornerTiles = tiles.filter(tile => 
        tile.possibleNorthMatchIds.length === 0 && tile.possibleEastMatchIds.length === 0 ||
        tile.possibleEastMatchIds.length === 0 && tile.possibleSouthMatchIds.length === 0 ||
        tile.possibleSouthMatchIds.length === 0 && tile.possibleWestMatchIds.length === 0 ||
        tile.possibleWestMatchIds.length === 0 && tile.possibleNorthMatchIds.length === 0
    );
    const cornerTileIds = cornerTiles.map(x => x.id);
    
    console.log('corner tile ids', cornerTileIds);
    console.log('product of corner tile ids', cornerTileIds.reduce((total, item) => total * item, 1));
    
    const topLeftTile = cornerTiles.filter(tile => tile.possibleNorthMatchIds.length === 0 && tile.possibleWestMatchIds.length === 0);
    const orderedTiles: Tile[][] = [];
    for (let row = 0; row < 12; ++row) {
        orderedTiles.push([]);
        for (let column = 0; column < 12; ++column) {
            
        }
    }
});

class Tile {
    id: number;
    northBorder: string;
    eastBorder: string;
    southBorder: string;
    westBorder: string;
    allPossibleBorders: string[];
    
    possibleNorthMatchIds: number[] = [];
    possibleEastMatchIds: number[] = [];
    possibleSouthMatchIds: number[] = [];
    possibleWestMatchIds: number[] = [];
    
    constructor(rawTile: string) {
        const tileRows = rawTile.split('\n');
        const rawTileId = tileRows.shift();
        this.id = Number(rawTileId.match(/Tile (?<id>[0-9]*):/).groups.id);
        
        this.northBorder = tileRows[0];
        this.southBorder = tileRows[tileRows.length - 1];
        this.westBorder = tileRows.map(x => x[0]).join('');
        this.eastBorder = tileRows.map(x => x[x.length - 1]).join('');
        
        this.allPossibleBorders = [
            this.northBorder,
            this.eastBorder,
            this.southBorder,
            this.westBorder,
            this.reverseString(this.northBorder),
            this.reverseString(this.eastBorder),
            this.reverseString(this.southBorder),
            this.reverseString(this.westBorder),
        ]
    }
    
    compareWithOtherTile(otherTile: Tile) {
        if (otherTile === this) {
            return;
        }
        
        if (otherTile.allPossibleBorders.find(x => x === this.northBorder)) {
            this.possibleNorthMatchIds.push(otherTile.id);
        }
        
        if (otherTile.allPossibleBorders.find(x => x === this.eastBorder)) {
            this.possibleEastMatchIds.push(otherTile.id);
        }
        
        if (otherTile.allPossibleBorders.find(x => x === this.southBorder)) {
            this.possibleSouthMatchIds.push(otherTile.id);
        }
        
        if (otherTile.allPossibleBorders.find(x => x === this.westBorder)) {
            this.possibleWestMatchIds.push(otherTile.id);
        }
    }
    
    private reverseString(stringToReverse): string {
        return stringToReverse.split('').reverse().join('');
    }
}