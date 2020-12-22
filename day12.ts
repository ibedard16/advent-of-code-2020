import { dir } from 'console';
import * as fs from 'fs';

fs.readFile('input/day12input.txt', 'utf8', (err, rawInput) => {
    if (err) {
        console.error(err);
        return;
    }
    
    const instructions = 
        rawInput
            .replace(/\r/g, '')
            .split('\n')
            .filter(x => x != null && x !== '')
            .map(x => x.trim())
            .map(x => new Instruction(x));
    
    const ship = new WaypointShip();
    
    console.log(instructions);
    
    instructions.forEach(instruction => ship.processInstruction(instruction));
    
    console.log(ship);
});

enum CardinalDirection {
    north = 'north',
    east = 'east',
    south = 'south',
    west = 'west'
}

class WaypointShip {
    north = 0;
    east = 0;
    waypoint = {
        north: 1,
        east: 10
    };
    
    processInstruction(instruction: Instruction) {
        if (instruction.type === 'move') {
            if (instruction.direction === 'forward') {
                this.moveToWaypoint(instruction.value);
            } else {
                this.moveWaypoint(instruction.direction, instruction.value);
            }
        } else if (instruction.type === 'turn') {
            this.turnWaypointRight(instruction.value);
        } else {
            throw `Error processing instruction, type not recognized ${instruction.type}`
        }
    }
    
    private moveToWaypoint(numberOfTimes: number) {
        this.north += this.waypoint.north * numberOfTimes;
        this.east += this.waypoint.east * numberOfTimes;
    }
    
    private moveWaypoint(direction: CardinalDirection, value: number) {
        switch (direction) {
            case CardinalDirection.north:
                this.waypoint.north += value;
                break;
            case CardinalDirection.east:
                this.waypoint.east += value;
                break;
            case CardinalDirection.south:
                this.waypoint.north -= value;
                break;
            case CardinalDirection.west:
                this.waypoint.east -= value;
                break;
            default:
                break;
        }
    }
    
    private turnWaypointRight(degrees) {
        const numberOfTimesToRotate = degrees / 90;
        for (let i = 0; i < numberOfTimesToRotate; ++i) {
            const newEast = this.waypoint.north;
            const newNorth = 0 - this.waypoint.east;
            this.waypoint.north = newNorth;
            this.waypoint.east = newEast;
        }
    }
}

class Ship {
    east = 0;
    north = 0;
    facing: CardinalDirection = CardinalDirection.east;
    
    processInstruction(instruction: Instruction) {
        if (instruction.type === 'move') {
            if (instruction.direction === 'forward') {
                this.moveDirection(this.facing, instruction.value);
            } else {
                this.moveDirection(instruction.direction, instruction.value);
            }
        } else if (instruction.type === 'turn') {
            this.turnRight(instruction.value);
        } else {
            throw `Error processing instruction, type not recognized ${instruction.type}`
        }
    }
    
    private moveDirection(direction: CardinalDirection, value: number) {
        switch (direction) {
            case CardinalDirection.north:
                this.north += value;
                break;
            case CardinalDirection.east:
                this.east += value;
                break;
            case CardinalDirection.south:
                this.north -= value;
                break;
            case CardinalDirection.west:
                this.east -= value;
                break;
            default:
                break;
        }
    }
    
    private turnRight(degrees: number) {
        const orderedDirections = [CardinalDirection.north, CardinalDirection.east, CardinalDirection.south, CardinalDirection.west];
        const cardinalDirectionsToAdvance = degrees / 90;
        const currentDirectionIndex = orderedDirections.indexOf(this.facing);
        const newDirectionIndex = (currentDirectionIndex + cardinalDirectionsToAdvance) % 4;
        this.facing = orderedDirections[newDirectionIndex];
    }
}

class Instruction {
    type: 'move' | 'turn';
    direction: CardinalDirection | 'forward';
    value: number;
    
    constructor(rawInstruction: string) {
        const rawType = rawInstruction[0];
        const rawValue = rawInstruction.slice(1);
        
        this.value = Number(rawValue);
        if (this.value === NaN) {
            throw `Instruction value was not a number! ${rawValue}`
        }
        
        switch (rawType) {
            case 'N':
                this.type = 'move';
                this.direction = CardinalDirection.north;
                break;
            case 'E':
                this.type = 'move';
                this.direction = CardinalDirection.east;
                break;
            case 'S':
                this.type = 'move';
                this.direction = CardinalDirection.south;
                break;
            case 'W':
                this.type = 'move';
                this.direction = CardinalDirection.west;
                break;
            case 'F':
                this.type = 'move';
                this.direction = 'forward';
                break;
            case 'L':
                this.type = 'turn';
                this.value = 360 - this.value;
                break;
            case 'R':
                this.type = 'turn';
                break;
            default:
                throw `type not recognized! ${rawType}`;
        }
    }
}