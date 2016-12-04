/**
 * Created by Sascha Siebrecht on 03.12.2016.
 */
let Worker = require('Worker');

class Repairer extends Worker {
    constructor(creepName, homeRoom, targetFlag, role){
        super(creepName, homeRoom, targetFlag, role);
    }

    run(){
        let creep = Game.creeps[this.creepName];

        if(creep.memory.isRepairing && creep.carry.energy == 0)
            creep.memory.isRepairing = false;
        else if(!creep.memory.isRepairing && creep.carry.energy == creep.carryCapacity)
            creep.memory.isRepairing = true;

        let result;

        if(creep.memory.isRepairing) {
            result = this.moveToTargetFlag(creep);
            if(result == OK)
                return;

            result = this.repairStructures_NoWallsAndRamparts(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;

            result = this.repairRamparts(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;

            result = this.repairWalls(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
        }else {
            result = this.pickUpEnergy(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;

            result = this.withdrawFromStorage(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;

            result = this.withdrawFromSpawn(creep);
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

    repairStructures_NoWallsAndRamparts(creep){
        let damagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (t) => t.hits <= t.hitsMax - _.sum(creep.body, b => b.type == WORK)*100
            && t.structureType != STRUCTURE_WALL && t.structureType != STRUCTURE_RAMPART
        })
        let result;

        if(!damagedStructure)
            return ERR_INVALID_TARGET;

        result = creep.repair(damagedStructure);

        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(damagedStructure);
            result = creep.repair(damagedStructure);
        }

        return result;
    }

    repairRamparts(creep){
        let damagedRampart = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (t) => t.hits <= 100000 - _.sum(creep.body, b => b.type == WORK)*100 && t.structureType == STRUCTURE_RAMPART
        })
        let result;

        _.sortBy(damagedRampart, function(r1, r2){ return r1.hits - r2.hits });

        if(!damagedRampart)
            return ERR_INVALID_TARGET;

        result = creep.repair(damagedRampart);

        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(damagedRampart);
            result = creep.repair(damagedRampart);
        }

        return result;
    }

    repairWalls(creep){
        let damagedWall = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (t) => t.hits <= 100000 - _.sum(creep.body, b => b.type == WORK)*100
            && t.structureType == STRUCTURE_WALL
        })
        let result;

        if(!damagedWall)
            return ERR_INVALID_TARGET;

        result = creep.repair(damagedWall);

        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(damagedWall);
            result = creep.repair(damagedWall);
        }

        return result;
    }
}

module.exports = Repairer;
