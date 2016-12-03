const NO_TARGET = -100;
const EMPTY_STORAGE = -200;
const STORAGE_FULL = -300;
const NO_TRAVEL = -400;
const NO_RENEW = -500;

class UtilityCreepActions {
    static moveToTargetFlag(creep, currentRoom, targetFlag){
        let result;
        
        if(currentRoom != targetFlag.room){
            result = creep.moveTo(targetFlag, { reusePath: 25 });
            
            return result = OK;
        }
        
        return result = NO_TRAVEL;
    }
    
    static moveToHomeRoom(creep, currentRoom, homeRoom){
        let result;
        
        if(currentRoom != homeRoom){
            result = creep.moveTo(homeRoom.controller, { reusePath: 25 });
            
            return result;
        }
        
        return result = NO_TRAVEL;
    }
    
    static withdrawFromClosestContainer(creep, resourceType){
        let container = creep.pos.findClosestByRange(FIND_STRUCTURES, { 
            filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[resourceType] >= creep.carryCapacity / 2
        });
        let result;
        
        if(!container)
            return NO_TARGET;
        else if(container.store[resourceType] == 0)
            return EMPTY_STORAGE;
            
        result = creep.withdraw(container, resourceType);
        
        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(container);
            result = creep.withdraw(container, resourceType);
        }
        
        return result;
    } //NO_TARGET... because of EMPTY_STORAGE??? needs fix
    
    static withdrawFromLink_Upgrader(creep){
        let link = creep.room.controller.pos.findClosestByRange(FIND_STRUCTURES, { 
            filter: s => s.structureType == STRUCTURE_LINK
        });
        let result;
        
        if(!link)
            return result = NO_TARGET;
        else if(link.energy == 0)
            return result = EMPTY_STORAGE;
            
        result = creep.withdraw(link, RESOURCE_ENERGY);
        
        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(link);
            result = creep.withdraw(link, RESOURCE_ENERGY);
        }
        
        return result;
    }
    
    static withdrawFromSpawn(creep){
        let spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS, { 
            filter: s => s.energy > 0 
        });
        let result;
        
        if(!spawn)
            return result = NO_TARGET;
        
        result = creep.withdraw(spawn, RESOURCE_ENERGY);
        
        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(spawn);
            result = creep.withdraw(spawn, RESOURCE_ENERGY);
        }
        
        return result;
    }    //NO_TARGET ... because of EMPTY_STORAGE??? Needs fix
    
    static withdrawFromStorage(creep, resourceType){
        let container = creep.pos.findClosestByRange(FIND_STRUCTURES, { 
            filter: s => s.structureType == STRUCTURE_STORAGE
        });
        let result;
        
        if(!container)
            return result = NO_TARGET;
        else if(container.store[resourceType] == 0)
            return result = EMPTY_STORAGE;
        
        result = creep.withdraw(container, resourceType);
        
        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(container);
            result = creep.withdraw(container, resourceType);
        }
        
        return result;
    }
    
	static pickUpEnergy(creep){
		let droppedEnergy = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
		let result;
		
		if(!droppedEnergy)
			return result = NO_TARGET;
		else if(droppedEnergy.energy < 50)
			return result = EMPTY_STORAGE;
		
		result = creep.pickup(droppedEnergy, RESOURCE_ENERGY);
		
		if(result == ERR_NOT_IN_RANGE){
			creep.moveTo(droppedEnergy);
			result = creep.pickup(droppedEnergy, RESOURCE_ENERGY);
		}
		
		return result;
	}
	
    static transferToSpawnOrExtension(creep){
        let target = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: s =>
            (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && s.energy < s.energyCapacity
        });
        let result;
        
        if(!target)
            return NO_TARGET;
        else if(target.energy == target.energyCapacity)
            return result = STORAGE_FULL;
            
        result = creep.transfer(target, RESOURCE_ENERGY);
        
        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(target);
            result = creep.transfer(target, RESOURCE_ENERGY);
        }
        
        return result;
    }
    
    static transferToClosestContainer(creep, resourceType){
        let container = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: s => 
            s.structureType == STRUCTURE_CONTAINER
        });
        let result;
        
        if(!container)
            return result = NO_TARGET;
        else if(_.sum(container.store) == container.storeCapacity)
            return result = STORAGE_FULL;
            
        result = creep.transfer(container, resourceType);
        
        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(container);
            result = creep.transfer(container, resourceType);
        }
        
        return result;
    }
    
    static transferToLink(creep, targetNo){
        let links = creep.room.find(FIND_STRUCTURES, { filter: s =>
            s.structureType == STRUCTURE_LINK
        });
        let result;
        
        if(links.length <= targetNo)
            return result = NO_TARGET;
        else if(links[targetNo].energy >= links[targetNo].energyCapacity / 2)
            return result = STORAGE_FULL;
            
        result = creep.transfer(links[targetNo], RESOURCE_ENERGY);
        
        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(links[targetNo]);
            result = creep.transfer(links[targetNo], RESOURCE_ENERGY);
        }
        
        return result;
    }
    
    static transferToTower(creep){
        let tower = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: s =>
            s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity
        });
        let result;
        
        if(!tower)
            return result = NO_TARGET;
            
        result = creep.transfer(tower, RESOURCE_ENERGY);
        
        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(tower);
            result = creep.transfer(tower, RESOURCE_ENERGY);
        }
        
        return result;
    }
    
    static repairStructures_NoWalls(creep){
        let damagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
	        filter: (t) => t.hits <= t.hitsMax - _.sum(creep.body, b => b.type == WORK)*100 && t.structureType != STRUCTURE_WALL && t.structureType != STRUCTURE_RAMPART
	    })
	    let result;
	    
	    if(!damagedStructure)
	        return result = NO_TARGET;
	    
	    result = creep.repair(damagedStructure);
	    
	    if(result == ERR_NOT_IN_RANGE){
	        creep.moveTo(damagedStructure);
	        result = creep.repair(damagedStructure);
	    }
	    
	    return result;
    }
    
    static repairRamparts(creep){
		let damagedRampart = creep.pos.findClosestByRange(FIND_STRUCTURES, {
	        filter: (t) => t.hits <= 100000 - _.sum(creep.body, b => b.type == WORK)*100 && t.structureType == STRUCTURE_RAMPART
	    })
	    let result;
	    
	    _.sortBy(damagedRampart, function(r1, r2){ return r1.hits - r2.hits });
	    
	    if(!damagedRampart)
	        return result = NO_TARGET;
	    
	    result = creep.repair(damagedRampart);
	    
	    if(result == ERR_NOT_IN_RANGE){
	        creep.moveTo(damagedRampart);
	        result = creep.repair(damagedRampart);
	    }
	    
	    return result;
	}
    
	static repairWalls(creep){
		let damagedWall = creep.pos.findClosestByRange(FIND_STRUCTURES, {
	        filter: (t) => t.hits <= 100000 - _.sum(creep.body, b => b.type == WORK)*100 && t.structureType == STRUCTURE_WALL
	    })
	    let result;
	    
	    if(!damagedWall)
	        return result = NO_TARGET;
	    
	    result = creep.repair(damagedWall);
	    
	    if(result == ERR_NOT_IN_RANGE){
	        creep.moveTo(damagedWall);
	        result = creep.repair(damagedWall);
	    }
	    
	    return result;
	}
	
    static buildStructure(creep){
        let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES, { filter: s =>
            s.structureType != STRUCTURE_ROAD
        });
        let result;
        
        if(constructionSites.length == 0)
            return result = NO_TARGET;
        
        result = creep.build(constructionSites[0]);
        
        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(constructionSites[0]);
            result = creep.build(constructionSites[0]);
        }
        
        return result;
    }
    
    static buildRoad(creep){
        let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES, { filter: s =>
            s == s
        });
        let result;
        
        if(constructionSites.length == 0)
            return result = NO_TARGET;
        
        result = creep.build(constructionSites[0]);
        
        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(constructionSites[0]);
            result = creep.build(constructionSites[0]);
        }
        
        return result;
    }

	static upgradeController(creep){
		let controller = creep.room.controller;
		let result;
		
		result = creep.upgradeController(controller);
		
		if(result == ERR_NOT_IN_RANGE){
			creep.moveTo(controller);
			result = creep.upgradeController(controller); 
		}
		
		return result;
	}
};

module.exports = UtilityCreepActions;