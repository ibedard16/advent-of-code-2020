import * as fs from 'fs';

fs.readFile('input/day8input.txt', 'utf8', (err, rawInput) => {
    if (err) {
        console.error(err);
        return;
    }
    
    const unprocessedInstructions = 
        rawInput
            .replace(/\r/g, '')
            .split('\n')
            .filter(x => x != null && x !== '')
            .map(x => x.trim());
    
    let instructionToChangeIndex = 0;
    let result = null;
    while (result == null) {
        try {
            const instructions = unprocessedInstructions.map(x => new Instruction(x));
            
            const instructionToChange = instructions.filter(x => x.type !== 'acc')[instructionToChangeIndex];
            if (instructionToChange.type === 'jmp') {
                instructionToChange.type = 'nop';
            } else if (instructionToChange.type === 'nop') {
                instructionToChange.type = 'jmp';
            }
            
            const executionContext = new ExecutionContext(instructions);
            result = executionContext.execute();
        } catch {
            instructionToChangeIndex += 1;
        }
    }
    
    console.log('result is ', result);
    console.log('instruction changed was ', instructionToChangeIndex);
});

class Instruction {
    type: 'nop'|'acc'|'jmp';
    value: number;
    executionCount = 0;
    
    constructor(unprocessedInstruction: string) {
        const matchedInstruction = unprocessedInstruction.match(/(?<instruction>nop|acc|jmp) (?<sign>\+|-)(?<value>[0-9]*)/);
        this.type = matchedInstruction.groups.instruction as 'nop'|'acc'|'jmp';
        this.value = Number(matchedInstruction.groups.value);
        if (matchedInstruction.groups.sign === '-') {
            this.value = this.value * -1;
        }
    }
}

class ExecutionContext {
    currentInstruction = 0;
    accumulator = 0;
    instructions: Instruction[];
    
    constructor(instructions: Instruction[]) {
        this.instructions = instructions;
    }
    
    execute() {
        while(this.currentInstruction < this.instructions.length) {
            this.processInstruction(this.instructions[this.currentInstruction]);
        }
        
        return this.accumulator;
    }
    
    private processInstruction(instruction: Instruction) {
        instruction.executionCount += 1;
        if (instruction.executionCount > 1) {
            throw `Instruction was executed twice! Program will loop forever. currentInstruction#: ${this.currentInstruction}, acc: ${this.accumulator}`;
        }
        
        if (instruction.type === 'acc') {
            this.accumulator += instruction.value;
            this.currentInstruction += 1;
        } else if (instruction.type === 'jmp') {
            this.currentInstruction += instruction.value;
        } else if (instruction.type === 'nop') {
            this.currentInstruction += 1;
        }
    }
}