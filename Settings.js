const mySettings = {
    'flagPriorities': {
        'Flag1' : 1.00,
        'Flag2' : 0.90,
        'Flag3' : 0.90,
        'Flag4' : 0.95
    },
    
    'rolePriorities': {
        'Harvester'     : 1.00,
        'Miner'         : 0.90,
        'Distributor'   : 0.95,
        'Hauler'        : 1.10,
        'Trader'        : 0.90,
        'Repairer'      : 0.90,
        'Builder'       : 0.75,
        'Upgrader'      : 0.70,
        'Claimer'       : 0.99,
        'Defender'      : 0.98,
        'Raider'        : 1.10
    },
    
    'myRooms': {
        'W7N4': {
            'Flag1' : {
                'Harvester'     : 2,
                'Miner'         : 1,
                'Distributor'   : 2,
                'Hauler'        : 2,
                'Trader'        : 0,
                'Repairer'      : 2,
                'Builder'       : 0,
                'Upgrader'      : 1,
            },
            
            'Flag2' : {
                'Harvester'   : 2,
                'Distributor' : 2,
                'Repairer'    : 1,
                'Builder'     : 0,
                'Upgrader'    : 0,
                'Claimer'     : 1,
                'Defender'    : 1
            },

            'Flag3' : {
                'Harvester'   : 2,
                'Distributor' : 2,
                'Repairer'    : 1,
                'Builder'     : 0,
                'Upgrader'    : 0,
                'Claimer'     : 1,
                'Defender'    : 1
            },
            
            'Flag4' : {
                'Raider'        : 3,
                'Distributor'   : 8,
                'Repairer'      : 2,
                'Builder'       : 0,
                'Defender'      : 0
            }
        }
    },
    
    'bodyparts': {
        'Harvester': {
            'Level1' : { 'work': 1, 'carry' : 2, 'move' : 2 }, 'Level2' : { 'work': 4, 'carry' : 1, 'move' : 2 },
            'Level3' : { 'work': 6, 'carry' : 1, 'move' : 3 }, 'Level4' : { 'work': 6, 'carry' : 1, 'move' : 3 },
            'Level5' : { 'work': 6, 'carry' : 1, 'move' : 4 }, 'Level6' : { 'work': 6, 'carry' : 1, 'move' : 3 },
            'Level7' : { 'work': 6, 'carry' : 1, 'move' : 3 }, 'Level8' : { 'work': 6, 'carry' : 1, 'move' : 3 }
        },
        
        'Miner': {
            'Level1' : { 'work': 0,  'carry' : 0, 'move' : 0  }, 'Level2' : { 'work': 0,  'carry' :  0, 'move' :  0  },
            'Level3' : { 'work': 0,  'carry' : 0, 'move' : 0  }, 'Level4' : { 'work': 0,  'carry' :  0, 'move' :  0  },
            'Level5' : { 'work': 0,  'carry' : 0, 'move' : 0  }, 'Level6' : { 'work': 20, 'carry' :  0, 'move' :  6  },
            'Level7' : { 'work': 30, 'carry' : 6, 'move' : 14 }, 'Level8' : { 'work': 30, 'carry' :  6, 'move' : 14  }
        },
        
        'Distributor' : {
            'Level1' : { 'carry' :  4, 'move' :  2 }, 'Level2' : { 'carry' :  6, 'move' :  3 },
            'Level3' : { 'carry' : 10, 'move' :  5 }, 'Level4' : { 'carry' : 16, 'move' :  8 },
            'Level5' : { 'carry' : 20, 'move' : 10 }, 'Level6' : { 'carry' : 20, 'move' : 10 },
            'Level7' : { 'carry' : 30, 'move' : 15 }, 'Level8' : { 'carry' : 30, 'move' : 15 }
        },
        
        'Hauler' : {
            'Level1' : {                           }, 'Level2' : {                           },
            'Level3' : {                           }, 'Level4' : { 'carry' : 10, 'move' :  5 },
            'Level5' : { 'carry' : 10, 'move' :  5 }, 'Level6' : { 'carry' : 10, 'move' :  5 },
            'Level7' : { 'carry' : 10, 'move' :  5 }, 'Level8' : { 'carry' : 10, 'move' :  5 }
        },
        
        'Trader' : {
            'Level1' : {                          }, 'Level2' : {                          },
            'Level3' : {                          }, 'Level4' : {                          },
            'Level5' : { 'move': 1                }, 'Level6' : { 'carry' : 10, 'move' : 5 },
            'Level7' : { 'carry' : 10, 'move' : 5 }, 'Level8' : { 'carry' : 10, 'move' : 5 }
        },
        
        'Repairer': {
            'Level1' : { 'work':  1, 'carry' :   1, 'move' :  2 }, 'Level2' : { 'work':  2, 'carry' :   4, 'move' :  3 },
            'Level3' : { 'work':  3, 'carry' :   3, 'move' :  6 }, 'Level4' : { 'work':  7, 'carry' :   5, 'move' :  6 },
            'Level5' : { 'work':  8, 'carry' :   6, 'move' :  7 }, 'Level6' : { 'work':  8, 'carry' :   6, 'move' :  7 },
            'Level7' : { 'work':  8, 'carry' :   6, 'move' :  7 }, 'Level8' : { 'work':  8, 'carry' :   6, 'move' :  7 }
        },
        
        'Builder': {
            'Level1' : { 'work':  1, 'carry' :   2, 'move' :  2 }, 'Level2' : { 'work':  3, 'carry' :   2, 'move' :  3 },
            'Level3' : { 'work':  4, 'carry' :   4, 'move' :  4 }, 'Level4' : { 'work':  5, 'carry' :   9, 'move' :  7 },
            'Level5' : { 'work':  8, 'carry' :  10, 'move' :  9 }, 'Level6' : { 'work': 10, 'carry' :  10, 'move' : 10 },
            'Level7' : { 'work': 10, 'carry' :  10, 'move' : 10 }, 'Level8' : { 'work': 10, 'carry' :  10, 'move' : 10 }
        },
        
        'Upgrader': {
            'Level1' : { 'work':  1, 'carry' :   2,  'move' :  2 }, 'Level2' : { 'work':  4, 'carry' :   1, 'move' :  2 },
            'Level3' : { 'work':  6, 'carry' :   1,  'move' :  3 }, 'Level4' : { 'work': 10, 'carry' :   1, 'move' :  5 },
            'Level5' : { 'work': 14, 'carry' :   3,  'move' :  5 }, 'Level6' : { 'work': 16, 'carry' :   1, 'move' :  5 },
            'Level7' : { 'work': 10, 'carry' :   10, 'move' : 10 }, 'Level8' : { 'work': 16, 'carry' :   1, 'move' :  5 }
        },
        
        'Claimer': {    //TODO
            'Level1' : {                        }, 'Level2' : {                        },
            'Level3' : { 'claim': 1, 'move' : 2 }, 'Level4' : { 'claim': 1, 'move' : 2 },
            'Level5' : { 'claim': 2, 'move' : 2 }, 'Level6' : { 'claim': 2, 'move' : 2 },
            'Level7' : { 'claim': 2, 'move' : 2 }, 'Level8' : { 'claim': 2, 'move' : 2 }
        },
        
        'Defender': { //TODO
            'Level1' : {                                       }, 'Level2' : {                                       },
            'Level3' : { 'move' : 2, 'attack' :  2, 'heal' : 2 }, 'Level4' : {  'move' : 4, 'attack' : 2, 'heal' : 1 },
            'Level5' : { 'move' : 5, 'attack' :  6, 'heal' : 4 }, 'Level6' : {  'move' : 5, 'attack' : 6, 'heal' : 4 },
            'Level7' : { 'move' : 9, 'attack' : 10, 'heal' : 8 }, 'Level8' : {  'move' : 5, 'attack' : 6, 'heal' : 4 }
        },
        
        'Raider': { //TODO
            'Level1' : {                                                                         }, 'Level2' : {                                                                         },
            'Level3' : {                                                                         }, 'Level4' : {                                                                         },
            'Level5' : {                                                                         }, 'Level6' : {                                                                         },
            'Level7' : { 'move' : 17, 'work' : 8, 'attack' : 15, 'ranged_attack' : 5, 'heal' : 5 }, 'Level8' : { 'move' : 17, 'work' : 8, 'attack' : 15, 'ranged_attack' : 5, 'heal' : 5 }
        },
        
        'DamageDealer': { //TODO
            'Level1' : {  }, 'Level2' : {  },
            'Level3' : {  }, 'Level4' : {  },
            'Level5' : {  }, 'Level6' : {  },
            'Level7' : {  }, 'Level8' : {  }
        },
    
        'Healer': { //TODO
            'Level1' : {  }, 'Level2' : {  },
            'Level3' : {  }, 'Level4' : {  },
            'Level5' : {  }, 'Level6' : {  },
            'Level7' : {  }, 'Level8' : {  }
        }
    }
};

module.exports = mySettings;