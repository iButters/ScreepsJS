/**
 * Created by Sascha Siebrecht on 03.12.2016.
 */
let myCreep = require('myCreep');

class Carrier extends myCreep{
    constructor(creepName, homeRoom, targetFlag, role){
        super(creepName, homeRoom, targetFlag, role);
    }

    pickUpResource(creep){
        let closestResource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: r => (r.resourceType == RESOURCE_ENERGY && r.amount > 50) || r.resourceType != RESOURCE_ENERGY
        });
        let result;

        if(!closestResource)
            return ERR_INVALID_TARGET;

        result = creep.pickup(closestResource);

        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(closestResource);
            result = creep.moveTo(closestResource);
        }

        return result;
    }

    transferToStorage(creep){
        let storage = creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_STORAGE })[0];
        let resourceType;
        let result;

        if(!storage)
            return ERR_INVALID_TARGET;

        for(let resource in creep.carry){
            if(creep.carry[resource] > 0){
                resourceType = resource;
                break;
            }
        }

        result = creep.transfer(storage, resourceType);

        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(storage);
            result = creep.transfer(storage, resourceType);
        }

        return result;
    }

    transferToClosestSpawnOrExtension(creep){
        let closestTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, {  filter: s =>
        (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && s.energy < s.energyCapacity
        });
        let result;

        if(!closestTarget)
            return ERR_INVALID_TARGET;

        result = creep.transfer(closestTarget, RESOURCE_ENERGY);

        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(closestTarget);
            result = creep.transfer(closestTarget, RESOURCE_ENERGY);
        }

        return result;
    }

    transferToClosestTower(creep){
        let closestTower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity
        });
        let result;

        if(!closestTower)
            return ERR_INVALID_TARGET;

        result = creep.transfer(closestTower, RESOURCE_ENERGY);

        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(closestTower);
            result = creep.transfer(closestTower, RESOURCE_ENERGY);
        }

        return result;
    }
};

module.exports = Carrier;