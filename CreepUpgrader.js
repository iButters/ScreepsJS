let UtilityCreepActions = require('UtilityCreepActions');

var CreepUpgrader = {
    run: function(creep) {
        let currentRoom = creep.room;
        let homeRoom = Game.rooms[creep.memory.homeRoom];
        let targetFlag = Game.flags[creep.memory.targetFlag];
        
        let result;
        
        if(creep.memory.isUpgrading && creep.carry.energy == 0)
            creep.memory.isUpgrading = false;
	    else if(!creep.memory.isUpgrading && creep.carry.energy == creep.carryCapacity)
	        creep.memory.isUpgrading = true;
        
        result = UtilityCreepActions.moveToTargetFlag(creep, currentRoom, targetFlag);
	    if(result == OK) 
	        return;
        
        if (creep.memory.isUpgrading) {
            result = UtilityCreepActions.upgradeController(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
        }else {
            result = UtilityCreepActions.withdrawFromLink_Upgrader(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
                
            result = UtilityCreepActions.withdrawFromSpawn(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
        }
	}
};

class UpgraderUtility{
    //TODO: implementation
}

module.exports = CreepUpgrader;