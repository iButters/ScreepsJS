/**
 * Created by Sascha Siebrecht on 03.12.2016.
 */
let myCreep = require('myCreep');

class Gatherer extends myCreep{
    constructor(creepName, homeRoom, targetFlag, role){
        super(creepName, homeRoom, targetFlag, role);
    }

    moveOnContainer(creep, source){
        let container = source.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
        })

        if(!container || creep.pos.getRangeTo(container) > 5)
            creep.moveTo(source);

        if(creep.pos.getRangeTo(container) > 0)
            creep.moveTo(container);
    }

    transferToClosestContainer(creep){
        let closestContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
        });
        let resourceType;
        let result;

        if(!closestContainer)
            return ERR_INVALID_TARGET;

        for(let resource in creep.carry){
            if(creep.carry[resource] > 0){
                resourceType = resource;
                break;
            }
        }

        result = creep.transfer(closestContainer, resourceType);

        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(closestContainer);
            result = creep.transfer(closestContainer, resourceType);
        }

        return result;
    }
}

module.exports = Gatherer;