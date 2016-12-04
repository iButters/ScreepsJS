let UtilityCreepActions = require('UtilityCreepActions');

let CreepDefender = {
    run: function (creep, sourceCounter) {
        let currentRoom = creep.room;
        let targetFlag = Game.flags[creep.memory.targetFlag];
        
        let result;

        result = UtilityCreepActions.moveToTargetFlag(creep, currentRoom, targetFlag);
        if(result != -400)
            return;

        result = DefenderUtility.attackHostileCreep(creep);
        if(result == OK)
            return;

        result = DefenderUtility.selfHeal(creep);
        if(result != OK) {
            result = DefenderUtility.healCreeps(creep);
            if (result == OK || result == ERR_NOT_IN_RANGE)
                return;
        }

        result = DefenderUtility.moveToNextSpawningLair(creep);
        if(result == OK || result == ERR_NOT_IN_RANGE)
            return;

        creep.moveTo(targetFlag, {reusePath: 50});
    }
};

class DefenderUtility{
    static selfHeal(creep){
        let result = ERR_INVALID_TARGET;

        if(creep.hits < creep.hitsMax)
            creep.heal(creep)

        return result;
    }

    static healCreeps(creep) {
        let creepToHeal = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: c => c.hits < c.hitsMax && c != creep});
        let result;

        if (!creepToHeal)
            return ERR_INVALID_TARGET;

        result = creep.heal(creepToHeal);

        if (result == ERR_NOT_IN_RANGE) {
            creep.rangedHeal(creepToHeal);
            result = creep.moveTo(creepToHeal);
        }

        return result;
    }

    static attackHostileCreep(creep){
        let hostileCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        let result;

        if(!hostileCreep)
            return ERR_INVALID_TARGET;

        if(hostileCreep.hits < 200 || creep.hits >= creep.hitsMax / 2)
            result = creep.attack(hostileCreep);

        if(result == ERR_NOT_IN_RANGE){
            creep.rangedAttack(hostileCreep);
        }

        result = creep.moveTo(hostileCreep);

        return result;
    }

    static moveToNextSpawningLair(creep){
        let lair = creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_KEEPER_LAIR });
        let result;

        if(lair.length == 0)
            return ERR_INVALID_TARGET

        lair.sort(function(l1, l2){ return l1.ticksToSpawn - l2.ticksToSpawn });

        result = creep.moveTo(lair[0]);

        return result;
    }
}

module.exports = CreepDefender;