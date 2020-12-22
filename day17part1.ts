const startingConfiguration = 
`
#....#.#
..##.##.
#..#..#.
.#..#..#
.#..#...
##.#####
#..#..#.
##.##..#
`.trim();

const targetIteration = 6;

class Cube {
    x: number;
    y: number;
    z: number;
    isActive: boolean;
    activeNeighborsCount = 0;
}

class CubeField {
    cubes: Cube[];
    
    constructor(rawField: string) {
        this.cubes = [];
        const rawCubes = rawField.split('\n').map(x => x.split(''));
        for (let yIndex = 0; yIndex < rawCubes.length; ++yIndex) {
            const cubeRow = rawCubes[yIndex];
            for (let xIndex = 0; xIndex < cubeRow.length; ++xIndex) {
                const cube = new Cube();
                cube.x = xIndex;
                cube.y = yIndex;
                cube.z = 0;
                cube.isActive = cubeRow[xIndex] === '#';
                this.cubes.push(cube);
            }
        }
    }
    
    getNeghbors(cube: Cube): Cube[] {
        const neighbors: Cube[] = [];
        
        for (let xIndex = cube.x -1; xIndex <= cube.x + 1; ++xIndex) {
            for (let yIndex = cube.y -1; yIndex <= cube.y + 1; ++yIndex) {
                for (let zIndex = cube.z -1; zIndex <= cube.z + 1; ++zIndex) {
                    if (xIndex === cube.x && yIndex === cube.y && zIndex === cube.z) {
                        continue;
                    }
                    
                    neighbors.push(this.getCubeWithIndex(xIndex,yIndex,zIndex));
                }
            }
        }
        
        return neighbors;
    }
    
    getCubeWithIndex(x: number, y: number, z: number): Cube {
        let cube = this.cubes.find(cube => cube.x === x && cube.y === y && cube.z === z);
        
        if (cube == null) {
            cube = new Cube();
            cube.isActive = false;
            cube.x = x;
            cube.y = y;
            cube.z = z;
            this.cubes.push(cube);
        }
        
        return cube;
    }
    
    getActiveCubes(): Cube[] {
        return this.cubes.filter(x => x.isActive);
    }
    
    doTick(): CubeField {
        // clone current field to get field for next tick
        const nextTick: CubeField = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        nextTick.cubes = this.cubes.map(cube => { return {...cube}; });
        
        const activeCubes = this.getActiveCubes();
        activeCubes.forEach(activeCube => 
            this.getNeghbors(activeCube).forEach(activeCubeNeighbor => 
                activeCubeNeighbor.activeNeighborsCount += 1
            )
        );
        
        const dyingCubes = activeCubes.filter(activeCube => activeCube.activeNeighborsCount < 2 || activeCube.activeNeighborsCount > 3);
        dyingCubes.forEach(dyingCube => 
            nextTick.getCubeWithIndex(dyingCube.x, dyingCube.y, dyingCube.z).isActive = false
        );
        
        const birthingCubes = this.cubes.filter(cube => !cube.isActive && cube.activeNeighborsCount === 3);
        birthingCubes.forEach(birthingCube => 
            nextTick.getCubeWithIndex(birthingCube.x, birthingCube.y, birthingCube.z).isActive = true
        );
        
        return nextTick;
    }
}

const cubeField = new CubeField(startingConfiguration);
const cubeFieldTicks = [cubeField];
for (let iteration = 0; iteration < targetIteration; ++iteration) {
    cubeFieldTicks.push(cubeFieldTicks[iteration].doTick());
}
console.log(`# of active cubes after ${targetIteration} iterations`, cubeFieldTicks[cubeFieldTicks.length - 1].getActiveCubes().length);