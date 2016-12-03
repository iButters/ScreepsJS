var CreepClaimer = {
    run: function (creep) {
        let currentRoom = creep.room;
        let homeRoom = Game.rooms[creep.memory.homeRoom];
        let targetFlag = Game.flags[creep.memory.targetFlag];
        
        let result;

        if (currentRoom != targetFlag.room) {
            creep.moveTo(targetFlag, {reusePath: 50});
	        return;
	    }
	    
        result = creep.reserveController(creep.room.controller);
        
        switch (result) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(creep.room.controller);
            case OK:
                return;
        }
    }
};

class ClaimerUtility{
    //TODO: Implementation
}

module.exports = CreepClaimer;