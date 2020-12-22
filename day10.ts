import * as fs from 'fs';

fs.readFile('input/day10input.txt', 'utf8', (err, rawInput) => {
    if (err) {
        console.error(err);
        return;
    }
    
    const adapters = 
        rawInput
            .replace(/\r/g, '')
            .split('\n')
            .filter(x => x != null && x !== '')
            .map(x => x.trim())
            .map(x => Number(x))
            .sort((x,y) => x - y)
            .map(x => new Adapter(x));
    
    // part 1
    const outlet = new Adapter(0);
    const device = new Adapter(adapters[adapters.length - 1].value + 3);
    
    const fullChain = adapters;
    fullChain.unshift(outlet);
    fullChain.push(device);
    
    let numberOf1Jumps = 0;
    let numberOf2Jumps = 0;
    let numberOf3Jumps = 0;
    fullChain.reduce((previousJoltValue, currentJoltValue) => {
        const jump = currentJoltValue.value - previousJoltValue.value;
        if (jump === 1) {
            numberOf1Jumps += 1;
        } else if (jump === 2) {
            numberOf2Jumps += 1;
        } else if (jump === 3) {
            numberOf3Jumps += 1;
        }
        return currentJoltValue;
    }, outlet);
    
    console.log({numberOf1Jumps, numberOf2Jumps, numberOf3Jumps});
    console.log(numberOf1Jumps * numberOf3Jumps);
    
    // part 2
    fullChain.forEach(adapter => {
        adapter.calculatePathsToAdapter(fullChain);
    });
    console.log(fullChain);
});

class Adapter {
    value: number;
    pathsToAdapter: number;
    
    constructor(value: number) {
        this.value = value;
    }
    
    calculatePathsToAdapter(chain: Adapter[]) {
        const previousAdaptersWithinReach = chain.filter(adapter => adapter.value >= this.value - 3 && adapter.value < this.value);
        console.log(this.value, previousAdaptersWithinReach);
        let numberOfPaths = previousAdaptersWithinReach.map(x => x.pathsToAdapter).reduce((total, paths) => total + paths, 0);
        if (numberOfPaths === 0) {
            numberOfPaths = 1;
        }
        this.pathsToAdapter = numberOfPaths;
    }
}