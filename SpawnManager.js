const {flagPriorities, rolePriorities, amountToSpawn, bodyparts} = require('Settings');
const amountOfExtensionsAtLevel = {0: 0, 1: 0, 2: 5, 3: 10, 4: 20, 5: 30, 6: 40, 7: 50, 8: 60};

let Creeps = {
    'Harvester': require('Harvester'),  'Hauler': require('Hauler'),        'Distributor': require('Distributor'),
    'Builder': require('Builder'),      'Repairer': require('Repairer'),    'Upgrader': require('Upgrader'),
    'Miner': require('Miner'),          'Defender': require('Defender'),    'LairHarvester': require('LairHarvester')
};

class SpawnManager {
    constructor(myRoom){
        this.mySpawns = myRoom.find(FIND_MY_SPAWNS);
        this.amountOfExtensions = myRoom.find(FIND_MY_STRUCTURES, { filter: s => s.structureType == STRUCTURE_EXTENSION}).length;
        this.myRoomControllerLevel = myRoom.controller.level;
        this.spawnStack = new Array();
    }
    
    addToSpawnStack(myHomeRoom, myFlagName, myRole){
        this.spawnStack.push({ 'homeRoom': myHomeRoom, 'targetFlag': myFlagName, 'myRole': myRole, 'priority': flagPriorities[myFlagName] * rolePriorities[myRole] });
        if(myRole == "RaidHarvester")
            console.log(myRole)
    }
    
    sortSpawnStack(){
        this.spawnStack.sort(function(s1, s2){ return s1.priority >= s2.priority });
    }
    
    spawnFromStack(){
        for(let spawnName in this.mySpawns){
            let spawn = this.mySpawns[spawnName];
            
            if(this.spawnStack.length > 0 && !spawn.spawning){
                let creepToSpawn = this.spawnStack.pop();
                let homeRoom = creepToSpawn.homeRoom;
                let targetFlag = creepToSpawn.targetFlag;
                let myRole = creepToSpawn.myRole;
                
                //Decrease RCL when the possible amount of extensions isnt build yet
                while(this.amountOfExtensions < amountOfExtensionsAtLevel[this.myRoomControllerLevel])
                    this.myRoomControllerLevel--;
                
                let bodyparts = this.createBodyparts(myRole);
                
                
                //Skip current Creep if no bodyparts are defined for current RCL
                if(bodyparts.length == 0)
                    this.spawnFromStack();
                
                let newCreep;
                
                if(spawn.canCreateCreep(bodyparts) == OK){
                    newCreep = spawn.createCreep(bodyparts, undefined);
                    
                    Game.creeps[newCreep].memory.role = myRole;
                    Game.creeps[newCreep].memory.homeRoom = homeRoom;
                    Game.creeps[newCreep].memory.targetFlag = targetFlag;
                    
                    this.applySourceNo(Game.creeps[newCreep]);

                    this.storeCreepToMemory(newCreep, myRole, homeRoom, targetFlag);

                    console.log('Spawned new Creep: ' + myRole + '[' + newCreep + ']' + ' - ' + homeRoom + '-' + targetFlag);
                }else {
                    this.spawnStack.push(creepToSpawn);
                }
            }
        }
    }

    //TODO: Too expensive - Accesses memory far too often
    storeCreepToMemory(newCreep, role, homeRoom, targetFlag){
        let myCreep = Memory.myCreeps;

        myCreep.push(new Creeps[role](newCreep, homeRoom, targetFlag, role));
        console.log(newCreep);
        Memory.myCreeps = myCreep;
    }

    createBodyparts(myRole){
        let bodypartTypes  = Object.keys(bodyparts[myRole]['Level' + this.myRoomControllerLevel]);
        let bodypartsArray = new Array();
        
        for(let bodypartType of bodypartTypes){
            let amountToAdd = bodyparts[myRole]['Level' + this.myRoomControllerLevel][bodypartType];
            
            for(let i = 0; i < amountToAdd; i++)
                bodypartsArray.push(bodypartType);
        }

        return bodypartsArray;
    }
    
    applySourceNo(myCreep){
        let role = myCreep.memory.role;
        let targetFlag = myCreep.memory.targetFlag;
        
        if(role != "Hauler" && role != "Harvester" && role != 'LairHarvester')
            return null;
        
        let creeps = _.filter(Game.creeps, function(c){ return c.memory.role == role
            && c.memory.targetFlag == targetFlag
            && c.name != myCreep.name;
        });
        let isApplied = new Array();
        
        for(let i = 0; i < 10; i++){
            isApplied.push(false);
        }
        
        for(let creep of creeps){
            isApplied[creep.memory.sourceNo] = true;
        }
        
        for(let i in isApplied){
            if(!isApplied[i]){
                myCreep.memory.sourceNo = i;
                break;
            }
        }
    }
    
    flush(){
        this.spawnStack = new Array();
    }
}

module.exports = SpawnManager;