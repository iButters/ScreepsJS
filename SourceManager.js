class SourceManager{
    //TODO: Finish implementation... Rework?
    constructor(myRoom){
        this.myRoom = myRoom;
        this.mySources = myRoom.find(FIND_SOURCES);
        this.myDroppedEnergies = myRoom.find(FIND_DROPPED_ENERGY);
        this.myContainers = myRoom.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_CONTAINER });
    }
    
    memoryCleanUp(){
        for(let source of _.filter(this.mySources, s => !s.memory.appliedTo || !Game.creeps[s.memory.appliedTo])){
            source.memory.appliedTo = "";
        }
        
        for(let droppedEnergy of _.filter(this.myDroppedEnergies, s => !s.memory.appliedTo || !Game.creeps[s.memory.appliedTo])){
            droppedEnergy.memory.appliedTo = "";
        }
        
        for(let container of _.filter(this.myContainers, s => !s.memory.appliedTo || !Game.creeps[s.memory.appliedTo])){
            container.memory.appliedTo = "";
        }
    }
    
    getSource(creepName){
        let reservedSource = _.filter(this.mySources, s => s.memory.appliedTo == creepName);
        if(reservedSource.length > 0)
            return reservedSource[0];
            
        let freeSource = _.filter(this.mySources, s => !s.memory.appliedTo || s.memory.appliedTo == "");
        if(freeSource.length > 0){
            freeSource[0].memory.appliedTo = creepName;
            
            return freeSource[0];
        }
        
        console.log("Could not find a free source!");
    }
    
    getContainers(){
        let reservedContainer = _.filter(this.myContainers, s => s.memory.appliedTo == creepName);
        if(reservedContainer.length > 0)
            return reservedContainer[0];
            
        let freeContainers = _.filter(this.myContainers, s => !s.memory.appliedTo || s.memory.appliedTo == "");
        if(freeContainer.length > 0){
            freeContainer[0].memory.appliedTo = creepName;
            
            return freeContainer[0];
        }
        
        console.log("Could not find a free container!");
    }
}

//Singleton
SourceManager.prototype.instance = null;

SourceManager.prototype.getInstanceOf = function(myRoom){
    if(SourceManager.prototype.instance == null)
        SourceManager.prototype.instance = new SourceManager(myRoom)
    return SourceManager.prototype.instance;
}


module.exports = SourceManager;