let UtilityCreepActions = require('UtilityCreepActions');

let CreepRaider = {
     run: function (creep, creepCounter) {
        let currentRoom = creep.room;
        let homeRoom = Game.rooms[creep.memory.homeRoom];
        let targetFlag = Game.flags[creep.memory.targetFlag];
        
        let result;

        result = UtilityCreepActions.moveToTargetFlag(creep, currentRoom, targetFlag);
        if(result != -400)
            return;
        
        result = RaiderUtility.selfHeal(creep);

        result = RaiderUtility.attackHostileCreepInRange(creep, 7);
        if(result == OK)
            return;

        result = RaiderUtility.harvestEnergySource(creep, creepCounter);
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
        let hostileCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        let result;
        
        if(!hostileCreep || creep.pos.getRangeTo(hostileCreep) > range)
            return ERR_INVALID_TARGET;

        if(hostileCreep.hits < 200 || creep.hits >= creep.hitsMax / 2)
            result = creep.attack(hostileCreep);

        if(result == ERR_NOT_IN_RANGE){
            creep.rangedAttack(hostileCreep);
        }

        result = creep.moveTo(hostileCreep);

        return result;
    }

    static moveOnContainer(creep, source){
        let container = source.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
        })

        if(creep.pos.getRangeTo(container) > 0)
            creep.moveTo(container);
    }


    static harvestEnergySource(creep, creepCounter){
        let energySources = creep.room.find(FIND_SOURCES);
        let sourceNo = creep.memory.sourceNo % energySources.length;
        let result;

        RaiderUtility.moveOnContainer(creep, energySources[sourceNo]);

        if(energySources.length < sourceNo)
            return ERR_INVALID_TARGET;

        result = creep.harvest(energySources[sourceNo]);

        return result;
    }
}

module.exports = CreepRaider;

