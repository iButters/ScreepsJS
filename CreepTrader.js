const MINERALS_TO_KEEP = [{ mineralType: RESOURCE_UTRIUM, amountToKeep: 50000, sellingFor: 1.5, buyingFor: 0 }, { mineralType: RESOURCE_OXYGEN, amountToKeep: 50000, sellingFor: 1.0, buyingFor: 0.5 }];
const MAX_AMOUNT_TO_SELL_AT_A_TIME = 50000;

let CreepTrader = {
    run: function (creep) {
        let currentRoom = creep.room;
        let homeRoom = Game.rooms[creep.memory.homeRoom];
        let targetFlag = Game.flags[creep.memory.targetFlag];
        targetFlag = Game.flags['T'];
        
        let myStorage = creep.room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType == STRUCTURE_STORAGE })[0];
        let myTerminal = creep.room.find(FIND_MY_STRUCTURES, { filter: t => t.structureType == STRUCTURE_TERMINAL })[0];
        let mineralsToSell = [{ mineralType: "", amountToSell: 0 }];
        let myOrders = Game.market.orders;
        
        let result;
        creep.moveTo(targetFlag);
        return;
        for (let o in order) {
            //Game.market.cancelOrder(order[o].id);
        }
        
        let energyAmountInTerminal = myTerminal.store[RESOURCE_ENERGY] == undefined ? 0 : myTerminal.store[RESOURCE_ENERGY];
        if(creep.room.name == 'E22S57' && energyAmountInTerminal >= 15000){
            myTerminal.send(RESOURCE_ENERGY, 10000, 'E24S57');
        }
        
        //Handle orders
        if(creep.room.name == 'E22S57')
        for(let mineral of MINERALS_TO_KEEP) {
            let myLabs = creep.room.find(FIND_MY_STRUCTURES, { filter: l => l.structureType == STRUCTURE_LAB && l.mineralType == mineral.mineralType })
            
            let amountAvailableInStorage = myStorage.store[mineral.mineralType] == undefined ? 0 : myStorage.store[mineral.mineralType];
            let amountAvailableInTerminal = myTerminal.store[mineral.mineralType] == undefined ? 0 : myTerminal.store[mineral.mineralType];
            let amountAvailableInLabs = myLabs.length > 0 ? _.sum(myLabs, l => { return l.mineralAmount }) : 0;
            let amountAvailableSum = amountAvailableInStorage + amountAvailableInTerminal + amountAvailableInLabs;

            if (amountAvailableSum < mineral.amountToKeep) {    //Buy from order
                let amountToBuy = mineral.amountToKeep - amountAvailableSum;
                let sellOrders = _.filter(Game.market.getAllOrders(), o => { return o.type == ORDER_SELL && o.resourceType == mineral.mineralType && o.price <= mineral.buyingFor });

                sellOrders = _.sortBy(sellOrders, o => o.price);
                if(sellOrders.length > 0){
                    amountToBuy = amountToBuy <= sellOrders[0].remainingAmount ? amountToBuy : sellOrders[0].remainingAmount;
                    if (myTerminal.store[RESOURCE_ENERGY] >= Game.market.calculateTransactionCost(amountToBuy, creep.room.name, sellOrders[0].room.name))
                        if (Game.market.deal(sellOrders[0].id, amountToBuy, creep.room.name) == 0)
                            console.log("Bought " + amountToBuy + " " + mineral.mineralType);
                }
            } else if (amountAvailableSum > mineral.amountToKeep) {     //Create new ORDER_SELL or extend current Order
                let amountToSell = amountAvailableSum - mineral.amountToKeep;
                let myOrders = _.filter(Game.market.orders, { resourceType: mineral.mineralType });

                if (myOrders.length == 0) {
                    if (Game.market.createOrder(ORDER_SELL, mineral.mineralType, mineral.sellingFor, amountToSell, creep.room.name) == 0)
                        console.log("Created order: " + mineral.mineralType + " " + amountToSell + " " + mineral.sellingFor);
                } else if (myOrders.length > 0 && myOrders[0].totalAmount - (myOrders[0].totalAmount - myOrders.remainingAmount) < amountToSell) {
                    amountToSell -= myOrders[0].totalAmount - (myOrdres[0].totalAmount - myOrders.remainingAmount);
                    if (Game.market.extendOrder(myOrders[0].id, amountToSell) == 0)
                        console.log("Extended order: " + myOrders[0].id + ". Added: " + amountToSell + " " + mineral.mineralType);
                }
            }
        }

        //Move resources between terminal and Storage
        if (_.sum(creep.carry) > 0) {
            let energyAmountInTerminal = myTerminal.store[RESOURCE_ENERGY] == undefined ? 0 : myTerminal.store[RESOURCE_ENERGY];
            let target;
            
            if (creep.carry.energy > 0 && energyAmountInTerminal >= 50000)
                target = myStorage;
            else if(creep.carry.energy > 0)
                target = myTerminal;
            
            result = creep.transfer(target, RESOURCE_ENERGY);
            switch (result) {
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(target);
                case OK:
                    return;
            }

            if (creep.carry.U > 0 && myStorage.store[RESOURCE_UTRIUM] < 50000)
                target = myStorage;
            else if (creep.carry.U)
                target = myTerminal;

            result = creep.transfer(target, RESOURCE_UTRIUM);
            switch (result) {
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(target);
                case OK:
                    return;
            }


            if (creep.carry.O > 0 && myStorage.store[RESOURCE_OXYGEN] < 50000)
                target = myStorage;
            else if (creep.carry.U)
                target = myTerminal;

            result = creep.transfer(target, RESOURCE_OXYGEN);
            switch (result) {
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(target);
                case OK:
                    return;
            }
        } else {
            let energyAmountInTerminal = myTerminal.store[RESOURCE_ENERGY] == undefined ? 0 : myTerminal.store[RESOURCE_ENERGY];
            if (energyAmountInTerminal < 50000 && myStorage.store[RESOURCE_ENERGY] > 10000) {
                var amountToWithdraw = 50000 - energyAmountInTerminal;
                amountToWithdraw = amountToWithdraw <= creep.carryCapacity ? amountToWithdraw : creep.carryCapacity;
                result = creep.withdraw(myStorage, RESOURCE_ENERGY, amountToWithdraw);
                switch (result) {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(myStorage);
                    case OK:
                        return;
                }
            } else if(energyAmountInTerminal > 50000){
                var amountToWithdraw = energyAmountInTerminal - 50000;
                amountToWithdraw = amountToWithdraw <= creep.carryCapacity ? amountToWithdraw : creep.carryCapacity;
                result = creep.withdraw(myTerminal, RESOURCE_ENERGY, amountToWithdraw);
                switch (result) {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(myTerminal);
                    case OK:
                        return;
                }
            }

            for(mineral of MINERALS_TO_KEEP) {
                let amountAvailableInStorage = myStorage.store[mineral.mineralType] == undefined ? 0 : myStorage.store[mineral.mineralType];
                let amountAvailableInTerminal = myTerminal.store[mineral.mineralType] == undefined ? 0 : myTerminal.store[mineral.mineralType];

                if (amountAvailableInStorage > mineral.amountToKeep && amountAvailableInTerminal < MAX_AMOUNT_TO_SELL_AT_A_TIME) {
                    let amountToPickUp = MAX_AMOUNT_TO_SELL_AT_A_TIME - amountAvailableInTerminal;
                    amountToPickUp = amountToPickUp <= creep.carryCapacity ? amountToPickUp : creep.carryCapacity;
                    amountToPickUp = amountToPickUp <= (amountAvailableInStorage - mineral.amountToKeep) ? amountToPickUp : (amountAvailableInStorage - mineral.amountToKeep);
                    result = creep.withdraw(myStorage, mineral.mineralType, amountToPickUp);
                    creep.say(result);
                    switch (result) {
                        case ERR_NOT_IN_RANGE:
                            creep.moveTo(myStorage);
                        case OK:
                            return;
                    }
                } else if (amountAvailableInTerminal > 0 && amountAvailableInStorage < mineral.amountToKeep) {
                    let amountToWithdraw = mineral.amountToKeep - amountAvailableInStorage;
                    amountToWithdraw = amountToWithdraw <= creep.carryCapacity ? amountToWithdraw : creep.carryCapacity;
                    result = creep.withdraw(myTerminal, mineral.mineralType, amountToWithdraw);
                    switch (result) {
                        case ERR_NOT_IN_RANGE:
                            creep.moveTo(myTerminal);
                        case OK:
                            return;
                    }
                }
            }
        }
    }
};
//TODO: Far too much ^_^
module.exports = CreepTrader;