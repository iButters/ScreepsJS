let CreepDefender = {
    run: function (creep, sourceCounter) {
        let currentRoom = creep.room;
        let homeRoom = Game.rooms[creep.memory.homeRoom];
        let targetFlag = Game.flags[creep.memory.targetFlag];
        
        let result;
        
        if(creep.hits < creep.hitsMax){
            creep.heal(creep);
        }
        
        let hostileCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        
        result = creep.attack(hostileCreep);
        
        switch(result){
            case ERR_NOT_IN_RANGE:
                creep.moveTo(hostileCreep);
                result = creep.attack(hostileCreep);
            case OK:
                return;
        }
        
        let creepToHeal = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: c => c.hits < c.hitsMax});
        
        result = creep.heal(creepToHeal);
        
        switch(result){
            case ERR_NOT_IN_RANGE:
                creep.moveTo(creepToHeal);
                result = creep.rangedHeal(creepToHeal);
            case OK:
                return;
        }
        
        
        creep.moveTo(targetFlag, {reusePath: 50});
    }
};

class DefenderUtility{
    //TODO: Implementation
}

module.exports = CreepDefender;