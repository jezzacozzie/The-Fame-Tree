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
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if (hasUpgrade ('f', 24)) exp = exp.times(1.01)
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
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    passiveGeneration() {
        return hasMilestone ('v', 2)?1:hasMilestone ('v', 1)?0.1:0
        },

    upgrades: {
        rows: 2,
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
            return player.points.add(1).pow(0.1)
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
            return player.f.points.add(1).pow(0.1)
        },
        effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" },
        unlocked() {
            return hasUpgrade ('f', 24)
        }
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
    color: "#6450D4",
    requires: new Decimal(25), // Can be a function that takes requirement increases into account
    resource: "viewers", // Name of prestige currency
    baseResource: "popularity", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        branches: ["f"],
    exponent: 1.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
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
        let eff = player.v.points.add(1)
        if (hasUpgrade ('v', 22)) eff = eff.add(50)
        eff = eff.times(tmp.v.buyables[11].effect)
        return eff
    },
    effectDescription() {
        dis = "which boost popularity gain by "+format(tmp.v.effect)+"x"
        return dis
    },
    effectBase() {
        let base = new Decimal(1)
        return base
    },

    tabFormat: {
        "Main": {
        content:[
            "main-display",
            "best-points",
            "prestige-button",
            "blank",
            "upgrades",
        ]
        },
        "Milestones": {
        content:[
            "main-display",
            "prestige-button",
            "blank",
            "milestones",
        ]
        },
        "Buyables": {
        content:[
            "main-display",
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
                return player.f.points.pow(0.5)
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
    },

    buyables: {
        11: {
            cost() { 
                return getBuyableAmount(this.layer, this.id).times(1).pow_base(2); 
            },
            title: "Loyal Viewers",
            effect() {
                return getBuyableAmount(this.layer, this.id).times(1.5);
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
        tooltip: "Have all of the fame upgrades.",
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
    }
    },
   },
)
