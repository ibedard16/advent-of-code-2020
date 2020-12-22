const myTime = 1005526;
const rawBusTimes = '37,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,x,587,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,13,19,x,x,x,23,x,x,x,x,x,29,x,733,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,17';
// const rawBusTimes = '7,13,x,x,59,x,31,19';

const busTimes = rawBusTimes.split(',').map(x => Number(x)).filter(x => !isNaN(x));

const minutesTillArrival = busTimes.map(busTime => {
    const arrivesInMinutes = (Math.ceil(myTime/busTime) * busTime) - myTime;
    return { busId: busTime, arrivesInMinutes: arrivesInMinutes};
});

console.log('first bus:', minutesTillArrival.sort((x,y) => x.arrivesInMinutes - y.arrivesInMinutes)[0]);

const bustimesAndOffset = rawBusTimes.split(',').map(x => Number(x)).map((busTime, index) => {
    return {busTime, offset: index}
}).filter(x => !isNaN(x.busTime));

const modularSubtraction = (minuend: number, subtrahend: number, modulo: number) => {
    let difference = (minuend - subtrahend) % modulo;
    if (difference < 0) {
        difference += modulo;
    }
    return difference;
}

const modularDivision = (dividend: number, divisor: number, modulo: number) => {
    dividend = dividend % modulo;
    if (dividend < 0) {
        dividend += modulo;
    }
    divisor = divisor % modulo;
    if (divisor < 0) {
        divisor += modulo;
    }
    
    // euclidean extended algorithm implementation
    let i = 2;
    let remainder = [modulo, divisor];
    let quotient = [null];
    let t = [0,1];
    while (remainder[i - 1] !== 0) {
        remainder.push(remainder[i - 2] % remainder[i - 1]);
        quotient.push(Math.floor(remainder[i - 2] / remainder[i - 1]))
        t.push(Math.floor(t[i - 2] - (t[i - 1] * quotient[i - 1])));
        ++i;
    }
    const divisorInverse = t[i-2];
    
    let result = (dividend * divisorInverse) % modulo;
    if (result < 0) {
        result += modulo;
    }
    return result;
}

let correctProduct = 1;
let correctOffset = 0;
bustimesAndOffset.forEach(x => {
    const targetRemainder = modularSubtraction(x.busTime, x.offset, x.busTime);
    const firstNumberToSatisfy = modularDivision(modularSubtraction(targetRemainder, correctOffset, x.busTime), correctProduct, x.busTime);
    correctOffset += correctProduct*firstNumberToSatisfy;
    correctProduct *= x.busTime;
    console.log({correctProduct, correctOffset});
});

console.log('answer is: ', correctOffset);
