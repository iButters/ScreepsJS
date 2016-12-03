let UtilityCreepActions = require('UtilityCreepActions');

let CreepRaider = {
     run: function (creep, creepCounter) {
        let currentRoom = creep.room;
        let homeRoom = Game.rooms[creep.memory.homeRoom];
        let targetFlag = Game.flags[creep.memory.targetFlag];
        
        let result;

        if(creep.room != targetFlag.room)
            result = UtilityCreepActions.moveToTargetFlag(creep, currentRoom, targetFlag);
            if(result != -400)
                return;
        
        result = RaiderUtility.selfHeal(creep);

        result = RaiderUtility.attackHostileCreepInRange(creep, 7);
        if(result == OK || result == ERR_NOT_IN_RANGE)
            return;

        result = RaiderUtility.harvestEnergySource(creep, sourceCounter);
        if(result == OK || result == ERR_NOT_IN_RANGE)
            return;
    }
};

class RaiderUtility{
    static selfHeal(creep){
        let result = ERR_INVALID_TARGET;
        
        if(creep.hits < creep.hitsMax)
            creep.heal(creep)
            
        return result;
    }
    
    static attackHostileCreepInRange(creep, range){
        let hostileCreeps = creep.pos.findInRange(FIND_HOSTILE_CREEPS, range);
        let result;
        
        if(hostileCreeps.length == 0)
            return ERR_INVALID_TARGET;
        
        if(hostileCreeps[0].hits < 200 || creep.hits == creep.hitsMax)
            result = creep.attack(hostileCreeps[0]);
        
        if(result == ERR_NOT_IN_RANGE){
            creep.rangedAttack(hostileCreeps[0]);
        }
        
        result = creep.moveTo(hostileCreeps[0]);
        
        return result;
    }

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
}

module.exports = CreepRaider;

