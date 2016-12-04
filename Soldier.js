/**
 * Created by Sascha Siebrecht on 03.12.2016.
 */
let myCreep = require('myCreep');

class Soldier extends myCreep{
    constructor(creepName, homeRoom, targetFlag, role){
        super(creepName, homeRoom, targetFlag, role);
    }

    selfHeal(creep){
        let result = ERR_INVALID_TARGET;

        if(creep.hits < creep.hitsMax)
            creep.heal(creep)

        return result;
    }

    healCreeps(creep) {
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

    attackHostileCreep(creep){
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
};

module.exports = Soldier;
