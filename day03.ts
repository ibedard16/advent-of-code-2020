import * as fs from 'fs';

fs.readFile('input/day3input.txt', 'utf8', (err, rawInput) => {
    if (err) {
        console.error(err);
        return;
    }
    
    const unprocessedRows = rawInput.split('\n').filter(x => x != null && x !== '').map(x => x.trim());
    const treeRows = unprocessedRows.map(unprocessedRow => new TreeRow(unprocessedRow));
    
    const treesHitForSlope1 = getNumberOfTreesHit(treeRows, 1, 1);
    const treesHitForSlope2 = getNumberOfTreesHit(treeRows, 3, 1);
    const treesHitForSlope3 = getNumberOfTreesHit(treeRows, 5, 1);
    const treesHitForSlope4 = getNumberOfTreesHit(treeRows, 7, 1);
    const treesHitForSlope5 = getNumberOfTreesHit(treeRows, 1, 2);
    
    console.log({treesHitForSlope1,treesHitForSlope2,treesHitForSlope3,treesHitForSlope4,treesHitForSlope5});
    console.log(treesHitForSlope1*treesHitForSlope2*treesHitForSlope3*treesHitForSlope4*treesHitForSlope5);
});

class TreeRow {
    tree: boolean[];
    
    constructor(rawTreeRow: string) {
        this.tree = rawTreeRow.split('').map(x => x === '#');
    }
    
    isTreeInColumn(column: number) {
        return this.tree[column % this.tree.length];
    }
}

function getNumberOfTreesHit(treeRows: TreeRow[], right: number, down: number): number {
    let treesHit = 0;
    let column = 0
    for(let row = 0; row < treeRows.length; row += down) {
        treesHit += treeRows[row].isTreeInColumn(column) ? 1 : 0;
        column += right;
    }
    return treesHit;
}