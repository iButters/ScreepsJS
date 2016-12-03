let UtilityCreepActions = require('UtilityCreepActions');

let CreepBuilder = {
    run: function (creep) {
        let currentRoom = creep.room;
        let homeRoom = Game.rooms[creep.memory.homeRoom];
        let targetFlag = Game.flags[creep.memory.targetFlag];
        
        let result;
        
	    if(creep.memory.isBuilding && creep.carry.energy == 0)
            creep.memory.isBuilding = false;
	    else if(!creep.memory.isBuilding && creep.carry.energy == creep.carryCapacity)
	        creep.memory.isBuilding = true;
	    
    	if(creep.memory.isBuilding) {
    	    result = UtilityCreepActions.moveToTargetFlag(creep, currentRoom, targetFlag);
    	    if(result == OK)
    	        return;
	        
	        result = UtilityCreepActions.buildStructure(creep);
	        if(result == ERR_NOT_IN_RANGE || result == OK)
	            return;
	        
	        result = UtilityCreepActions.buildRoad(creep);
	        if(result == ERR_NOT_IN_RANGE || result == OK)
	            return;
	    }else {
	        //result = BuilderUtility.pickUpResource(creep);
	        if(result == OK || result == ERR_NOT_IN_RANGE)
	            return;
	        
	        result = UtilityCreepActions.withdrawFromStorage(creep, RESOURCE_ENERGY);
	        if(result == -200 || result == OK || result == ERR_NOT_IN_RANGE)
	            return;
	        
	        result = UtilityCreepActions.withdrawFromSpawn(creep, RESOURCE_ENERGY);
	        if(result == OK || result == ERR_NOT_IN_RANGE)
	            return;
	        
	        result = UtilityCreepActions.withdrawFromClosestContainer(creep, RESOURCE_ENERGY);
	        if(result == OK || result == ERR_NOT_IN_RANGE)
	            return;
	        
	        UtilityCreepActions.moveToHomeRoom(creep, currentRoom, homeRoom);
	        if(result == OK)
	            return;
	    }
	}
};

class BuilderUtility{
	//TODO: Implementation
    static buildStructures(creep){
        let structure = creep.room.find(FIND_MY_CONSTRUCTION_SITES)[0];
        let result;
        
        result = creep.build(structure);
        
        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(structure);
            result = creep.build(structure);
        }
        
        return result;
    }
    
    static pickUpResource(creep){
        let closestResource = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 10)[0];
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
}

module.exports = CreepBuilder;