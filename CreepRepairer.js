let UtilityCreepActions = require('UtilityCreepActions');

let CreepRepairer = {
   run: function (creep) {
        let currentRoom = creep.room;
        let homeRoom = Game.rooms[creep.memory.homeRoom];
        let targetFlag = Game.flags[creep.memory.targetFlag];
        
        let result;
        
        
        if(creep.memory.isRepairing && creep.carry.energy == 0)
            creep.memory.isRepairing = false;
        else if(!creep.memory.isRepairing && creep.carry.energy > 0)
            creep.memory.isRepairing = true;
        
        if(creep.memory.isRepairing){
            result = UtilityCreepActions.moveToTargetFlag(creep, currentRoom, targetFlag);
    	    if(result == OK)
    	        return;
	        
	        result = UtilityCreepActions.repairStructures_NoWalls(creep);
    	    if(result == OK || result == ERR_NOT_IN_RANGE)
    	        return;
    	        
    	    result = UtilityCreepActions.repairRamparts(creep);
    	    if(result == OK || result == ERR_NOT_IN_RANGE)
    	        return;
    	        
    	    result = UtilityCreepActions.repairWalls(creep);
    	    if(result == OK || result == ERR_NOT_IN_RANGE)
    	        return;
        }else{
            if(currentRoom != homeRoom){
                result = UtilityCreepActions.pickUpEnergy(creep);
    	        if(result == OK || result == ERR_NOT_IN_RANGE)
    	            return;
                
                result = UtilityCreepActions.withdrawFromClosestContainer(creep, RESOURCE_ENERGY);
    	        if(result == OK || result == ERR_NOT_IN_RANGE)
    	            return;
                
                UtilityCreepActions.moveToHomeRoom(creep, currentRoom, homeRoom);
	            if(result == OK)
	                return;
            }
            
            result = UtilityCreepActions.withdrawFromStorage(creep, RESOURCE_ENERGY);
	        if(result == -200 || result == OK || result == ERR_NOT_IN_RANGE)
	            return;
	            
	        result = UtilityCreepActions.withdrawFromSpawn(creep, RESOURCE_ENERGY);
	        if(result == OK || result == ERR_NOT_IN_RANGE)
	            return;
        }
    }
};

class RepairerUtility{
	//TODO: Implementation
}

module.exports = CreepRepairer;