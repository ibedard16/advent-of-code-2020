const numbers = [5,2,8,16,18,0,1];
const targetIndex = 30000000;

const lastIndexOfNumber: {[key: number]: number} = new Array(targetIndex);

numbers.slice(0, numbers.length - 1).forEach((number,index) => {
    lastIndexOfNumber[number] = index;
})

const timeStart = Date.now();
let previousNumber = numbers[numbers.length - 1];
for (let index = numbers.length; index < targetIndex; ++index) {
    const indexOfPreviousNumber = lastIndexOfNumber[previousNumber];
    
    let number = null;
    if (indexOfPreviousNumber == null) {
        number = 0;
    } else {
        number = (index) - indexOfPreviousNumber - 1;
    }
    
    lastIndexOfNumber[previousNumber] = index - 1;
    previousNumber = number;
}

console.log(`The ${targetIndex} number is: `, previousNumber);
console.log('time (s): ', (Date.now() - timeStart) / 1000);