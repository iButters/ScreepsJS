let CreepHealer = {
    run: function(creep, sourceCounter){
        let currentRoom = creep.room;
        let homeRoom = Game.rooms[creep.memory.homeRoom];
        let targetFlag = Game.flags[creep.memory.targetFlag];

        let hostileHealer;
        let result;
        
        if(creep.hits < creep.hitsMax){
            creep.heal(creep);
            return;
        }
        
        hostileHealer = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: c => c.hits < c.hitsMax});
        
        result = creep.heal(hostileHealer);

        switch(result){
            case ERR_NOT_IN_RANGE:
                creep.moveTo(hostileHealer);
                result = creep.rangedHeal(hostileHealer);
            case OK:
                return;
        }
        
        
        if(currentRoom != targetFlag.room){
            creep.moveTo(targetFlag, {reusePath: 100});
            return;
        }
        
        
        
    }
};

class HealerUtility{
    //TODO: Implementation
}

module.exports = CreepHealer;