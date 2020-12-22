
import * as fs from 'fs';

fs.readFile('input/day18input.txt', 'utf8', (err, rawInput) => {
    if (err) {
        console.error(err);
        return;
    }
    
// uncomment for test input
//     rawInput = `
// 1 + 2 * 3 + 4 * 5 + 6
// 1 + (2 * 3) + (4 * (5 + 6))
// 2 * 3 + (4 * 5)
// 5 + (8 * 3 + 9 + 3 * 4 * 3)
// 5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))
// ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2
// `;
    
    const rawProblems = 
        rawInput
            .replace(/\r/g, '')
            .split('\n')
            .filter(x => x != null && x !== '')
            .map(x => x.trim());
    console.log(rawProblems);
    
    // uncomment for part 1
    // const problems = rawProblems.map(x => new Problem(x));
    const problems = rawProblems.map(x => new AdvancedProblem(x));
    
    // uncomment to debug problem answers
    // problems.forEach(problem => console.log(problem.rawProblem, problem.evaluate()));
    
    const sumOfProbemAnswers = problems.map(x => x.evaluate()).reduce((total, item) => total + item, 0);
    console.log('sum of problem answers:', sumOfProbemAnswers);
});

// pt 1
class Problem {
    rawProblem: string;
    tokens: string[] = [];
    
    constructor(rawProblem: string) {
        this.rawProblem = rawProblem;
        // converts problem to tokens, orders in reverse polish notation
        const parsedTokens = rawProblem.replace(/\(/g, '( ').replace(/\)/g, ' )').split(' ');
        
        const operatorStack = [];
        parsedTokens.forEach(token => {
            if (!isNaN(Number(token))) {
                this.tokens.push(token);
                while (operatorStack.length !== 0 && operatorStack[operatorStack.length - 1] !== '(') {
                    this.tokens.push(operatorStack.pop());
                }
                return;
            }
            
            if (token === '(') {
                operatorStack.push(token);
                return;
            }
            
            if (token === ')') {
                let operator = operatorStack.pop();
                while (operator !== '(') {
                    this.tokens.push(operator);
                    operator = operatorStack.pop();
                }
                while (operatorStack.length !== 0 && operatorStack[operatorStack.length - 1] !== '(') {
                    this.tokens.push(operatorStack.pop());
                }
                return;
            }
            
            operatorStack.push(token);
        });
        
        while (operatorStack.length !== 0) {
            let operator = operatorStack.pop();
            if (operator === '(') {
                continue;
            }
            this.tokens.push(operator);
        }
    }
    
    evaluate(): number {
        const answerStack: number[] = [];
        
        this.tokens.forEach(token => {
            if (!isNaN(Number(token))) {
                answerStack.push(Number(token))
            } else if (token === '+') {
                answerStack.push(answerStack.pop() + answerStack.pop());
            } else if (token === '*') {
                answerStack.push(answerStack.pop() * answerStack.pop());
            } else {
                throw `Unrecognized token found during evaluation ${token}`;
            }
        });
        
        if (answerStack.length > 1) {
            console.error('Token stack was unbalanced!', this.tokens);
        }
        
        return answerStack.pop();
    }
}

// pt 2
class AdvancedProblem {
    rawProblem: string;
    tokens: string[] = [];
    
    constructor(rawProblem: string) {
        this.rawProblem = rawProblem;
        // converts problem to tokens, orders in reverse polish notation
        const parsedTokens = rawProblem.replace(/\(/g, '( ').replace(/\)/g, ' )').split(' ');
        
        const operatorStack = [];
        parsedTokens.forEach(token => {
            if (!isNaN(Number(token))) {
                this.tokens.push(token);
                while (operatorStack.length !== 0 && operatorStack[operatorStack.length - 1] !== '(' && operatorStack[operatorStack.length - 1] !== '*') {
                    this.tokens.push(operatorStack.pop());
                }
                return;
            }
            
            if (token === '(') {
                operatorStack.push(token);
                return;
            }
            
            if (token === ')') {
                let operator = operatorStack.pop();
                while (operator !== '(') {
                    this.tokens.push(operator);
                    operator = operatorStack.pop();
                }
                while (operatorStack.length !== 0 && operatorStack[operatorStack.length - 1] !== '(' && operatorStack[operatorStack.length - 1] !== '*') {
                    this.tokens.push(operatorStack.pop());
                }
                return;
            }
            
            operatorStack.push(token);
        });
        
        while (operatorStack.length !== 0) {
            let operator = operatorStack.pop();
            if (operator === '(') {
                continue;
            }
            this.tokens.push(operator);
        }
    }
    
    evaluate(): number {
        const answerStack: number[] = [];
        
        this.tokens.forEach(token => {
            if (!isNaN(Number(token))) {
                answerStack.push(Number(token))
            } else if (token === '+') {
                answerStack.push(answerStack.pop() + answerStack.pop());
            } else if (token === '*') {
                answerStack.push(answerStack.pop() * answerStack.pop());
            } else {
                throw `Unrecognized token found during evaluation ${token}`;
            }
        });
        
        if (answerStack.length > 1) {
            console.error('Token stack was unbalanced!', this.tokens);
        }
        
        return answerStack.pop();
    }
}
