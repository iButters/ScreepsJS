let UtilityCreepActions = require('UtilityCreepActions');

let CreepHealer = {
    run: function(creep, sourceCounter){
        let currentRoom = creep.room;
        let homeRoom = Game.rooms[creep.memory.homeRoom];
        let targetFlag = Game.flags[creep.memory.targetFlag];

        let result;

        result = HealerUtility.selfHeal(creep);
        if(result != OK) {
            result = HealerUtility.healCreeps(creep);
            if (result == OK || result == ERR_NOT_IN_RANGE)
                return;
        }

        result = HealerUtility.moveToNextSpawningLair(creep);
        if(result == OK || result == ERR_NOT_IN_RANGE)
            return;
    }
};

class HealerUtility{
    static selfHeal(creep){
        let result = ERR_INVALID_TARGET;

        if(creep.hits < creep.hitsMax)
            creep.heal(creep)

        return result;
    }

    static healCreeps(creep) {
        let creepToHeal = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: c => c.hits < c.hitsMax});
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

module.exports = CreepHealer;