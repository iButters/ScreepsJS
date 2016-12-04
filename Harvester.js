/**
 * Created by Sascha Siebrecht on 03.12.2016.
 */
let Gatherer = require('Gatherer');

class Harvester extends Gatherer{
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

            result = this.harvestEnergySource(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
        } else {
            result = this.transferToClosestContainer(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
        }
    }

    harvestEnergySource(creep){
        let energySources = creep.room.find(FIND_SOURCES);
        let sourceNo = creep.memory.sourceNo % energySources.length;
        let result;

        if(energySources.length < sourceNo)
            return ERR_INVALID_TARGET;

        this.moveOnContainer(creep, energySources[sourceNo]);

        result = creep.harvest(energySources[sourceNo]);

        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(energySources[sourceNo]);
            result = creep.harvest(energySources[sourceNo]);
        }

        return result;
    }
}

module.exports = Harvester;