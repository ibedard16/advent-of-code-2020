import * as fs from 'fs';

fs.readFile('input/day6input.txt', 'utf8', (err, rawInput) => {
    if (err) {
        console.error(err);
        return;
    }
    
    const unprocessedGroups = 
        rawInput
            .replace(/\r/g, '')
            .split('\n\n')
            .filter(x => x != null && x !== '')
            .map(x => x.trim());
    
    const seats = unprocessedGroups.map(x => new GroupUnanimousAnswers(x));
    console.log('answers', seats.map(x => x.yesAnswers.size).reduce((total, element) => total += element));
});

class GroupAnswers {
    yesAnswers = new Set<string>();
    
    constructor(rawAnswers: string) {
        const individualResponses = rawAnswers.split('\n');
        individualResponses.forEach(individualResponse => {
            individualResponse.split('').forEach(answer => this.yesAnswers.add(answer));
        });
        console.log(this.yesAnswers);
    }
}

class GroupUnanimousAnswers {
    yesAnswers = new Set<string>();
    
    constructor(rawAnswers: string) {
        const rawIndividualResponses = rawAnswers.split('\n');
        const individualResponses = rawIndividualResponses.map(individualResponse => {
            return new Set<string>(individualResponse.split(''));
        });
        this.yesAnswers = individualResponses.reduce((intersection, element) => {
            console.log(intersection, element);
            return new Set(Array.from(intersection).filter(x => element.has(x)));
        });
        console.log(this.yesAnswers);
    }
}

