
import * as fs from 'fs';

fs.readFile('input/day19input.txt', 'utf8', (err, rawInput) => {
    if (err) {
        console.error(err);
        return;
    }
    
    let [rawRules, messages] = 
        rawInput
            .replace(/\r/g, '')
            .split('\n\n')
            .filter(x => x != null && x !== '')
            .map(x => x.trim().split('\n'));

    const ruleRepository = new RuleRepository();
    
    const rules = rawRules.map(x => new Rule(x));
    rules.forEach(rule => ruleRepository.saveRule(rule));
    
    // special rules
    const rule8 = new Rule8();
    ruleRepository.saveRule(rule8);
    const rule11 = new Rule11();
    ruleRepository.saveRule(rule11);
    
    const rule0 = ruleRepository.getRule(0);
    const matchingMessages = rule0.getRuleMatches(messages);
    
    console.log(messages.length, matchingMessages.length);
});

class RuleRepository {
    private static ListOfRules: IRule[] = [];
    
    saveRule(rule: IRule) {
        RuleRepository.ListOfRules[rule.id] = rule;
    }
    
    getRule(id: number): IRule {
        return RuleRepository.ListOfRules[id];
    }
}

interface IRule {
    id: number;
    getRuleRegex(): RegExp;
    getRuleMatches(possibleMatches: string[]): string[];
}

class Rule implements IRule {
    id: number;
    value: string;
    regex: RegExp;
    rulesImplemented: number[][];
    ruleRepository = new RuleRepository();
    
    constructor(rawRule: string) {
        const [id, rule] = rawRule.split(':').map(x => x.trim());
        
        this.id = Number(id);
        
        if (rule === '"a"' || rule === '"b"') {
            this.value = rule[1];
        } else {
            this.rulesImplemented = rule.split(' | ').map(x => x.split(' ').map(y => Number(y)));
        }
    }
    
    getRuleRegex(): RegExp {
        if (this.regex) {
            return this.regex;
        }
        
        if (this.value != null) {
            const regex = new RegExp('^' + this.value + '$');
            this.regex = regex;
            return regex;
        }
        
        const ruleValues = this.rulesImplemented.map(ruleIdsImplemented => {
            const regexRules = ruleIdsImplemented.map(ruleId => this.ruleRepository.getRule(ruleId).getRuleRegex());
            const rule = regexRules.map(x => x.source).map(x => x.substr(1, x.length-2)).join('');
            return rule;
        });
        
        const regex = new RegExp('^(?:' + ruleValues.join('|') + ')$');
        this.regex = regex;
        return regex;
    }
    
    getRuleMatches(possibleMatches: string[]): string[] {
        const regex = this.getRuleRegex();
        
        return possibleMatches.filter(possibleMatch => possibleMatch.match(regex));
    }
}

class Rule8 implements IRule {
    id = 8;
    regex: RegExp;
    ruleRepository = new RuleRepository();
    
    getRuleRegex(): RegExp {
        if (this.regex) {
            return this.regex;
        }
        
        let rule42Regex = this.ruleRepository.getRule(42).getRuleRegex().source;
        rule42Regex = rule42Regex.substr(1, rule42Regex.length - 2);
        
        const regex = new RegExp('^(?:' + rule42Regex + ')+$');
        this.regex = regex;
        return regex;
    }
    
    getRuleMatches(possibleMatches: string[]): string[] {
        const regex = this.getRuleRegex();
        
        return possibleMatches.filter(possibleMatch => possibleMatch.match(regex));
    }
}

class Rule11 implements IRule {
    id = 11;
    regex: RegExp;
    ruleRepository = new RuleRepository();
    
    getRuleRegex(): RegExp {
        if (this.regex) {
            return this.regex;
        }
        
        let rule42Regex = this.ruleRepository.getRule(42).getRuleRegex().source;
        rule42Regex = rule42Regex.substr(1, rule42Regex.length - 2);
        
        let rule31Regex = this.ruleRepository.getRule(31).getRuleRegex().source;
        rule31Regex = rule31Regex.substr(1, rule31Regex.length - 2);
        
        // Javascript-flavored regex cannot match infinitely nested groups, so this is a cheat to match groups nested up to 8 times
        let nestedRegex = rule42Regex + rule31Regex;
        for (let i = 0; i < 10; ++i) {
            nestedRegex = rule42Regex + '(?:' + nestedRegex + ')?' + rule31Regex;
        }
        
        const regex = new RegExp('^(?:' + nestedRegex + ')$');
        this.regex = regex;
        return regex;
    }
    
    getRuleMatches(possibleMatches: string[]): string[] {
        const regex = this.getRuleRegex();
        
        return possibleMatches.filter(possibleMatch => possibleMatch.match(regex));
    }
}
