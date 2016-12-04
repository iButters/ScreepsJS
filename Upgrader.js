/**
 * Created by Sascha Siebrecht on 03.12.2016.
 */
let Worker = require('Worker');

class Upgrader extends Worker{
    constructor(creepName, homeRoom, targetFlag, role){
        super(creepName, homeRoom, targetFlag, role);
    }

    run(){
        let creep = Game.creeps[this.creepName];

        if(creep.memory.isUpgrading && creep.carry.energy == 0)
            creep.memory.isUpgrading = false;
        else if(!creep.memory.isUpgrading && creep.carry.energy == creep.carryCapacity)
            creep.memory.isUpgrading = true;

        let result;

        if(creep.memory.isUpgrading) {
            result = this.moveToTargetFlag(creep);
            if(result == OK)
                return;

            result = this.upgradeController(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
        }else {
            result = this.withdrawFromStorage(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;

            result = this.withdrawFromSpawn(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;

            result = this.moveToHomeRoom(creep);
            if(result == OK)
                return;
        }
    }

    upgradeController(creep){
        let controller = creep.room.controller;
        let result;

        result = creep.upgradeController(controller);       //Method of creep class!!!

        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(controller);
            result = creep.upgradeController(controller);
        }

        return result;
    }
};

module.exports = Upgrader;