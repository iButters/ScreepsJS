var structureLink = {
    run: function(room){
        var linksInRoom = room.find(FIND_MY_STRUCTURES, { filter: l => l.structureType == STRUCTURE_LINK});
        for(var i = 1; i < linksInRoom.length; i++){
            if(linksInRoom[i].energy < 750)
                linksInRoom[0].transferEnergy(linksInRoom[i]);
        }            
    }
};

module.exports = structureLink;