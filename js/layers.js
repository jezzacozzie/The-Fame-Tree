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
    }
    },
   },
)
