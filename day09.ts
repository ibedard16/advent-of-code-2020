import * as fs from 'fs';

fs.readFile('input/day9input.txt', 'utf8', (err, rawInput) => {
    if (err) {
        console.error(err);
        return;
    }
    
    const numbers = 
        rawInput
            .replace(/\r/g, '')
            .split('\n')
            .filter(x => x != null && x !== '')
            .map(x => x.trim())
            .map(x => Number(x));
    
    const preamble = numbers.slice(0, 25);
    
    let weakness = null;
    for (let i = 25; i < numbers.length; ++i) {
        const number = numbers[i];
        
        if (!isSumInArray(number, preamble)) {
            weakness = number;
            console.log('number is invalid', number);
            break;
        }
        
        preamble.shift();
        preamble.push(number);
    }
    
    for (let startOfRange = 0; startOfRange < numbers.length; ++startOfRange) {
        let endOfRange = startOfRange;
        let subsetSum = sumArray(numbers.slice(startOfRange, endOfRange + 1));
        while (subsetSum < weakness) {
            endOfRange += 1;
            subsetSum = sumArray(numbers.slice(startOfRange, endOfRange + 1));
        }
        if (subsetSum === weakness) {
            console.log('range found!');
            console.log('start of range:', numbers[startOfRange]);
            console.log('end of range:', numbers[endOfRange]);
            console.log('their sum', numbers[startOfRange] + numbers[endOfRange]);
            break;
        }
    }
});

function isSumInArray(sum: number, array: number[]): boolean {
    for(let i = 0; i < array.length; ++i) {
        let target = sum - array[i];
        let targetIndex = array.indexOf(target);
        if (targetIndex !== -1) {
            return true;
        }
    }
    return false;
}

function sumArray(array: number[]) {
    return array.reduce((total, element) => total + element, 0);
}