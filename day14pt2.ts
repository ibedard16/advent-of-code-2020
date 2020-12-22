import * as fs from 'fs';

fs.readFile('input/day14input.txt', 'utf8', (err, rawInput) => {
    if (err) {
        console.error(err);
        return;
    }
    
    const rawInstructions = 
        rawInput
            .replace(/\r/g, '')
            .split('\n')
            .filter(x => x != null && x !== '')
            .map(x => x.trim());
    
    const instructions = rawInstructions.map(x => new Instruction(x));
    
    const executionContext = new ExecutionContext();
    
    instructions.forEach(instruction => instruction.execute(executionContext));
    console.log('sum of values in memory:', executionContext.getSumOfValuesInMemory());
});

class ExecutionContext {
    currentMask = new Mask('');
    memory: {
        [key: number]: number;
    } = {};
    
    getSumOfValuesInMemory() {
        return Object.values(this.memory).reduce((total, current) => total += current, 0);
    }
}

class Instruction {
    constructor(rawInstruction: string) {
        const [rawType, rawValue] = rawInstruction.split(' = ');
        if (rawType === 'mask') {
            return new MaskInstruction(rawValue);
        }
        if (rawType.substr(0,3) === 'mem') {
            const rawAddress = rawType.slice(4, rawType.length -1);
            return new WriteInstruction(rawAddress, rawValue);
        }
        throw 'Unrecognized instruction format';
    }
    
    execute(context: ExecutionContext) {
        throw 'Baseclass Instruction.execute is not meant to be called';
    }
}

class MaskInstruction implements Instruction {
    mask: Mask;
    
    constructor(rawValue: string) {
        this.mask = new Mask(rawValue);
    }
    
    execute(context: ExecutionContext) {
        context.currentMask = this.mask;
    }
}

class Mask {
    rawMask: string;
    numberOfFloatingBits: number;
    
    constructor(rawString: string) {
        this.rawMask = rawString;
        this.numberOfFloatingBits = (this.rawMask.match(/X/g) || []).length;
    }
    
    applyMaskToAddress(address: number): number[] {
        const binaryAddress = address.toString(2).padStart(this.rawMask.length, '0');
        const maskedBinaryAddress = binaryAddress
            .split('')
            .map((digit, index) => {
                if (this.rawMask[index] === '0') {
                    return digit;
                }
                if (this.rawMask[index] === '1') {
                    return '1';
                }
                if (this.rawMask[index] === 'X') {
                    return 'X';
                }
                return this.rawMask[index];
            }).join('');
        
        let maskedAddresses = [];
        const numberOfCombinationsOfFloatingBits = Math.pow(2, this.numberOfFloatingBits);
        for (let i = 0; i < numberOfCombinationsOfFloatingBits; ++i) {
            const binaryString = i.toString(2).padStart(this.numberOfFloatingBits, '0');
            let floatingBitIndex = 0;
            const result = maskedBinaryAddress.replace(/X/g, () => {
                const collapsedBit = binaryString[floatingBitIndex];
                ++floatingBitIndex;
                return collapsedBit;
            });
            maskedAddresses.push(result);
        }
        
        return maskedAddresses.map(maskedAddress => parseInt(maskedAddress,2));
    }
}

class WriteInstruction implements Instruction {
    address: number;
    value: number;
    
    constructor(rawAddress: string, rawValue: string) {
        this.address = Number(rawAddress);
        this.value = Number(rawValue);
    }
    
    execute(context: ExecutionContext) {
        const addresses = context.currentMask.applyMaskToAddress(this.address);
        addresses.forEach(address => {
            context.memory[address] = this.value;
        });
    }
}