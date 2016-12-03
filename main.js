const {flagPriorities, rolePriorities, myRooms, bodyparts} = require('Settings');

let SpawnManager = require('SpawnManager');
let SourceManager = require('SourceManager');
let StructureTowers = require('StructureTower');
let StructureLinks = require('StructureLink');
let Creeps = {
    'Harvester': require('CreepHarvester'), 'Miner': require('CreepMiner'),         'Distributor': require('CreepDistributor'), 
    'Repairer': require('CreepRepairer'),   'Builder': require('CreepBuilder'),     'Upgrader': require('CreepUpgrader'),
    'Claimer': require('CreepClaimer'),     'Defender': require('CreepDefender'),   'DamageDealer': require('CreepDamageDealer'),
    'Healer': require('CreepHealer'),       'Trader' : require('CreepTrader'),      'Hauler' : require('CreepHauler'),
    'Raider': require('CreepRaider')
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
                let myCreeps = _.filter(Game.creeps, function(c) { return c.memory.homeRoom == myRoomName && c.memory.targetFlag == myFlagName && c.memory.role == myRoleName })
                let amountOf = myCreeps.length;
                
                let sourceCounter = 0;
                for(let myCreep of myCreeps){
                        let MyCreep = Creeps[myRoleName];

                        MyCreep.run(myCreep, sourceCounter++);
                }
                
                let amountToSpawn = myRoles[myRoleName];
                
                for(let i = 0; i + amountOf < amountToSpawn; i++)
                    spawnManager.addToSpawnStack(myRoomName, myFlagName, myRoleName);
            }
        }
        
        spawnManager.sortSpawnStack();
        spawnManager.spawnFromStack();
        spawnManager.flush();
    }    
}

let cleanUpCreepsFromMemory = function () {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep from memory:', name);
        }
    }
}