import * as fs from 'fs';

fs.readFile('input/day16input.txt', 'utf8', (err, rawInput) => {
    if (err) {
        console.error(err);
        return;
    }
    
    const rawInputGroups = 
        rawInput
            .replace(/\r/g, '')
            .split('\n\n')
            .filter(x => x != null && x !== '')
            .map(x => x.trim());
    
    const fieldValidators = rawInputGroups[0].split('\n').map(x => new FieldValidator(x));
    const myTicket = new Ticket(rawInputGroups[1].split('\n')[1]);
    const nearbyTickets = rawInputGroups[2].split('\n').slice(1).map(x => new Ticket(x));
    
    const errorsOnTickets = (nearbyTickets
        .map(nearbyTicket => nearbyTicket.findInvalidFieldValues(fieldValidators)) as any)
        .flat() as number[];
    
    console.log('invalid fields: ', errorsOnTickets);
    console.log('scanning error rate: ', errorsOnTickets.reduce((total, item) => total + item, 0));
    
    const validTickets = nearbyTickets.filter(nearbyTicket => nearbyTicket.findInvalidFieldValues(fieldValidators).length === 0);
    let possibleFields = fieldValidators.map(x => { return { validator: x, possibleFields: x.getPossibleFields(validTickets)}});
    
    const orderedFieldValidators = new Array<FieldValidator>(fieldValidators.length);
    while (possibleFields.filter(x => x.possibleFields.length === 1).length > 0) {
        const knownFieldValidator = possibleFields.filter(x => x.possibleFields.length === 1)[0];
        const fieldId = knownFieldValidator.possibleFields[0];
        orderedFieldValidators[fieldId] = knownFieldValidator.validator;
        
        const indexOfKnownField = possibleFields.indexOf(knownFieldValidator);
        possibleFields.splice(indexOfKnownField, 1);
        
        possibleFields = possibleFields.map(x => {
            const indexOfKnownFieldId = x.possibleFields.indexOf(fieldId);
            if (indexOfKnownFieldId !== -1) {
                x.possibleFields.splice(indexOfKnownFieldId, 1);
            }
            return x;
        });
    }
    
    console.log();
    
    let departureFieldProduct = 1;
    myTicket.fieldValues.forEach((fieldValue, index) => {
        const fieldName = orderedFieldValidators[index].fieldName;
        console.log('my', fieldName, ':', fieldValue);
        if (fieldName.slice(0,9) === 'departure') {
            departureFieldProduct *= fieldValue;
        }
    });
    console.log('departure field product', departureFieldProduct);
});

class FieldValidator {
    fieldName: string;
    validRanges: {
        lowerBound: number;
        upperBound: number;
    }[] = [];
    
    constructor(rawFieldValidator) {
        const matchedField = rawFieldValidator.match(/^(?<fieldName>[a-z ]*): (?<lowerRange>[0-9]*-[0-9]*) or (?<upperRange>[0-9]*-[0-9]*)$/);
        
        this.fieldName = matchedField.groups.fieldName;
        
        const lowerRange = matchedField.groups.lowerRange.split('-').map(x => Number(x));
        this.validRanges.push({lowerBound: lowerRange[0], upperBound: lowerRange[1]});
        
        const upperRange = matchedField.groups.upperRange.split('-').map(x => Number(x));
        this.validRanges.push({lowerBound: upperRange[0], upperBound: upperRange[1]});
    }
    
    validateField(fieldValue: number): boolean {
        for (let index = 0; index < this.validRanges.length; ++index) {
            const validRange = this.validRanges[index];
            if (fieldValue >= validRange.lowerBound && fieldValue <= validRange.upperBound) {
                return true;
            }
        }
        return false;
    }
    
    getPossibleFields(tickets: Ticket[]) {
        const possibleFields = [];
        const numberOfFields = tickets[0].fieldValues.length;
        for (let field = 0; field < numberOfFields; ++field) {
            let ticket;
            for (ticket = 0; ticket < tickets.length; ++ticket) {
                if (!this.validateField(tickets[ticket].fieldValues[field])) {
                    break;
                }
            }
            if (ticket === tickets.length) {
                possibleFields.push(field);
            }
        }
        return possibleFields;
    }
}

class Ticket {
    fieldValues: number[];
    constructor(rawTicket: string) {
        this.fieldValues = rawTicket.split(',').map(x => Number(x));
    }
    
    findInvalidFieldValues(validators: FieldValidator[]): number[] {
        return this.fieldValues.filter(fieldValue => {
            for (let index = 0; index < validators.length; ++index) {
                const currentValidator = validators[index];
                if (currentValidator.validateField(fieldValue)) {
                    // exclude valid fields
                    return false;
                }
            }
            return true;
        });
    }
}
