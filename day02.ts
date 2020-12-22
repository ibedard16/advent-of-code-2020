import * as fs from 'fs';

fs.readFile('input/day2input.txt', 'utf8', (err, rawInput) => {
    if (err) {
        console.error(err);
        return;
    }
    
    const unprocessedPasswords = rawInput.split('\n').filter(x => x != null && x !== '').map(x => x.trim());
    const passwords = unprocessedPasswords.map(x => new TobogganPassword(x));
    const validPasswords = passwords.filter(x => x.isValid());
    console.log('valid passwords count:', validPasswords.length);
});

class Password {
    minRequiredCharCount: number;
    maxRequiredCharCount: number;
    requiredChar: string;
    password: string;
    
    constructor(unprocessedPassword: string) {
        const tokens = unprocessedPassword.split(' ');
        const charCountTokens = tokens[0].split('-');
        this.minRequiredCharCount = Number(charCountTokens[0]);
        this.maxRequiredCharCount = Number(charCountTokens[1]);
        this.requiredChar = tokens[1].split(':')[0];
        this.password = tokens[2];
    }
    
    isValid() {
        console.log(this.password);
        const requiredCharMatches = this.password.match(new RegExp(this.requiredChar, 'g')) || [];
        console.log(requiredCharMatches)
        const requiredCharCount = requiredCharMatches.length;
        return requiredCharCount >= this.minRequiredCharCount && requiredCharCount <= this.maxRequiredCharCount;
    }
}

class TobogganPassword {
    requiredPositions: number[];
    requiredChar: string;
    password: string;
    
    constructor(unprocessedPassword: string) {
        const tokens = unprocessedPassword.split(' ');
        this.requiredPositions = tokens[0].split('-').map(x => Number(x) - 1);
        this.requiredChar = tokens[1].split(':')[0];
        this.password = tokens[2];
    }
    
    isValid() {
        const foundMatches = this.requiredPositions.map(position => this.password[position] === this.requiredChar).filter(matchFound => matchFound);
        return foundMatches.length === 1;
    }
}