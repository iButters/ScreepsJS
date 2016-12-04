/**
 * Created by Sascha Siebrecht on 03.12.2016.
 */
let Carrier = require('Carrier');

class Distributor extends Carrier{
    constructor(creepName, homeRoom, targetFlag, role){
        super(creepName, homeRoom, targetFlag, role);
    }

    run(){
        let creep = Game.creeps[this.creepName];

        if(!creep.memory.isSpreading)
            creep.memory.isSpreading = false;
        if(creep.memory.isSpreading && creep.carry.energy == 0)
            creep.memory.isSpreading = false;
        else if(!creep.memory.isSpreading && creep.carry.energy == creep.carryCapacity)
            creep.memory.isSpreading = true;

        let result;

        if(creep.memory.isSpreading) {
            result = this.transferToClosestSpawnOrExtension(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;

            result = this.transferToClosestTower(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;

            //TODO: transferToLink
        }else {
            result = this.withdrawFromStorage(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
        }
    }

    withdrawFromStorage(creep){
        let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_STORAGE
        });
        let result;

        if(!container)
            return ERR_INVALID_TARGET;
        else if(container.store[RESOURCE_ENERGY] == 0)
            return ERR_NOT_ENOUGH_ENERGY;

        result = creep.withdraw(container, RESOURCE_ENERGY);

        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(container);
            result = creep.withdraw(container, RESOURCE_ENERGY);
        }

        return result;
    }
};

module.exports = Distributor;