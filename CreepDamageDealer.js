let CreepDamageDealer = {
    run: function(creep, sourceCounter){
        let currentRoom = creep.room;
        let homeRoom = Game.rooms[creep.memory.homeRoom];
        let targetFlag = Game.flags[creep.memory.targetFlag];
        targetFlag = Game.flags['DD'];
        
        let result;
        
       //TODO: Implementation
    }
};

module.exports = CreepDamageDealer;