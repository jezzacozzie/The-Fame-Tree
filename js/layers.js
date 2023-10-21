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
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "f", description: "F: Reset for fame.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},    

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
            return player[this.layer].points.add(1).pow(0.3)
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
        cost: new Decimal(3),
        effect() {
            return player.points.add(1).pow(0.15)
        },
        effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" },
        unlocked() {
            return hasUpgrade ('f', 13)
            },
    },
    15: {
        title: "Fame^2",
        description: "Multiply fame gain by fame.",
        cost: new Decimal(5),
        effect() {
            return player[this.layer].points.add(1).pow(0.03)
        },
        effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" },
        unlocked() {
            return hasUpgrade ('f', 14)
            },
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
    columns: 5,
    11: {
        name: "Somebody Knows Me!",
        tooltip: "Start generation of popularity.",
        done() {
            return hasUpgrade ('f', 11) 
        },
    },
    12: {
        name: "Is this good enough?",
        tooltip: "Have 20 popularity at any one time.",
        done() {
            return player.points.gte(20)
        },
    },
    13: {
        name: "Gaining Attraction",
        tooltip: "Have 5 fame at any one time.",
        done() {
            return player.f.points.gte(5)
        },
    },
    },
   },
)
