/**
 * Created by Sascha Siebrecht on 03.12.2016.
 */
let Defender = require('Defender');

class LairHarvester extends Defender{ //TODO: Mixins
    constructor(creepName, homeRoom, targetFlag, role){
        super(creepName, homeRoom, targetFlag, role);
    }

    run(){
        return;//TODO:
        let creep = Game.creeps[this.creepName];

        let result;

        result = this.moveToTargetFlag(creep);
        if(result == OK)
            return;

        result = this.selfHeal(creep);

        result = this.attackHostileCreep(creep);
        if(result == OK || result == ERR_NOT_IN_RANGE)
            return;

        result = this.harvestEnergySource(creep);
        if(result == OK || result == ERR_NOT_IN_RANGE)
            return;
    }

    harvestEnergySource(creep){
        let energySources = creep.room.find(FIND_SOURCES);
        let sourceNo = creep.memory.sourceNo % energySources.length;
        let result;

        if(energySources.length < sourceNo)
            return ERR_INVALID_TARGET;

        this.moveOnContainer(creep, energySources[sourceNo]);

        result = creep.harvest(energySources[sourceNo]);

        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(energySources[sourceNo]);
            result = creep.harvest(energySources[sourceNo]);
        }

        return result;
    }

    moveOnContainer(creep, source){
        let container = source.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
        })

        if(!container || creep.pos.getRangeTo(container) > 5)
            creep.moveTo(source);

        if(creep.pos.getRangeTo(container) > 0)
            creep.moveTo(container);
    }
};

module.exports = LairHarvester;
