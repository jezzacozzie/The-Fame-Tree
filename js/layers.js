addLayer("f", {
    name: "fame", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#F5E907",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "fame", // Name of prestige currency
    baseResource: "popularity", // Name of resource prestige is based on
    baseAmount() { return player.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.35, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('f', 13)) mult = mult.times(upgradeEffect('f', 13))
        if (hasUpgrade('f', 15)) mult = mult.times(upgradeEffect('f', 15))
        if (hasUpgrade('f', 22)) mult = mult.times(1.1)
        if (hasUpgrade('v', 11)) mult = mult.times(upgradeEffect('v', 11))
        if (hasAchievement('fo', 23)) mult = mult.times(achievementEffect('fo', 23))
        if (hasUpgrade('v', 13)) mult = mult.pow(1.05)
        if (hasUpgrade('i', 13)) mult = mult.times(upgradeEffect('i', 13))
        if (hasUpgrade('k', 33)) mult = mult.pow(1.1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if (hasUpgrade('f', 24)) exp = exp.times(1.01)
        if (hasUpgrade('f', 31)) exp = exp.times(upgradeEffect('f', 31))
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "f", description: "F: Reset for fame.", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() { return true },
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone('v', 0) && resettingLayer == "v") keep.push("upgrades")
        if (hasMilestone('i', 0) && resettingLayer == "i") keep.push("upgrades")
        if (hasMilestone('k', 0) && resettingLayer == "k") keep.push("upgrades")
        if (hasAchievement('fo', 14) && resettingLayer == "fo") keep.push("upgrades")
        if (hasAchievement('s', 14) && resettingLayer == "s") keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    passiveGeneration() {
        return hasMilestone('v', 2) ? 1 : hasMilestone('v', 1) ? 0.1 : 0
    },
    upgrades: {
        rows: 5,
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
                if (player.s.unlocked) eff = eff.times(tmp.s.effect)
                if (!hasUpgrade('f', 52))eff = softcap(eff, new Decimal(1e6), new Decimal(0.1))
                if (hasUpgrade('f', 52)) eff = softcap(eff, new Decimal(1e6), new Decimal(0.2))
                if (player.s.unlocked) eff = eff.times(tmp.s.effect.div(4.5))
                if (hasUpgrade('f', 44)) eff = eff.times(upgradeEffect('f', 44))
                if (player.i.unlocked) eff = eff.times(tmp.i.effect)
                if (hasUpgrade('k', 32)) eff = eff.times(upgradeEffect('k', 32))
                eff = softcap(eff, new Decimal(2e15), new Decimal(0.2))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            unlocked() {
                return hasUpgrade('f', 11)
            },

        },
        13: {
            title: "Recognition",
            description: "Multiply fame gain by popularity.",
            cost: new Decimal(2),
            effect() {
                let eff = player.points.add(1).pow(0.1)
                if (hasUpgrade('v', 31)) eff = eff.pow(upgradeEffect('v', 31))
                eff = softcap(eff, new Decimal(1e9), new Decimal(0.1))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            unlocked() {
                return hasUpgrade('f', 12)
            },
        },
        14: {
            title: "Exponential",
            description: "Multiply popularity generation by popularity.",
            cost: new Decimal(2),
            effect() {
                let eff = player.points.add(1).pow(0.15)
                if (hasUpgrade('v', 12)) eff = eff.add(2)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            unlocked() {
                return hasUpgrade('f', 13)
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
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            unlocked() {
                return hasUpgrade('f', 14)
            },
        },
        21: {
            title: "Post-Existence",
            description: "Add an extra 0.1 to popularity gain base.",
            cost: new Decimal(4),
            unlocked() {
                return hasUpgrade('f', 15)
            },
        },
        22: {
            title: "Extra Fame",
            description: "Gain 10% more fame.",
            cost: new Decimal(6),
            unlocked() {
                return hasUpgrade('f', 21)
            },
        },
        23: {
            title: "More Growth",
            description: "Increase 'Growth' effect by popularity.",
            cost: new Decimal(8),
            effect() {
                return player.points.add(1).pow(0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            unlocked() {
                return hasUpgrade('f', 22)
            }
        },
        24: {
            title: "1/100th Superstar",
            description: "Add 0.01 to fame gain exponent.",
            cost: new Decimal(12),
            unlocked() {
                return hasUpgrade('f', 23)
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
            effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id)) },
            unlocked() {
                return hasUpgrade('f', 24)
            }
        },
        31: {
            title: "Fame Exponent",
            description: "Raise fame based on popularity.",
            cost: new Decimal(1.5e9),
            effect() {
                return player.points.add(1).pow(0.002)
            },
            effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id)) },
            unlocked() {if ((hasUpgrade('v', 33) && hasUpgrade('f', 25)) || (hasAchievement('fo', 14) || hasAchievement('s', 14))) return true}
        },
        32: {
            title: "Viewer Viewer",
            description: "Add to viewers base based on viewers.",
            cost: new Decimal(2e11),
            effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id)) },
            effect() {
                return player.v.points.add(1).pow(2)
            },
            unlocked() { return hasUpgrade('f', 31) }
        },
        33: {
            title: "250 To Go",
            description: "Divide viewer cost by 250.",
            cost: new Decimal(1e12),
            unlocked() { return hasUpgrade('f', 32) }
        },
        34: {
            title: "Speedy Growth",
            description: "Growth starts at softcap.",
            cost: new Decimal(1e12),
            unlocked() { return hasUpgrade('f', 33) }
        },
        35: {
            title: "Fame^4",
            description: "Increase 'Fame^3' effect by fame.",
            cost: new Decimal(1.5e13),
            unlocked() { return hasUpgrade('f', 34) },
            effect() {
                let eff = player.f.points.add(1).pow(0.1)
                if (hasUpgrade('f', 45)) eff = eff.times(upgradeEffect ('f', 45))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        41: {
            title: "On The Up",
            description: "Raise 'Interconnection' based on fame.",
            cost: new Decimal(1e22),
            unlocked() {if ((hasUpgrade('i', 33) && hasUpgrade('f', 35)) || hasAchievement('fo', 14) || hasAchievement('s', 14)) return true},
            effect() {
                let eff = player.f.points.add(1).pow(0.005)
                eff = softcap(eff, new Decimal(1.1), new Decimal(0.2))
                return eff
            },
            effectDisplay() {return "^"+format(upgradeEffect(this.layer, this.id))},
        },
        42: {
            title: "We Already Have Viewers!",
            description: "Unlock another advertisement.",
            cost: new Decimal(1.5e23),
            unlocked() {return hasUpgrade('f', 41)},
        },
        43: {
            title: "Out of Thin Air",
            description: "Add to effective viewers based on best interactions",
            cost: new Decimal(1e25),
            unlocked() {return hasUpgrade('f', 42)},
            effect() {
                let eff = player.i.best
                if (hasUpgrade('f', 53)) eff = player.i.total
                eff = softcap(eff, new Decimal(5000), new Decimal(0))
                return eff
            },
            effectDisplay() {return "+"+format(upgradeEffect(this.layer, this.id))},
            style: {
                height: "120px",
                width: "120px",
            },
        },
        44: {
            title: "Back to Basics",
            description: "Multiply 'Growth' after softcap based on fame.",
            cost: new Decimal(2.5e25),
            unlocked() {return hasUpgrade('f', 43)},
            effect() {
                let eff = player.f.points.add(1).pow(2).log(10)
                return eff
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x"},
            style: {
                height: "120px",
                width: "120px",
            },
        },
        45: {
            title: "Fame^5",
            description: "Increase 'Fame^4' effect by fame.",
            cost: new Decimal(1e27),
            unlocked() {return hasUpgrade('f', 44)},
            effect() {
                let eff = player.f.points.add(1).pow(0.05)
                if (hasUpgrade('f', 55)) eff = eff.times(upgradeEffect('f', 55))
                return eff
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x"},
        },
        51: {
            title: "Cheap Karma",
            description: "Make karma buyables cheaper based on fame",
            cost: new Decimal(1e64),
            unlocked() {if ((hasUpgrade ('k', 52) && hasUpgrade ('f', 45)) || hasAchievement('fo', 14) || hasAchievement('s', 14)) return true},
            effect() {
                let eff = player.f.points.add(1).log(2).add(1)
                return eff
            },
            effectDisplay() {return "/"+format(upgradeEffect(this.layer, this.id))}
        },
        52: {
            title: "Raised Bars",
            description: "Raise the power of 'Growth' softcap by 0.1",
            cost: new Decimal(1e65),
            unlocked() {return hasUpgrade('f', 51)},
        },
        53: {
            title: "Out of Thick Air",
            description: "Above upgrade is based on total interactions.",
            cost: new Decimal(1e69),
            unlocked() {return hasUpgrade('f', 52)},
        },
        54: {
            title: "Better Viewers",
            description: "Add extra Loyal Viewers based on Royal Viewers and effect is better.",
            cost: new Decimal(1e72),
            unlocked() {return hasUpgrade('f', 53)},
            effect() {return getBuyableAmount('v', 12).pow(2)},
            effectDisplay() {return "+"+format(upgradeEffect(this.layer, this.id))}
        },
        55: {
            title: "Fame^6",
            description: "Increase Fame^5 effect by fame.",
            cost: new Decimal(1e73),
            unlocked() {return hasUpgrade ('f', 54)},
            effect() {return player.f.points.add(1).log(10).pow(0.2).add(1)},
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x"}
        },
    },
})

addLayer("v", {
    name: "viewers", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "V", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
        }
    },
    color: "#5440C4",
    requires: new Decimal(25), // Can be a function that takes requirement increases into account
    resource: "viewers", // Name of prestige currency
    baseResource: "popularity", // Name of resource prestige is based on
    baseAmount() { return player.points }, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    branches: ["f"],
    exponent: 1.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('f', 33)) mult = mult.div(250)
        if (hasUpgrade('i', 31)) mult = mult.div(upgradeEffect('i', 31))
        if (hasUpgrade('k', 34)) mult = mult.div(upgradeEffect('k', 34))
        if (hasAchievement('a', 51) && player.v.points.lte(15)) mult = mult.div(1.5)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "v", description: "V: Reset for viewers.", onPress() { if (canReset(this.layer)) doReset(this.layer) }, unlocked() {return hasAchievement('a', 15)} },
    ],
    layerShown() { return hasAchievement('a', 15) },
    effect() {
        let eff = player.v.points.add(1).max(1)
        eff = eff.times(tmp.v.effectBase)
        if (hasUpgrade('v', 22)) eff = eff.add(50)
        if (hasUpgrade('f', 43)) eff = eff.add(upgradeEffect('f', 43))
        eff = eff.times(tmp.v.buyables[11].effect)
        eff = softcap(eff, new Decimal(1e6), new Decimal(0.5))
        eff = softcap(eff, new Decimal(1e7), new Decimal(0.25))
        if (player.fo.unlocked) eff = eff.times(tmp.fo.effect)
        eff = softcap(eff, new Decimal(1e8), new Decimal(0.125))
        eff = softcap(eff, new Decimal(1e9), new Decimal(0.0625))
        eff = eff.add(1)
        return eff
    },
    effectDescription() {
        dis = "which boost popularity gain by <font color=5440C4><h2>" + format(tmp.v.effect) + "x</h2></font color=5440C4>"
        return dis
    },
    effectBase() {
        let base = new Decimal(1)
        if (hasUpgrade('v', 32)) base = base.add(upgradeEffect('v', 32))
        if (hasUpgrade('f', 32)) base = base.add(upgradeEffect('f', 32))
        if (hasUpgrade('i', 22)) base = base.add(upgradeEffect('i', 22))
        if (hasUpgrade('k', 14)) base = base.pow(upgradeEffect('k', 14))
        return base
    },
    canBuyMax() { return hasMilestone('v', 3) },
    doReset(resettingLayer) {
        let keep = [];
        if (hasAchievement('fo', 12) && resettingLayer == "fo") keep.push("milestones")
        if (hasAchievement('fo', 15) && resettingLayer == "fo") keep.push("buyables")
        if (hasAchievement('fo', 24) && resettingLayer == "fo") keep.push("upgrades")
        if (hasAchievement('s', 12) && resettingLayer == "s") keep.push("milestones")
        if (hasAchievement('s', 15) && resettingLayer == "s") keep.push("buyables")
        if (hasAchievement('s', 24) && resettingLayer == "s") keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    resetsNothing() {
        if (hasMilestone('v', 4)) return true
    },

    tabFormat: {
        "Main": {
            content: [
                "main-display",
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.v.best) + ' best viewers.' },
                    {}],
                "blank",
                ["display-text",
                    function () { if (!hasAchievement('a', 22)) return 'To progress better, go into the "Buyables" tab and purchase a loyal viewer.' },
                    {}],
                    "blank",
                "prestige-button",
                "blank",
                "upgrades",
            ]
        },
        "Milestones": {
            content: [
                "main-display",
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.v.best) + ' best viewers.' },
                    {}],
                "blank",
                "prestige-button",
                "blank",
                "milestones",
            ]
        },
        "Buyables": {
            content: [
                "main-display",
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.v.best) + ' best viewers.' },
                    {}],
                "blank",
                "prestige-button",
                "blank",
                "buyables",
            ]
        }
    },

    upgrades: {
        11: {
            title: "Famous Viewing",
            description: "Gain more fame based on your viewers.",
            cost: new Decimal(2),
            effect() {
                return player.v.points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        12: {
            title: "Expo-Exponential",
            description: "Add 2 to 'Exponential' effect base.",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade('v', 11) }
        },
        13: {
            title: "Column 2 Boost",
            description: "Boost the 2 upgrades in the second column of fame upgrades.",
            cost: new Decimal(5),
            unlocked() { return hasUpgrade('v', 12) },
            effect() {
                let eff = player.f.points.pow(0.5)
                if (hasUpgrade('i', 11)) eff = eff.add(1e7)
                eff = softcap(eff, new Decimal(1e7), new Decimal(0))
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        21: {
            title: "Popular Viewing",
            description: "Gain more popularity based on your viewers.",
            cost: new Decimal(6),
            unlocked() { return hasUpgrade('v', 13) },
            effect() {
                return player.v.points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        22: {
            title: "Membership",
            description: "Gain 50 more base viewers.",
            cost: new Decimal(7),
            unlocked() { return hasUpgrade('v', 21) }
        },
        23: {
            title: "^Popular Viewing",
            description: "Raise popularity based on viewers.",
            cost: new Decimal(9),
            unlocked() { return hasUpgrade('v', 22) },
            effect() {
                return player.v.points.add(1).pow(0.1)
            },
            effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id)) },
        },
        31: {
            title: "Public Recognition",
            description: "Raise 'Recognition' based on viewers.",
            cost: new Decimal(10),
            unlocked() { return hasUpgrade('v', 23) },
            effect() {
                return player.v.points.add(1).pow(0.15)
            },
            effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id)) },
        },
        32: {
            title: "Base-Boost",
            description: "Add to viewers base based on fame.",
            cost: new Decimal(11),
            unlocked() { return hasUpgrade('v', 31) },
            effect() {
                return player.f.points.add(1).pow(0.15)
            },
            effectDisplay() { return "+" + format(upgradeEffect(this.layer, this.id)) },
        },
        33: {
            title: "Fame Revisit",
            description: "Unlock 5 new fame upgrades.",
            cost: new Decimal(12),
            unlocked() {
                return hasUpgrade('v', 32)
            }
        },
    },

    milestones: {
        0: {
            requirementDescription: "5 Viewers",
            done() {
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
        4: {
            requirementDescription: "44 Viewers",
            done() {
                return player.v.best.gte(44)
            },
            effectDescription: "Viewers no longer reset fame.",
            unlocked() {return hasMilestone('fo', 0)}
        },
    },

    buyables: {
        11: {
            cost() {
                let cost = getBuyableAmount(this.layer, this.id).times(1).pow_base(2)
                if (hasUpgrade('k', 11)) cost = cost.div(8)
                return cost;
            },
            title: "Loyal Viewers",
            effect() {
                let eff = getBuyableAmount(this.layer, this.id)
                if (hasUpgrade('f', 54)) eff = eff.add(upgradeEffect('f', 54))
                eff = eff.times(1.5)
                if (hasUpgrade('f', 54)) eff = getBuyableAmount(this.layer, this.id).add(upgradeEffect('f', 54)).pow(2)
                return eff
            },
            display() {
                let dis = "Multiply viewers effect by x1.50 per buyable.<br>Amount: "+format(getBuyableAmount(this.layer, this.id))+ "<br> Cost: " + format(tmp.v.buyables[11].cost) + " viewers<br>Effect: " + format(tmp.v.buyables[11].effect) + "x"
                if (hasUpgrade('f', 54)) dis = "Multiply viewers effect by ^2.00 per buyable.<br>Amount: " + format(getBuyableAmount(this.layer, this.id)) + " + " + format(upgradeEffect('f', 54)) + "<br> Cost: " + format(tmp.v.buyables[11].cost) + " viewers<br>Effect: " + format(tmp.v.buyables[11].effect) + "x"
                return dis
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },
        },
        12: {
            cost(x) {
                let cost = getBuyableAmount(this.layer, this.id).add(1).times(x.times(1.35)).add(20).floor()
                return cost
            },
            title: "Royal Viewers",
            effect() {
                return player.v.points.pow(0.5).pow(getBuyableAmount(this.layer, this.id).pow(1.05)).add(1)
            },
            display() {
                return "Popularity is multiplied by viewers and raised by amount of buyable.<br>Amount: " + format(getBuyableAmount(this.layer, this.id)) +
                    "<br> Cost: " + format(tmp.v.buyables[12].cost) + " viewers<br>Effect: " + format(tmp.v.buyables[12].effect) + "x"
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },
            unlocked() {
                return hasUpgrade('k', 51) || hasAchievement('fo', 15) || hasAchievement('s', 15)
            }
        },
    },
})

addLayer("i", {
    name: "interactions", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
        }
    },
    color: "#CF4FE1",
    requires() {
        let req = new Decimal(1e15)
        if (hasMilestone('i', 1) && !hasAchievement('a', 44)) req = 1e12
        if (hasAchievement ('a', 44) && hasUpgrade('k', 44) && player.i.points.lte(3600))  req = 1e3
        return req
        }, // Can be a function that takes requirement increases into account
    resource: "interactions", // Name of prestige currency
    baseResource: "fame", // Name of resource prestige is based on
    baseAmount() { return player.f.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    branches: ["f"],
    exponent: 0.005, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.times(tmp.i.buyables[11].effect)
        if (hasAchievement('fo', 11) && player.fo.unlockOrder<=0) mult = mult.times(2)
        if (hasAchievement('s', 11) && player.s.unlockOrder<=0) mult = mult.times(2)
        if (hasAchievement('a', 55) && player.i.points.lte(12000)) mult = mult.times(3)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "i", description: "I: Reset for interactions.", onPress() { if (canReset(this.layer)) doReset(this.layer) }, unlocked() {return hasAchievement('a', 25)} },
    ],
    layerShown() { return hasAchievement('a', 25) },
    effect() {
        let eff = new Decimal(1)
        eff = eff.times(tmp.i.effectBase)
        if (hasUpgrade('i', 12) && !hasAchievement('fo', 11)) eff = eff.add(upgradeEffect('i', 12))
        if (hasUpgrade('i', 12) && hasAchievement('fo', 11)) eff = eff.times(upgradeEffect('i', 12)).add(1)
        eff = softcap(eff, new Decimal(400), new Decimal(0.1))
        return eff
    },
    effectDescription() {
        dis = "which boosts 'Growth' multiplier after first softcap by <font color=CF4FE1><h2>" +format(tmp.i.effect) + "x</h2></font color=CF4FE1>"
        return dis
    },
    effectBase() {
        let base = new Decimal(1)
        if (hasUpgrade('k', 31)) base = base.add(0.5)
        return base
    },
    passiveGeneration() {
        return (hasMilestone('i', 3)) ? ((getBuyableAmount('i', 21)).add(getBuyableAmount('i', 22)).add(getBuyableAmount('i', 23)).add(getBuyableAmount('i', 24)).add(getBuyableAmount('i', 25)).div(100)): (hasMilestone('i', 2) && !(hasMilestone('i', 3))) ? 0.01:0
    },
    doReset(resettingLayer) {
        let keep = [];
        if (hasAchievement('fo', 12) && resettingLayer == "fo") keep.push("milestones")
        if (hasAchievement('fo', 13) && resettingLayer == "fo") keep.push("buyables")
        if (hasAchievement('fo', 22) && resettingLayer == "fo") keep.push("upgrades")
        if (hasAchievement('s', 12) && resettingLayer == "s") keep.push("milestones")
        if (hasAchievement('s', 13) && resettingLayer == "s") keep.push("buyables")
        if (hasAchievement('s', 22) && resettingLayer == "s") keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    canReset() {if (player.i.points.gte(12000)) return false
    else return true},

    tabFormat: {
        "Main": {
            content: [
                "main-display",
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.i.best) + ' best interactions.' },
                    {}],
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.i.total) + ' total interactions.' },
                    {}],
                "blank",
                "prestige-button",
                "blank",
                ["display-text",
                    function () { if (hasAchievement('a', 44) && !hasMilestone('k', 4)) return '<small>This part of the game requires holding down the I key on your keyboard to gain interactions quicker. This part is very moblie unfriendly.</small>'},
                    {}],
                ["display-text",
                    function () { if (player.i.points.gte(7500) && player.fo.best.gte(250)) return '<small>You can no longer reset to gain interactions after 12000 interactions.</small>'},
                    {}],
                "blank",
                "upgrades",
            ]
        },
        "Milestones": {
            content: [
                "main-display",
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.i.best) + ' best interactions.' },
                    {}],
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.i.total) + ' total interactions.' },
                    {}],
                "blank",
                "prestige-button",
                "blank",
                ["display-text",
                    function () { if (player.i.points.gte(7500) && player.fo.best.gte(250)) return '<small>You can no longer reset to gain interactions after 12000 interactions.</small>'},
                {   }],
                "blank",
                "milestones",
            ]
        },
        "Advertisements": {
            content: [
                "main-display",
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.i.best) + ' best interactions.' },
                    {}],
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.i.total) + ' total interactions.' },
                    {}],
                "blank",
                "prestige-button",
                "blank",
                ["display-text",
                    function () { if (player.i.points.gte(7500) && player.fo.best.gte(250)) return '<small>You can no longer reset to gain interactions after 12000 interactions.</small>'},
                    {}],
                "blank",
                ["bar", "bigBar"],
                "blank",
                ["bar", 'biggerBar'],
                "blank",
                ["bar", 'biggestBar'],
                "blank",
                ["buyables", [1]],
            ]
        },
        "The Internet": {
            content: [
                "main-display",
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.i.best) + ' best interactions.' },
                    {}],
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.i.total) + ' total interactions.' },
                    {}],
                "blank",
                "prestige-button",
                "blank",
                ["display-text",
                    function () { return '<small>People have grown strong opinions about you! You can use this to your advantage to generate more interactions per second.</small>' },
                    {}],
                "blank",
                ["bar", "cancellationbarscaredemojicluelessemojiquippyscreamemoji"],
                "blank",
                ["buyables", [2]]
            ],
            unlocked() {if (hasMilestone('fo', 1) && hasMilestone('i', 3)) return true
        else return false},
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
                if (hasAchievement('a', 35)) eff = player.i.total.times(0.02)
                if (hasUpgrade('f', 41)) eff = eff.pow(upgradeEffect('f', 41))
                eff = softcap(eff, new Decimal(100), new Decimal(0.75))
                return eff
            },
            effectDisplay() {
                 let dis = "+" + format(upgradeEffect(this.layer, this.id))
                 return dis
            },
            unlocked() { return hasUpgrade('i', 11) }
        },
        13: {
            title: "Fame-ous Interactions",
            description: "Add to fame on interactions.",
            cost: new Decimal(4),
            effect() {
                let eff = player.i.points.add(1).pow(0.75)
                if (hasUpgrade('i', 32)) eff = player.i.best.add(1).pow(0.75)
                eff = softcap(eff, new Decimal(100), new Decimal(0))
                return eff
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id)) + "x" },
            unlocked() {return hasUpgrade('i', 12) }
        },
        21: {
            title: "Interconnected",
            description: "'Interconnection' is based on best interactions.",
            cost: new Decimal(10),
            unlocked() {return hasUpgrade('i', 13) && hasAchievement('a', 32) }
        },
        22: {
            title: "Inter-Base",
            description: "Viewers base is boosted by interactions.",
            cost: new Decimal(20),
            unlocked() { return hasUpgrade('i', 21) },
            effect() {
                let eff = player.i.points.add(1).pow(1.5)
                if (hasUpgrade('i', 32)) eff = player.i.best.add(1).pow(1.5)
                return eff
            },
            effectDisplay() {return "+" + format(upgradeEffect(this.layer, this.id)) },
        },
        23: {
            title: "Inter-Raise",
            description: "Interactions raise popularity gain.",
            cost: new Decimal(100),
            unlocked() { return hasUpgrade('i', 22) },
            effect() {
                let eff = player.i.points.add(1).pow(0.01)
                if (hasUpgrade('i', 32)) eff = player.i.best.add(1).pow(0.01)
                return eff
            },
            effectDisplay() {return "^" + format(upgradeEffect(this.layer, this.id)) },
        },
        31: {
            title: "Cheap Viewing",
            description: "Viewers are cheaper based on interactions.",
            cost: new Decimal(200),
            unlocked() {return hasUpgrade('i', 23) },
            effect() {
                let eff = player.i.points.add(1).pow(5)
                if (hasUpgrade('i', 32)) eff = player.i.best.add(1).pow(5)
                eff = softcap(eff, new Decimal(1e13), new Decimal(0.05))
                return eff
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id)) + "x" },
        },
        32: {
            title: "Best of the Best",
            description: "All previous upgrades are based on best amounts.",
            cost: new Decimal(350),
            unlocked() {return hasUpgrade('i', 31)},
        },
        33: {
            title: "Fame Revisit II",
            description: "Unlock 5 new fame upgrades.",
            cost: new Decimal(500),
            unlocked() {return hasUpgrade('i', 32)},
        }
    },

    milestones: {
        0: {
            requirementDescription: "3 Total Interactions",
            effectDescription: "Keep fame upgrades on reset.",
            done() { return player.i.total.gte(3) }
        },
        1: {
            requirementDescription: "100 Total Interactions",
            effectDescription: "Interactions fame requirement becomes 1e12.",
            done() {return player.i.total.gte(100)}
        },
        2: {
            requirementDescription: "300 Total Interactions",
            effectDescription: "Gain 1% of interactions gain per second.",
            done() { return player.i.total.gte(300) }
        },
        3: {
            requirementDescription: "12,000 Interactions",
            effectDescription: "Unlock 'The Internet'.",
            done() {return player.i.points.gte(12000)},
            unlocked() {return hasMilestone('fo', 1)}
        }
    },

    bars: {
        bigBar: {
            direction: RIGHT,
            width: 650,
            height: 40,
            fillStyle: { 'background-color': "#cf4fe1" },
            borderStyle() { return { "border-color": "#cf4fe1" } },
            progress() {
                let prog = player.i.points.div(10)
                if (player.i.best.gte(10)) prog = 1
                return prog
            },
            display() {
                if (player.i.best.lte(9))
                    return "Unlock an advertisement: " + format(player.i.points) + "/10 interactions."
                else
                    return "You have unlocked Train Advertisements."
            }
        },
        biggerBar: {
            direction: RIGHT,
            width: 650,
            height: 40,
            fillStyle: { 'background-color': "#cf4fe1" },
            borderStyle() { return { "border-color": "#cf4fe1" } },
            progress() {
                let prog = player.i.points.div(200)
                if (player.i.best.gte(200)) prog = 1
                return prog
            },
            display() {
                if (player.i.best.lte(199))
                    return "Unlock an advertisement: " + format(player.i.points) + "/200 interactions."
                else
                    return "You have unlocked Billboards."
            },
            unlocked() { return player.i.best.gte(10) }
        },
        biggestBar: {
            direction: RIGHT,
            width: 650,
            height: 40,
            fillStyle: { 'background-color': "#cf4fe1" },
            borderStyle() { return { "border-color": "#cf4fe1" } },
            progress() {
                let prog = player.i.points.div(750)
                if (player.i.best.gte(750)) prog = 1
                return prog
            },
            display() {
                if (player.i.best.lte(749))
                    return "Unlock an advertisement: " + format(player.i.points) + "/750 interactions."
                else
                    return "You have unlocked TV Broadcasts."
            },
            unlocked() { return hasUpgrade('f', 42)}
        },
        cancellationbarscaredemojicluelessemojiquippyscreamemoji: {
            direction: RIGHT,
            width: 650,
            height: 40,
            fillStyle: { 'background-color': "#cf4fe1" },
            borderStyle() { return { "border-color": "#cf4fe1" } },
            progress() {
                let prog = getBuyableAmount('i', 21).add(getBuyableAmount('i', 22)).add(getBuyableAmount('i', 23)).add(getBuyableAmount('i', 24)).add(getBuyableAmount('i', 25)).div(100)
                return prog
            },
            display() {
                if (getBuyableAmount('i', 21).add(getBuyableAmount('i', 22)).add(getBuyableAmount('i', 23)).add(getBuyableAmount('i', 24)).add(getBuyableAmount('i', 25)).lte(99))
                    return "Your cancellation fuels you to: " + format(getBuyableAmount('i', 21).add(getBuyableAmount('i', 22)).add(getBuyableAmount('i', 23)).add(getBuyableAmount('i', 24)).add(getBuyableAmount('i', 25))) + "% interactions per second."
                else
                    return "They should've listened."
            },
            unlocked() { return hasMilestone('i', 3)}
        }
    },

    buyables: {
        11: {
            title: "Train Advertisements",
            unlocked() { return player.i.best.gte(10) },
            base() {
                let base = new Decimal(1).pow_base(2)
                if (getBuyableAmount('i', 13).gte(1)) base = base.times(tmp.i.buyables[13].effect)
                return base
            },
            effect() { 
                let eff = new Decimal(1).pow_base(2)
                if (getBuyableAmount('i', 13).gte(1)) eff = eff.times(tmp.i.buyables[13].effect)
                eff = eff.pow(getBuyableAmount(this.layer, this.id))
                return eff
             },
            cost() {
                let cost = getBuyableAmount(this.layer, this.id).add(1).pow(2).times(10)
                if (getBuyableAmount(this.layer, this.id).gte(2)) cost = cost.pow(2)
                if (getBuyableAmount(this.layer, this.id).equals(2)) cost = cost.div(1.2)
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
                return "Multiply interactions gain by " +format(tmp.i.buyables[11].base) + "x per buyable amount.<br>Amount: " + formatWhole(getBuyableAmount(this.layer, this.id)) +
                    "/4<br>Cost: " + format(tmp.i.buyables[11].cost) + " interactions.<br>Effect: " + format(tmp.i.buyables[11].effect) + "x"
            },
            purchaseLimit: new Decimal(4)
        },
        12: {
            title: "Billboards",
            unlocked() { return player.i.best.gte(200) },
            effect() { return getBuyableAmount(this.layer, this.id).times(1).pow_base(1.5); },
            cost() {
                let cost = getBuyableAmount(this.layer, this.id).add(1).pow(1.75).times(200)
                if (getBuyableAmount(this.layer, this.id).gte(2)) cost = cost.pow(1.5)
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
                return "Divide cost of Train Advertisements based on buyable amounts.<br>Amount: " + formatWhole(getBuyableAmount(this.layer, this.id)) +
                    "/2<br>Cost: " + format(tmp.i.buyables[12].cost) + " interactions.<br>Effect: " + format(tmp.i.buyables[12].effect) + "x"
            },
            purchaseLimit: new Decimal(2)
        },
        13: {
            title: "TV Broadcasts",
            unlocked() { return player.i.best.gte(750) && hasUpgrade('f', 42) },
            effect() { return getBuyableAmount(this.layer, this.id).times(1).pow_base(1.1); },
            cost() {
                let cost = getBuyableAmount(this.layer, this.id).add(1).pow(2).times(750)
                if (getBuyableAmount(this.layer, this.id).gte(2)) cost = cost.pow(1.5)
                if (getBuyableAmount(this.layer, this.id).equals(1)) cost = cost.div(1.2)
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
                return "Increase effect of Train Advertisements based on buyable amounts.<br>Amount: " + formatWhole(getBuyableAmount(this.layer, this.id)) +
                    "/2<br>Cost: " + format(tmp.i.buyables[13].cost) + " interactions.<br>Effect: " + format(tmp.i.buyables[13].effect) + "x"
            },
            purchaseLimit: new Decimal(2)
        },
        21: {
            title: "Fuel your cancellation!",
            effect() {return getBuyableAmount(this.layer, this.id)},
            cost() {let cost = new Decimal(1)
                    cost = cost.times(10).pow(getBuyableAmount(this.layer, this.id))
                    cost = cost.times(1e100)
                    return cost},
            buy() {
                player.f.points = player.f.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            canAfford() {
                return player.f.points.gte(this.cost())
            },
            display() {
                return "Amount: " + formatWhole(getBuyableAmount(this.layer, this.id)) +
                    "/20<br>Cost: " + format(tmp.i.buyables[21].cost) + " <font color=F5E907><h2>fame</h2></font color=F5E907>."
            },
            purchaseLimit: new Decimal(20),
            style: {
                "height": "130px",
                "width": "130px",
            }
    },
        22: {
            title: "Fuel your cancellation!",
            effect() {return getBuyableAmount(this.layer, this.id)},
            cost() {let cost = new Decimal(44)
                cost = cost.add(getBuyableAmount(this.layer, this.id))
                return cost},
            buy() {
            player.v.points = player.v.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            canAfford() {
            return player.v.points.gte(this.cost())
            },
            display() {
            return "Amount: " + formatWhole(getBuyableAmount(this.layer, this.id)) +
                "/20<br>Cost: " + format(tmp.i.buyables[22].cost) + " <font color=5440C4><h2>viewers</h2</font color=5440C4>."
            },
            purchaseLimit: new Decimal(20),
            style: {
                "height": "130px",
                "width": "130px",
            }
    },      
        23: {
            title: "Fuel your cancellation!",
            effect() {return getBuyableAmount(this.layer, this.id)},
            cost() {let cost = new Decimal(2)
                cost = cost.pow_base((getBuyableAmount(this.layer, this.id)).add(1))
                cost = cost.times(1e6)
                return cost},
            buy() {
            player.k.points = player.k.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            canAfford() {
            return player.k.points.gte(this.cost())
            },
            display() {
            return "Amount: " + formatWhole(getBuyableAmount(this.layer, this.id)) +
                "/20<br>Cost: " + format(tmp.i.buyables[23].cost) + " <font color=6E7570><h2>karma</h2></font color=6E7570>."
            },
            purchaseLimit: new Decimal(20),
            style: {
                "height": "130px",
                "width": "130px",
            }
    },
        24: {
            title: "Fuel your cancellation!",
            effect() {return getBuyableAmount(this.layer, this.id)},
            cost() {let cost = new Decimal(50).times((getBuyableAmount(this.layer, this.id).add(1)))
                cost = cost.add(200)
                return cost},
            buy() {
            player.fo.points = player.fo.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            canAfford() {
            return player.fo.points.gte(this.cost())
            },
            display() {
            return "Amount: " + formatWhole(getBuyableAmount(this.layer, this.id)) +
                "/20<br>Cost: " + format(tmp.i.buyables[24].cost) + " <font color=162C7D><h2>followers</h2></font color=162C7D>."
            },
            purchaseLimit: new Decimal(20),
            style: {
                "height": "130px",
                "width": "130px",
            }
    },
    25: {
        title: "Fuel your cancellation!",
        effect() {return getBuyableAmount(this.layer, this.id)},
        cost() {let cost = new Decimal(50).times((getBuyableAmount(this.layer, this.id).add(1)))
            cost = cost.add(200)
            return cost},
        buy() {
        player.s.points = player.s.points.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        canAfford() {
        return player.s.points.gte(this.cost())
        },
        display() {
        return "Amount: " + formatWhole(getBuyableAmount(this.layer, this.id)) +
            "/20<br>Cost: " + format(tmp.i.buyables[25].cost) + " <font color=#dd2424><h2>subscribers</h2></font color=#dd2424>."
        },
        purchaseLimit: new Decimal(20),
        style: {
            "height": "130px",
            "width": "130px",
        }
},
}})

addLayer("k", {
    name: "karma", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "K", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
        }
    },
    color: "#6e7570",
    requires: new Decimal(1e30), // Can be a function that takes requirement increases into account
    resource: "neutral karma", // Name of prestige currency
    baseResource: "popularity", // Name of resource prestige is based on
    baseAmount() { return player.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('k', 12)) mult = mult.times(upgradeEffect('k', 12))
        if (hasUpgrade('k', 21) && player.i.points.gte(1000)) mult = mult.times(2)
        if (hasUpgrade('k', 23) && player.v.points.gte(32)) mult = mult.times(2)
        if (hasUpgrade('k', 41) && player.points.gte(1e35)) mult = mult.times(2)
        if (hasUpgrade('k', 43) && player.f.points.gte(1e45)) mult = mult.times(2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "k", description: "K: Reset for neutral karma.", onPress() { if (canReset(this.layer)) doReset(this.layer) }, unlocked() {return hasAchievement('a', 35)} },
    ],
    layerShown() {return hasAchievement('a', 35)},
    branches: ["f"],
    effectDescription() {return "which can be assigned to different karma types."},
    automate() {if (hasMilestone('k', 2)) buyBuyable('k', 11), buyBuyable('k', 12), buyBuyable('k', 21), buyBuyable('k', 22)},
    passiveGeneration() {return (hasMilestone('s', 0)) && (player.k.points.lte(tmp.k.kCap)) ? 1: (hasAchievement('fo', 24) || hasAchievement('s', 24)) && player.k.points.lte(45000) && hasMilestone('k', 3) ? 0.25: hasMilestone('k', 3) && player.k.points.lte(9975) ? 0.25: hasMilestone('k', 3) && player.k.points.lte(10000) ? 0.01:0},
    doReset(resettingLayer) {
        let keep = [];
        if (hasAchievement('fo', 12) && resettingLayer == "fo") keep.push("milestones")
        if (hasAchievement('fo', 24) && resettingLayer == "fo") keep.push("upgrades")
        if (hasAchievement('s', 12) && resettingLayer == "s") keep.push("milestones")
        if (hasAchievement('s', 24) && resettingLayer == "s") keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    kCap() {
        let kcap = new Decimal(45000)
        if (hasMilestone('s', 1)) kcap = kcap.add(((player.s.points.add(1)).times(1000)).pow(0.75))
        return kcap
    },

    tabFormat: {
        "Main": {
            content: [
                "main-display",
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.k.best) + ' best neutral karma.' },
                    {}],
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.k.total) + ' total neutral karma.' },
                    {}],
                "blank",
                "prestige-button",
                "blank",
                "buyables",
                "blank",
                ["upgrades", [5]]
            ]
        },
        "Milestones": {
            content: [
                "main-display",
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.k.best) + ' best neutral karma.' },
                    {}],
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.k.total) + ' total neutral karma.' },
                    {}],
                "blank",
                "prestige-button",
                "blank",
                "milestones",
            ]
        },
        "Karma Upgrades": {
            content: [
                "main-display",
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.k.best) + ' best neutral karma.' },
                    {}],
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.k.total) + ' total neutral karma.' },
                    {}],
                "blank",
                "prestige-button",
                "blank",
                ["upgrades", [1, 2, 3, 4]],
                "blank",
                "blank"
            ]
        }
    },

    buyables: {
        11: {
            title: "Positive Karma",
            cost() {
                let cost = getBuyableAmount(this.layer, this.id).times(1).pow_base(1.2).floor()
                if (hasUpgrade('f', 51)) cost = cost.div(upgradeEffect('f', 51))
                return cost
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
            if (hasMilestone('k', 1))
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1).sub(1))
            else 
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            display() {
                return "Cost: "+format(tmp.k.buyables[11].cost)+"<br>Amount: "+format(getBuyableAmount(this.layer, this.id))
            },
        },
        12: {
            title: "Composed Karma",
            cost() {
                let cost = getBuyableAmount(this.layer, this.id).times(1).pow_base(1.2).floor()
                if (hasUpgrade('f', 51)) cost = cost.div(upgradeEffect('f', 51))
                return cost
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (hasMilestone('k', 1))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1).sub(1))
                else 
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            display() {
                return "Cost: "+format(tmp.k.buyables[12].cost)+"<br>Amount: "+format(getBuyableAmount(this.layer, this.id))
            }
        },
        21: {
            title: "Amusing Karma",
            cost() {
                let cost = getBuyableAmount(this.layer, this.id).times(1).pow_base(1.2).floor()
                if (hasUpgrade('f', 51)) cost = cost.div(upgradeEffect('f', 51))
                return cost
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (hasMilestone('k', 1))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1).sub(1))
                else 
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            display() {
                return "Cost: "+format(tmp.k.buyables[21].cost)+"<br>Amount: "+format(getBuyableAmount(this.layer, this.id))
            },
            style: {"top": "10px"}
        },
        22: {
            title: "Charismatic Karma",
            cost() {
                let cost = getBuyableAmount(this.layer, this.id).times(1).pow_base(1.2).floor()
                if (hasUpgrade('f', 51)) cost = cost.div(upgradeEffect('f', 51))
                return cost
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (hasMilestone('k', 1))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1).sub(1))
                else 
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            display() {
                return "Cost: "+format(tmp.k.buyables[22].cost)+"<br>Amount: "+format(getBuyableAmount(this.layer, this.id))
            },
            style: {"top": "10px"}
        },
    },

    upgrades: {
        11: {
            title: "Positive Loyalty",
            description: "Loyal Viewers are 8x cheaper.",
            cost: new Decimal(1),
            currencyDisplayName: "positive karma",
            currencyLocation() {return player[this.layer].buyables},
            currencyInternalName: "11",
            style: {
                "right" : "20px"
            }
        },
        12: {
            title: "Positive Gain",
            description: "Gain more neutral karma based on positive karma.",
            cost: new Decimal(10),
            currencyDisplayName: "positive karma",
            currencyLocation() {return player[this.layer].buyables},
            currencyInternalName: "11",
            style: {
                "right" : "20px"
            },
            unlocked() {return hasUpgrade('k', 11)},
            effect() {
                let eff = getBuyableAmount('k', 11)
                eff = eff.add(1).log(10).add(1)
                return eff
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x"}
        },
        13: {
            title: "Composed Popularity",
            description: "Popularity gain is raised to the ^1.1th power.",
            cost: new Decimal(1),
            currencyDisplayName: "composed karma",
            currencyLocation() {return player[this.layer].buyables},
            currencyInternalName: "12",
            style: {
                "left" : "20px"
            }
        },
        14: {
            title: "Composed Base",
            description: "Viewer base is raised by composed karma.",
            cost: new Decimal(10),
            currencyDisplayName: "composed karma",
            currencyLocation() {return player[this.layer].buyables},
            currencyInternalName: "12",
            style: {
                "left" : "20px"
            },
            unlocked() {return hasUpgrade('k', 13)},
            effect() {
                let eff = getBuyableAmount('k', 12)
                eff = eff.add(1).log(10).add(1)
                eff = softcap(eff, new Decimal(3.5), new Decimal(0.25))
                return eff
            },
            effectDisplay() {return "^"+format(upgradeEffect(this.layer, this.id))}
        },
        21: {
            title: "Positive Benchmark",
            description: "Double neutral karma gain when interactions are greater than 1,000.",
            cost: new Decimal(30),
            currencyDisplayName: "positive karma",
            currencyLocation() {return player[this.layer].buyables},
            currencyInternalName: "11",
            style: {
                "right" : "20px",
                "height" : "120px"
            },
            unlocked() {return hasUpgrade('k', 12)},
        },
        22: {
            title: "Positive Advertisements",
            description: "Total advertisements multiply popularity gain.",
            cost: new Decimal(50),
            currencyDisplayName: "positive karma",
            currencyLocation() {return player[this.layer].buyables},
            currencyInternalName: "11",
            style: {
                "right" : "20px",
                "height" : "120px"
            },
            unlocked() {return hasUpgrade('k', 21)},
            effect() {
                let eff = getBuyableAmount('i', 11)
                eff = eff.add(getBuyableAmount('i', 12))
                eff = eff.add(getBuyableAmount('i', 13))
                eff = eff.add(1).pow(1.2)
                return eff
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x"}
            },
        23: {
            title: "Composed Benchmark",
            description: "Double neutral karma gain when viewers are greater than 32.",
            cost: new Decimal(30),
            currencyDisplayName: "composed karma",
            currencyLocation() {return player[this.layer].buyables},
            currencyInternalName: "12",
            unlocked() {return hasUpgrade('k', 14)},
            style: {
                "left" : "20px",
                "height" : "120px"
            },
        },
        24: {
            title: "Composed Synergy",
            description: "'Recognition' multiplies popularity at log10 rate.",
            cost: new Decimal(50),
            currencyDisplayName: "composed karma",
            currencyLocation() {return player[this.layer].buyables},
            currencyInternalName: "12",
            unlocked() {return hasUpgrade('k', 23)},
            style: {
                "left" : "20px",
                "height" : "120px"
            },
            effect() {
                let eff = tmp.f.upgrades[13].effect
                eff = eff.add(0.1).log(10).add(0.1)
                return eff
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x"}
        },
        31: {
            title: "Amusing Interactions",
            description: "Add 0.5 to interactions effect base.",
            cost: new Decimal(1),
            currencyDisplayName: "amusing karma",
            currencyLocation() {return player[this.layer].buyables},
            currencyInternalName: "21",
            style: {
                "right" : "20px",
                "top" : "40px",
            }
        },
        32: {
            title: "Amusing Growth",
            description: "'Growth' effect is multiplied by amusing karma.",
            cost: new Decimal(10),
            currencyDisplayName: "amusing karma",
            currencyLocation() {return player[this.layer].buyables},
            currencyInternalName: "21",
            style: {
                "right" : "20px",
                "top" : "40px",
            },
            unlocked() {return hasUpgrade('k', 31)},
            effect() {
                let eff = getBuyableAmount('k', 21)
                eff = eff.add(1).log(10).add(1)
                return eff
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x"}
        },
        33: {
            title: "Charismatic Fame",
            description: "Fame gain is raised to the ^1.1th power.",
            cost: new Decimal(1),
            currencyDisplayName: "charismatic karma",
            currencyLocation() {return player[this.layer].buyables},
            currencyInternalName: "22",
            style: {
                "left" : "20px",
                "top" : "40px"
            }
        },
        34: {
            title: "Charismatic Superstar",
            description: "Viewer cost is divided based on charismatic karma.",
            cost: new Decimal(10),
            currencyDisplayName: "charismatic karma",
            currencyLocation() {return player[this.layer].buyables},
            currencyInternalName: "22",
            style: {
                "left" : "20px",
                "top" : "40px",
                "height" : "120px",
                
            },
            unlocked() {return hasUpgrade('k', 33)},
            effect() {
                let eff = getBuyableAmount('k', 22)
                eff = eff.add(1).log(10).add(1)
                return eff
            },
            effectDisplay() {return "/"+format(upgradeEffect(this.layer, this.id))}
        },
        41: {
            title: "Amusing Benchmark",
            description: "Double neutral karma gain when popularity is greater than 1e35.",
            cost: new Decimal(30),
            currencyDisplayName: "amusing karma",
            currencyLocation() {return player[this.layer].buyables},
            currencyInternalName: "21",
            unlocked() {return hasUpgrade('k', 32)},
            style: {
                "right" : "20px",
                "top" : "40px",
                "height" : "120px",
            }
        },
        42: {
            title: "Amusing Squares",
            description: "'Fame^2' multiplies popularity at log10 rate.",
            cost: new Decimal(50),
            currencyDisplayName: "amusing karma",
            currencyLocation() {return player[this.layer].buyables},
            currencyInternalName: "21",
            unlocked() {return hasUpgrade('k', 41)},
            style: {
                "right" : "20px",
                "top" : "40px",
                "height" : "120px",
            },
            effect() {
                let eff = tmp.f.upgrades[15].effect
                eff = eff.add(0.1).log(10).add(0.1)
                return eff
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x"}
        },
        43: {
            title: "Charismatic Benchmark",
            description: "Double neutral karma gain when fame is greater than 1e45.",
            cost: new Decimal(30),
            currencyDisplayName: "charismatic karma",
            currencyLocation() {return player[this.layer].buyables},
            currencyInternalName: "22",
            unlocked() {return hasUpgrade('k', 34)},
            style: {
                "left" : "20px",
                "top" : "40px",
                "height" : "120px"
            }
        },
        44: {
            title: "Charismatic Charisma",
            description: "Effect of all charisma upgrades multiplies popularity.",
            cost: new Decimal(50),
            currencyDisplayName: "charismatic karma",
            currencyLocation() {return player[this.layer].buyables},
            currencyInternalName: "22",
            unlocked() {return hasUpgrade('k', 43)},
            style: {
                "left" : "20px",
                "top" : "40px",
                "height" : "120px"
            },
            effect() {
                let eff = tmp.k.upgrades[34].effect
                eff = eff.times(2).pow(1.1)
                return eff
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x"}
        },
        51: {
            title: "Royal Viewer",
            description: "Unlock another viewer buyable.",
            cost: new Decimal(12000),
            unlocked() {return hasMilestone ('k', 4)}
        },
        52: {
            title: "Fame Revisit III",
            description: "Unlock 5 new fame upgrades.",
            cost: new Decimal(45000),
            unlocked() {return hasUpgrade ('k', 51)}
        }
    },

    milestones: {
        0: {
            requirementDescription: "4 Total Neutral Karma",
            done() {
                return player.k.total.gte(4)
            },
            effectDescription: "Keep fame upgrades on reset."
        },
        1: {
            requirementDescription: "300 Total Neutral Karma",
            done() {
                return player.k.total.gte(300)
            },
            effectDescription: "Karma buyables cost nothing."
        },
        2: {
            requirementDescription: "1,500 Total Neutral Karma",
            done() {
                return player.k.total.gte(1500)
            },
            effectDescription: "Automate karma buyables."
        },
        3: {
            requirementDescription: "2,500 Total Neutral Karma",
            done() {
                return player.k.total.gte(2500)
            },
            effectDescription: "Generate 25% of neutral karma gain per second until neutral karma > 10,000."
        },
        4: {
            requirementDescription: "10,000 Total Neutral Karma & 7 Total Advertisements",
            done() {
                return player.k.total.gte(10000) && getBuyableAmount('i', 11).add(getBuyableAmount('i', 12)).add(getBuyableAmount('i', 13)).gte(7)
            },
            effectDescription: "Unlock two neutral karma upgrades.",
            unlocked() {return hasUpgrade ('k', 22) && hasUpgrade ('k', 24) && hasUpgrade ('k', 42) && hasUpgrade ('k', 44)}
        }
    }
})

addLayer("fo", {
    name: "followers", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "FO", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            unlockOrder: 0
        }
    },
    color: "#162C7D",
    requires() {return new Decimal((player.fo.unlockOrder>0 && !hasAchievement('fo', 25))?5e88:1e75)}, // Can be a function that takes requirement increases into account
    resource: "followers", // Name of prestige currenc
    baseResource: "fame", // Name of resource prestige is based on
    baseAmount() { return player.f.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.08, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasAchievement('fo', 21)) mult = mult.times(achievementEffect('fo', 21))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    effect() {
        let eff = new Decimal(1)
        eff = eff.times(player.fo.points)
        eff = eff.add(1).pow(49).log(2.025).add(1)
        return eff
    },
    effectDescription() {
        let dis = "which multiplies viewer effect after 2 softcaps by <font color=162C7D><h2>"+format(tmp.fo.effect)+ "x</h2></font color=162C7D>"
        return dis
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "o", description: "O: Reset for followers.", onPress() { if (canReset(this.layer)) doReset(this.layer) }, unlocked() {return player.fo.unlocked} },
    ],
    layerShown() {return (hasAchievement ('a', 45) && !player.s.unlocked) || (player.s.points.gte(100) || hasAchievement('a', 53))},
    branches: ["i", "v"],
    increaseUnlockOrder: ["s"],
    nodeStyle() {return {"color" : "rgba(255,255,255,0.75)"}},
    componentStyles() { return {
        "prestige-button": {
            "color" : "rgba(255, 255, 255, 0.75)",
        }}},
    softcap: new Decimal(25),
    softcapPower: new Decimal(0.25),
    progFOValue() {
        let prog = new Decimal(175)
        if (hasMilestone('fo', 0)) prog = new Decimal(250)
        if (hasMilestone('fo', 1)) prog = new Decimal(600)
        return prog
    },

    tabFormat: {
            "Main": {
                content: [
                    "main-display",
                    "prestige-button",
                    "blank",
                    ["display-text",
                        function () { return 'You have ' + formatWhole(player.fo.best) + ' best followers.' },
                        {}],
                    ["display-text",
                        function () { return 'You have ' + formatWhole(player.fo.total) + ' total followers.' },
                        {}],
                    "blank",
                    ["display-text",
                        function () { return "You have<font color=162C7D><h2> "+format(tmp.fo.buyables[31].cost)+ "</h2></font color=162C7D> Achievement Points, translating to a<font color=162C7D><h2> "+format(tmp.fo.buyables[31].effect)+"x</h2></font color=162C7D> boost to popularity."},
                        {}],
                    "blank",
                    "achievements",
                    "blank",
                    ["bar" , "followerBar"],
                    ["bar" , "unlockFOBar"]
                ]
            },
            "Short Videos": {
                content: [
                    "main-display",
                    "prestige-button",
                    "blank",
                    ["display-text",
                        function () { return 'You have ' + formatWhole(player.fo.best) + ' best followers.' },
                        {}],
                    ["display-text",
                        function () { return 'You have ' + formatWhole(player.fo.total) + ' total followers.' },
                        {}],
                    "blank",
                    "blank",
                    "blank"
                ],
                unlocked() {return false}
            }
    },

    achievements: {
        11: {
            name: "1 Total<br>Follower",
            tooltip: "Interactions x2. (only works if followers are first)",
            done() {return player.fo.total.gte(1)},
        },
        12: {
            name: "2 Total<br>Followers",
            tooltip: "Keep all row 2 milestones on reset.",
            done() {return player.fo.total.gte(2)},
            unlocked() {return hasAchievement('fo', 11)},
        },
        13: {
            name: "3 Total<br>Followers",
            tooltip: "Keep advertisements on reset (doesn't include bars).",
            done() {return player.fo.total.gte(3)},
            unlocked() {return hasAchievement('fo', 12)},
        },
        14: {
            name: "5 Total<br>Followers",
            tooltip: "Keep fame upgrades on reset.",
            done() {return player.fo.total.gte(5)},
            unlocked() {return hasAchievement('fo', 13)}
        },
        15: {
            name: "7 Total<br>Followers",
            tooltip: "Keep viewer buyables on reset.",
            done() {return player.fo.total.gte(7)},
            unlocked() {return hasAchievement('fo', 14)}
        },
        21: {
            name: "10 Total Followers",
            tooltip() {
                let dis = "Popularity boosts followers gain.<br>Currently: "+format(achievementEffect(this.layer,this.id))+"x"
                if (hasAchievement('fo', 25)) dis = "Popularity boosts followers gain.<br>Currently: "+format(achievementEffect(this.layer,this.id))+"x"+"<br><br>This effect boosts popularity at 75 followers. Currently: "+format(achievementEffect('fo', 21).times(10))+"x"
                return dis
            },
            done() {return player.fo.total.gte(10)},
            unlocked() {return hasAchievement('fo', 15)},
            effect() {
                let eff = player.points.add(1).pow(0.0045)
                return eff
            }
        },
        22: {
            name: "15 Total Followers",
            tooltip: "Keep interactions upgrades on reset.",
            done() {return player.fo.total.gte(15)},
            unlocked() {return hasAchievement('fo', 21)}
        },
        23: {
            name: "22 Total Followers",
            tooltip() {
                let dis = "Followers also provide a boost to fame. Currently: "+format(achievementEffect(this.layer,this.id))+"x"
                if (hasAchievement('fo', 25)) dis = "Followers also provide a boost to fame. Currently: "+format(achievementEffect(this.layer,this.id))+"x<br><br>This effect's formula is improved at 60 followers."
                return dis
            },
            done() {return player.fo.total.gte(22)},
            unlocked() {return hasAchievement('fo', 22)},
            effect() {
                let eff = tmp.fo.effect.pow(0.625)
                if (player.fo.points.gte(60)) eff = tmp.fo.effect.add(1).pow(9).log(2).add(1)
                return eff
            }
        },
        24: {
            name: "30 Total Followers",
            tooltip: "Keep viewer and karma upgrades on reset. Neutral Karma generation cap is now 45,000.",
            done() {return player.fo.total.gte(30)},
            unlocked() {return hasAchievement('fo', 23)}
        },
        25: {
            name: "40 Total Followers",
            tooltip() {return "Followers act as if you chose them first & total achievement points are multiplied by followers. Currently: "+format(achievementEffect(this.layer,this.id))+"x"},
            done() {return player.fo.total.gte(40)},
            unlocked() {return hasAchievement('fo', 24)},
            effect() {
                let eff = new Decimal(1)
                eff = eff.times(player.fo.points)
                eff = eff.add(1).pow(0.1).log(2).add(1)
                return eff
            }
        }
    },

    milestones: {
        0: {
            requirementDescription: "175 Followers: Unlock a viewer milestone.",
            done() {return player.fo.points.gte(175)},
        },
        1: {
            requirementDescription: "250 Followers: Unlock an interactions milestone.",
            done() {return player.fo.points.gte(250)},
        },
    },

    buyables: {
        31: {
            title: "achievement point lol",
            display() {return "ap: "+format(tmp.fo.buyables[31].cost)+"<br>eff: "+format(tmp.fo.buyables[31].effect)},
            cost() {
                let cost = new Decimal(1)
                cost = cost.times(player.fo.achievements.length)
                if (hasAchievement('fo', 25)) cost = cost.times(achievementEffect('fo', 25))
                return cost
            },
            effect() {
                let eff = tmp.fo.buyables[31].cost
                eff = eff.add(1).pow(27.28).log(2).add(1)
                return eff
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },

        }
    },

    bars: {
        followerBar: {
            direction: RIGHT,
            width: 650,
            height: 40,
            fillStyle: { 'background-color': "#162C7D" },
            borderStyle() { return { "border-color": "#162C7D" } },
            progress() {
                let prog = player.fo.points.div(100)
                if (player.fo.points.gte(100)) prog = 1
                return prog
            },
            display() {
                if (player.fo.points.lte(99))
                    return "Unlock another layer: " + formatWhole(player.fo.points) + " / 100 followers."
                else
                    return "You have unlocked Subscribers."
            },
            unlocked() { return hasAchievement('fo', 25) && !hasAchievement('a', 54)}
        },
        unlockFOBar: {
            direction: RIGHT,
            width: 650,
            height: 40,
            fillStyle: { 'background-color': "#162C7D" },
            borderStyle() { return { "border-color": "#162C7D" } },
            progress() {
                let prog = player.fo.points.div(tmp.fo.progFOValue)
                if (hasMilestone('s', 1)) prog = 1
                return prog
            },
            display() {
                if (!hasMilestone('fo', 1))
                    return "Unlock more content: " + formatWhole(player.fo.points) + " / "+formatWhole(tmp.fo.progFOValue)+" followers."
                else
                    return "More content is on its way in a future update!"
            },
            unlocked() { return hasAchievement('a', 54)}
        },
    }
})

addLayer("s", {
    name: "subscribers", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            best: new Decimal(0),
            total: new Decimal(0),
            unlockOrder: 0
        }
    },
    color: "#dd2424",
    requires() {return (player[this.layer].unlockOrder>0&&!hasAchievement('s', 25))?new Decimal("5e88"):new Decimal("1e75")}, // Can be a function that takes requirement increases into account
    resource: "subscribers", // Name of prestige currency
    baseResource: "fame", // Name of resource prestige is based on
    baseAmount() { return player.f.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.08, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasAchievement('s', 21)) mult = mult.times(achievementEffect('s', 21))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "s", description: "S: Reset for subscribers.", onPress() { if (canReset(this.layer)) doReset(this.layer) }, unlocked() {return player.s.unlocked} },
    ],
    layerShown() { return hasAchievement ('a', 45) && !player.fo.unlocked || (player.fo.points.gte(100) || hasAchievement('a', 53))},
    branches: ["k", "i"],
    increaseUnlockOrder: ["fo"],
    effect() {
        let eff = new Decimal(1)
        eff = eff.times(player.s.points)
        eff = eff.add(1).pow(9).log(2).add(1)
        return eff
    },
    effectDescription() {
        let dis = "which multiplies 'Growth' effect before softcaps by <font color=#dd2424><h2>"+format(tmp.s.effect)+ "x</h2></font color=#dd2424> and after 1 softcap by <font color=#dd2424><h2>"+format(tmp.s.effect.div(4.5))+ "x</h2></font color=#dd2424>"
        return dis
    },
    softcap: new Decimal(25),
    softcapPower: new Decimal(0.25),
    progValue() {
        let prog = new Decimal(175)
        if (hasMilestone('s', 0)) prog = new Decimal(250)
        if (hasMilestone('s', 1)) prog = new Decimal(600)
        return prog
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.s.best) + ' best subscribers.' },
                    {}],
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.s.total) + ' total subscribers.' },
                    {}],
                "blank",
                ["display-text",
                        function () { return "You have<font color=dd2424><h2> "+format(tmp.s.buyables[31].cost)+ "</h2></font color=dd2424> Achievement Points, translating to a<font color=dd2424><h2> "+format(tmp.s.buyables[31].effect)+"x</h2></font color=dd2424> boost to popularity."},
                        {}],
                "blank",
                "achievements",
                "blank",
                ["bar", "subscriberBar"],
                ["bar", "unlockSBar"]
            ]
        },
        "Creation Team": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.s.best) + ' best subscribers.' },
                    {}],
                ["display-text",
                    function () { return 'You have ' + formatWhole(player.s.total) + ' total subscribers.' },
                    {}],
                "blank",
                "blank",
                "blank"
            ],
            unlocked() {return false}
        }
    },

    achievements: {
        11: {
            name: "1 Total<br>Subscriber",
            tooltip: "Interactions x2. (only works if subscribers are first)",
            done() {return player.s.total.gte(1)}
        },
        12: {
            name: "2 Total Subscribers",
            tooltip: "Keep all row 2 milestones on reset.",
            done() {return player.s.total.gte(2)},
            unlocked() {return hasAchievement('s', 11)},
        },
        13: {
            name: "4 Total Subscribers",
            tooltip: "Keep advertisements on reset (doesn't include bars).",
            done() {return player.s.total.gte(4)},
            unlocked() {return hasAchievement('s', 12)},
        },
        14: {
            name: "6 Total Subscribers",
            tooltip: "Keep fame upgrades on reset.",
            done() {return player.s.total.gte(6)},
            unlocked() {return hasAchievement('s', 13)}
        },
        15: {
            name: "8 Total Subscribers",
            tooltip: "Keep viewer buyables on reset.",
            done() {return player.s.total.gte(8)},
            unlocked() {return hasAchievement('s', 14)}
        },
        21: {
            name: "10 Total Subscribers",
            tooltip() {
                let dis = "Popularity boosts subscribers gain.<br>Currently: "+format(achievementEffect(this.layer,this.id))+"x"
                if (hasAchievement('s', 25)) dis = "Popularity boosts subscribers gain.<br>Currently: "+format(achievementEffect(this.layer,this.id))+"x"+"<br><br>This effect boosts popularity at 75 subscribers. Currently: "+format(achievementEffect('s', 21).times(10))+"x"
                return dis
            },
            done() {return player.s.total.gte(10)},
            unlocked() {return hasAchievement('s', 15)},
            effect() {
                let eff = player.points.add(1).pow(0.00465)
                if (player.s.points.gte(100)) eff = player.points.add(1).pow(0.0045)
                return eff
            }
        },
        22: {
            name: "15 Total Subscribers",
            tooltip: "Keep interactions upgrades on reset.",
            done() {return player.s.total.gte(15)},
            unlocked() {return hasAchievement('s', 21)}
        },
        23: {
            name: "22 Total Subscribers",
            tooltip() {
                let dis = "Subscribers also provide a boost to fame. Currently: "+format(achievementEffect(this.layer,this.id))+"x"
                if (hasAchievement('s', 25)) dis = "Subscribers also provide a boost to fame. Currently: "+format(achievementEffect(this.layer,this.id))+"x<br><br>This effect's formula is improved at 60 subscribers."
                return dis
            },
            done() {return player.s.total.gte(22)},
            unlocked() {return hasAchievement('s', 22)},
            effect() {
                let eff = tmp.s.effect.pow(0.625)
                if (player.s.points.gte(60)) eff = tmp.s.effect.add(1).pow(9).log(2).add(1)
                return eff
            }
        },
        24: {
            name: "30 Total Subscribers",
            tooltip: "Keep viewer and karma upgrades on reset. Neutral Karma generation cap is now 45,000.",
            done() {return player.s.total.gte(30)},
            unlocked() {return hasAchievement('s', 23)}
        },
        25: {
            name: "40 Total Subscribers",
            tooltip() {
                let dis = "Subscribers act as if you chose them first & total achievement points are multiplied by subscribers. Currently: "+format(achievementEffect(this.layer,this.id))+"x"
                return dis
            },
            done() {return player.s.total.gte(40)},
            unlocked() {return hasAchievement('s', 24)},
            effect() {
                let eff = new Decimal(1)
                eff = eff.times(player.s.points)
                eff = eff.add(1).pow(0.1).log(2).add(1)
                return eff
            }
        }
    },

    milestones: {
      0: {
        requirementDescription: "175 Subscribers: Karma generation is now 100%.",
        done() {return player.s.points.gte(175)},
      }, 
      1: {
        requirementDescription: "250 Subscribers: Add to karma generation cap based on subscribers.",
        done() {return player.s.points.gte(250)}
      }
    },

    buyables: {
        31: {
            title: "achievement point lol",
            display() {return "ap: "+format(tmp.s.buyables[31].cost)+"<br>eff: "+format(tmp.s.buyables[31].effect)},
            cost() {
                let cost = new Decimal(1)
                cost = cost.times(player.s.achievements.length)
                if (hasAchievement('s', 25)) cost = cost.times(achievementEffect('s', 25))
                return cost
            },
            effect() {
                let eff = tmp.s.buyables[31].cost
                eff = eff.add(1).pow(27.28).log(2).add(1)
                return eff
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },

        }
    },

    bars: {
        subscriberBar: {
            direction: RIGHT,
            width: 650,
            height: 40,
            fillStyle: { 'background-color': "#dd2424" },
            borderStyle() { return { "border-color": "#dd2424" } },
            progress() {
                let prog = player.s.points.div(100)
                if (player.s.points.gte(100)) prog = 1
                return prog
            },
            display() {
                if (player.s.points.lte(99))
                    return "Unlock another layer: " + formatWhole(player.s.points) + " / 100 subscribers."
                else
                    return "You have unlocked Followers."
            },
            unlocked() { return hasAchievement('s', 25) && !hasAchievement('a', 54)}
        },
        unlockSBar: {
            direction: RIGHT,
            width: 650,
            height: 40,
            fillStyle: { 'background-color': "#dd2424" },
            borderStyle() { return { "border-color": "#dd2424" } },
            progress() {
                let prog = player.s.points.div(tmp.s.progValue)
                if (hasMilestone('s', 1)) prog = 1
                return prog
            },
            display() {
                if (!hasMilestone('s', 1))
                    return "Unlock more content: " + formatWhole(player.s.points) + " / "+formatWhole(tmp.s.progValue)+" subscribers."
                else
                    return "More content is on its way in a future update!"
            },
            unlocked() { return hasAchievement('a', 54)}
        },
    }
})

addLayer("a", {
    startData() {
        return {
            unlocked: true,
        }
    },
    color: "yellow",
    row: "side",
    layerShown() { return true },
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
                return hasUpgrade('f', 11)
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
            name: "Kinda Famous",
            tooltip: "Have one row of fame upgrades.",
            done() {
                return hasUpgrade('f', 15)
            }
        },
        15: {
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
            name: "100 Isn't Alot",
            tooltip: "Have the viewer effect exceed 100x.",
            done() {
                return tmp.v.effect.gte(100)
            }
        },
        24: {
            name: "Everybody Knows Me.",
            tooltip: "Have 8.00e9 popularity.",
            done() {
                return player.points.gte(8e9)
            }
        },
        25: {
            name: "The Perfect Combinations",
            tooltip: "Have three rows of fame upgrades.",
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
        },
        33: {
            name: "1,000,000 IS Alot",
            tooltip: "Have the viewer effect exceed 1 million.",
            done() {
                return tmp.v.effect.gte(1e6)
            }
        },
        34: {
            name: "You Can't Spell Advertisements Without [REDACTED]",
            tooltip: "Have 3 advertisements.",
            done() {
                return getBuyableAmount('i', 13).gte(1)
            }
        },
        35: {
            name: "The Ranks of the Universe",
            tooltip: "Have four rows of fame upgrades.<br><br>Reward: 'Interconnection' is based on total interactions.",
            done() {
                return hasUpgrade('f', 45)
            }
        },
        41: {
            name: "Karma Chameleon",
            tooltip: "Do a karma reset.",
            done() {
                return player.k.points.gte(1)
            }
        },
        42: {
            name: "No Negative Karma?",
            tooltip: "Have 5 positive karma at any one time.",
            done() {
                return getBuyableAmount('k', 11).gte(5)
            }
        },
        43: {
            name: "Threshold? Broken.",
            tooltip: "Have all of the thresholds for all the 3rd karma upgrades.",
            done() {
                return player.points.gte(1e35) && player.f.points.gte(1e45) && player.v.points.gte(32) && player.i.points.gte(1000)
            }
        },
        44: {
            name: "ULTIMATE RIZZ",
            tooltip: "Have all the charisma upgrades.<br><br>Reward: Interactions start cost is now 1,000 fame. (only works when you have karma 44. & less than 3600 interactions.)",
            done() {
                return hasUpgrade('k', 44)
            }
        },
        45: {
            name: "Grid Of Perfection",
            tooltip: "Have five rows of fame upgrades.",
            done() {
                return hasUpgrade('f', 55)
            }
        },
        51: {
            name: "Social Media",
            tooltip: "Have either followers or subscribers.<br><br>Reward: Viewers are 1.5x cheaper under 16 viewers.",
            done() {
                return player.fo.points.gte(1) || player.s.points.gte(1)
            }
        },
        52: {
            name: "'Antisocial Mexico' - Thenonymous",
            tooltip: "Have both followers and subscribers.",
            done() {
                return player.fo.unlocked && player.s.unlocked
            }
        },
        53: {
            name: "Achievements Galore!",
            tooltip: "Have the first two rows of follower and subscriber achievements.",
            done() {
                return hasAchievement('fo', 25) && hasAchievement('s', 25)
            }
        },
        54: {
            name: "The New MrBeast",
            tooltip: "Have 100 followers and subscribers.<br><br>Reward: Repurpose the row 3 bars.",
            done() {
                return player.fo.points.gte(100) && player.s.points.gte(100)
            }
        },
        55: {
            name: "What do you mean no more fame upgrades?",
            tooltip: "Unlock 'The Internet'<br><br>Reward: Interactions gain below 12,000 is x3.",
            done() {
                return hasMilestone('i', 3)
            }
        },
    },
},
)