import * as fs from 'fs';

fs.readFile('input/day7input.txt', 'utf8', (err, rawInput) => {
    if (err) {
        console.error(err);
        return;
    }
    
    const unprocessedBags = 
        rawInput
            .replace(/\r/g, '')
            .split('.\n')
            .filter(x => x != null && x !== '')
            .map(x => x.trim());
    
    const bagRepository = new BagRepository();
    const bagProcessor = new BagProcessor();
    
    const processedBags = unprocessedBags.map(x => bagProcessor.handleRawBag(x));
    // uncomment for answer to part 1
    // const shinyGoldBag = bagRepository.getBag('shiny gold');
    
    // console.log('shiny gold bags are contained in', shinyGoldBag.parentBags);
    // const parentBags = Array.from(shinyGoldBag.parentBags);
    // const parentBagSet = new Set(shinyGoldBag.parentBags);
    // for (let i = 0; i < parentBags.length; ++i) {
    //     const parentBagName = parentBags[i];
    //     const parentBag = bagRepository.getBag(parentBagName);
        
    //     console.log(parentBag.colorDescription, 'are contained in', parentBag.parentBags);
        
    //     parentBag.parentBags.forEach(metaParent => {
    //         parentBags.push(metaParent);
    //         parentBagSet.add(metaParent);
    //     });
    // }
    // console.log(parentBagSet.size);
    
    console.log('bag subcount', bagRepository.getBagSubCount('shiny gold'))
});

class BagRepository {
    private static _bagList: {
        [key: string]: Bag
    } = {};
    
    getBag(colorDescription: string): Bag {
        let bag = BagRepository._bagList[colorDescription];
        if (bag == null) {
            bag = new Bag(colorDescription);
            BagRepository._bagList[colorDescription] = bag;
        }
        return bag;
    }
    
    saveBag(bag: Bag) {
        BagRepository._bagList[bag.colorDescription] = bag;
    }
    
    getBagSubCount(colorDescription: string): number {
        const childBags = this.getBag(colorDescription).childBags;
        let bagCount = 0;
        for (let i = 0; i < childBags.length; ++i) {
            bagCount += childBags[i].count * (1 + this.getBagSubCount(childBags[i].color));
        };
        return bagCount;
    }
}

class BagProcessor {
    private _repository: BagRepository;
    
    constructor() {
        this._repository = new BagRepository();
    }
    
    handleRawBag(rawBag: string): Bag {
        const [bagDescription, rawChildBags] = rawBag.split(' bags contain ');
        
        const bag: Bag = this._repository.getBag(bagDescription);

        if (rawChildBags !== 'no other bags') {
            rawChildBags.split(', ').forEach(childBagDescription => {
                const childBagDescriptionMatch = childBagDescription.match(/(?<count>[1-9]) (?<color>.*) bag[s]{0,1}/);
                const childBag = this._repository.getBag(childBagDescriptionMatch.groups.color);
                
                bag.childBags.push({
                    color: childBag.colorDescription,
                    count: Number(childBagDescriptionMatch.groups.count)
                });
                childBag.parentBags.add(bag.colorDescription);
                
                this._repository.saveBag(childBag);
            });
        }
        
        this._repository.saveBag(bag);
        return bag;
    }
}

class Bag {
    colorDescription: string;
    parentBags: Set<string>;
    childBags: {
        color: string;
        count: number;
    }[];
    
    constructor(colorDescription) {
        this.colorDescription = colorDescription;
        this.parentBags = new Set();
        this.childBags = [];
    }
}