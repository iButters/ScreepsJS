let UtilityCreepActions = require('UtilityCreepActions');

var CreepDistributor = {
    run: function (creep, creepCounter) {
        let currentRoom = creep.room;
        let homeRoom = Game.rooms[creep.memory.homeRoom];
        let targetFlag = Game.flags[creep.memory.targetFlag];
        
        let result;
        
        //Switches between fetch and deliver energy
        if (creep.memory.isSpreading && _.sum(creep.carry) == 0)
            creep.memory.isSpreading = false;
        else if (!creep.memory.isSpreading && _.sum(creep.carry) == creep.carryCapacity)
            creep.memory.isSpreading = true;
            
        if (creep.memory.isSpreading) {
            result = UtilityCreepActions.moveToHomeRoom(creep, currentRoom, homeRoom);
            if(result != -400)
                return;
            
            result = DistributorUtility.transferToStorage(creep)
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
                
            result = DistributorUtility.transferToClosestSpawnOrExtension(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
                
            result = DistributorUtility.transferToClosestTower(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
        } else {
            result = UtilityCreepActions.moveToTargetFlag(creep, currentRoom, targetFlag);
            if(result != -400)
                return;
                
            result = DistributorUtility.pickUpResource(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
                
            result = DistributorUtility.withdrawFromContainer(creep, creepCounter);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
                    
            result = DistributorUtility.withdrawFromContainer(creep, ++creepCounter);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
        }
    }
}

class DistributorUtility{
    static pickUpResource(creep){
        let closestResource = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 15)[0];
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
    
    static withdrawFromContainer(creep, creepCounter){
        let containers = creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_CONTAINER });
        let sourceNo = creepCounter % containers.length;
        let resourceType;
        let result;
        
        if(containers.length < sourceNo)
            return ERR_INVALID_TARGET;
        else if(_.sum(containers[sourceNo].store) < creep.carryCapacity / 2)
            return ERR_NOT_ENOUGH_RESOURCES;
        
        for(let type in containers[sourceNo].store){
            if(containers[sourceNo].store[type] > 0){
                resourceType = type;
                break;
            }
        }
        
        result = creep.withdraw(containers[sourceNo], resourceType);
        
        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(containers[sourceNo]);
            result = creep.withdraw(containers[sourceNo], resourceType);
        }
        
        return result;
    }
    
    static transferToStorage(creep){
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
    
    static transferToClosestSpawnOrExtension(creep){
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
    
    static transferToClosestTower(creep){
        let closestTower = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity });
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
}

module.exports = CreepDistributor;