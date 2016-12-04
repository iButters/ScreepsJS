/**
 * Created by Sascha Siebrecht on 03.12.2016.
 */
let Carrier = require('Carrier');

class Hauler extends Carrier{
    constructor(creepName, homeRoom, targetFlag, role){
        super(creepName, homeRoom, targetFlag, role);
    }

    run(){
        let creep = Game.creeps[this.creepName];
        
        if(creep.memory.isSpreading && _.sum(creep.carry) == 0)
            creep.memory.isSpreading = false;
        else if(!this.isSpreading && _.sum(creep.carry) == creep.carryCapacity)
            creep.memory.isSpreading = true;

        let result;

        if(creep.memory.isSpreading) {
            result = this.moveToHomeRoom(creep);
            if(result == OK)
                return;

            result = this.transferToStorage(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;

            result = this.transferToClosestSpawnOrExtension(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;

            result = this.transferToClosestTower(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
        }else {
            result = this.moveToTargetFlag(creep);
            if(result == OK)
                return;

            result = this.pickUpResource(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;

            result = this.withdrawFromContainer(creep);
            if(result == OK || result == ERR_NOT_IN_RANGE)
                return;
        }
    }

    withdrawFromContainer(creep){
        let containers = creep.room.find(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
            && _.sum(s.store) > creep.carryCapacity / 2
        });
        let sourceNo = creep.memory.sourceNo % containers.length;  //TODO: Store in class, not in memory...
        let resourceType;
        let result;

        if(containers.length == 0 || containers.length <= sourceNo)
            return ERR_INVALID_TARGET;
        else if(_.sum(containers[sourceNo].store) < creep.carryCapacity / 2)
            return ERR_NOT_ENOUGH_RESOURCES;

        for(let type in containers[sourceNo].store){
            if(containers[sourceNo].store[type] > 0){
                resourceType = type;
                break;
            }
        }

        result = creep.withdraw(containers[sourceNo], resourceType);

        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(containers[sourceNo]);
            result = creep.withdraw(containers[sourceNo], resourceType);
        }

        return result;
    }
};

module.exports = Hauler;
