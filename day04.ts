import * as fs from 'fs';

fs.readFile('input/day4input.txt', 'utf8', (err, rawInput) => {
    if (err) {
        console.error(err);
        return;
    }
    
    const unprocessedRows = 
        rawInput
            .replace(/\r/g, '')
            .split('\n\n')
            .filter(x => x != null && x !== '')
            .map(x => x.replace(/\n/g, ' ').trim());
            
    const passports = unprocessedRows.map(x => new Passport(x));
    const validPassports = passports.filter(x => x.isValid());
    const invalidPassports = passports.filter(x => !x.isValid());

    console.log(validPassports.length);
});

class Passport {
    birthYear: number;
    issueYear: number;
    expirationYear: number;
    height: string;
    hairColor: string;
    eyeColor: string;
    passportId: string;
    countryId: string;
    
    constructor(rawPassport: string) {
        const tokens = rawPassport.split(' ');
        tokens.forEach(token => {
            let [key, value] = token.split(':');
            
            switch (key) {
                case 'byr':
                    this.birthYear = Number(value);
                    break;
                case 'iyr':
                    this.issueYear = Number(value);
                    break;
                case 'eyr':
                    this.expirationYear = Number(value);
                    break;
                case 'hgt':
                    this.height = value;
                    break;
                case 'hcl':
                    this.hairColor = value;
                    break;
                case 'ecl':
                    this.eyeColor = value;
                    break;
                case 'pid':
                    this.passportId = value;
                    break;
                case 'cid':
                    this.countryId = value;
                    break;
                default:
                    console.error('passport with invalid key found:', key, value);
                    break;
            }
        });
    }
    
    isValid(): boolean {
        const allFieldsPresent = this.birthYear != null &&
            this.issueYear != null &&
            this.expirationYear != null &&
            this.height != null &&
            this.hairColor != null &&
            this.eyeColor != null &&
            this.passportId != null;
            
        if (!allFieldsPresent) {
            return false;
        }
        
        if (this.birthYear < 1920 || this.birthYear > 2002) {
            console.log('invalid birth year', this.birthYear);
            return false;
        }
        
        if (this.issueYear < 2010 || this.issueYear > 2020) {
            console.log('invalid issue year', this.issueYear);
            return false;
        }
        
        if (this.expirationYear < 2020 || this.expirationYear > 2030) {
            console.log('invalid expiration year', this.expirationYear);
            return false;
        }
        
        const matchedHeight = this.height.match(/^(?<height>[0-9]{2,3})(?<type>in|cm)$/);
        if (matchedHeight == null) {
            console.log('invalid height', this.height);
            return false;
        }
        const height = Number(matchedHeight.groups.height);
        if (matchedHeight.groups.type === 'in') {
            if (height < 59 || height > 76) {
                console.log('height out of range (in)', height);
                return false;
            }
        }
        if (matchedHeight.groups.type === 'cm') {
            if (height < 150 || height > 193) {
                console.log('height out of range (cm)', height);
                return false;
            }
        }
        
        const matchedHairColor = this.hairColor.match(/^#[a-f0-9]{6}$/);
        if (matchedHairColor == null) {
            console.log('invalid hair', this.hairColor);
            return false;
        }
        
        const matchedEyeColor = this.eyeColor.match(/^(amb|blu|brn|gry|grn|hzl|oth)$/);
        if (matchedEyeColor == null) {
            console.log('invalid hair', this.eyeColor);
            return false;
        }
        
        const matchedPassportId = this.passportId.match(/^[0-9]{9}$/);
        if (matchedPassportId == null) {
            console.log('invalid hair', this.passportId);
            return false;
        }
        
        return true;
    }
}
