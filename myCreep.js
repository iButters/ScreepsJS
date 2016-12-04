/**
 * Created by Sascha Siebrecht on 03.12.2016.
 */
class myCreep {
    constructor(creepName, homeRoom, targetFlag, role){
        this.creepName = creepName;
        this.homeRoom = homeRoom;
        this.targetFlag = targetFlag;
        this.role = role;
    }

    moveToTargetFlag(creep){
        let targetFlag = Game.flags[creep.memory.targetFlag];
        let currentRoom = creep.room;
        let result = ERR_BUSY;

        if(currentRoom != targetFlag.room)
            result = creep.moveTo(targetFlag, { reusePath: 25 });

        return result;
    }

    moveToHomeRoom(creep){
        let homeRoom = Game.rooms[creep.memory.homeRoom];
        let currentRoom = creep.room;
        let result = ERR_BUSY;

        if(currentRoom != homeRoom)
            result = creep.moveTo(homeRoom.controller, { reusePath: 25 });

        return result;
    }
};

module.exports = myCreep;