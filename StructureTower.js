let structureTower = {
    run: function(tower){
        let result;
        
        let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: (c) => c.pos.y > 0 && c.pos.x > 0 && c.pos.y < 49 && c.pos.x < 49
        });
        result = tower.attack(closestHostile);
        switch (result) {
            case OK:
                return;  
        }
    
        let creepToHeal = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (c) => c.hits < c.hitsMax
        });
        result = tower.heal(creepToHeal);
        switch (result) {
            case OK:
                return;  
        }
    }
};

module.exports = structureTower;