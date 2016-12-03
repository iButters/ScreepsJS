let CreepMiner = {
    run: function(creep) {
        let currentRoom = creep.room;
        let homeRoom = Game.rooms[creep.memory.homeRoom];
        let targetFlag = Game.flags[creep.memory.targetFlag];
        
        let result;
        
        if(creep.memory.isMining && _.sum(creep.carry) == creep.carryCapacity)
            creep.memory.isMining = false;
        else if(!creep.memory.isMining && _.sum(creep.carry) == 0)
            creep.memory.isMining = true;
        
        if(creep.memory.isMining){
            if(currentRoom != targetFlag.room){
                creep.moveTo(targetFlag, {reusePath: 50});
            }
            
            result = harvestMineral(creep);
        }else {
            if(currentRoom != homeRoom){
                creep.moveTo(homeRoom.controller, {reusePath: 50});
            }
            
            result = transferMineralToClosestContainerOrStorage(creep);
        }
    }
};

class MinerUtility{
    //TODO: Implementation
}

 let harvestMineral = function(creep){
    let resourceMineral = creep.pos.findClosestByRange(FIND_MINERALS);
    let result;
    
    result = creep.harvest(resourceMineral);
    
    if(result == ERR_NOT_IN_RANGE)
        creep.moveTo(resourceMineral);
        
    return result;
}
    
let transferMineralToClosestContainerOrStorage = function(creep){
    let storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_STORAGE || s.structureType == STRUCTURE_CONTAINER
    });
    let result;
        
    
    result = creep.transfer(storage, _.findKey(creep.carry, v => v > 0));
    
    if(result == ERR_NOT_IN_RANGE)
       creep.moveTo(storage);
       
    return result;
}

module.exports = CreepMiner;