let UtilityCreepActions = require('UtilityCreepActions');

let CreepHauler = {
    run: function(creep, sourceCounter){
        let currentRoom = creep.room;
        let homeRoom = Game.rooms[creep.memory.homeRoom];
        let targetFlag = Game.flags[creep.memory.targetFlag];
        
        let result;
        
        if(creep.memory.isHauling && _.sum(creep.carry) == 0)
            creep.memory.isHauling = false;
        if(!creep.memory.isHauling && _.sum(creep.carry) == creep.carryCapacity)
            creep.memory.isHauling = true;
        
        if(!creep.memory.isHauling){
            result = UtilityCreepActions.withdrawFromStorage(creep, RESOURCE_ENERGY);
	        if(result == -200 || result == OK || result == ERR_NOT_IN_RANGE)
	            return;
        } else {
            if(sourceCounter > 0){
                result = UtilityCreepActions.transferToLink(creep, 0);
                if(result == OK || result == ERR_NOT_IN_RANGE)
                    return;
            }
                
            result = UtilityCreepActions.transferToSpawnOrExtension(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
            
            result = UtilityCreepActions.transferToTower(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
                
            result = UtilityCreepActions.transferToLink(creep, 0);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
        }
    }
};

class HaulerUtility{
    //TODO: Implementation
}

module.exports = CreepHauler;
