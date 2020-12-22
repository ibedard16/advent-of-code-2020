
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
    // rawRules = ['0: 4 1 5', '1: 2 3 | 3 2', '2: 4 4 | 5 5', '3: 4 5 | 5 4', '4: "a"', '5: "b"'];
    const ruleRepository = new RuleRepository();
    
    const rules = rawRules.map(x => new Rule(x));
    rules.forEach(rule => ruleRepository.saveRule(rule));
    
    const rule0 = ruleRepository.getRule(0).getRuleValues();
    const matchingMessages = messages.filter(message => rule0.indexOf(message) != -1);
    console.log(matchingMessages);
    console.log(matchingMessages.length);
});

class RuleRepository {
    private static ListOfRules = [];
    
    saveRule(rule: Rule) {
        RuleRepository.ListOfRules.push(rule);
    }
    
    getRule(id: number): Rule {
        return RuleRepository.ListOfRules.find(x => x.id === id);
    }
}

class Rule {
    id: number;
    value: string;
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
    
    getRuleValues(): string[] {
        if (this.value) {
            return [this.value];
        }
        
        const ruleValues = this.rulesImplemented.map(ruleImplemented => {
            const rules =  ruleImplemented.map(ruleId => this.ruleRepository.getRule(ruleId).getRuleValues());
            let results = rules[0];
            rules.slice(1).forEach(rule => {
                const newRules = results.map(result => {
                    return rule.map(individualRule => result + individualRule);
                });
                results = (newRules as any).flat() as string[];
            });
            return results;
        });
        
        return (ruleValues as any).flat() as string[];
    }
}