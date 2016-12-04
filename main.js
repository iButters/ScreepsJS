const {flagPriorities, rolePriorities, myRooms, bodyparts} = require('Settings');

let SpawnManager = require('SpawnManager');
let SourceManager = require('SourceManager');
let StructureTowers = require('StructureTower');
let StructureLinks = require('StructureLink');

let Harvester =  require('Harvester');
let Creeps = {
    'Harvester': require('Harvester'),  'Hauler': require('Hauler'),        'Distributor': require('Distributor'),
    'Builder': require('Builder'),      'Repairer': require('Repairer'),    'Upgrader': require('Upgrader'),
    'Miner': require('Miner'),          'Defender': require('Defender'),    'LairHarvester': require('LairHarvester')
};
module.exports.loop = function () {
    cleanUpCreepsFromMemory();

    for(let myRoomName in myRooms){
        let myRoom = Game.rooms[myRoomName];
        let myFlags = myRooms[myRoomName];
        
        let spawnManager = new SpawnManager(myRoom);
        
        let myTowers = myRoom.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_TOWER });
        for(let myTower of myTowers){
            StructureTowers.run(myTower);
        }
        
        StructureLinks.run(myRoom);
        
        
        for(let myFlagName in myFlags){
            let myFlag = Game.flags[myFlagName];
            let myRoles = myFlags[myFlagName];
            
            let sourceManager = SourceManager.prototype.getInstanceOf(myFlag.room);
            
            for(let myRoleName in myRoles){
                let myCreeps = _.filter(Game.creeps, function(c) { return c.memory.homeRoom == myRoomName
                    && c.memory.targetFlag == myFlagName && c.memory.role == myRoleName })
                let amountOf = myCreeps.length;
                
                let amountToSpawn = myRoles[myRoleName];
                
                for(let i = 0; i + amountOf < amountToSpawn; i++)
                    spawnManager.addToSpawnStack(myRoomName, myFlagName, myRoleName);
            }
        }

        if(!Memory.myCreeps)
            Memory.myCreeps = new Array();

        spawnManager.sortSpawnStack();
        spawnManager.spawnFromStack();
        spawnManager.flush();

        let myCreeps = Memory.myCreeps;
        for(let myCreep of myCreeps){
            if(Game.creeps[myCreep.creepName]) {
                let creep = _.create(Creeps[myCreep.role].prototype, myCreep);
                creep.run();
            }
        }
    }    
}

let cleanUpCreepsFromMemory = function () {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep from memory:', name);
        }
    }

    for(let creep in Memory.myCreeps){
        if(!Game.creeps[Memory.myCreeps[creep].creepName])
            Memory.myCreeps.splice(creep, 1);
    }
}