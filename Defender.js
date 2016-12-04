/**
 * Created by Sascha Siebrecht on 03.12.2016.
 */
let Soldier = require('Soldier');

class Defender extends Soldier{
    constructor(creepName, homeRoom, targetFlag, role){
        super(creepName, homeRoom, targetFlag, role);
    }

    run(){
        let creep = Game.creeps[this.creepName];
        let result;

        result = this.moveToTargetFlag(creep);
        if(result == OK)
            return;

        result = this.selfHeal(creep);      //TODO:
        if(result != OK) {
            result = this.healCreeps(creep);
            if (result == OK || result == ERR_NOT_IN_RANGE)
                return;
        }

        result = this.attackHostileCreep(creep);
        if(result == OK || ERR_NOT_IN_RANGE)
            return;

        result = this.moveToNextSpawningLair(creep);
        if(result == OK)
            return;
    }

    moveToNextSpawningLair(creep){
        let lair = creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_KEEPER_LAIR });
        let result;

        if(lair.length == 0)
            return ERR_INVALID_TARGET

        lair.sort(function(l1, l2){ return l1.ticksToSpawn - l2.ticksToSpawn });

        result = creep.moveTo(lair[0]);

        return result;
    }
};

module.exports = Defender;
