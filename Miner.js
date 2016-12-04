/**
 * Created by Sascha Siebrecht on 03.12.2016.
 */
let Gatherer = require('Gatherer');

class Miner extends Gatherer{
    constructor(creepName, homeRoom, targetFlag, role){
        super(creepName, homeRoom, targetFlag, role);
    }

    run(){
        let creep = Game.creeps[this.creepName];

        if(creep.memory.isGathering && _.sum(creep.carry) == creep.carryCapacity
            && creep.carryCapacity > 0)
            creep.memory.isGathering = false;
        else if(!creep.memory.isGathering && _.sum(creep.carry) == 0)
            creep.memory.isGathering = true;

        let result;

        if (creep.memory.isGathering) {
            result = this.moveToTargetFlag(creep);
            if(result == OK)
                return;

            result = this.harvestMineral(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
        } else {
            result = this.transferToClosestContainer(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
        }
    }

    harvestMineral(creep){
        let resourceMineral = creep.pos.findClosestByRange(FIND_MINERALS);
        let result;

        result = creep.harvest(resourceMineral);

        this.moveOnContainer(creep, resourceMineral);

        if(result == ERR_NOT_IN_RANGE)
            creep.moveTo(resourceMineral);

        return result;
    }
};

module.exports = Miner;
