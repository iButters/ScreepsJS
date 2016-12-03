let UtilityCreepActions = require('UtilityCreepActions');

var CreepHarvester = {
    run: function(creep, sourceCounter) {
        let currentRoom = creep.room;
        let homeRoom = Game.rooms[creep.memory.homeRoom];
        let targetFlag = Game.flags[creep.memory.targetFlag];
        
        let deliver = _.filter(Game.creeps, c => c.memory.targetFlag == creep.memory.targetFlag && c.memory.role == 'Distributor').length == 0;
        
        let result;
        
        //Switches between harvesting and storing energy
        if(creep.memory.isGathering && _.sum(creep.carry) == creep.carryCapacity && creep.carryCapacity > 0)
            creep.memory.isGathering = false;
            
        else if(!creep.memory.isGathering && _.sum(creep.carry) == 0)
            creep.memory.isGathering = true;

        if (creep.memory.isGathering) {
	        result = UtilityCreepActions.moveToTargetFlag(creep, currentRoom, targetFlag);
	        if(result == OK) 
	            return;
            
            result = HarvesterUtility.harvestEnergySource(creep, sourceCounter);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
	    } else {
            if(currentRoom != homeRoom && deliver){ //See next comment below. Travels through rooms too
                result = UtilityCreepActions.moveToHomeRoom(creep, currentRoom, homeRoom);
	            if(result == OK) 
	                return;
                
            }else if(deliver){  //If there are no distributors to deliver the energy to spawn just do it by yourself
                result = HarvesterUtility.transferToStorage(creep, RESOURCE_ENERGY)
                if(result == OK || result == ERR_NOT_IN_RANGE)
                    return;
                
                result = HarvesterUtility.transferToClosestSpawnOrExtension(creep);
                if(result == OK || result == ERR_NOT_IN_RANGE)
                    return;
                
                result = HarvesterUtility.transferToClosestTower(creep);
                if(result == OK || result == ERR_NOT_IN_RANGE)
                    return;
                
            }else{
                result = HarvesterUtility.transferToClosestContainer(creep);
                if(result == OK || result == ERR_NOT_IN_RANGE)
                    return;
            }
        }
	}
};

class HarvesterUtility{
    static harvestEnergySource(creep, creepCounter){
        let energySources = creep.room.find(FIND_SOURCES);
        let sourceNo = creep.memory.sourceNo % energySources.length;
        let result;
        
        if(energySources.length < sourceNo)
            return ERR_INVALID_TARGET;
            
        result = creep.harvest(energySources[sourceNo]);
        
        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(energySources[sourceNo]);
            result = creep.harvest(energySources[sourceNo]);
        }
        
        return result;
    }
    
    
    static transferToStorage(creep){
        let storage = creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_STORAGE })[0];
        let result;
        
        if(!storage)
            return ERR_INVALID_TARGET;
            
        result = creep.transfer(storage, RESOURCE_ENERGY);
        
        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(storage);
            result = creep.transfer(storage, RESOURCE_ENERGY);
        }
        
        return result;
    }
    
    static transferToClosestSpawnOrExtension(creep){
        let closestTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, {  filter: s => 
            s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION
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
    
    static transferToClosestContainer(creep){
        let container = creep.pos.findClosestByRange(FIND_STRUCTURES,{ filter: s => s.structureType == STRUCTURE_CONTAINER });
        let result;
        
        if(!container)
            return ERR_INVALID_TARGET;
            
        result = creep.transfer(container, RESOURCE_ENERGY);
        
        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(container);
            result = creep.transfer(container, RESOURCE_ENERGY);
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

module.exports = CreepHarvester;