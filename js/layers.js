addLayer("f", {
    name: "fame", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#F5E907",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "fame", // Name of prestige currency
    baseResource: "popularity", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.35, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade ('f', 13)) mult = mult.times(upgradeEffect('f', 13))
        if (hasUpgrade ('f', 15)) mult = mult.times(upgradeEffect('f', 15))
        if (hasUpgrade ('f', 22)) mult = mult.times(1.1)
        if (hasUpgrade ('v', 11)) mult = mult.times(upgradeEffect('v', 11))
        if (hasUpgrade ('v', 13)) mult = mult.pow(1.05)
        if (hasUpgrade ('i', 13)) mult = mult.times(upgradeEffect('i', 13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if (hasUpgrade ('f', 24)) exp = exp.times(1.01)
        if (hasUpgrade ('f', 31)) exp = exp.times(upgradeEffect('f', 31))
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "f", description: "F: Reset for fame.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},    
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone ('v', 0) && resettingLayer=="v") keep.push("upgrades")
        if (hasMilestone ('i', 0) && resettingLayer=="i") keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    passiveGeneration() {
        return hasMilestone ('v', 2)?1:hasMilestone ('v', 1)?0.1:0
        },

    upgrades: {
        rows: 3,
        columns: 5,
    11: {
        title: "Exist",
        description: "Gain 0.1 popularity per second.",
        cost: new Decimal(1),
    },
    12: {
        title: "Growth",
        description: "Multiply popularity gain by fame.",
        cost: new Decimal(1),
        effect() {
            let eff = player.f.points.add(1).pow(0.3)
            if (hasUpgrade('f', 23)) eff = eff.add(upgradeEffect('f', 23))
            if (hasUpgrade('v', 13)) eff = eff.add(upgradeEffect('v', 13))
            if (hasUpgrade('f', 34)) eff = eff.add(1e6)
            eff = softcap(eff, new Decimal(1e6), new Decimal(0.1))
            if (player.i.unlocked) eff = eff.times(tmp.i.effect)
            return eff
        },
        effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" },
        unlocked() {
        return hasUpgrade ('f', 11)
        },
    },
    13: {
        title: "Recognition",
        description: "Multiply fame gain by popularity.",
        cost: new Decimal(2),
        effect() {
            let eff = player.points.add(1).pow(0.1)
            if (hasUpgrade('v', 31)) eff = eff.pow(upgradeEffect('v', 31))
            return eff
        },
        effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" },
        unlocked() {
            return hasUpgrade ('f', 12)
            },
    },
    14: {
        title: "Exponential",
        description: "Multiply popularity generation by popularity.",
        cost: new Decimal(2),
        effect() {
            let eff = player.points.add(1).pow(0.15)
            if (hasUpgrade ('v', 12)) eff = eff.add(2)
            return eff
        },
        effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" },
        unlocked() {
            return hasUpgrade ('f', 13)
            },
    },
    15: {
        title: "Fame^2",
        description: "Multiply fame gain by fame.",
        cost: new Decimal(3),
        effect() {
            let eff = player.f.points.add(1).pow(0.03)
            if (hasUpgrade('f', 25)) eff = eff.add(upgradeEffect('f', 25))
            return eff
        },
        effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" },
        unlocked() {
            return hasUpgrade ('f', 14)
            },
    },
    21: {
        title: "Post-Existence",
        description: "Add an extra 0.1 to popularity gain base.",
        cost: new Decimal(4),
        unlocked() {
            return hasUpgrade ('f', 15)
        },
    },
    22: {
        title: "Extra Fame",
        description: "Gain 10% more fame.",
        cost: new Decimal(6),
        unlocked() {
            return hasUpgrade ('f', 21)
        },
    },
    23: {
        title: "More Growth",
        description: "Increase 'Growth' effect by popularity.",
        cost: new Decimal(8),
        effect() {
            return player.points.add(1).pow(0.1)
        },
        effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" },
        unlocked() {
            return hasUpgrade ('f', 22)
        }
    },
    24: {
        title: "1/100th Superstar",
        description: "Add 0.01 to fame gain exponent.",
        cost: new Decimal(12),
        unlocked() {
            return hasUpgrade ('f', 23)
        },
    },
    25: {
        title: "Fame^3",
        description: "Increase 'Fame^2' effect by fame.",
        cost: new Decimal(20),
        effect() {
            let eff = player.f.points.add(1).pow(0.1)
            if (hasUpgrade('f', 35)) eff = eff.times(upgradeEffect('f', 35))
            return eff
        },
        effectDisplay() {return "+"+format(upgradeEffect(this.layer, this.id))},
        unlocked() {
            return hasUpgrade ('f', 24)
        }
    },
    31: {
        title: "Fame Exponent",
        description: "Raise fame based on popularity.",
        cost: new Decimal(1.5e9),
        effect() {
            return player.points.add(1).pow(0.002)
        },
        effectDisplay() {return "^"+format(upgradeEffect(this.layer, this.id))},
        unlocked() {return hasUpgrade ('v', 33)}
    },
    32: {
        title: "Viewer Viewer",
        description: "Add to viewers base based on viewers.",
        cost: new Decimal(2e11),
        effectDisplay() {return "+"+format(upgradeEffect(this.layer, this.id))},
        effect() {
            return player.v.points.add(1).pow(2)
        },
        unlocked() {return hasUpgrade ('f', 31)}
    },
    33: {
        title: "250 To Go",
        description: "Divide viewer cost by 250.",
        cost: new Decimal(1e12),
        unlocked() {return hasUpgrade ('f', 32)}
    },
    34: {
        title: "Speedy Growth",
        description: "Growth starts at softcap.",
        cost: new Decimal(1e12),
        unlocked() {return hasUpgrade ('f', 33)}
    },
    35: {
        title: "Fame^4",
        description: "Increase 'Fame^3' effect by fame.",
        cost: new Decimal(1.5e13),
        unlocked() {return hasUpgrade ('f', 34)},
        effect() {
            return player.f.points.add(1).pow(0.1)
        },
        effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" },
    }
},

})

addLayer("v", {
    name: "viewers", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "V", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#5440C4",
    requires: new Decimal(25), // Can be a function that takes requirement increases into account
    resource: "viewers", // Name of prestige currency
    baseResource: "popularity", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        branches: ["f"],
    exponent: 1.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('f', 33)) mult = mult.div(250)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "v", description: "V: Reset for viewers.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasAchievement ('a', 14)}, 
    effect() {
        let eff = player.v.points.add(1).max(1)
        eff = eff.times(tmp.v.effectBase)
        if (hasUpgrade ('v', 22)) eff = eff.add(50)
        eff = eff.times(tmp.v.buyables[11].effect)
        eff = eff.add(1)
        eff = softcap(eff, new Decimal(1e6), new Decimal(0.5))
        eff = softcap(eff, new Decimal(1e7), new Decimal(0.25))
        eff = softcap(eff, new Decimal(1e8), new Decimal(0.125))
        return eff
    },
    effectDescription() {
        dis = "which boost popularity gain by "+format(tmp.v.effect)+"x"
        return dis
    },
    effectBase() {
        let base = new Decimal(1)
        if (hasUpgrade ('v', 32)) base = base.add(upgradeEffect('v', 32))
        if (hasUpgrade ('f', 32)) base = base.add(upgradeEffect('f', 32))
        if (hasUpgrade ('i', 22)) base = base.add(upgradeEffect('i', 22)) 
        return base
    },
    canBuyMax() {return hasMilestone('v', 3)},

    tabFormat: {
        "Main": {
        content:[
            "main-display",
            ["display-text",
            function() {return 'You have ' + formatWhole(player.v.best)+' best viewers.'},
                {}],
            "blank",
            "prestige-button",
            "blank",
            "upgrades",
        ]
        },
        "Milestones": {
        content:[
            "main-display",
            ["display-text",
            function() {return 'You have ' + formatWhole(player.v.best)+' best viewers.'},
                {}],
            "blank",
            "prestige-button",
            "blank",
            "milestones",
        ]
        },
        "Buyables": {
        content:[
            "main-display",
            ["display-text",
            function() {return 'You have ' + formatWhole(player.v.best)+' best viewers.'},
                {}],
            "blank",
            "prestige-button",
            "blank",
            "buyables",
        ]
        }
    },

    upgrades:{
        11: {
            title: "Famous Viewing",
            description: "Gain more fame based on your viewers.",
            cost: new Decimal(2),
            effect() {
                return player.v.points.add(1).pow(0.5)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        12: {
            title: "Expo-Exponential",
            description: "Add 2 to 'Exponential' effect base.",
            cost: new Decimal(3),
            unlocked () {return hasUpgrade ('v', 11)}
        },
        13: {
            title: "Column 2 Boost",
            description: "Boost the 2 upgrades in the second column of fame upgrades.",
            cost: new Decimal(5),
            unlocked () {return hasUpgrade ('v', 12)},
            effect() {
                let eff = player.f.points.pow(0.5)
                if (hasUpgrade ('i', 11)) eff = eff.add(1e7)
                eff = softcap(eff, new Decimal(1e7), new Decimal(0))
                return eff
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        21: {
            title: "Popular Viewing",
            description: "Gain more popularity based on your viewers.",
            cost: new Decimal(6),
            unlocked() {return hasUpgrade ('v', 13)},
            effect() {
                return player.v.points.add(1).pow(0.5)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" },
        }, 
        22: {
            title: "Membership",
            description: "Gain 50 more base viewers.",
            cost: new Decimal(7),
            unlocked() {return hasUpgrade ('v', 21)}
        },
        23: {
            title: "^Popular Viewing",
            description: "Raise popularity based on viewers.",
            cost: new Decimal(9),
            unlocked() {return hasUpgrade ('v', 22)},
            effect() {
                return player.v.points.add(1).pow(0.1)
            },
            effectDisplay() {return "^"+format(upgradeEffect(this.layer, this.id))},
        },
        31: {
            title: "Public Recognition",
            description: "Raise 'Recognition' based on viewers.",
            cost: new Decimal(10),
            unlocked() {return hasUpgrade ('v', 23)},
            effect() {
                return player.v.points.add(1).pow(0.15)
            },
            effectDisplay() {return "^"+format(upgradeEffect(this.layer, this.id))},
        },
        32: {
            title: "Base-Boost",
            description: "Add to viewers base based on fame.",
            cost: new Decimal(11),
            unlocked() {return hasUpgrade ('v', 31)},
            effect() {
                return player.f.points.add(1).pow(0.15)
            },
            effectDisplay() {return "+"+format(upgradeEffect(this.layer, this.id))},
        },
        33: {
            title: "Fame Revisit",
            description: "Unlock 5 new fame upgrades.",
            cost: new Decimal(12),
            unlocked() {
                return hasUpgrade ('v', 32)
            }
        },
    },

    milestones: {
        0: {
            requirementDescription: "5 Viewers",
            done () {
                return player.v.best.gte(5)
            },
            effectDescription: "Keep fame upgrades on reset."
        },
        1: {
            requirementDescription: "7 Viewers",
            done() {
                return player.v.best.gte(7)
            },
            effectDescription: "Gain 10% of fame gain per second."
        },
        2: {
            requirementDescription: "8 Viewers",
            done() {
                return player.v.best.gte(8)
            },
            effectDescription: "Gain 100% of fame gain per second."
        },
        3: {
            requirementDescription: "10 Viewers",
            done() {
                return player.v.best.gte(10)
            },
            effectDescription: "You can buy max viewers."
        },
    },

    buyables: {
        11: {
            cost() { 
                return getBuyableAmount(this.layer, this.id).times(1).pow_base(2); 
            },
            title: "Loyal Viewers",
            effect() {
                return getBuyableAmount(this.layer, this.id). times(1.5);
            },
            display() {
                return "Multiply views effect by 1.50x<br>Amount: "+format(getBuyableAmount(this.layer, this.id))+
                "<br> Cost: "+format(tmp.v.buyables[11].cost)+" viewers<br>Effect: "+format(tmp.v.buyables[11].effect)+"x"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            }
        },
    },
})

addLayer("i", {
    name: "interactions", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "#CF4FE1",
    requires: new Decimal(1e15), // Can be a function that takes requirement increases into account
    resource: "interactions", // Name of prestige currency
    baseResource: "fame", // Name of resource prestige is based on
    baseAmount() {return player.f.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        branches: ["f"],
    exponent: 0.005, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.times(tmp.i.buyables[11].effect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "I", description: "I: Reset for interactions.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasAchievement ('a', 24)}, 
    effect() {
        let eff = new Decimal(1)
        eff = eff.add(upgradeEffect('i', 12))
        return eff
    },
    effectDescription() {
        dis = "which boost 'Growth' multiplier after softcap by "+format(tmp.i.effect)+"x"
        return dis
    },
    effectBase() {
        let base = new Decimal(1)
        return base
    },
    passiveGeneration() {
        return hasMilestone ('i', 1)?0.1:0
        },

    tabFormat: {
        "Main": {
        content:[
            "main-display",
            ["display-text",
            function() {return 'You have ' + formatWhole(player.i.best)+' best interactions.'},
                {}],
            ["display-text",
                function() {return 'You have ' + formatWhole(player.i.total)+' total interactions.'},
                    {}],
            "blank",
            "prestige-button",
            "blank",
            "upgrades",
        ]
        },
        "Milestones": {
        content:[
            "main-display",
            ["display-text",
            function() {return 'You have ' + formatWhole(player.i.best)+' best interactions.'},
                {}],
            ["display-text",
                function() {return 'You have ' + formatWhole(player.i.total)+' total interactions.'},
                    {}],
            "blank",
            "prestige-button",
            "blank",
            "milestones",
        ]
        },
        "Advertisements": {
        content:[
            "main-display",
            ["display-text",
            function() {return 'You have ' + formatWhole(player.i.best)+' best interactions.'},
                {}],
            ["display-text",
                function() {return 'You have ' + formatWhole(player.i.total)+' total interactions.'},
                    {}],
            "blank",
            "prestige-button",
            "blank",
            ["bar", "bigBar"],
            "blank",
            ["bar", 'biggerBar'],
            "blank",
            "buyables",
        ]
        }
    },

    upgrades: {
        11: {
            title: "Full-Capped",
            description: "'Column 2 Boost' starts at its hardcap.",
            cost: new Decimal(2)
        },
        12: {
            title: "Interconnection",
            description: "Add to the above effect per interaction.",
            cost: new Decimal(3),
            effect() {
                let eff = player.i.points.times(0.02)
                if (hasUpgrade('i', 21)) eff = player.i.best.times(0.02)
                return eff
            },
            effectDisplay() {return "+"+format(upgradeEffect(this.layer, this.id))},
            unlocked() {return hasUpgrade('i', 11)}
        },
        13: {
            title: "Fame-ous Interactions",
            description: "Add to fame gain based on interactions.",
            cost: new Decimal(4),
            effect() {
                let eff = player.i.points.add(1).pow(0.75)
                eff = softcap(eff, new Decimal(100), new Decimal(0))
                return eff
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x"},
            unlocked() {return hasUpgrade('i', 12)}
        },
        21: {
            title: "Interconnected",
            description: "'Interconnection' is based on best interactions.",
            cost: new Decimal(10),
            unlocked() {return hasUpgrade('i', 13), hasAchievement('a', 32)}
        },
        22: {
            title: "Inter-Base",
            description: "Viewers base is boosted by interactions.",
            cost: new Decimal(20),
            unlocked() {return hasUpgrade('i', 21)},
            effect() {
                let eff = player.i.points.add(1).pow(1.5)
                return eff
            },
            effectDisplay() {return "+"+format(upgradeEffect(this.layer, this.id))},
        },
        23: {
            title: "Inter-Raise",
            description: "Interactions raise popularity gain.",
            cost: new Decimal(100),
            unlocked() {return hasUpgrade ('i', 22)},
            effect() {
                let eff = player.i.points.add(1).pow(0.01)
                return eff
            },
            effectDisplay() {return "^"+format(upgradeEffect(this.layer, this.id))},
        }
    },

    milestones: {
        0: {
            requirementDescription: "3 Total Interactions",
            effectDescription: "Keep fame upgrades on reset.",
            done() {return player.i.total.gte(3)}
        },
        1: {
            requirementDescription: "300 Total Interactions",
            effectDescription: "Gain 10% of interactions gain per second.",
            done() {return player.i.total.gte(300)}
        },
    },

    bars: {
        bigBar: {
            direction: RIGHT,
            width: 650,
            height: 40,
            fillStyle: {'background-color' : "#cf4fe1"},
            borderStyle() { return {"border-color": "#cf4fe1"} },
            progress() {
                let prog = player.i.points.div(10)
                if (player.i.best.gte(10)) prog = 1
                return prog
            },
            display() {
                if (player.i.best.lte(9))
                return "Unlock an advertisement: "+format(player.i.points)+"/10 interactions."
                else
                return "You have unlocked Train Advertisements."
            }
        },
        biggerBar: {
            direction: RIGHT,
            width: 650,
            height: 40,
            fillStyle: {'background-color' : "#cf4fe1"},
            borderStyle() { return {"border-color": "#cf4fe1"} },
            progress() {
                let prog = player.i.points.div(200)
                if (player.i.best.gte(200)) prog = 1
                return prog
            },
            display() {
                if (player.i.best.lte(199))
                return "Unlock an advertisement: "+format(player.i.points)+"/200 interactions."
                else
                return "You have unlocked Billboards."
            },
            unlocked() {return player.i.best.gte(10)}
        },
    },

    buyables: {
        11: {
            title: "Train Advertisements",
            unlocked() {return player.i.best.gte(10)},
            effect() {return getBuyableAmount(this.layer, this.id).times(1).pow_base(2);},
            cost() {
                let cost = getBuyableAmount(this.layer, this.id).add(1).pow(2).times(10)
                if (getBuyableAmount(this.layer, this.id).gte(2)) cost = cost.pow(2)
                if (getBuyableAmount('i', 12).gte(1)) cost = cost.div(tmp.i.buyables[12].effect)
                return cost
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },
            display() {
                return "Multiply interactions gain by 2 per buyable amount.<br>Amount: "+format(getBuyableAmount(this.layer, this.id))+
                "<br>Cost: "+format(tmp.i.buyables[11].cost)+" interactions.<br>Effect: "+format(tmp.i.buyables[11].effect)+"x"
            }
        },
        12: {
            title: "Billboards",
            unlocked() {return player.i.best.gte(500)},
            effect() {return getBuyableAmount(this.layer, this.id).times(1).pow_base(1.5);},
            cost() {
                let cost = getBuyableAmount(this.layer, this.id).add(1).pow(1.5).times(200)
                return cost
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },
            display() {
                return "Divide cost of Train Advertisements based on buyable amounts.<br>Amount: "+format(getBuyableAmount(this.layer, this.id))+
                "<br>Cost: "+format(tmp.i.buyables[12].cost)+" interactions.<br>Effect: "+format(tmp.i.buyables[12].effect)+"x"
            }
        },
    }

})

addLayer("a", {
    startData() { return {
        unlocked: true,
    }},
    color: "yellow",
    row: "side",
    layerShown() {return true}, 
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },

   achievements: {
    rows: 20,
    columns: 4,
    11: {
        name: "Somebody Knows Me!",
        tooltip: "Start generation of popularity.",
        done() {
            return hasUpgrade ('f', 11)
        },
    },
    12: {
        name: "Is this good enough?",
        tooltip: "Have 3 popularity at any one time.",
        done() {
            return player.points.gte(3)
        },
    },
    13: {
        name: "Gaining Attraction",
        tooltip: "Have 5 fame at any one time.",
        done() {
            return player.f.points.gte(5)
        },
    },
    14: {
        name: "Berry Famous",
        tooltip: "Have two rows of fame upgrades.",
        done() {
            return hasUpgrade('f', 25)
        }
    },
    21: {
        name: "Someone's Watching",
        tooltip: "Gain your first viewer.",
        done() {
            return player.v.points.gte(1)
        },
    },
    22: {
        name: "Double Viewer",
        tooltip: "Gain 2 loyal viewers.",
        done() {
            return getBuyableAmount('v', 11).gte(2)
        }
    },
    23: {
        name: "Everybody Knows Me.",
        tooltip: "Have 8.00e9 popularity.",
        done() {
            return player.points.gte(8e9)
        }
    },
    24: {
        name: "The Perfect Combinations",
        tooltip: "Have the third row of fame upgrades.",
        done() {
            return hasUpgrade('f', 35)
        }
    },
    31: {
        name: "FREE PUBLICITY",
        tooltip: "Gain your first interaction.",
        done() {
            return player.i.points.gte(1)
        }
    },
    32: {
        name: "Getting The World To See",
        tooltip: "Have 1 of any type of advertisement.",
        done() {
            return getBuyableAmount('i', 11).gte(1)
        }
    }
    },
   },
)
