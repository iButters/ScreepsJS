/**
 * Created by Sascha Siebrecht on 03.12.2016.
 */

let myCreep = require('myCreep');

class Worker extends myCreep{
    constructor(creepName, homeRoom, targetFlag, role){
        super(creepName, homeRoom, targetFlag, role);
    }

    pickUpEnergy(creep){
        let droppedEnergy = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, {
            filter: d => d.resourceType == RESOURCE_ENERGY && d.amount > 50
        });
        let result;

        if(!droppedEnergy)
            return ERR_INVALID_TARGET;
        else if(droppedEnergy.energy < 50)
            return ERR_NOT_ENOUGH_ENERGY;

        result = creep.pickup(droppedEnergy);

        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(droppedEnergy);
            result = creep.pickup(droppedEnergy);
        }

        return result;
    }

    withdrawFromClosestContainer(creep) {
        let closestContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
        });
        let result;

        if (!closestContainer)
            return ERR_INVALID_TARGET;
        else if (closestContainer.store[RESOURCE_ENERGY] == 0)
            return ERR_NOT_ENOUGH_ENERGY;

        result = creep.withdraw(closestContainer, RESOURCE_ENERGY);

        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(closestContainer);
            result = creep.withdraw(closestContainer, RESOURCE_ENERGY);
        }

        return result;
    }

    withdrawFromStorage(creep){
        let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_STORAGE
        });
        let result;

        if(!container)
            return  ERR_INVALID_TARGET;
        else if(container.store[RESOURCE_ENERGY] == 0)
            return ERR_NOT_ENOUGH_ENERGY;

        result = creep.withdraw(container, RESOURCE_ENERGY);

        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(container);
            result = creep.withdraw(container, RESOURCE_ENERGY);
        }

        return result;
    }

    withdrawFromSpawn(creep){
        let spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS, {
            filter: s => s.energy > 0
        });
        let result;

        if(!spawn)
            return ERR_INVALID_TARGET;

        result = creep.withdraw(spawn, RESOURCE_ENERGY);

        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(spawn);
            result = creep.withdraw(spawn, RESOURCE_ENERGY);
        }

        return result;
    }
}

module.exports = Worker;