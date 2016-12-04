/**
 * Created by Sascha Siebrecht on 03.12.2016.
 */
let Worker = require('Worker');

class Builder extends Worker {
    constructor(creepName, homeRoom, targetFlag, role){
        super(creepName, homeRoom, targetFlag, role);
    }

    run(){
        let creep = Game.creeps[this.creepName];

        if(!creep.memory.isBuilding)
            creep.memory.isBuilding = false;
        if(creep.memory.isBuilding && creep.carry.energy == 0)
            creep.memory.isBuilding = false;
        else if(!creep.memory.isBuilding && creep.carry.energy == creep.carryCapacity)
            creep.memory.isBuilding = true;

        let result;

        if(creep.memory.isBuilding) {
            result = this.moveToTargetFlag(creep);
            if(result == OK)
                return;

            result = this.buildClosestStructure(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
        }else {
            result = this.withdrawFromStorage(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;

            result = this.withdrawFromSpawn(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;

            result = this.pickUpEnergy(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;

            result = this.withdrawFromClosestContainer(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;

            result = this.moveToHomeRoom(creep);
            if(result == OK)
                return;
        }
    }

    buildClosestStructure(creep){
        let closestStructure = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
        let result;

        result = creep.build(closestStructure);

        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(closestStructure);
            result = creep.build(closestStructure);
        }

        return result;
    }
}

module.exports = Builder;