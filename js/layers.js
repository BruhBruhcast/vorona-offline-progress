const STATIC_SCALE_STARTS = {
    "2": function() { return new Decimal(2000) },
    "3": function() { return new Decimal(320) },
}

function scaleStaticCost(gain, row) {
	let start = (STATIC_SCALE_STARTS[String(row+1)]?STATIC_SCALE_STARTS[String(row+1)]():1);
    if (gain.gte(start)) { 
        if (row == 1) gain = gain.pow(2).div(start);
        if (row == 2) gain = gain.pow(3).div(Decimal.pow(start, 2))
    }
	return gain;
}
function startCChallenge(id) {
    player.f.p = new Decimal(0)
    player.f.cp = new Decimal(0)
    player.f.casuals = new Decimal(1)
    player.f.cboosts = new Decimal(0)
    player.f.points = new Decimal(0)
    player.f.resettime = new Decimal(0.001)
    player.f.sac = new Decimal(0)
    player.f.d1 = new Decimal(0)
    player.f.d2 = new Decimal(0)
    player.f.d3 = new Decimal(0)
    player.f.d4 = new Decimal(0)
    player.f.d5 = new Decimal(0)
    player.f.d6 = new Decimal(0)
    player.f.d7 = new Decimal(0)
    player.f.d8 = new Decimal(0)
    player.f.mult = new Decimal(0)
    player.f.buyables[11] = new Decimal(0)
    player.f.buyables[12] = new Decimal(0)
    player.f.buyables[13] = new Decimal(0)
    player.f.buyables[14] = new Decimal(0)
    player.f.buyables[21] = new Decimal(0)
    player.f.buyables[22] = new Decimal(0)
    player.f.buyables[23] = new Decimal(0)
    player.f.buyables[24] = new Decimal(0)
    player.f.buyables[31] = new Decimal(0)
    player.f.buyables[32] = (hasFUpg(84) && id !== 22 && id !== 31) ? new Decimal(2) : new Decimal(0)
    player.f.buyables[33] = new Decimal(0) 
    player.f.buyables[71] = player.f.buyables[71].min(player.f.cd[0])
    player.f.buyables[72] = player.f.buyables[72].min(player.f.cd[1])
    player.f.buyables[73] = player.f.buyables[73].min(player.f.cd[2])
    player.f.buyables[74] = player.f.buyables[74].min(player.f.cd[3])
    player.f.buyables[81] = player.f.buyables[81].min(player.f.cd[4])
    player.f.buyables[82] = player.f.buyables[82].min(player.f.cd[5])
}

function softcapStaticGain(gain, row) {
	let start = (STATIC_SCALE_STARTS[String(row+1)]?STATIC_SCALE_STARTS[String(row+1)]():1);
    if (gain.gte(start)) {
        if (row == 1) gain = gain.times(start).pow(1/2);
        if (row == 2) gain = gain.times(Decimal.pow(start,2)).root(3)
    }
	return gain;
}
function hasVUpg(id){
    return hasUpgrade("v",id)
}
function getVUpgEff(id){
    return upgradeEffect("v",id)
}
function hasIUpg(id){
    return hasUpgrade("i",id)
}
function getIUpgEff(id){
    return upgradeEffect("i",id)
}
function hasRUpg(id){
    return hasUpgrade("r",id)
}
function getRUpgEff(id){
    return upgradeEffect("r",id)
}
function hasUUpg(id){
    return hasUpgrade("u",id)
}
function getUUpgEff(id){
    return upgradeEffect("u",id)
}
function hasSUpg(id){
    return hasUpgrade("s",id)
}
function getSUpgEff(id){
    return upgradeEffect("s",id)
}
function hasDUpg(id){
    return hasUpgrade("d",id)
}
function getDUpgEff(id){
    return upgradeEffect("d",id)
}
function hasFUpg(id){
    return hasUpgrade("f",id)
}
function getFUpgEff(id){
    return upgradeEffect("f",id)
}

addLayer("v", {
    name: "virus",
    symbol: "V",
    position: 0,
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            total: new Decimal(0),
            best: new Decimal(0),
        }
    },
    color: "#777777",
    requires: new Decimal(1),
    resource: "virus points",
    baseResource: "cases",
    baseAmount() { return player.points },
    type: "normal",
    exponent: 0.5,
    softcap: new Decimal("ee7"),
    softcapPower: 0.5,
    gainMult() {
        mult = new Decimal(1)
        if(hasVUpg(22)) mult = mult.mul(getVUpgEff(22))
        if(hasVUpg(31)) mult = mult.mul(getVUpgEff(31))
        if(hasIUpg(11)) mult = mult.mul(getIUpgEff(11))
        mult = mult.mul(layers.d.effect())
        mult = mult.mul(layers.f.effect())
        if (hasAchievement("a", 21)) mult = mult.mul(layers.a.effect())
        if (player.s.unlocked) mult = mult.mul(tmp.s.severityEff);
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 0,
    hotkeys: [
        {
            key:"v", description: "V:Reset for virus points", onPress() {
                if (canReset(this.layer))
                    doReset(this.layer)
            }
        },
    ],
    update(diff) {
        if (hasMilestone("i", 1)) generatePoints("v", diff);
    },
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("i", 0) && resettingLayer=="i") keep.push("upgrades")
        if (hasMilestone("r", 0) && resettingLayer=="r") keep.push("upgrades")
        if (hasAchievement("a", 31)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        rows: 3,
        cols: 3,
        11: {
            title: "Start",
            description: "Gain 0.1 cases/s.",
            cost: new Decimal(1),
            effect(){
                return true
            },
            effectDisplay() {
                return format(getPointGen()) + "/s"
            }
        },
        12: {
            title: "Infection",
            description: "Multiply cases gain.",
            cost: new Decimal(2),
            base() {
                let base =  new Decimal(2)
                if(hasIUpg(21)) base = base.add(getIUpgEff(21))
                if(hasIUpg(22)) base = base.add(getIUpgEff(22))
                base = base.add(layers.r.effect2())
                if(hasIUpg(21) && hasIUpg(31)) base = base.mul(getIUpgEff(21).max(1))
                if(hasIUpg(22) && hasIUpg(32)) base = base.mul(getIUpgEff(22).max(1))
                if(hasUUpg(11)) base = base.mul(getUUpgEff(11))
                if(hasSUpg(24)) base = base.mul(getSUpgEff(24))
                base = base.mul(layers.s.buyables[23].effect())
                return base
            },
            effect(){
                let eff = this.base()
                let v12sf = new Decimal("e10000")
                let v12sf2 = new Decimal("ee10")
                let v12sf3 = new Decimal("ee50")
                if(hasVUpg(23)) eff = eff.pow(getVUpgEff(23))
                if(hasFUpg(33)) eff = eff.pow(getFUpgEff(33))
                if(eff.gte(v12sf)) eff = Decimal.pow(10,Decimal.log10(eff.div(v12sf)).pow(3/4)).mul(v12sf)
                if(eff.gte(v12sf2)) eff = Decimal.pow(10,Decimal.log10(eff.div(v12sf2)).pow(0.9)).mul(v12sf2)
                if(eff.gte(v12sf3)) eff = Decimal.pow(10,Decimal.pow(10,eff.div(v12sf3).log10().log10().pow(0.99))).mul(v12sf3)
                if (inChallenge("u", 12)) eff = new Decimal(1)
                return eff
            },
            effectDisplay(){
                let v12dis = format(getVUpgEff(12))+"x"
                let v12sf = new Decimal("e10000")
                if (getVUpgEff(12).gte(v12sf)) v12dis = v12dis+" (softcapped)"
                return v12dis
            },
            unlocked(){
                return hasVUpg(11)
            }
        },
        13: {
            title: "Transmission",
            description: "Multiplier to cases based on VP.",
            cost: new Decimal(5),
            effect(){
                let v13 = player.v.points.add(2)
                let v13sf = new Decimal("1.8e308")
                let v13sf2 = new Decimal("1e2370")
                let v13sf3 = new Decimal("e25e8")
                let v13sf4 = new Decimal("ee14")
                let v13sf5 = new Decimal("ee50")
                let v13sff = new Decimal(0.5)
                let v13sff2 = new Decimal(0.8)
                let v13sff3 = new Decimal(10/11)
                let v13sff4 = new Decimal(5/6)
                let v13sff5 = new Decimal(0.95)
                v13 = v13.pow(1/2)
                if(hasUUpg(12)) v13sf = v13sf.mul(getUUpgEff(12))
                if(hasUUpg(12)) v13sf2 = v13sf2.mul(getUUpgEff(12)).add(1)
                if(hasUUpg(12)) v13sf3 = v13sf3.mul(getUUpgEff(12)).add(1)
                if(hasUUpg(12)) v13sf4 = v13sf4.mul(getUUpgEff(12)).add(1)
                if (inChallenge("u", 22)) v13sf = new Decimal(1)
                if (inChallenge("u", 22)) v13sf2 = new Decimal(1)
                if (hasChallenge("u", 22)) v13sff = v13sff.pow(challengeEffect("u", 22).pow(-1))
                if (hasChallenge("u", 22)) v13sff2 = v13sff2.pow(challengeEffect("u", 22).pow(-1))
                if(hasIUpg(12)) v13 = v13.pow(getIUpgEff(12))
                if(hasDUpg(14)) v13 = v13.pow(getDUpgEff(14))
                if(hasSUpg(55)) v13 = v13.pow(getSUpgEff(55))
                if(v13.gte(v13sf)) v13 = v13.mul(v13sf).pow(v13sff) 
                if(v13.gte(v13sf2)) {
                    v13 = Decimal.pow(10,Decimal.log10(v13.div(v13sf2)).pow(v13sff2)).mul(v13sf2)
                }
                if(v13.gte(v13sf3)) {
                    v13 = Decimal.pow(10,Decimal.log10(v13.div(v13sf3)).pow(v13sff3)).mul(v13sf3)
                }
                if(v13.gte(v13sf4)) {
                    v13 = Decimal.pow(10,Decimal.log10(v13.div(v13sf4)).pow(v13sff4)).mul(v13sf4)
                }
                if(v13.gte(v13sf5)) {
                    v13 = Decimal.pow(10,Decimal.pow(10,v13.div(v13sf5).log10().log10().pow(v13sff5))).mul(v13sf5)
                }
                return v13  
            },
            effectDisplay(){
                let v13sf = new Decimal("1.8e308")
                if(hasUUpg(12)) v13sf = v13sf.mul(getUUpgEff(12))
                let v13dis = format(getVUpgEff(13))+"x"
                if (getVUpgEff(13).gte(v13sf) || inChallenge("u", 22)) v13dis = v13dis+" (softcapped)"
            return v13dis
            },
            unlocked(){
                return hasVUpg(12)
            }
        },
        21: {
            title: "Self Boost",
            description: "Multiplier to cases based on cases.",
            cost: new Decimal(10),
            effect(){
                let v21 = player.points.add(1)
                let v21sf = new Decimal("ee5")
                let v21sf2 = new Decimal("ee16")
                v21 = Decimal.log10(v21).pow(2).add(2)
                if(hasVUpg(32)) v21 = v21.pow(getVUpgEff(32))
                if(hasRUpg(23)) v21 = v21.pow(getRUpgEff(23))
                if(v21.gte(v21sf)) v21 = Decimal.pow(10,Decimal.log10(v21.div(v21sf)).pow(0.8)).mul(v21sf)
                if(v21.gte(v21sf2)) v21 = Decimal.pow(10,Decimal.log10(v21.div(v21sf2)).pow(0.88)).mul(v21sf2)
                return v21
            },
            effectDisplay(){
                let v21sf = new Decimal("ee5")
                let v21dis = format(getVUpgEff(21))+"x"
                if (getVUpgEff(21).gte(v21sf)) v21dis = v21dis + " (softcapped)"
                return v21dis
            },
            unlocked(){
                return hasVUpg(13)
            }
        },
        22: {
            title: "Contaminate",
            description: "Multiplier to VP based on cases.",
            cost: new Decimal(20),
            effect(){
                let v22 = player.points.add(1)
                v22 = Decimal.log10(v22).add(1)
                if(hasVUpg(33)) v22 = v22.pow(getVUpgEff(33))
                if(hasRUpg(31)) v22 = v22.pow(getRUpgEff(31))
                return v22
            },
            effectDisplay(){
                return format(getVUpgEff(22))+"x"
            },
            unlocked(){
                return hasVUpg(21)
            }
        },
        23: {
            title: "More Infections",
            description: "Raise 'Infection' to the number of bought upgrades.",
            cost: new Decimal(200),
            effect(){
                let v23 = player.v.upgrades.length
                if(hasRUpg(22)) v23 = Decimal.mul(v23,getRUpgEff(22))
                return v23
            },
            effectDisplay(){
                return "^"+format(getVUpgEff(23))
            },
            unlocked(){
                return hasVUpg(22)
            }
        },
        31: {
            title: "Disease",
            description: "Multiplier to VP based on VP.",
            cost: new Decimal(5e3),
            effect(){
                let v31 = player.v.points.add(10)
                v31 = Decimal.log10(v31).pow(1.3)
                if(hasRUpg(12)) v31 = v31.pow(getRUpgEff(12))
                return v31
            },
            effectDisplay(){
                return format(getVUpgEff(31))+"x"
            },
            unlocked(){
                return hasVUpg(23)
            }
        },
        32: {
            title: "BOOSTER",
            description: "'Self Boost' is stronger based on VP.",
            cost: new Decimal(2.5e5),
            effect(){
                let v32 = player.v.points.add(10)
                v32 = Decimal.log10(v32).pow(0.2)
                return v32
            },
            effectDisplay(){
                return "^"+format(getVUpgEff(32))
            },
            unlocked(){
                return hasVUpg(31)
            }
        },
        33: {
            title: "Food Contamination",
            description: "'Contaminate' is stronger based on cases.",
            cost: new Decimal(5e6),
            effect(){
                let v33 = player.points.add(10)
                v33 = Decimal.log10(v33).pow(0.15)
                return v33
            },
            effectDisplay(){
                return "^"+format(getVUpgEff(33))
            },
            unlocked(){
                return hasVUpg(32)
            }
        },
    },
    layerShown() {return true}
})

addLayer("i", {
    name: "infectivity",
    symbol: "I",
    position: 0,
    startData() { return {
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
    unlocked: false,
    total: new Decimal(0)
    }},
    color: "#880435",
    requires: new Decimal("7.8e9"),
    resource: "infectivity",
    baseResource: "cases",
    baseAmount() { return player.points },
    type: "normal",
    exponent: 0.08,
    branches: ["v"],
    softcap: new Decimal("ee7"),
    softcapPower: 0.5,
    hotkeys: [
        {
            key:"i", description: "I:Reset for infectivity", onPress() {
                if (canReset(this.layer))
                    doReset(this.layer)
            }
        },
    ],
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("u", 0) && resettingLayer=="u") keep.push("milestones")
        if (hasMilestone("s", 0) && resettingLayer=="s") keep.push("milestones")
        if (hasMilestone("u", 3) && resettingLayer=="u") keep.push("upgrades")
        if (hasMilestone("s", 1) && resettingLayer=="s") keep.push("upgrades")
        if (hasMilestone("d", 6) && resettingLayer=="d") keep.push("upgrades")
        if (hasAchievement("a", 41)) keep.push("upgrades")
        if (hasMilestone("a", 0)) keep.push("milestones")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    effect(){
        let eff = player.i.points.add(1)
        eff = eff.pow(2)
        if (inChallenge("u", 12)) eff = new Decimal(1)
        if (eff.gte("ee16")) eff = Decimal.pow(10,eff.div("ee16").log10().pow(0.88)).mul("ee16")
        if (eff.gte("ee32")) eff = Decimal.pow(10,eff.div("ee32").log10().pow(0.85)).mul("ee32")
        return eff
    },
    effectDescription() {
        let dis = "which boost cases gain by "+layerText("h2", "i", format(this.effect()))
        if (this.effect().gte("ee16")) dis += " (softcapped)"
        return dis
    },
    gainMult() {
        imult = new Decimal(1)
        if (hasIUpg(13)) imult = imult.mul(getIUpgEff(13))
        if (hasIUpg(23)) imult = imult.mul(getIUpgEff(23))
        imult = imult.mul(layers.u.effect())
        imult = imult.mul(layers.d.effect())
        imult = imult.mul(layers.f.effect())
        if (hasAchievement("a", 31)) imult = imult.mul(layers.a.effect())
        imult = imult.mul(layers.s.buyables[12].effect())
        if (player.s.unlocked) imult = imult.mul(tmp.s.severityEff);
        return imult
    },
    gainExp() {
        let exp = new Decimal(1)
        return exp
    },
    update(diff) {
        if (hasMilestone("u", 2)) generatePoints("i", diff);
    },
    row: 1,
    layerShown() {
        let shown = player.v.total.gte(new Decimal(1))
        if(player.i.unlocked) shown = true
        return shown
    },
    milestones: {
        0: {
            requirementDescription: "15 total infectivity",
            effectDescription: "Keep virus upgrades on reset.",
            done() { return player.i.total.gte(15) }
        },
        1: {
            requirementDescription: "2,000 total infectivity",
            effectDescription: "Gain 100% of VP gain per second.",
            done() { return player.i.total.gte(2e3) }
        }
    },
    upgrades: {
        rows: 3,
        cols: 3,
        11: {
            title: "VP Boost",
            description: "Infectivity boosts VP gain.",
            cost: new Decimal(10),
            effect(){
            let i11 = player.i.points.add(1)
            if (inChallenge("u", 12)) i11 = new Decimal(1)
            return i11
            },
            effectDisplay(){
            return format(getIUpgEff(11))+"x"
            },
        },
        12: {
            title: "Air Transmission",
            description: "Infectivity boosts 'Transmission'.",
            cost: new Decimal(20),
            effect(){
            let i12 = player.i.points.add(15)
            let i12sf = new Decimal(1.35)
            i12 = Decimal.log10(i12.mul(2)).pow(0.3)
            if (hasUUpg(21)) i12sf = i12sf.mul(getUUpgEff(21))
            if (i12.gte(i12sf)) i12 = i12.mul(Decimal.pow(i12sf,2)).pow(1/3)
            if (i12.gte(2) && !hasUUpg(21)) i12 = new Decimal(2)
            if (inChallenge("u", 12)) i12 = new Decimal(1)
            return i12
            },
            effectDisplay(){
                let i12dis = "^"+format(getIUpgEff(12))
                let i12sf = new Decimal(1.35)
                if (hasUUpg(21)) i12sf = i12sf.mul(getUUpgEff(21))
                if ((getIUpgEff(12).gte(i12sf) && getIUpgEff(12).lt(2)) || (hasUUpg(21) && getIUpgEff(12).gte(i12sf))) i12dis = i12dis+" (softcapped)" 
                if (getIUpgEff(12).gte(2) && !hasUUpg(21)) i12dis = i12dis+" (hardcapped)"
            return i12dis
            },
            unlocked(){
                return hasIUpg(11)
            }
        },
        13: {
            title: "Resistance",
            description: "Multiplier to infectivity based on VP.",
            cost: new Decimal(50),
            effect(){
            let i13 = player.v.points.add(10)
            i13 = Decimal.log10(i13).pow(0.4)
            if (hasIUpg(33)) i13 = i13.pow(getIUpgEff(33))
            return i13
            },
            effectDisplay(){
            return format(getIUpgEff(13))+"x"
            },
            unlocked(){
                return hasIUpg(12)
            }
        },
        21: {
            title: "Susceptible",
            description: "Infectivity increases 'Infection' base.",
            cost: new Decimal(500),
            effect(){
            let i21 = player.i.points.add(1)
            i21 = Decimal.log10(i21).pow(0.5)
            if(hasIUpg(31)) i21 = i21.mul(getIUpgEff(31))
            if (inChallenge("u", 12)) i21 = new Decimal(1)
            return i21
            },
            effectDisplay(){
            return "+"+format(getIUpgEff(21))
            },
            unlocked(){
                return hasIUpg(13)
            }
        },
        22: {
            title: "Drug Resistance",
            description: "Cases increase 'Infection' base.",
            cost: new Decimal(5e3),
            effect(){
            let i22 = player.points.add(1)
            i22 = Decimal.log10(i22).pow(0.2)
            if(hasIUpg(32)) i22 = i22.mul(getIUpgEff(32))
            return i22
            },
            effectDisplay(){
            return "+"+format(getIUpgEff(22))
            },
            unlocked(){
                return hasIUpg(21)
            }
        },
        23: {
            title: "Environmental Hardening",
            description: "Multiplier to infectivity based on cases.",
            cost: new Decimal(25e3),
            effect(){
            let i23 = player.points.add(10)
            i23 = Decimal.log10(i23).pow(0.3).mul(1.25)
            if (hasIUpg(33)) i23 = i23.pow(getIUpgEff(33))
            return i23
            },
            effectDisplay(){
            return format(getIUpgEff(23))+"x"
            },
            unlocked(){
                return hasIUpg(22)
            }
        },
        31: {
            title: "SUSceptible",
            description: "'Susceptible' is stronger based on replicators and make it add and multiply.",
            cost: new Decimal("2.5e60"),
            effect(){
            let i31 = player.r.points.add(1)
            i31 = i31.pow(0.78)
            if (inChallenge("u", 21)) i31 = new Decimal(1)
            return i31
            },
            effectDisplay(){
            return format(getIUpgEff(31))+"x"
            },
            unlocked(){
                return hasRUpg(32)
            }
        },
        32: {
            title: "Genetic Hardening",
            description: "'Drug Resistance' is stronger based on replicators and make it add and multiply.",
            cost: new Decimal("4.20e69"),
            effect(){
            let i32 = player.r.points.add(1)
            if (inChallenge("u", 21)) i32 = new Decimal(1)
            return i32
            },
            effectDisplay(){
            return format(getIUpgEff(32))+"x"
            },
            unlocked(){
                return hasIUpg(31)
            }
        },
        33: {
            title: "Genetic ReShuffle",
            description: "'Resistance' and 'Environmental Hardening' is stronger based on infectivity.",
            cost: new Decimal("7.77e77"),
            effect(){
            let i33 = player.i.points.add(10)
            i33 = Decimal.log10(i33).pow(1/3)
            if (inChallenge("u", 12)) i33 = new Decimal(1)
            if (hasChallenge("u", 12)) i33 = i33.pow(challengeEffect("u", 12))
            if (i33.gte(1e17)) i33 = i33.div(1e17).pow(0.5).mul(1e17)
            return i33
            },
            effectDisplay(){
                let dis = "^"+format(getIUpgEff(33))
                if (this.effect().gte(1e17)) dis += " (softcapped)"
                return dis
            },
            unlocked(){
                return hasIUpg(32)
            }
        },
    },
})
addLayer("r", {
    name: "replicators",
    symbol: "R",
    position: 1,
    startData() { return {
        points: new Decimal(0),
        total: new Decimal(0),
        best: new Decimal(0),
    unlocked: false
    }},
    color: "#df34c9",
    requires: new Decimal("5e58"),
    resource: "replicators",
    baseResource: "cases",
    baseAmount() { return player.points },
    type: "static",
    exponent: new Decimal(1.7),
    base: new Decimal(1e4),
    branches: ["v"],
    hotkeys: [
        {
            key:"r", description: "R:Reset for replicators", onPress() {
                if (canReset(this.layer))
                    doReset(this.layer)
            }
        },
    ],
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("u", 0) && resettingLayer=="u") keep.push("milestones")
        if (hasMilestone("s", 0) && resettingLayer=="s") keep.push("milestones")
        if (hasMilestone("u", 3) && resettingLayer=="u") keep.push("upgrades")
        if (hasMilestone("s", 1) && resettingLayer=="s") keep.push("upgrades")
        if (hasMilestone("d", 6) && resettingLayer=="d") keep.push("upgrades")
        if (hasAchievement("a", 41)) keep.push("upgrades")
        if (hasMilestone("a", 0)) keep.push("milestones")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    automate() {},
    autoPrestige() { return (hasMilestone("u", 4) && player.u.auto) },
    effbase() {
        let eff = new Decimal(100)
        if(hasRUpg(11)) eff = eff.mul(getRUpgEff(11))
        if(hasRUpg(13)) eff = eff.mul(getRUpgEff(13))
        if(hasSUpg(15)) eff = eff.mul(getSUpgEff(15))
        if(hasUUpg(13)) eff = eff.mul(upgradeEffect("u",13).r)
        if(hasChallenge("u", 21)) eff = eff.mul(challengeEffect("u", 21))
        return eff
    },
    effect(){
        let eff = this.effbase()
        eff = Decimal.pow(eff,player.r.points)
        if (inChallenge("u", 21)) eff = new Decimal(1)
        return eff
    },
    effect2(){
        let eff2 = player.r.points
        eff2 = eff2.pow(0.75)
        if(hasRUpg(21)) eff2 = eff2.mul(getRUpgEff(21))
        if(hasUUpg(22)) eff2 = eff2.pow(getUUpgEff(22))
        if (inChallenge("u", 21)) eff2 = new Decimal(0)
        return eff2
    },
    effectDescription() {
        return "which boost cases gain by "+layerText("h2", "r", format(this.effect()))+" and increasing 'Infection' base by "+layerText("h2", "r", format(this.effect2()))
    },
    gainMult() {
        rmult = new Decimal(1)
        if(hasUUpg(14)) rmult = rmult.div(getUUpgEff(14))
        return rmult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1,
    resetsNothing() { return hasMilestone("u", 5) },
    layerShown() {
        let shown = player.i.total.gte(new Decimal(1))
        if(player.r.unlocked) shown = true
        return shown
    },
    canBuyMax() {
        return hasMilestone("r", 1)
    },
    milestones: {
        0: {
            requirementDescription: "5 replicators",
            effectDescription: "Keep virus upgrades on reset.",
            done() { return player.r.points.gte(5) }
        },
        1: {
            requirementDescription: "12 replicators",
            effectDescription: "You can buy max replicators.",
            done() { return player.r.points.gte(12) }
        },
    },
    upgrades: {
        rows: 3,
        cols: 3,
        11: {
            title: "Replication",
            description: "Infectivity boosts replicators 1st effect base.",
            cost: new Decimal(4),
            effect(){
            let r11 = player.i.points.add(10)
            r11 = Decimal.log10(r11).pow(1.2).add(1)
            if (inChallenge("u", 12)) r11 = new Decimal(1)
            return r11
            },
            effectDisplay(){
            return format(getRUpgEff(11))+"x"
            },
        },
        12: {
            title: "DNA",
            description: "Replicators boost 'Disease'.",
            cost: new Decimal(5),
            effect(){
            let r12 = player.r.points.add(10)
            r12 = Decimal.log10(r12).pow(1.6).mul(1.65).add(1)
            if(hasRUpg(33)) r12 = r12.pow(getRUpgEff(33))
            if (inChallenge("u", 21)) r12 = new Decimal(1)
            return r12
            },
            effectDisplay(){
            return "^"+format(getRUpgEff(12))
            },
            unlocked(){
                return hasRUpg(11)
            }
        },
        13: {
            title: "Attachment",
            description: "VP boosts replicators 1st effect base.",
            cost: new Decimal(7),
            effect(){
            let r13 = player.v.points.add(10)
            r13 = Decimal.log10(r13).pow(0.7).add(1)
            return r13
            },
            effectDisplay(){
            return format(getRUpgEff(13))+"x"
            },
            unlocked(){
                return hasRUpg(12)
            }
        },
        21: {
            title: "Entry",
            description: "VP boosts replicators 2nd effect.",
            cost: new Decimal(12),
            effect(){
            let r21 = player.v.points.add(10)
            r21 = Decimal.log10(r21).pow(0.35).add(1)
            return r21
            },
            effectDisplay(){
            return format(getRUpgEff(21))+"x"
            },
            unlocked(){
                return hasRUpg(13)
            }
        },
        22: {
            title: "Uncoating",
            description: "Cases boost 'More Infections'.",
            cost: new Decimal(13),
            effect(){
            let r22 = player.points.add(10)
            r22 = Decimal.log10(r22).add(10)
            r22 = Decimal.log10(r22).pow(2).div(10).add(1)
            r22 = r22.mul(layers.u.effect2())
            if (r22.gte(4.8e6)) r22 = r22.div(4.8e6).pow(0.5).mul(4.8e6)
            if (r22.gte(3e11)) r22 = Decimal.pow(10,r22.div(3e11).log10().pow(0.5)).mul(3e11)
            if (r22.gte(1e55)) r22 = Decimal.pow(10,r22.div(1e55).log10().pow(0.75)).mul(1e55)
            return r22
            },
            effectDisplay(){
                let dis = format(getRUpgEff(22))+"x"
                if (this.effect().gte(4.8e6)) dis += " (softcapped)"
                return dis
            },
            unlocked(){
                return hasRUpg(21)
            }
        },
        23: {
            title: "Transcription",
            description: "'Self Boost' is stronger based on replicators",
            cost: new Decimal(16),
            effect(){
            let r23 = player.r.points.add(10)
            r23 = Decimal.log10(r23).pow(2.4).add(1)
            if (hasChallenge("u", 22)) r23 = r23.mul(challengeEffect("u", 22))
            if (hasUUpg(24)) r23 = r23.pow(getUUpgEff(24))
            if (r23.gte(1e25)) r23 = r23.div(1e25).pow(0.3).mul(1e25)
            if (inChallenge("u", 21)) r23 = new Decimal(1)
            return r23
            },
            effectDisplay(){
                let dis = "^"+format(getRUpgEff(23))
                if (this.effect().gte(1e25)) dis += " (softcapped)"
                return dis
            },
            unlocked(){
                return hasRUpg(22)
            }
        },
        31: {
            title: "Synthesis",
            description: "'Contaminate' is stronger based on replicators",
            cost: new Decimal(20),
            effect(){
            let r31 = player.r.points.add(10)
            r31 = Decimal.log10(r31).pow(3.8).add(1)
            if (inChallenge("u", 21)) r31 = new Decimal(1)
            return r31
            },
            effectDisplay(){
            return "^"+format(getRUpgEff(31))
            },
            unlocked(){
                return hasRUpg(23)
            }
        },
        32: {
            title: "Virion",
            description: "Unlock a row of infectivity upgrades.",
            cost: new Decimal(21),
            unlocked(){
                return hasRUpg(31)
            }
        },
        33: {
            title: "Release",
            description: "'DNA' is stronger based on cases",
            cost: new Decimal(26),
            effect(){
            let r33 = player.points.add(10)
            r33 = Decimal.log10(r33).add(10)
            r33 = Decimal.log10(r33).pow(0.4).add(1)
            return r33
            },
            effectDisplay(){
            return "^"+format(getRUpgEff(33))
            },
            unlocked(){
                return hasIUpg(33)
            }
        },
    },
})
addLayer("u", {
    name: "uncoaters",
    symbol: "U",
    position: 0,
    startData() { return {
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        auto: false,
    unlocked: false
    }},
    color: "#3fa3d3",
    requires: new Decimal("5e116"),
    resource: "uncoaters",
    baseResource: "infectivity",
    baseAmount() { return player.i.points },
    type: "static",
    exponent() {
        let exp = new Decimal(3.2)
        return exp
    },
    base() {
        let base = new Decimal("1e10")
        return base
    },
    branches: ["i","r"],
    hotkeys: [
        {
            key:"u", description: "U:Reset for uncoaters", onPress() {
                if (canReset(this.layer))
                    doReset(this.layer)
            }
        },
    ],
    effbase() {
        let eff = new Decimal("30")
        if(hasUUpg(13)) eff = eff.mul(upgradeEffect("u",13).u)
        if(hasSUpg(11)) eff = eff.mul(getSUpgEff(11))
        if(hasSUpg(13)) eff = eff.mul(getSUpgEff(13))
        if(hasDUpg(21)) eff = eff.mul(getDUpgEff(21))
        if (getBuyableAmount("s", 22).gte(1)) eff = eff.mul(layers.s.buyables[22].effect().add(1))
        return eff
    },
    effect(){
        let eff = this.effbase()
        eff = eff.pow(player.u.points)
        if(hasFUpg(54)) eff = eff.pow(getFUpgEff(54))
        if (inChallenge("u", 11)) eff = new Decimal(1)
        return eff
    },
    effect2(){
        let eff2 = player.u.points.add(10)
        eff2 = Decimal.log10(eff2).pow(3)
        if(hasSUpg(12)) eff2 = eff2.mul(getSUpgEff(12))
        if(hasUUpg(23)) eff2 = eff2.pow(getUUpgEff(23))
        if (eff2.gte("e10000")) eff2 = Decimal.pow(10,eff2.div("e10000").log10().pow(0.5)).mul("1e10000")
        if (inChallenge("u", 11)) eff2 = new Decimal(1)
        return eff2
    },
    effectDescription() {
        return "which boost cases and infectivity by "+layerText("h2", "u", format(this.effect()))+", and boosts 'Uncoating' by "+layerText("h2", "u", format(this.effect2()))
    },
    gainMult() {
        umult = new Decimal(1)
        if (hasChallenge("u", 11)) umult = umult.div(challengeEffect("u", 11))
        return umult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    layerShown() {
        let shown = hasIUpg(33)
        if(player.u.unlocked) shown = true
        return shown
    },
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("a", 0)) keep.push("upgrades")
        if (hasMilestone("a", 0)) keep.push("milestones")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    autoPrestige() { return (hasMilestone("d", 2) && player.d.auto) },
    canBuyMax() { return hasMilestone("d", 1)},
    resetsNothing() { return hasMilestone("d", 5) },
    milestones: {
        0: {
            requirementDescription: "2 uncoaters",
            effectDescription: "Keep Infectivity/Replicator milestones on reset.",
            done() { return player.u.points.gte(2) }
        },
        2: {
            requirementDescription: "3 uncoaters",
            effectDescription: "Gain 100% of infectivity gain per second.",
            done() { return player.u.points.gte(3) }
        },
        3: {
            requirementDescription: "6 uncoaters",
            effectDescription: "Keep Infectivity/Replicator upgrades on reset.",
            done() { return player.u.points.gte(6) }
        },
        4: {
            requirementDescription: "8 uncoaters",
            effectDescription: "Autobuy replicators.",
            toggles: [["u", "auto"]],
            done() { return player.u.points.gte(8) }
        },
        5: {
            requirementDescription: "10 uncoaters",
            effectDescription: "Replicators reset nothing.",
            done() { return player.u.points.gte(10) }
        },
        6: {
            requirementDescription: "15 uncoaters",
            effectDescription: "Unlock uncoater challenges.",
            done() { return player.u.points.gte(15) }
        },
    },
    upgrades: {
        rows: 2,
        cols: 4,
        11: {
            title: "Uncoated Infection",
            description: "Best uncoaters boosts 'Infection' base.",
            cost: new Decimal(2),
            effect(){
            let u11 = player.u.best.add(1)
            u11 = u11.pow(4.5)
            if (inChallenge("u", 11) || inChallenge("s", 21)) u11 = new Decimal(1)
            return u11
            },
            effectDisplay(){
            return format(getUUpgEff(11))+"x"
            },
        },
        12: {
            title: "Water Transmission",
            description: "'Transmission' softcap starts later based on uncoaters and replicators.",
            cost: new Decimal(3),
            effect(){
            let u12 = layers.u.effect()
            u12 = u12.pow(7.5)
            let rep = player.r.points
            u12 = u12.pow(rep.div(10).add(1))
            if (inChallenge("u", 11) || inChallenge("u", 21) || inChallenge("s", 21)) u12 = new Decimal(1)
            if (u12.gte(new Decimal("e1500"))) u12 = u12.div(new Decimal("e1500")).pow(0.3).mul(new Decimal("e1500"))
            if (u12.gte(new Decimal("e15000"))) u12 = Decimal.pow(10,u12.div(new Decimal("e1500")).log10().pow(2/3)).mul(new Decimal("e15000"))
            if (u12.gte(new Decimal("ee17"))) u12 = Decimal.pow(10,u12.div(new Decimal("ee17")).log10().pow(0.93)).mul(new Decimal("ee17"))
            return u12
            },
            effectDisplay(){
                let u12dis = format(getUUpgEff(12))+"x"
                if (this.effect().gte(new Decimal("e1500"))) u12dis = u12dis + " (softcapped)"
                return u12dis
            },
            unlocked(){
                return hasUUpg(11)
            }
        },
        13: {
            title: "Synergy",
            description: "Uncoaters and replicators boost each other .",
            cost: new Decimal(4),
            effect(){
                let u13 = player.u.points.add(1)
                let u13b = player.r.points.add(1)
                u13 = u13.pow(2.2)
                u13b = u13b.pow(0.63)
                if (inChallenge("u", 11) || inChallenge("s", 21)) u13 = new Decimal(1)
                if (inChallenge("u", 21) || inChallenge("s", 21)) u13b = new Decimal(1)
                return {r:u13, u:u13b}
            },
            effectDisplay(){
            return format(this.effect().r)+"x to replicators base, "+format(this.effect().u)+"x to uncoaters base."
            },
            unlocked(){
                return hasUUpg(12)
            }
        },
        14: {
            title: "Genome Replication",
            description: "Cases make replicators cheaper.",
            cost: new Decimal(6),
            effect(){
            let u14 = player.points.add(1)
            u14 = Decimal.log10(u14).pow(0.83)
            u14 = Decimal.pow(10,u14).pow(1.536)
            if (inChallenge("s", 21)) u14 = new Decimal(1)
            return u14
            },
            effectDisplay(){
            return format(getUUpgEff(14))+"x"
            },
            unlocked(){
                return hasUUpg(13)
            }
        },
        21: {
            title: "Bird Transmission",
            description: "Remove 'Air Transmission' hardcap and its softcap starts later based on cases.",
            cost: new Decimal(8),
            effect(){
            let u21 = player.points.add(10)
            u21 = Decimal.log10(u21).add(10)
            u21 = Decimal.log10(u21).add(10)
            u21 = u21.pow(0.1).div(1.12)
            if (inChallenge("s", 21)) u21 = new Decimal(1)
            return u21
            },
            effectDisplay(){
            return format(getUUpgEff(21))+"x"
            },
            unlocked(){
                return hasUUpg(14)
            }
        },
        22: {
            title: "Viral Proteins",
            description: "Infectivity boosts replicators 2nd effect.",
            cost: new Decimal(10),
            effect(){
            let u22 = player.i.points.add(10)
            u22 = Decimal.log10(u22)
            u22 = u22.pow(0.26).add(0.13)
            if (inChallenge("u", 12) || inChallenge("s", 21)) u22 = new Decimal(1)
            return u22
            },
            effectDisplay(){
            return "^"+format(getUUpgEff(22))
            },
            unlocked(){
                return hasUUpg(21)
            }
        },
        23: {
            title: "Viral Enzymes",
            description: "Infectivity boosts uncoaters 2nd effect.",
            cost: new Decimal(11),
            effect(){
            let u23 = player.i.points.add(10)
            u23 = Decimal.log10(u23)
            u23 = u23.pow(0.0747)
            if (u23.gte(150)) u23 = u23.div(150).pow(0.333).mul(150)
            if (inChallenge("u", 12) || inChallenge("s", 21)) u23 = new Decimal(1)
            return u23
            },
            effectDisplay(){
            return "^"+format(getUUpgEff(23))
            },
            unlocked(){
                return hasUUpg(22)
            }
        },
        24: {
            title: "Endocytosis",
            description: "'Transcription' is stronger based on uncoaters.",
            cost: new Decimal(13),
            effect(){
            let u24 = player.u.points.add(10)
            u24 = Decimal.log10(u24)
            u24 = u24.pow(1.523)
            if (inChallenge("u", 11) || inChallenge("s", 21)) u24 = new Decimal(1)
            return u24
            },
            effectDisplay(){
            return "^"+format(getUUpgEff(24))
            },
            unlocked(){
                return hasUUpg(23)
            }
        },
    },
    challenges: { // Order: 1x1,2x1,1x2,3x1,4x1,2x2,1x3,3x2,2x3,4x2,3x3,4x3
        rows: 2,
        cols: 2,
        11: {
            name: "Coated",
            challengeDescription: function() {
                let c11 = "Uncoaters are useless."
                if (inChallenge("u", 11)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("u", 11) == 3) c11 = c11 + " (Completed)"
                c11 = c11 + "<br>Completed:" + challengeCompletions("u",11) + "/" + this.completionLimit
                return c11
            },
            goal(){
                if (challengeCompletions("u", 11) == 0) return new Decimal("e2610");
                if (challengeCompletions("u", 11) == 1) return new Decimal("e2865");
                if (challengeCompletions("u", 11) == 2) return new Decimal("e4860");
            },
            currencyDisplayName: "cases",
            completionLimit:3 ,
            rewardDescription: "Infectivity makes uncoaters cheaper.",
            rewardEffect() {
                 let c11 = player.i.points.add(1)
                 let c11r = new Decimal(1.27)
                 let c11c = challengeCompletions("u", 11)
                 c11c = Decimal.pow(1.2, c11c)
                 c11 = Decimal.log10(c11).pow(0.7)
                 c11 = Decimal.pow(10,c11)
                 c11r = c11r.mul(c11c)
                 c11 = c11.pow(c11r)
                 c11 = c11.pow(layers.s.buyables[13].effect())
                 if (inChallenge("u", 12)) c11 = new Decimal(1)
                 return c11
            },
            rewardDisplay() {return format(this.rewardEffect())+"x"},
            unlocked(){
                return hasMilestone("u", 6)
            }
        },
        12: {
            name: "Disinfectant",
            challengeDescription: function() {
                let c12 = "Infectivity and 'Infection' are useless."
                if (inChallenge("u", 12)) c12 = c12 + " (In Challenge)"
                if (challengeCompletions("u", 12) == 3) c12 = c12 + " (Completed)"
                c12 = c12 + "<br>Completed:" + challengeCompletions("u",12) + "/" + this.completionLimit
                return c12
            },
            goal(){
                if (challengeCompletions("u", 12) == 0) return new Decimal("e714");
                if (challengeCompletions("u", 12) == 1) return new Decimal("e2360");
                if (challengeCompletions("u", 12) == 2) return new Decimal("e3434");
            },
            currencyDisplayName: "cases",
            completionLimit:3 ,
            rewardDescription: "Cases boost 'Genetic ReShuffle'.",
            rewardEffect() {
                 let c12 = player.points.add(10)
                 let c12r = new Decimal(1/5)
                 let c12c = challengeCompletions("u", 12)
                 c12c = Decimal.div(c12c, 20)
                 c12r = c12r.add(c12c)
                 c12 = Decimal.log10(c12).add(10)
                 c12 = Decimal.log10(c12).pow(c12r)
                 return c12
            },
            rewardDisplay() {return "^"+format(this.rewardEffect())},
            unlocked(){
                return hasChallenge("u", 11)
            }
        },
        21: {
            name: "Unreplicated",
            challengeDescription: function() {
                let c21 = "Replicators are useless."
                if (inChallenge("u", 21)) c21 = c21 + " (In Challenge)"
                if (challengeCompletions("u", 21) == 3) c21 = c21 + " (Completed)"
                c21 = c21 + "<br>Completed:" + challengeCompletions("u",21) + "/" + this.completionLimit
                return c21
            },
            goal(){
                if (challengeCompletions("u", 21) == 0) return new Decimal("e3700");
                if (challengeCompletions("u", 21) == 1) return new Decimal("e5720");
                if (challengeCompletions("u", 21) == 2) return new Decimal("e6905");
            },
            currencyDisplayName: "cases",
            completionLimit:3 ,
            rewardDescription: "Cases boost replicators 1st effect base.",
            rewardEffect() {
                 let c21 = player.points.add(10)
                 let c21r = new Decimal(0.5)
                 let c21c = challengeCompletions("u", 21)
                 c21c = Decimal.div(c21c, 2)
                 c21r = c21r.add(c21c)
                 c21 = Decimal.log10(c21).pow(c21r)
                 return c21
            },
            rewardDisplay() {return format(this.rewardEffect())+"x"},
            unlocked(){
                return hasChallenge("u", 12)
            }
        },
        22: {
            name: "Masks",
            challengeDescription: function() {
                let c22 = "'Transmission' softcap starts instantly and 'Coated' and 'Disinfectant' are applied at once. Cases gain is multiplied by 5^(total challenge completions-4)"
                if (inChallenge("u", 22)) c22 = c22 + " (In Challenge)"
                if (challengeCompletions("u", 22) == 3) c22 = c22 + " (Completed)"
                c22 = c22 + "<br>Completed:" + challengeCompletions("u",22) + "/" + this.completionLimit
                return c22
            },
            goal(){
                if (challengeCompletions("u", 22) == 0) return new Decimal("1e14");
                if (challengeCompletions("u", 22) == 1) return new Decimal("5e19");
                if (challengeCompletions("u", 22) == 2) return new Decimal("5e21");
            },
            currencyDisplayName: "cases",
            completionLimit:3 ,
            countsAs: [11, 12],
            rewardDescription: "VP boosts 'Transcription' and makes 'Transmission' softcap weaker.",
            rewardEffect() {
                 let c22 = player.v.points.add(10)
                 let c22r = new Decimal(0.15)
                 let c22c = challengeCompletions("u", 22)
                 c22c = Decimal.div(c22c, 20)
                 c22r = c22r.add(c22c)
                 c22 = Decimal.log10(c22).add(10)
                 c22 = Decimal.max(Decimal.log10(c22).pow(c22r).div(1.15),1)
                 return c22
            },
            rewardDisplay() {return format(this.rewardEffect())+"x"},
            unlocked(){
                return hasChallenge("u", 21)
            }
        },
    },
})
addLayer("s", {
    name: "symptoms",
    symbol: "S",
    position: 1,
    startData() { return {
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        auto: false,
        severity: new Decimal(0),
        recoveries: new Decimal(0),
        time: new Decimal(0),
        ct: 0,
        unlocked: false
    }},
    color: "#5ad93f",
    requires: new Decimal("e10310"),
    resource: "symptoms",
    baseResource: "infectivity",
    baseAmount() { return player.i.points },
    type: "static",
    exponent: new Decimal(1.99),
    base: new Decimal("1e570"),
    branches: ["i","r","u"],
    hotkeys: [
        {
            key:"s", description: "S:Reset for symptoms", onPress() {
                if (canReset(this.layer))
                    doReset(this.layer)
            }
        },
    ],
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("f", 3)) keep.push("upgrades")
        if (hasMilestone("f", 4)) keep.push("challenges")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    resetsNothing() { return hasMilestone("d", 9) },
    autoPrestige() { return (hasMilestone("d", 7) && player.d.autos) },
    effbase() {
        let eff = new Decimal("123")
        eff = eff.mul(layers.s.buyables[21].effect())
        if (hasDUpg(11)) eff = eff.mul(getDUpgEff(11))
        if (hasSUpg(35)) eff = eff.mul(getSUpgEff(35))
        return eff
    },
    effect(){
        let eff = this.effbase()
        eff = eff.pow(player.s.points).sub(1)
        if (hasSUpg(14)) eff = eff.mul(getSUpgEff(14))
        if (hasSUpg(32)) eff = eff.mul(getSUpgEff(32))
        eff = eff.mul(layers.s.buyables[11].effect())
        eff = eff.mul(layers.d.effect())
        eff = eff.mul(layers.f.effect())
        if (hasChallenge("s", 11)) eff = eff.mul(challengeEffect("s", 11))
        eff = eff.pow(layers.s.buyables[33].effect())
        if (player.s.severity.gte(new Decimal("1.8e308"))) eff = eff.div(tmp.s.recoveryEff)
        if (hasDUpg(42)) {
            if (hasDUpg(31)) eff = eff.pow(getDUpgEff(31))
            if (hasDUpg(32)) eff = eff.pow(getDUpgEff(32))
            if (hasChallenge("s", 22)) eff = eff.pow(challengeEffect("s", 22))
            if (hasSUpg(53)) eff = Decimal.pow(10,eff.log10().pow(getSUpgEff(53)))
            if (hasSUpg(54)) eff = Decimal.pow(10,eff.log10().pow(getSUpgEff(54)))
            if (hasDUpg(44)) eff = Decimal.pow(10,eff.log10().pow(getDUpgEff(44)))
            if (hasFUpg(21)) eff = Decimal.pow(10,eff.log10().pow(getFUpgEff(21)))
        }
        if (eff.gte("e2e6")) eff = eff.log10().mul(5000).pow(2e5)
        if (player.s.points.eq(0)) eff = new Decimal(0)
        if (hasFUpg(11)) eff = eff.mul(getFUpgEff(11))
        if (hasFUpg(13)) eff = eff.mul(getFUpgEff(13))
        if (hasFUpg(15)) eff = eff.mul(layers.f.effect())
        eff = eff.mul(layers.d.buyables[11].effect())
        return eff
    },
    recoveryGain() {
        let s = player.s.severity
        let recov = (s.add(10)).log10().div(308.254).pow(40)
        let r = player.s.recoveries.add(1)
        if (s.gte(new Decimal("e1000"))) recov = recov.pow(s.log10().sub(999).pow(0.3)).pow(r.log10().pow(0.1))
        if (s.gte(new Decimal("e150000"))) recov = Decimal.pow(10,recov.log10().pow(s.log10().div(3e6).add(0.95)))
        if (hasDUpg(42)) recov = new Decimal(0)
        return recov
    },
    recoveryEff() {
        let s = player.s.severity
        let recov = player.s.recoveries.add(1)
        recov = Decimal.log10(recov).add(1).pow(40)
        if (s.gte(new Decimal("e1000"))) recov = recov.pow(s.log10().sub(999).pow(0.15)).pow(recov.log10().pow(0.2))
        if (s.gte(new Decimal("e2000"))) recov = recov.pow(s.log10().sub(1999).pow(0.12))
        if (s.gte(new Decimal("e5000"))) recov = Decimal.pow(10,recov.log10().pow(s.log10().sub(4999).pow(0.02)))
        if (s.gte(new Decimal("e150000"))) recov = Decimal.pow(10,recov.log10().pow(s.log10().div(1.5e6).add(0.9)))
        if (hasDUpg(31)) recov = recov.pow(getDUpgEff(31))
        if (hasDUpg(32)) recov = recov.pow(getDUpgEff(32))
        if (hasChallenge("s", 22)) recov = recov.pow(challengeEffect("s", 22))
        if (hasSUpg(53)) recov = Decimal.pow(10,recov.log10().pow(getSUpgEff(53)))
        if (hasSUpg(54)) recov = Decimal.pow(10,recov.log10().pow(getSUpgEff(54)))
        if (hasDUpg(42)) recov = new Decimal(1)
        return recov
    },
    effectDescription() {
        let desc = "which produces " + layerText("h2", "s", format(this.effect())) + " severity "
        if (this.effect().gte("e2e6")) desc += " (softcapped) "
        if (player.s.severity.gte(new Decimal("1.8e308"))) desc = desc + "and " + format(this.recoveryGain()) + " recoveries"
        desc = desc + " per second."
        return desc
    },
    severityEff() {
        let seff = player.s.severity.add(1)
        seff = seff.pow(6)
        if (hasSUpg(21)) seff = seff.pow(getSUpgEff(21))
        if (hasSUpg(51)) seff = seff.pow(getSUpgEff(51))
        if (inChallenge("s", 11)) seff = new Decimal(1)
        return seff
    },
    bulk() {
        let buymult = new Decimal(1)
        if (hasMilestone("d", 4)) buymult = buymult.mul(10)
        if (hasMilestone("a", 0)) buymult = buymult.mul(2)
        if (hasAchievement("a", 41)) buymult = buymult.mul(2)
        if (hasDUpg(23)) buymult = buymult.mul(2)
        if (hasDUpg(32)) buymult = buymult.mul(5)
        if (hasDUpg(33)) buymult = buymult.mul(2)
        if (hasSUpg(55)) buymult = buymult.mul(25)
        if (hasMilestone("f", 8)) buymult = buymult.mul(100)
        if (hasFUpg(73)) buymult = buymult.mul(1000)
        if (hasFUpg(123)) buymult = buymult.pow(2)
        return buymult
    },
    speed() {
        let speed = 1
        if (hasMilestone("d", 9)) speed *= 2
        if (hasMilestone("a", 0)) speed *= 2
        if (hasAchievement("a", 41)) speed *= 2
        if (hasDUpg(33)) speed *= 2
        if (hasFUpg(73)) speed *= 2
        return speed
    },
    update(diff) {
        if (player.s.unlocked) player.s.severity = player.s.severity.add(tmp.s.effect.times(diff));
        if (tmp.s.effect.gte(new Decimal("e1000")) && player.s.severity.lt(new Decimal("e1000"))) player.s.severity = new Decimal("e1000")
        if (tmp.s.effect.gte(new Decimal("e5000")) && player.s.severity.lt(new Decimal("e5000"))) player.s.severity = new Decimal("e5000")
        if (player.s.severity.gte(new Decimal("1.8e308"))) player.s.recoveries = player.s.recoveries.add(tmp.s.recoveryGain.times(diff));
        if (player.s.recoveries.log10().gte(this.recoveryGain().log10().add(2))) player.s.recoveries = this.recoveryGain().mul(100)
        let t = diff*this.speed()
            player.s.time = Decimal.add(player.s.time, t)
            if (player.s.time.gte(1)) {
                let times = Decimal.floor(player.s.time).mul(-1)
                player.s.time = Decimal.add(player.s.time, times)
                times = times.mul(-1)
                if (hasUpgrade("s", 31) || hasAchievement("a", 41)) {
                    layers.s.buyables[11].buyMax(times.mul(this.bulk()))
                    layers.s.buyables[12].buyMax(times.mul(this.bulk()))
                    layers.s.buyables[13].buyMax(times.mul(this.bulk()))
                    layers.s.buyables[21].buyMax(times.mul(this.bulk()))
                    layers.s.buyables[22].buyMax(times.mul(this.bulk()))
                    layers.s.buyables[23].buyMax(times.mul(this.bulk()))
                    layers.s.buyables[31].buyMax(times.mul(this.bulk()))
                    layers.s.buyables[32].buyMax(times.mul(this.bulk()))
                    layers.s.buyables[33].buyMax(times.mul(this.bulk()))
                }
            };
        if (player.s.ct <0.1 && (inChallenge("s", 11) || inChallenge("s", 12) || inChallenge("s", 21) || inChallenge("s", 22)))player.s.ct += diff
        if (player.s.ct >= 0.1) {
            player.v.upgrades = [11,12,13,21,22,23,31,32,33]
        }
    },
    tabFormat: ["main-display",
    "prestige-button",
    "blank",
    ["raw-html", function() {return "You have " + layerText("h2", "s", format(player.s.severity)) +  ' severity, which boosts cases, VP, and infectivity by ' + layerText("h2", "s", format(tmp.s.severityEff))}],
    ["display-text",
    function() {
        if (player.s.severity.gte(new Decimal("1.8e308"))) 
        return 'You have ' + format(player.s.recoveries) + ' recoveries, which divides severity gain by ' + format(tmp.s.recoveryEff)
        },
    ],
    "milestones",
    "buyables",
    "upgrades",
    "challenges"
],
    gainMult() {
        smult = new Decimal(1)
        let s = player.s.points
        let ssc = new Decimal(8)
        let ssc2 = new Decimal(20)
        if (hasDUpg(41)) ssc2 = ssc2.add(getDUpgEff(41))
        if (s.gte(ssc)) smult = smult.mul(Decimal.pow(1e100, s.sub(ssc).pow(3.7)))
        if (s.gte(ssc2)) smult = smult.mul(Decimal.pow(new Decimal("e10000"),Decimal.pow(1.9,s.sub(ssc2))))
        return smult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    layerShown() {
        let shown = challengeCompletions("u" ,22) == 3
        if(player.s.unlocked) shown = true
        return shown
    },
    canBuyMax() {return hasMilestone("f",12)},
    milestones: {
        0: {
            requirementDescription: "2 symptoms",
            effectDescription: "Keep Infectivity/Replicator milestones on reset.",
            done() { return player.s.points.gte(2) }
        },
        1: {
            requirementDescription: "3 symptoms",
            effectDescription: "Keep Infectivity/Replicator upgrades on reset.",
            done() { return player.s.points.gte(3) }
        },
        2: {
            requirementDescription: "4 symptoms",
            effectDescription: "Unlock buyables.",
            done() { return player.s.points.gte(4) }
        },
        3: {
            requirementDescription: "10 symptoms",
            effectDescription: "Unlock 2 more buyables.",
            done() { return player.s.points.gte(10) }
        },
    },
    buyables: {
		rows: 3,
        cols: 3,
        11: {
			title: "Severity Gain",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(2.5, x.pow(1.3)).mul(1e15)
                return cost.floor()
            },
            base() { 
                let base = new Decimal(2)
                if (hasSUpg(33)) base = base.add(getSUpgEff(33))
                base = base.mul(layers.s.buyables[31].effect())
                return base
            },
            extra() {
                let extra = new Decimal(0)
                if (!inChallenge("s", 22)) {
                if (hasSUpg(22)) extra = extra.add(layers.s.buyables[12].total())
                if (hasSUpg(23)) extra = extra.add(layers.s.buyables[21].total())
                extra = extra.add(layers.d.buyables[11].total())
                extra = extra.add(layers.s.buyables[33].total())
                }
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 11).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.total()
                let base = this.base()
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (hasSUpg(22)) extra = "+" + formatWhole(layers.s.buyables[11].extra())
                return "Multiply severity gain by "+format(this.base())+".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("s", 11)) + extra
            },
            unlocked() { return hasMilestone("s", 2) }, 
            canAfford() {
                    return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div(1e15)).div(Decimal.log10(2.5)).pow(10/13)
                target = target.ceil()
                let cost = Decimal.pow(2.5, target.sub(1).pow(1.3)).mul(1e15)
                let diff = target.sub(player.s.buyables[11])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[11] = player.s.buyables[11].add(diff)
                }
            },
        },
        12: {
			title: "Infectivity Gain",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(10, x.pow(1.29)).mul(1e19)
                return cost.floor()
            },
            base() { 
                let base = new Decimal(1e100)
                if (hasDUpg(13)) base = base.mul(getDUpgEff(13))
                return base
            },
            extra() {
                let extra = new Decimal(0)
                extra = extra.add(layers.s.buyables[33].total())
                if (hasSUpg(25) && !inChallenge("s", 21)) extra = extra.add(layers.s.buyables[22].total())
                if (hasSUpg(34) && !inChallenge("s", 21)) extra = extra.add(layers.s.buyables[13].total())
                extra = extra.add(layers.d.buyables[12].total())
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 12).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[12].total()
                let base = layers.s.buyables[12].base()
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (hasSUpg(25)) extra = "+" + formatWhole(layers.s.buyables[12].extra())
                return "Multiply Infectivity gain by "+format(this.base())+".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("s", 12)) + extra
            },
            unlocked() { return player[this.layer].buyables[11].gte(1) }, 
            canAfford() {
                    return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div(1e19)).pow(Decimal.pow(1.29,-1))
                target = target.ceil()
                let cost = Decimal.pow(10, target.sub(1).pow(1.29)).mul(1e19)
                let diff = target.sub(player.s.buyables[12])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[12] = player.s.buyables[12].add(diff)
                }
            },
		},
		21: {
			title: "Symptom Base",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(65, x.pow(1.35)).mul(new Decimal("e20"))
                return cost.floor()
            },
            base() { 
                let base = new Decimal(1.5)
                if (hasSUpg(45)) base = base.add(getSUpgEff(45))
                base = base.add(layers.s.buyables[32].effect())
                return base
            },
            extra() {
                let extra = new Decimal(0)
                extra = extra.add(layers.s.buyables[33].total())
                if (hasSUpg(31) && !inChallenge("s", 21)) extra = extra.add(layers.s.buyables[22].total())
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 21).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[21].total()
                let base = layers.s.buyables[21].base()
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (hasSUpg(31)) extra = "+" + formatWhole(layers.s.buyables[21].extra())
                return "Multiply the symptom base by "+ format(this.base()) + ".\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("s", 21)) + extra
            },
            unlocked() { return player[this.layer].buyables[12].gte(1) }, 
            canAfford() {
                    return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div(1e20)).div(Decimal.log10(65)).pow(Decimal.pow(1.35,-1))
                target = target.ceil()
                let cost = Decimal.pow(65, target.sub(1).pow(1.35)).mul(1e20)
                let diff = target.sub(player.s.buyables[21])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[21] = player.s.buyables[21].add(diff)
                }
            },
        },
        22: {
            title: "Uncoater Base",
            scalebase(){
                let base = new Decimal(5e3)
                if (hasSUpg(42)) base = base.div(getSUpgEff(42))
                return base
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(this.scalebase(), x.pow(1.5)).mul(new Decimal("e37"))
                return cost.floor()
            },
            base() { 
                let b = player.points.add(10)
                b = Decimal.log10(b)
                return new Decimal(b)
            },
            extra() {
                let extra = new Decimal(0)
                extra = extra.add(layers.s.buyables[33].total())
                if (hasSUpg(44) && !inChallenge("s", 21)) extra = extra.add(layers.s.buyables[23].total())
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 22).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[22].total()
                let base = layers.s.buyables[22].base()
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (hasSUpg(44)) extra = "+" + formatWhole(layers.s.buyables[22].extra())
                return "Multiply the uncoater base by " + format(this.base())+" (based on cases)\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("s", 22)) + extra
            },
            unlocked() { return player[this.layer].buyables[21].gte(1) }, 
            canAfford() {
                    return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div(1e37)).div(Decimal.log10(this.scalebase())).pow(Decimal.pow(1.5,-1))
                target = target.ceil()
                let cost = Decimal.pow(this.scalebase(), target.sub(1).pow(1.5)).mul(1e37)
                let diff = target.sub(player.s.buyables[22])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[22] = player.s.buyables[22].add(diff)
                }
            },
        },
        13: {
            title: "'Coated' Boost",
            scalebase(){
                let base = new Decimal(1e5)
                if (hasSUpg(41)) base = base.div(getSUpgEff(41))
                return base
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(this.scalebase(), x.pow(1.5)).mul(new Decimal("2e164"))
                return cost.floor()
            },
            base() { 
                let b = player.i.points.add(1)
                b = Decimal.log10(b).add(10)
                b = Decimal.log10(b).pow(0.8)
                return new Decimal(b)
            },
            extra() {
                let extra = new Decimal(0)
                extra = extra.add(layers.d.buyables[13].total())
                extra = extra.add(layers.s.buyables[33].total())
                if (hasSUpg(44) && !inChallenge("s", 21)) extra = extra.add(layers.s.buyables[23].total())
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 13).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[13].total()
                let base = layers.s.buyables[13].base()
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.mul(base, x).add(1);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (hasSUpg(44)) extra = "+" + formatWhole(layers.s.buyables[13].extra())
                return "Raise 'Coated' reward to ^(1+" + format(this.base())+"x) (based on infectivity)\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: ^" + format(tmp[this.layer].buyables[this.id].effect)+"\n\
                Amount: " + formatWhole(getBuyableAmount("s", 13)) + extra
            },
            unlocked() { return hasMilestone("s", 3) }, 
            canAfford() {
                    return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div("2e164")).div(Decimal.log10(this.scalebase())).pow(Decimal.pow(1.5,-1))
                target = target.ceil()
                let cost = Decimal.pow(this.scalebase(), target.sub(1).pow(1.5)).mul("2e164")
                let diff = target.sub(player.s.buyables[13])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[13] = player.s.buyables[13].add(diff)
                }
            },
        },
        23: {
            title: "'Infection' Base",
            scalebase(){
                let base = new Decimal(1e10)
                if (hasSUpg(43)) base = base.div(getSUpgEff(43))
                return base
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(this.scalebase(), x.pow(1.65)).mul(new Decimal("e270"))
                return cost.floor()
            },
            base() { 
                let b = player.v.points.add(10)
                b = Decimal.log10(b).pow(4)
                return new Decimal(b)
            },
            extra() {
                let extra = new Decimal(0)
                extra = extra.add(layers.s.buyables[33].total())
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 23).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[23].total()
                let base = layers.s.buyables[23].base()
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (player["s"].buyables[33].gte(1)) extra = "+" + formatWhole(layers.s.buyables[23].extra())
                return "Multiply 'Infection' base by " + format(this.base())+". (based on VP)\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("s", 23)) + extra
            },
            unlocked() { return player[this.layer].buyables[13].gte(1) }, 
            canAfford() {
                return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div("e270")).div(Decimal.log10(this.scalebase())).pow(Decimal.pow(1.65,-1))
                target = target.ceil()
                let cost = Decimal.pow(this.scalebase(), target.sub(1).pow(1.65)).mul("e270")
                let diff = target.sub(player.s.buyables[23])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[23] = player.s.buyables[23].add(diff)
                }
            },
        },
        31: {
            title: "Severity Boost",
            scalebase(){
                let base = new Decimal("e100")
                return base
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(this.scalebase(), x.pow(2)).mul(new Decimal("e34e5"))
                return cost.floor()
            },
            base() { 
                let b = player.d.points.add(1)
                b = Decimal.pow(10,b.log10().pow(0.5)).pow(0.02)
                return b
            },
            extra() {
                let extra = new Decimal(0)
                extra = extra.add(layers.s.buyables[33].total())
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 31).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[31].total()
                let base = layers.s.buyables[31].base()
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (player["s"].buyables[33].gte(1)) extra = "+" + formatWhole(layers.s.buyables[31].extra())
                return "Multiply 'Severity Gain' base by " + format(this.base())+"x (based on deaths)\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("s", 31)) + extra
            },
            unlocked() { return hasFUpg(21) }, 
            canAfford() {
                    return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div("e34e5")).div(Decimal.log10(this.scalebase())).pow(Decimal.pow(2,-1))
                target = target.ceil()
                let cost = Decimal.pow(this.scalebase(), target.sub(1).pow(2)).mul("e34e5")
                let diff = target.sub(player.s.buyables[31])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[31] = player.s.buyables[31].add(diff)
                }
            },
        },
        32: {
            title: "Symptom Boost",
            scalebase(){
                let base = new Decimal("e300")
                return base
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(this.scalebase(), x.pow(2)).mul(new Decimal("e3573000"))
                return cost.floor()
            },
            base() { 
                let b = player.f.points.add(10)
                let s = player.s.severity.add(10)
                b = Decimal.pow(10,b.log10().pow(1.25)).pow(0.03).pow(s.log10().pow(0.17)).div(20)
                if (b.gte("e300")) b = b.div("e300").pow(0.1).mul("e300")
                if (b.gte("ee4")) b = Decimal.pow(10,b.div("ee4").log10().pow(0.8)).mul("ee4")
                return b
            },
            extra() {
                let extra = new Decimal(0)
                extra = extra.add(layers.s.buyables[33].total())
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 32).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[32].total()
                let base = layers.s.buyables[32].base()
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.mul(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (player["s"].buyables[33].gte(1)) extra = "+" + formatWhole(layers.s.buyables[32].extra())
                return "Increase 'Symptom Base' base by " + format(this.base())+" (based on fatality and severity)\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: +" + format(tmp[this.layer].buyables[this.id].effect)+"\n\
                Amount: " + formatWhole(getBuyableAmount("s", 32)) + extra
            },
            unlocked() { return player["s"].buyables[31].gte(1) }, 
            canAfford() {
                    return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div("e3573000")).div(Decimal.log10(this.scalebase())).pow(Decimal.pow(2,-1))
                target = target.ceil()
                let cost = Decimal.pow(this.scalebase(), target.sub(1).pow(2)).mul("e3573000")
                let diff = target.sub(player.s.buyables[32])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[32] = player.s.buyables[32].add(diff)
                }
            },
        },
        33: {
            title: "Severity Exponent",
            scalebase(){
                let base = new Decimal("e500")
                return base
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(this.scalebase(), x.pow(2.2)).mul(new Decimal("e388e4"))
                return cost.floor()
            },
            base() { 
                let b = player.points.add(10)
                let s = player.i.points.add(10)
                b = Decimal.pow(10,b.log10().pow(0.12)).pow(0.03).pow(s.log10().pow(0.005)).div(100)
                return b
            },
            extra() {
                let extra = new Decimal(0)
                return extra
            },
            total() {
                let total = getBuyableAmount("s", 33).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = layers.s.buyables[33].total()
                let base = layers.s.buyables[33].base()
                if (inChallenge("s", 12)) x = new Decimal(0)
                return Decimal.mul(base, x).add(1);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                return "Increase severity gain exponent by " + format(this.base())+" (based on cases and infectivity) and gives free levels to all previous buyables\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" severity\n\
                Effect: ^" + format(tmp[this.layer].buyables[this.id].effect)+"\n\
                Amount: " + formatWhole(getBuyableAmount("s", 33)) + extra
            },
            unlocked() { return player["s"].buyables[32].gte(1) }, 
            canAfford() {
                    return player.s.severity.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.s.severity
                let target = Decimal.log10(s.div("e388e4")).div(Decimal.log10(this.scalebase())).pow(Decimal.pow(2.2,-1))
                target = target.ceil()
                let cost = Decimal.pow(this.scalebase(), target.sub(1).pow(2.2)).mul("e388e4")
                let diff = target.sub(player.s.buyables[33])
                if (this.canAfford()) {
                    if (!hasMilestone("d", 4)) player.s.severity = player.s.severity.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.s.buyables[33] = player.s.buyables[33].add(diff)
                }
            },
        },
    },
    upgrades: {
        rows: 5,
        cols: 5,
        11: {
            title: "Cough",
            description: "Severity boosts uncoaters 1st effect base.",
            cost: new Decimal("5e3"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
            let s11 = player.s.severity.add(10)
            s11 = Decimal.log10(s11)
            s11 = s11.pow(2).add(10)
            if (inChallenge("s", 11) || inChallenge("s", 21)) s11 = new Decimal(1)
            return s11
            },
            effectDisplay(){
            return format(getSUpgEff(11))+"x"
            },
        },
        12: {
            title: "Fever",
            description: "Uncoaters 2nd effect is boosted by bought symptom upgrades.",
            cost: new Decimal(2),
            effect(){
            let s12 = player.s.upgrades.length
            if (hasDUpg(34)) s12 += player.d.upgrades.length*2
            s12 = Decimal.div(s12, 2.85).pow(0.3)
            s12 = s12.mul(1.5).add(0.7)
            if (inChallenge("s", 21)) s12 = new Decimal(1)
            return s12
            },
            effectDisplay(){
            return format(getSUpgEff(12))+"x"
            },
            unlocked(){
            return hasSUpg(11)
            }
        },
        13: {
            title: "Tiredness",
            description: "Symptoms boost uncoaters 1st effect base.",
            cost: new Decimal("3e7"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
            let s13 = player.s.points.add(1)
            s13 = s13.pow(3.75)
            if (inChallenge("s", 11) || inChallenge("s", 21)) s13 = new Decimal(1)
            return s13
            },
            effectDisplay(){
            return format(getSUpgEff(13))+"x"
            },
            unlocked(){
                return hasSUpg(12)
            }
        },
        14: {
            title: "Pain",
            description: "Infectivity boost severity gain.",
            cost: new Decimal("77777777"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
            let s14 = player.i.points.add(1)
            s14 = s14.pow(new Decimal("3e-4"))
            if (s14.gte(new Decimal("e5000"))) s14 = s14.div("e5000").pow(0.1).mul("e5000")
            if (inChallenge("s", 21)) s14 = new Decimal(1)
            return s14
            },
            effectDisplay(){
                let dis = format(getSUpgEff(14))+"x"
                if (this.effect().gte(new Decimal("e5000"))) dis += " (softcapped)"
                return dis
            },
            unlocked(){
                return hasSUpg(13)
            }
        },
        15: {
            title: "Sore Throat",
            description: "Severity boosts replicators 1st effect base.",
            cost: new Decimal("1.5e12"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
            let s15 = player.s.severity.add(1)
            s15 = s15.pow(0.3)
            if (inChallenge("s", 11) || inChallenge("s", 21)) s15 = new Decimal(1)
            return s15
            },
            effectDisplay(){
            return format(getSUpgEff(15))+"x"
            },
            unlocked(){
                return hasSUpg(14)
            }
        },
        21: {
            title: "Chills",
            description: "'Fever' boosts severity effect.",
            cost: new Decimal("1e15"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
            let s21 = getSUpgEff(12)
            s21 = s21.pow(2).add(1.8)
            if (inChallenge("s", 21)) s21 = new Decimal(1)
            return s21
            },
            effectDisplay(){
            return "^"+format(getSUpgEff(21))
            },
            unlocked(){
                return hasSUpg(15)
            }
        },
        22: {
            title: "Headache",
            description: "'Infectivity Gain' gives free levels to 'Severity Gain'.",
            cost: new Decimal("2.22e22"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            unlocked(){
                return hasSUpg(21)
            }
        },
        23: {
            title: "Diarrhea",
            description: "'Symptom Base' gives free levels to 'Severity Gain'.",
            cost: new Decimal("5e38"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            unlocked(){
                return hasSUpg(22)
            }
        },
        24: {
            title: "Conjunctivitis",
            description: "Symptoms boost 'Infection' base.",
            cost: new Decimal("7"),
            effect(){
            let s24 = player.s.points
            s24 = Decimal.pow(1e4,s24)
            if (inChallenge("s", 11) || inChallenge("s", 21)) s24 = new Decimal(1)
            return s24
            },
            effectDisplay(){
            return format(getSUpgEff(24))+"x"
            },
            unlocked(){
                return hasSUpg(23)
            }
        },
        25: {
            title: "Taste Loss",
            description: "'Uncoater Base' gives free levels to 'Infectivity Gain'.",
            cost: new Decimal("5e58"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            unlocked(){
                return hasSUpg(24)
            }
        },
        31: {
            title: "Smell Loss",
            description: "'Uncoater Base' gives free levels to 'Symptom Base' and autobuy buyables once per second.",
            cost: new Decimal("1e63"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            unlocked(){
                return hasSUpg(25)
            }
        },
        32: {
            title: "Skin Rash",
            description: "Replicators boost severity gain.",
            cost: new Decimal("5e164"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.r.points
                s32 = Decimal.pow(1.02, s32)
                if (inChallenge("s", 21)) s32 = new Decimal(1)
                return s32
            },
            effectDisplay(){
                return format(getSUpgEff(32))+"x"
            },
            unlocked(){
                return hasSUpg(31)
            }
        },
        33: {
            title: "Discoloration",
            description: "'Severity Gain' base is increased by 0.0002 per level.",
            cost: new Decimal("15e271"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = layers.s.buyables[11].total().div(5e3)
                if (hasChallenge("s", 21)) s32 = s32.mul(challengeEffect("s", 21))
                if (inChallenge("s", 21)) s32 = new Decimal(1)
                return s32
            },
            effectDisplay(){
                return "+"+format(getSUpgEff(33))
            },
            unlocked(){
                return hasSUpg(32)
            }
        },
        34: {
            title: "Shortness of Breath",
            description: "'Coated Boost' gives free 'Infectivity gain'.",
            cost: new Decimal("e54490"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            unlocked(){
                return hasDUpg(34)
            }
        },
        35: {
            title: "Chest Pain",
            description: "Cases boost symptom base.",
            cost: new Decimal("e60100"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.points.add(10)
                s32 = s32.log10().pow(5)
                if (inChallenge("s", 21)) s32 = new Decimal(1)
                return s32
            },
            effectDisplay(){
                return format(getSUpgEff(35))+"x"
            },
            unlocked(){
                return hasSUpg(34)
            }
        },
        41: {
            title: "Speech Loss",
            description: "Deaths reduce 'Coated Boost' scaling base.",
            cost: new Decimal("e70000"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.d.points.add(10)
                s32 = s32.log10().pow(1.2)
                if (inChallenge("s", 21)) s32 = new Decimal(1)
                return s32.min(7e4)
            },
            effectDisplay(){
                return format(getSUpgEff(41))+"x"
            },
            unlocked(){
                return hasSUpg(35)
            }
        },
        42: {
            title: "Movement Loss",
            description: "Severity reduces 'Uncoater Base' scaling base.",
            cost: new Decimal("e87700"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.s.severity.add(10)
                s32 = s32.log10().pow(0.27)
                if (inChallenge("s", 21)) s32 = new Decimal(1)
                return s32.min(1e3)
            },
            effectDisplay(){
                return format(getSUpgEff(42))+"x"
            },
            unlocked(){
                return hasSUpg(41)
            }
        },
        43: {
            title: "Pneumonia",
            description: "Cases reduce 'Infection Base' scaling base.",
            cost: new Decimal("e133420"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.points.add(10)
                s32 = s32.log10().add(10)
                s32 = s32.log10().pow(5).mul(3333)
                if (inChallenge("s", 21)) s32 = new Decimal(1)
                return s32.min(3e9)
            },
            effectDisplay(){
                return format(getSUpgEff(43))+"x"
            },
            unlocked(){
                return hasSUpg(42)
            }
        },
        44: {
            title: "Fatigue",
            description: "'Infection Base' gives free 'Coated Boost' and 'Uncoater Base'.",
            cost: new Decimal("e146060"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            unlocked(){
                return hasSUpg(43)
            }
        },
        45: {
            title: "Congestion",
            description: "Each 'Infection Base' adds 0.0001 to 'Symptom Base' base.",
            cost: new Decimal("e191185"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = layers.s.buyables[23].total().div(1e4)
                return s32
            },
            effectDisplay(){
                return "+"+format(getSUpgEff(45))
            },
            unlocked(){
                return hasSUpg(44)
            }
        },
        51: {
            title: "Muscle Aches",
            description: "Cases boost severity effect.",
            cost: new Decimal("e215350"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.points.add(10)
                s32 = s32.log10().add(1).log10()
                return s32
            },
            effectDisplay(){
                return "^"+format(getSUpgEff(51))
            },
            unlocked(){
                return hasSUpg(45)
            }
        },
        52: {
            title: "Nausea",
            description: "Infectivity boosts 'Deadly'.",
            cost: new Decimal("e225315"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.i.points.add(10)
                s32 = s32.log10().pow(0.23)
                return s32
            },
            effectDisplay(){
                return "^"+format(getSUpgEff(52))
            },
            unlocked(){
                return hasSUpg(51)
            }
        },
        53: {
            title: "Asthma",
            description() {
                let des =  "Uncoaters reduce recovery effect exponent."
                if (hasDUpg(42)) des =  "Uncoaters boost severity gain exponent."
                return des
            },
            cost: new Decimal("e301777"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.u.points.add(10)
                s32 = s32.log10().pow(-0.1)
                if (hasDUpg(42)) s32 = s32.pow(-1)
                return s32
            },
            effectDisplay(){
                return "^"+format(getSUpgEff(53))
            },
            unlocked(){
                return hasSUpg(52)
            }
        },
        54: {
            title: "Cancer",
            description() {
                let des =  "Replicators reduce recovery effect exponent."
                if (hasDUpg(42)) des =  "Replicators boost severity gain exponent."
                return des
            },
            cost: new Decimal("e435630"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.r.points.add(10)
                s32 = s32.log10().pow(-0.05)
                if (hasDUpg(42)) s32 = s32.pow(-1)
                return s32
            },
            effectDisplay(){
                return "^"+format(getSUpgEff(54))
            },
            unlocked(){
                return hasSUpg(53)
            }
        },
        55: {
            title: "Heart Failure",
            description: "Severity boosts 'Transmission', 'Smell Loss' buys 25x more, and unlock a row of death upgrades.",
            cost: new Decimal("e545766"),
            currencyDisplayName: "severity",
            currencyInternalName: "severity",
            currencyLayer: "s",
            effect(){
                let s32 = player.s.severity.add(10)
                s32 = s32.log10().pow(0.12)
                return s32
            },
            effectDisplay(){
                return "^"+format(getSUpgEff(55))
            },
            unlocked(){
                return hasSUpg(54)
            }
        },
    },
    challenges: { // Order: 1x1,2x1,1x2,3x1,2x2,1x3,4x1,1x4,2x3,3x2,4x2,3x3,2x4,1x5,4x3,3x4,4x4,2x5,3x5,4x5
        rows: 2,
        cols: 2,
        11: {
            name: "Asymptomatic",
            currencyDisplayName: "cases",
            challengeDescription: function() {
                let c11 = "Symptoms and severity are useless. Cases gain is ^0.1."
                if (inChallenge("s", 11)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("s", 11) == 5) c11 = c11 + " (Completed)"
                c11 = c11 + "<br>Completed:" + challengeCompletions("s",11) + "/" + this.completionLimit
                return c11
            },
            goal(){
                if (challengeCompletions("s", 11) == 0) return new Decimal("e78000");
                if (challengeCompletions("s", 11) == 1) return new Decimal("e107500");
                if (challengeCompletions("s", 11) == 2) return new Decimal("e285000");
                if (challengeCompletions("s", 11) == 3) return new Decimal("e3e6");
                if (challengeCompletions("s", 11) == 4) return new Decimal("e8.93e6");
            },
            onStart(testInput=false) { 
                if (testInput) {
                    doReset("i")
                    player.v.upgrades = []
                    player.s.ct = 0
                    player.i.points = new Decimal(0)
                    player.r.points = new Decimal(0)
                    player.v.points = new Decimal(0)
                    player.points = new Decimal(0)
                }
            },
            completionLimit: 5,
            rewardDescription: "Cases boost severity gain.",
            rewardEffect() {
                 let c11 = player.points.add(1)
                 let c11r = new Decimal(0.38)
                 let c11c = challengeCompletions("s", 11)
                 c11r = Decimal.add(c11r, Decimal.div(c11c, 50))
                 let c11r2 = new Decimal(0.3)
                 if (c11c >= 4) c11r2 = Decimal.sub(0.6, Decimal.div(c11c, 11))
                 if (c11c == 5) c11r = c11r.add(0.007)
                 c11 = Decimal.pow(10, Decimal.log10(c11).pow(c11r)).pow(c11r2)
                 return c11
            },
            rewardDisplay() {return format(this.rewardEffect())+"x"},
            unlocked(){
                return hasMilestone("d", 8)
            }
        },
        12: {
            name: "Unbuyable",
            currencyDisplayName: "cases",
            challengeDescription: function() {
                let c12 = "Symptom buyables are useless. Cases gain is ^0.01."
                if (inChallenge("s", 12)) c12 = c12 + " (In Challenge)"
                if (challengeCompletions("s", 12) == 5) c12 = c12 + " (Completed)"
                c12 = c12 + "<br>Completed:" + challengeCompletions("s",12) + "/" + this.completionLimit
                return c12
            },
            goal(){
                if (challengeCompletions("s", 12) == 0) return new Decimal("e5640");
                if (challengeCompletions("s", 12) == 1) return new Decimal("e13600");
                if (challengeCompletions("s", 12) == 2) return new Decimal("e86400");
                if (challengeCompletions("s", 12) == 3) return new Decimal("e154000");
                if (challengeCompletions("s", 12) == 4) return new Decimal("e327000");
            },
            onStart(testInput=false) { 
                if (testInput) {
                    doReset("i")
                    player.v.upgrades = []
                    player.s.ct = 0
                    player.i.points = new Decimal(0)
                    player.r.points = new Decimal(0)
                    player.v.points = new Decimal(0)
                    player.points = new Decimal(0)
                }
            },
            completionLimit: 5,
            rewardDescription: "Infectivity boosts death gain.",
            rewardEffect() {
                 let c12 = player.points.add(1)
                 let c12r = new Decimal(0.33)
                 let c12c = challengeCompletions("s", 12)
                 c12r = Decimal.add(c12r, Decimal.div(c12c, 5))
                 c12 = Decimal.log10(c12).pow(c12r).div(100).max(1)
                 return c12
            },
            rewardDisplay() {return format(this.rewardEffect())+"x"},
            unlocked(){
                return hasChallenge("s", 11)
            }
        },
        21: {
            name: "Row 3 Downgrade",
            currencyDisplayName: "cases",
            challengeDescription: function() {
                let c12 = "Row 3 Upgrades are useless. Cases gain is ^0.03."
                if (inChallenge("s", 21)) c12 = c12 + " (In Challenge)"
                if (challengeCompletions("s", 21) == 5) c12 = c12 + " (Completed)"
                c12 = c12 + "<br>Completed:" + challengeCompletions("s",21) + "/" + this.completionLimit
                return c12
            },
            goal(){
                if (challengeCompletions("s", 21) == 0) return new Decimal("e4660");
                if (challengeCompletions("s", 21) == 1) return new Decimal("e34100");
                if (challengeCompletions("s", 21) == 2) return new Decimal("e44640");
                if (challengeCompletions("s", 21) == 3) return new Decimal("e64500");
                if (challengeCompletions("s", 21) == 4) return new Decimal("e89100");
            },
            onStart(testInput=false) { 
                if (testInput) {
                    doReset("i")
                    player.v.upgrades = []
                    player.s.ct = 0
                    player.i.points = new Decimal(0)
                    player.r.points = new Decimal(0)
                    player.v.points = new Decimal(0)
                    player.points = new Decimal(0)
                }
            },
            completionLimit: 5,
            rewardDescription: "Deaths boost 'Discoloration'.",
            rewardEffect() {
                 let c12 = player.d.points.add(10)
                 let c12r = new Decimal(0.07)
                 let c12c = challengeCompletions("s", 21)
                 c12r = Decimal.add(c12r, Decimal.div(c12c, 15))
                 c12 = Decimal.log10(c12).pow(c12r)
                 return c12
            },
            rewardDisplay() {return format(this.rewardEffect())+"x"},
            unlocked(){
                return hasChallenge("s", 12)
            }
        },
        22: {
            name: "Symptomless Symptoms",
            currencyDisplayName: "cases",
            challengeDescription: function() {
                let c12 = "'Asymptomatic' and 'Unbuyable' at once."
                if (inChallenge("s", 22)) c12 = c12 + " (In Challenge)"
                if (challengeCompletions("s", 22) == 5) c12 = c12 + " (Completed)"
                c12 = c12 + "<br>Completed:" + challengeCompletions("s",22) + "/" + this.completionLimit
                return c12
            },
            goal(){
                if (challengeCompletions("s", 22) == 0) return new Decimal("e1020");
                if (challengeCompletions("s", 22) == 1) return new Decimal("e2170");
                if (challengeCompletions("s", 22) == 2) return new Decimal("e4720");
                if (challengeCompletions("s", 22) == 3) return new Decimal("e5850");
                if (challengeCompletions("s", 22) == 4) return new Decimal("e12715");
            },
            onStart(testInput=false) { 
                if (testInput) {
                    doReset("i")
                    player.v.upgrades = []
                    player.s.ct = 0
                    player.i.points = new Decimal(0)
                    player.r.points = new Decimal(0)
                    player.v.points = new Decimal(0)
                    player.points = new Decimal(0)
                }
            },
            countsAs: [11,12],
            completionLimit: 5,
            rewardDescription() {
                let des =  "Severity reduces the recovery effect."
                if (hasDUpg(42)) des =  "Severity boosts severity gain."
                return des
            },
            rewardEffect() {
                 let c12 = player.s.severity.add(10)
                 let c12r = new Decimal(0.02)
                 let c12c = challengeCompletions("s", 22)
                 c12r = Decimal.add(c12r, Decimal.div(c12c, 200))
                 c12 = Decimal.log10(c12).pow(-c12r)
                 if (hasDUpg(42)) c12 = c12.pow(-1)
                 return c12
            },
            rewardDisplay() {return "^"+format(this.rewardEffect())},
            unlocked(){
                return hasChallenge("s", 21)
            }
        },
    },
})
addLayer("d", {
    name: "deaths",
    symbol: "D",
    position: 2,
    startData() { return {
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        auto: false,
        autob: false,
        autos: false,
        unlocked: false,
        time: new Decimal(0)
    }},
    color: "#ff1234",
    requires: new Decimal("1.8e308"),
    resource: "deaths",
    baseResource: "severity",
    baseAmount() { return player.s.severity },
    type: "normal",
    exponent: new Decimal(0.0035),
    branches: ["i","r","s"],
    row: 2,
    hotkeys: [
        {
            key:"d", description: "D:Reset for deaths", onPress() {
                if (canReset(this.layer) && !hasMilestone("d",10))
                    doReset(this.layer)
            }
        },
    ],
    bulk() {
        let bulk = new Decimal(100)
        if (hasAchievement("a", 53)) bulk = bulk.mul(5)
        if (hasMilestone("f", 8)) bulk = bulk.mul(100)
        if (hasFUpg(73)) bulk = bulk.mul(1000)
        if (hasFUpg(123)) bulk = bulk.pow(2)
        return bulk
    },
    speed() {
        let speed = 1
        if (hasAchievement("a", 53)) speed *=2
        if (hasFUpg(73)) speed *=2
        return speed
    },
    update(diff) {
        if (hasMilestone("d", 10) && !inChallenge("f",31)) generatePoints("d", diff/100);
        let t = diff*this.speed()
            player.d.time = Decimal.add(player.d.time, t)
            if (player.d.time.gte(1)) {
                let times = Decimal.floor(player.d.time).mul(-1)
                player.d.time = Decimal.add(player.d.time, times)
                times = times.mul(-1)
                if (hasUpgrade("f", 25)) {
                    layers.d.buyables[11].buyMax(times.mul(this.bulk()))
                    layers.d.buyables[12].buyMax(times.mul(this.bulk()))
                    layers.d.buyables[13].buyMax(times.mul(this.bulk()))
                }
            };
    },
    layerShown() {
        let shown = hasSUpg(33)
        if(player.d.unlocked) shown = true
        return shown
    },
    effect() {
        let eff = player.d.best.add(1)
        eff = eff.pow(5)
        return eff
    },
    effectDescription() {
        return "which boost cases, VP, infectivity, and severity gain by "+layerText("h2", "d", format(this.effect())) + " (based on best)."
    },
    gainMult() {
        let mult = new Decimal(1)
        if (hasDUpg(12)) mult = mult.mul(getDUpgEff(12))
        if (hasDUpg(22)) mult = mult.mul(getDUpgEff(22))
        if (hasDUpg(24)) mult = mult.mul(getDUpgEff(24))
        if (hasFUpg(23)) mult = mult.mul(getFUpgEff(23))
        if (hasFUpg(45)) mult = mult.mul(getFUpgEff(45))
        if (hasAchievement("a", 43)) mult = mult.mul(2)
        if (hasAchievement("a", 44)) mult = mult.mul(2)
        mult = mult.mul(layers.f.effect2())
        if (hasAchievement("a", 52)) mult = mult.mul(layers.a.effect())
        mult = mult.mul(layers.d.buyables[12].effect())
        if (hasChallenge("s", 12)) mult = mult.mul(challengeEffect("s", 12))
        return mult
    },
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("f", 3)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    doReset(resettingLayer){
        if (resettingLayer == "d") {
        player.u.points = new Decimal(0)
        player.u.best = new Decimal(0)
        player.u.total = new Decimal(0)
        player.s.points = new Decimal(0)
        player.s.severity = new Decimal(0)
        player.s.recoveries = new Decimal(0)
        player.s.buyables[11] = new Decimal(0)
        player.s.buyables[12] = new Decimal(0)
        player.s.buyables[13] = new Decimal(0)
        player.s.buyables[21] = new Decimal(0)
        player.s.buyables[22] = new Decimal(0)
        player.s.buyables[23] = new Decimal(0)
        if (!hasMilestone("d", 3)) player.u.challenges[11] = 0
        if (!hasMilestone("d", 3)) player.u.challenges[12] = 0
        if (!hasMilestone("d", 3)) player.u.challenges[21] = 0
        if (!hasMilestone("d", 3)) player.u.challenges[22] = 0
        if (!hasMilestone("d", 6) && !hasMilestone("a", 0)) player.u.upgrades = []
        if (!hasMilestone("d", 6)) player.s.upgrades = []
        if (!hasMilestone("d", 0) && !hasMilestone("a", 0)) player.u.milestones = []
        if (!hasMilestone("d", 0)) player.s.milestones = []
        }
        if (resettingLayer == "f") {
            player.d.buyables[11] = new Decimal(0)
            player.d.buyables[12] = new Decimal(0)
            player.d.buyables[13] = new Decimal(0)
            if (hasMilestone("f", 0)) {
                player.u.auto = true
                player.d.milestones = [0,1,2,3,4,5]
                player.s.milestones = [0,1,2,3]
                if (hasMilestone("f", 3)) player.d.upgrades = [11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44]
                if (hasMilestone("f", 1)) player.d.milestones = [0,1,2,3,4,5,6,7,8,9,10]
                player.u.challenges[11] = 3
                player.u.challenges[12] = 3
                player.u.challenges[21] = 3
                player.u.challenges[22] = 3
                if (hasMilestone("f", 4)) {
                player.s.challenges[11] = 5
                player.s.challenges[12] = 5
                player.s.challenges[21] = 5
                player.s.challenges[22] = 5
                }
            }
        }
    },
    tabFormat: {
        "Milestones": {
            content: [
            "main-display",
            function() {if (!hasMilestone("d", 10)) return "prestige-button"},
            ["raw-html", function() {if (hasMilestone("d",10)) return "You are gaining " + layerText("h2", "d", format(getResetGain("d").div(100))) + " deaths per second"}],
            "resource-display",
            "blank",
            ["display-text",
            "Deaths reset all previous progress.",
            ],
            "milestones"
            ]
        },
        "Upgrades": {
            content: [
                "main-display",
                function() {if (!hasMilestone("d", 10)) return "prestige-button"},
                ["raw-html", function() {if (hasMilestone("d",10)) return "You are gaining " + layerText("h2", "d", format(getResetGain("d").div(100))) + " deaths per second"}],
                "resource-display",
                "blank",
                ["display-text",
                "Deaths reset all previous progress.",
                ],
                "upgrades",
            ],
            unlocked() { return hasMilestone("d", 2) }
        },
        "Buyables": {
            content: [
                "main-display",
                function() {if (!hasMilestone("d", 10)) return "prestige-button"},
                ["raw-html", function() {if (hasMilestone("d",10)) return "You are gaining " + layerText("h2", "d", format(getResetGain("d").div(100))) + " deaths per second"}],
                "resource-display",
                "blank",
                ["display-text",
                "Buyables give free levels to the previous layer buyable.",
                ],
                "buyables",
            ],
            unlocked() { return hasMilestone("f", 5) }
        }
    },
    milestones: {
        0: {
            requirementDescription: "1 total death",
            effectDescription: "Keep uncoater/symptom milestones on reset.",
            done() { return player.d.total.gte(1) }
        },
        1: {
            requirementDescription: "2 total deaths",
            effectDescription: "You can buy max uncoaters.",
            done() { return player.d.total.gte(2) }
        },
        2: {
            requirementDescription: "3 total deaths",
            effectDescription: "Autobuy uncoaters and unlock upgrades.",
            toggles:[["d", "auto"]],
            done() { return player.d.total.gte(3) }
        },
        3: {
            requirementDescription: "4 total deaths",
            effectDescription: "Keep uncoater challenge completions.",
            done() { return player.d.total.gte(4) }
        },
        4: {
            requirementDescription: "6 total deaths",
            effectDescription: "'Smell Loss' buys 10x more and buyables cost nothing.",
            done() { return player.d.total.gte(6) }
        },
        5: {
            requirementDescription: "24 total deaths",
            effectDescription: "Uncoaters reset nothing.",
            done() { return player.d.total.gte(24) }
        },
        6: {
            requirementDescription: "48 total deaths",
            effectDescription: "Keep previous upgrades on reset.",
            done() { return player.d.total.gte(48) }
        },
        7: {
            requirementDescription: "96 total deaths",
            effectDescription: "Autobuy symptoms.",
            toggles:[["d", "autos"]],
            done() { return player.d.total.gte(96) }
        },
        8: {
            requirementDescription: "1,048,576 total deaths",
            effectDescription: "Unlock symptom challenges.",
            done() { return player.d.total.gte(1048576) }
        },
        9: {
            requirementDescription() {
                return format(Decimal.pow(2, 32)) + " total deaths"
            },
            effectDescription: "Symptoms reset nothing and 'Smell Loss' buys 2x often.",
            done() { return player.d.total.gte(Decimal.pow(2, 32)) }
        },
        10: {
            requirementDescription: "1.798e308 total deaths",
            effectDescription: "Gain 1% of death gain per second and disable prestige.",
            unlocked() {
                return hasDUpg(34) || player.f.unlocked
            },
            done() { return player.d.total.gte(Decimal.pow(2,1024))}
        },
    },
    buyables: {
		rows: 3,
        cols: 3,
        11: {
            title: "Severity Gain",
            scalebase() {
                return new Decimal(3)
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(this.scalebase(), x.pow(1.5)).mul("e16000")
                return cost.floor()
            },
            base() { 
                let base = player.d.points.add(10)
                base = base.log10().pow(100)
                return base
            },
            extra() {
                let extra = new Decimal(0)
                return extra
            },
            total() {
                let total = getBuyableAmount("d", 11).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.total()
                let base = this.base()
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                return "Multiply severity gain by "+format(this.base())+" after softcap (based on deaths).\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" deaths\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("d", 11)) + extra
            },
            unlocked() { return hasMilestone("f", 5) }, 
            canAfford() {
                    return player.d.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",6)) player.d.points = player.d.points.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.d.points
                let target = Decimal.log10(s.div("e16000")).div(Decimal.log10(this.scalebase())).pow(2/3)
                target = target.ceil()
                let cost = Decimal.pow(this.scalebase(), target.sub(1).pow(1.5)).mul("e16000")
                let diff = target.sub(player.d.buyables[11])
                if (this.canAfford()) {
                    if (!hasMilestone("f",6)) player.d.points = player.d.points.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.d.buyables[11] = player.d.buyables[11].add(diff)
                }
            },
        },
        12: {
            title: "Death Gain",
            scalebase() {
                return new Decimal(10)
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(this.scalebase(), x.pow(1.5)).mul("e17000")
                return cost.floor()
            },
            base() { 
                let base = player.f.points.add(10)
                base = base.log10().pow(3)
                return base
            },
            extra() {
                let extra = new Decimal(0)
                return extra
            },
            total() {
                let total = getBuyableAmount("d", 12).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.total()
                let base = this.base()
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                return "Multiply death gain by "+format(this.base())+" (based on fatality).\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" deaths\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(getBuyableAmount("d", 12)) + extra
            },
            unlocked() { return player.d.buyables[11].gte(1) }, 
            canAfford() {
                    return player.d.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",6)) player.d.points = player.d.points.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.d.points
                let target = Decimal.log10(s.div("e17000")).div(Decimal.log10(this.scalebase())).pow(2/3)
                target = target.ceil()
                let cost = Decimal.pow(this.scalebase(), target.sub(1).pow(1.5)).mul("e17000")
                let diff = target.sub(player.d.buyables[12])
                if (this.canAfford()) {
                    if (!hasMilestone("f",6)) player.d.points = player.d.points.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.d.buyables[12] = player.d.buyables[12].add(diff)
                }
            },
        },
        13: {
            title: "Cases Boost",
            scalebase() {
                return new Decimal(1.007)
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(10, Decimal.pow(this.scalebase(),x).mul(1000)).mul("e17000")
                return cost.floor()
            },
            base() { 
                let base = player.points.add(10)
                base = base.log10().add(10)
                base = base.log10().add(10)
                base = base.log10().pow(0.004)
                return base.min(1.003)
            },
            extra() {
                let extra = new Decimal(0)
                if (hasFUpg(71)) extra = extra.add(getBuyableAmount("f",24).mul(2))
                if (hasFUpg(123)) extra = extra.add(getFUpgEff(123))
                return extra
            },
            total() {
                let total = getBuyableAmount("d", 13).add(this.extra())
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.total()
                let base = this.base()
                let eff = Decimal.pow(base, x)
                if (x.gte(2500)) eff = Decimal.pow(base, x.mul(2500).pow(0.5))
                return eff;
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                let eff = format(tmp[this.layer].buyables[this.id].effect)
                if (this.total().gte(2500)) eff += " (softcapped)"
                if (hasFUpg(71)) extra = "+" + formatWhole(this.extra())
                return "Raise cases gain to "+format(this.base())+" (based on cases).\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" deaths\n\
                Effect: ^" + eff +"\n\
                Amount: " + formatWhole(getBuyableAmount("d", 13)) + extra
            },
            unlocked() { return player.d.buyables[12].gte(1) }, 
            canAfford() {
                    return player.d.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",6)) player.d.points = player.d.points.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(max) {
                let s = player.d.points // log1.003(log10(cost/e17k)/1k)=x
                let target = Decimal.log10(s.div("e17000").log10().div(1000)).div(Decimal.log10(this.scalebase()))
                target = target.ceil()
                let cost = Decimal.pow(10, Decimal.pow(this.scalebase(),target).mul(1000)).mul("e17000")
                let diff = target.sub(player.d.buyables[13])
                if (this.canAfford()) {
                    if (!hasMilestone("f",6)) player.d.points = player.d.points.sub(cost).max(0)
                    if (diff.gt(max)) diff = max
                    player.d.buyables[13] = player.d.buyables[13].add(diff)
                }
            },
        },
    },
    canReset() { return !hasMilestone("d", 10) },
    upgrades: {
        rows: 4,
        cols: 4,
        11: {
            title: "Deadly",
            description: "Deaths boosts symptom base.",
            cost: new Decimal(2),
            effect(){
            let d11 = player.d.points.add(10)
            d11 = Decimal.log10(d11).pow(4.5).add(1)
            if (hasSUpg(52)) d11 = d11.pow(getSUpgEff(52))
            if (inChallenge("s", 21)) d11 = new Decimal(1)
            return d11
            },
            effectDisplay(){
            return format(getDUpgEff(11))+"x"
            },
            unlocked() {
                return hasMilestone("d", 2)
            }
        },
        12: {
            title: "Fatal",
            description: "Cases boost death gain.",
            cost: new Decimal(5),
            effect(){
            let d12 = player.points.add(1)
            d12 = Decimal.log10(d12).pow(0.1).add(1)
            if (hasDUpg(33)) d12 = d12.pow(getDUpgEff(33))
            if (hasFUpg(31)) d12 = d12.pow(getFUpgEff(31))
            if (inChallenge("s", 21)) d12 = new Decimal(1)
            return d12
            },
            effectDisplay(){
            return format(getDUpgEff(12))+"x"
            },
            unlocked() {
                return hasDUpg(11)
            }
        },
        13: {
            title: "Lethal",
            description: "Deaths boost 'Infectivity Gain' base.",
            cost: new Decimal(20),
            effect(){
            let d12 = player.d.points.add(1)
            d12 = d12.pow(20)
            if (inChallenge("s", 21)) d12 = new Decimal(1)
            return d12
            },
            effectDisplay(){
            return format(getDUpgEff(13))+"x"
            },
            unlocked() {
                return hasDUpg(12)
            }
        },
        14: {
            title: "Blood Transmission",
            description: "Deaths boost 'Transmission'.",
            cost: new Decimal(30),
            effect(){
            let d14 = player.d.points.add(10)
            d14 = Decimal.log10(d14).add(10)
            d14 = Decimal.log10(d14).pow(4)
            if (d14.gte(10)) d14 = d14.div(10).pow(0.3).mul(10)
            if (inChallenge("s", 21)) d14 = new Decimal(1)
            return d14
            },
            effectDisplay(){
                let dis = "^"+format(getDUpgEff(14))
                if (this.effect().gte(10)) dis += " (softcapped)"
                return dis
            },
            unlocked() {
                return hasDUpg(13)
            }
        },
        21: {
            title: "Dangerous",
            description: "Deaths boost uncoater base.",
            cost: new Decimal(75),
            effect(){
            let d12 = player.d.points.add(1)
            d12 = d12.pow(30)
            if (inChallenge("s", 21)) d12 = new Decimal(1)
            return d12
            },
            effectDisplay(){
            return format(getDUpgEff(21))+"x"
            },
            unlocked() {
                return hasDUpg(14)
            }
        },
        22: {
            title: "Mortal",
            description: "Double death gain per death upgrade bought.",
            cost: new Decimal(150),
            effect(){
            let d22 = player.d.upgrades.length
            d22 = Decimal.pow(2, d22)
            if (inChallenge("s", 21)) d22 = new Decimal(1)
            return d22
            },
            effectDisplay(){
            return format(getDUpgEff(22))+"x"
            },
            unlocked() {
                return hasDUpg(21)
            }
        },
        23: {
            title: "Kill",
            description: "'Smell Loss' buys 2x more.",
            cost: new Decimal(3e5),
            unlocked() {
                return hasDUpg(22)
            }
        },
        24: {
            title: "Dying",
            description: "Severity boosts death gain.",
            cost: new Decimal(1e8),
            effect(){
            let d24 = player.s.severity.add(10)
            d24 = Decimal.log10(d24).pow(0.5)
            if (inChallenge("s", 21)) d24 = new Decimal(1)
            return d24
            },
            effectDisplay(){
            return format(getDUpgEff(24))+"x"
            },
            unlocked() {
                return hasDUpg(23)
            }
        },
        31: {
            title: "Pass Away",
            description() {
                let des =  "Deaths reduce recovery effect."
                if (hasDUpg(42)) des =  "Deaths boost severity gain."
                return des
            },
            cost: new Decimal(5e13),
            effect(){
            let d24 = player.d.points.add(10)
            d24 = Decimal.log10(d24).pow(-0.12)
            if (hasDUpg(42)) d24 = d24.pow(-1)
            if (inChallenge("s", 21)) d24 = new Decimal(1)
            return d24
            },
            effectDisplay(){
            return "^"+format(getDUpgEff(31))
            },
            unlocked() {
                return hasDUpg(24)
            }
        },
        32: {
            title: "Perish",
            description() {
                let des =  "Cases reduce recovery effect "
                if (hasDUpg(42)) des =  "Cases boost severity gain"
                return des + " and 'Smell Loss' buys 5x more."
            },
            cost: new Decimal(2e27),
            effect(){
            let d24 = player.points.add(10)
            d24 = Decimal.log10(d24).pow(-0.018)
            if (hasDUpg(42)) d24 = d24.pow(-1)
            if (inChallenge("s", 21)) d24 = new Decimal(1)
            return d24
            },
            effectDisplay(){
            return "^"+format(getDUpgEff(32))
            },
            unlocked() {
                return hasDUpg(31)
            }
        },
        33: {
            title: "Expire",
            description: "VP boost 'Fatal' and 'Smell Loss' buys 2x more and 2x often.",
            cost: new Decimal(3e46),
            effect(){
            let d24 = player.v.points.add(10)
            d24 = Decimal.log10(d24).pow(0.1)
            if (inChallenge("s", 21)) d24 = new Decimal(1)
            return d24
            },
            effectDisplay(){
            return "^"+format(getDUpgEff(33))
            },
            unlocked() {
                return hasDUpg(32)
            }
        },
        34: {
            title: "Decease",
            description: "Bought death upgrades boost 'Fever' and unlock more symptom upgrades.",
            cost: new Decimal(4e165),
            unlocked() {
                return hasDUpg(33)
            }
        },
        41: {
            title: "Demise",
            description: "Deaths make symptom scaling start later.",
            cost: new Decimal("1.5e2089"),
            effect(){
            let d24 = player.d.points.add(10)
            d24 = Decimal.log10(d24).pow(0.3).sub(1)
            if (d24.gte(5000)) d24 = d24.div(5000).pow(0.5).mul(5000)
            if (inChallenge("s", 21)) d24 = new Decimal(1)
            return d24
            },
            effectDisplay(){
            return "+"+format(getDUpgEff(41))
            },
            unlocked() {
                return hasSUpg(55)
            }
        },
        42: {
            title: "Murder",
            description: "Stop gaining recoveries and upgrades that reduce recovery effect boost severity gain.",
            cost: new Decimal("5e2208"),
            unlocked() {
                return hasDUpg(41)
            }
        },
        43: {
            title: "Slain",
            description: "Deaths boost cases gain.",
            cost: new Decimal("1.5e9101"),
            effect(){
            let d24 = player.d.points.add(10)
            d24 = Decimal.log10(d24).pow(0.025)
            if (inChallenge("s", 21)) d24 = new Decimal(1)
            return d24
            },
            effectDisplay(){
            return "^"+format(getDUpgEff(43))
            },
            unlocked() {
                return hasDUpg(42)
            }
        },
        44: {
            title: "Slaughter",
            description: "Deaths boost severity gain exponent.",
            cost: new Decimal("8e9291"),
            effect(){
                let d24 = player.d.points.add(10)
                d24 = Decimal.log10(d24).pow(0.015)
                if (inChallenge("s", 21)) d24 = new Decimal(1)
                return d24
                },
                effectDisplay(){
                return "^"+format(getDUpgEff(44))
                },
            unlocked() {
                return hasDUpg(43)
            }
        },
    },
})
addLayer("stat", {
    name: "Statistics", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ST", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    tooltip() {
      return "Statistics"
    },
    color: "#FFFFFF",
    requires: new Decimal(0), // Can be a function that takes requirement increases into account
    resource: "points", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown() { return true },
    tabFormat: [
        "blank",
        ["display-text", function() {return "You have "+format(player.points)+" cases."}],
        "blank",
        ["display-text", function() {return "You have "+format(player.v.points)+" virus points."}],
        "blank",
        ["display-text", function() {if (player.i.unlocked) return "You have "+format(player.i.points)+" infectivity."}],
        "blank",
        ["display-text", function() {if (player.r.unlocked) return "You have "+formatWhole(player.r.points)+" replicators."}],
        "blank",
        ["display-text", function() {if (player.u.unlocked) return "You have "+formatWhole(player.u.points)+" uncoaters."}],
        "blank",
        ["display-text", function() {if (player.s.unlocked) return "You have "+formatWhole(player.s.points)+" symptoms."}],
        "blank",
        ["display-text", function() {if (player.s.unlocked) return "You have "+format(player.s.severity)+" severity."}],
        "blank",
        ["display-text", function() {if (player.d.unlocked) return "You have "+format(player.d.points)+" deaths."}],
        "blank",
        ["display-text", function() {
              let base =  tmp["v"].upgrades[12].base
              return "'Infection' base:"+format(base)
            }],
        "blank",
        ["display-text", function() {
        let eff = tmp["r"].effbase
        if (player.r.unlocked) return "Replicator base:"+format(eff)
        }],
        "blank",
        ["display-text", function() {
        let ueff = tmp["u"].effbase
        if (player.u.unlocked) return "Uncoater base:"+format(ueff)
        }],
        "blank",
        ["display-text", function() {
        let seff = tmp["s"].effbase
        if (player.s.unlocked) return "Symptom base:"+format(seff)
        }],
        "blank",
        ["display-text", function() {if (hasSUpg(31) || player.d.unlocked) return "'Smell Loss' autobuy:"+formatWhole(tmp.s.bulk)+"/" + format(1/tmp.s.speed)+"s (" + format(Decimal.mul(tmp.s.bulk,tmp.s.speed)) + "/s)"}],
        "blank",
        ["display-text", function() {if (hasFUpg(25)) return "'More Fatal' autobuy:"+formatWhole(tmp.d.bulk)+"/" + format(1/tmp.d.speed)+"s (" + format(Decimal.mul(tmp.d.bulk,tmp.d.speed)) + "/s)"}],
        "blank",
        ["display-text", function() {if (hasMilestone("f",6)) return "Multiplier per Fatality Dimension:"+format(tmp.f.multpd)}],
        "blank",
        ["display-text", function() {if (player.f.total.gte("e1000")) return "Fatality Dimension Scaling:"+format(tmp.f.DimScaling)}],
        "blank",
        ["display-text", function() {if (player.f.total.gte("6.969e420")) return "Fatality Dimension Boost Scaling:"+format(tmp.f.buyables[32].scale)}],
        "blank",
        ["display-text", function() {if (player.f.buyables[33].gte(100)) return "Distant Multiplier Boost Scaling Start:"+format(tmp.f.buyables[33].distantStart)}],
    ],
})
addLayer("a", {
    name: "Achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    tooltip() {
      return "Achievements"
    },
    color: "#FFFF00",
    nodeStyle() {return {
        "background": "radial-gradient(#FFFF00, #d5ad83)" ,
    }},
    requires: new Decimal(0), // Can be a function that takes requirement increases into account
    resource: "Achievement Points", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown() { return true },
    achievements: {
        rows: 6,
        cols: 6,
        11: {
            name: "Start",
            tooltip: "Get 2 cases. Reward: 1 AP",
            done() {
                return player.points.gte(2)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        12: {
            name: "Infect",
            tooltip: "Get 10 cases. Reward: 1 AP",
            done() {
                return player.points.gte(10)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        13: {
            name: "Thousand Infected",
            tooltip: "Get 1,000 cases. Reward: 1 AP",
            done() {
                return player.points.gte(1000)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        14: {
            name: "Million Infected",
            tooltip: "Get 1,000,000 cases. Reward: 1 AP",
            done() {
                return player.points.gte(1e6)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        15: {
            name: "Covid 19",
            tooltip: "Get 63,154,455 cases. Reward: 1 AP",
            done() {
                return player.points.gte(63154455)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        16: {
            name: "World Infected",
            tooltip: "Get 7.8e9 cases. Reward: 1 AP",
            done() {
                return player.points.gte(7.8e9)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        21: {
            name: "Infected infections",
            tooltip: "Get 10 infectivity. Reward: 1 AP, AP boosts VP",
            done() {
                return player.i.points.gte(10)
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        22: {
            name: "Upgraded infections",
            tooltip: "Get 5 infectivity upgrades. Reward: 1 AP",
            done() {
                return player.i.upgrades.length>=5
            },
            onComplete() {
                addPoints("a",1)
            }
        },
        23: {
            name: "Replicated",
            tooltip: "Get 1 replicator. Reward: 2 AP",
            done() {
                return player.r.points.gte(1)
            },
            onComplete() {
                addPoints("a",2)
            }
        },
        24: {
            name: "Infected company",
            tooltip: "Get 1e100 cases. Reward: 2 AP",
            done() {
                return player.points.gte(1e100)
            },
            onComplete() {
                addPoints("a",2)
            }
        },
        25: {
            name: "Infinite infections",
            tooltip: "Get 1.798e308 cases. Reward: 2 AP",
            done() {
                return player.points.gte("1.798e308")
            },
            onComplete() {
                addPoints("a",2)
            }
        },
        26: {
            name: "SUS Upgrade",
            tooltip: "Get 7 infectivity upgrades. Reward: 2 AP",
            done() {
                return player.i.upgrades.length>=7
            },
            onComplete() {
                addPoints("a",2)
            }
        },
        31: {
            name: "Uncoated",
            tooltip: "Get 1 uncoater. Reward: 2 AP, AP boosts infectivity and keep virus upgrades",
            done() {
                return player.u.points.gte(1)
            },
            onComplete() {
                addPoints("a",2)
            }
        },
        32: {
            name: "(softcapped)",
            tooltip: "Get 2 uncoater upgrades. Reward: 2 AP",
            done() {
                return player.u.upgrades.length>=2
            },
            onComplete() {
                addPoints("a",2)
            }
        },
        33: {
            name: "(hardcapped)",
            tooltip: "Get 5 uncoater upgrades. Reward: 2 AP",
            done() {
                return player.u.upgrades.length>=5
            },
            onComplete() {
                addPoints("a",2)
            }
        },
        34: {
            name: "Challenging",
            tooltip: "Complete an uncoater challenge. Reward: 2 AP",
            done() {
                return challengeCompletions("u", 11)>=1
            },
            onComplete() {
                addPoints("a",2)
            }
        },
        35: {
            name: "Severe case",
            tooltip: "Get 1 severity. Reward: 3 AP",
            done() {
                return player.s.severity.gte(1)
            },
            onComplete() {
                addPoints("a",3)
            }
        },
        36: {
            name: "Auto",
            tooltip: "Get 11 symptom upgrades. Reward: 3 AP",
            done() {
                return player.s.upgrades.length>=11
            },
            onComplete() {
                addPoints("a",3)
            }
        },
        41: {
            name: "Dead",
            tooltip: "Get 1 death. Reward: 3 AP, Autobuy buyables, 'Smell Loss' buys 2x more and faster, AP boosts severity, Keep I/R upgrades",
            done() {
                return player.d.points.gte(1)
            },
            onComplete() {
                addPoints("a",3)
            }
        },
        42: {
            name: "Automated",
            tooltip: "Get 8 death milestones. Reward: 3 AP, AP formula is better",
            done() {
                return hasMilestone("d", 7)
            },
            onComplete() {
                addPoints("a",3)
            }
        },
        43: {
            name: "Corona Death",
            tooltip: "Get 1,466,925 deaths. Reward: 3 AP, Double death gain",
            done() {
                return player.d.points.gte(1466925)
            },
            onComplete() {
                addPoints("a",3)
            }
        },
        44: {
            name: "Coffin",
            tooltip: "Get 1e30 deaths. Reward: 3 AP, Double death gain",
            done() {
                return player.d.points.gte(1e10)
            },
            onComplete() {
                addPoints("a",3)
            }
        },
        45: {
            name: "Coffin Dance",
            tooltip: "Get 1e100 deaths. Reward: 4 AP",
            done() {
                return player.d.points.gte(1e100)
            },
            onComplete() {
                addPoints("a",4)
            }
        },
        46: {
            name: "Coughin Dance",
            tooltip: "Get 14 death upgrades. Reward: 4 AP",
            done() {
                return player.d.upgrades.length>=14
            },
            onComplete() {
                addPoints("a",4)
            }
        },
        51: {
            name: "Mortal Kombat",
            tooltip: "Get 1 fatality. Reward: 4 AP",
            done() {
                return player.f.points.gte(1)
            },
            onComplete() {
                addPoints("a",4)
            }
        },
        52: {
            name: "Kortal Mombat",
            tooltip: "Get 2 fatality upgrades. Reward: 4 AP, AP boosts death gain",
            done() {
                return player.f.upgrades.length>=2
            },
            onComplete() {
                addPoints("a",4)
            }
        },
        53: {
            name: "DIMENSIONS??",
            tooltip: "Get 6 fatality milestones. Reward: 4 AP, 'More Fatal' buys 5x more and 2x faster",
            done() {
                return player.f.milestones.length>=6
            },
            onComplete() {
                addPoints("a",4)
            }
        },
        54: {
            name: "NG+++ INFECTED",
            tooltip: "Get ee18 cases. Reward: 4 AP, Double Fatality Dimensions",
            done() {
                return player.points.gte("ee18")
            },
            onComplete() {
                addPoints("a",4)
            }
        },
        55: {
            name: "PPOOWWEERR!",
            tooltip: "Get 1e1000 fatality power. Reward: 4 AP",
            done() {
                return player.f.p.gte("ee3")
            },
            onComplete() {
                addPoints("a",4)
            }
        },
        56: {
            name: "The 9th Dimension is a lie",
            tooltip: "Get exactly 99 8th Dimensions. Reward: 5 AP",
            done() {
                return player.f.buyables[24].eq(99)
            },
            onComplete() {
                addPoints("a",5)
            }
        },
        61: {
            name: "Casual",
            tooltip: "Get 1 casualty. Reward: 5 AP",
            done() {
                return player.f.casualty.gte(1)
            },
            onComplete() {
                addPoints("a",5)
            }
        },
        62: {
            name: "Fatally Challenged",
            tooltip: "Complete 4 Fatality Challenges Reward: 5 AP",
            done() {
                return hasChallenge("f",11) && hasChallenge("f",12) && hasChallenge("f",21) && hasChallenge("f",22)
            },
            onComplete() {
                addPoints("a",5)
            }
        },
        63: {
            name: "Zero Deaths",
            tooltip: "Get 1e10000 fatality without Dimension and Multiplier Boosts. Reward: 5 AP",
            done() {
                return player.f.points.gte("ee4") && player.f.buyables[32].eq(0) && player.f.buyables[33].eq(0)
            },
            onComplete() {
                addPoints("a",5)
            }
        },
        64: {
            name: "REPLICANTI",
            tooltip: "Unlock Casuals. Reward: 5 AP",
            done() {
                return hasMilestone("f",17)
            },
            onComplete() {
                addPoints("a",5)
            }
        },
        65: {
            name: "'ZERO' Deaths",
            tooltip: "Get 6e666,666 fatality without Dimension and Multiplier Boosts in Casualty Challenge 1. Reward: 5 AP, AP boosts fatality dimensions",
            done() {
                return player.f.points.gte("6e666666") && player.f.buyables[32].eq(0) && player.f.buyables[33].eq(0) && inChallenge("f",31)
            },
            onComplete() {
                addPoints("a",5)
            }
        },
        66: {
            name: "0 cases from Casualty",
            tooltip: "Get 1 Casualty Dimension 8. Reward: 5 AP",
            done() {
                return player.f.buyables[84].gte(1)
            },
            onComplete() {
                addPoints("a",5)
            }
        },
    },
    effect() {
        let eff = player.a.points
        if (hasAchievement("a", 42)) eff = Decimal.pow(1.2, eff.pow(1.5))
        else eff = Decimal.pow(1.07, eff)
        return eff
    },
    effectDescription() {
        return "which boost cases gain by " + format(tmp.a.effect)
    },
    tabFormat: {
        "Achievements" :{
            content: ["main-display",
            "achievements"]
        },
        "Milestones" :{
            content: ["milestones"]
        }
    },
    milestones: {
        0: {
            requirementDescription: "50 Achievement Points",
            effectDescription: "Keep I,R,U upgrades and milestones, and autobuy 2x more and faster.",
            done() { return player.a.points.gte(50) }
        }
    },
    
})
addLayer("f", {
    name: "fatality",
    symbol: "F",
    position: 0,
    startData() { return {
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),
        unlocked: false,
        sac: new Decimal(0),
        p: new Decimal(0),
        mult: new Decimal(0),
        d1: new Decimal(0),
        d2: new Decimal(0),
        d3: new Decimal(0),
        d4: new Decimal(0),
        d5: new Decimal(0),
        d6: new Decimal(0),
        d7: new Decimal(0),
        d8: new Decimal(0),
        resettime: new Decimal(0.001),
        cpm: new Decimal(0),
        casualty: new Decimal(0),
        casualtyTotal: new Decimal(0),
        d1auto: false,
        d2auto: false,
        d3auto: false,
        d4auto: false,
        d5auto: false,
        d6auto: false,
        d7auto: false,
        d8auto: false,
        multauto: false,
        boostauto: false,
        multbauto: false,
        sacauto: false,
        cmultauto: false,
        t: [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)],
        times: [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)],
        buy: [41,42,43,44,51,52,53,54,61,62,63],
        sact: new Decimal(0),
        sactimes: new Decimal(0),
        cd: [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)],
        cp: new Decimal(0),
        casuals: new Decimal(1),
        rt: new Decimal(0),
        rtimes: new Decimal(0),
        cboosts: new Decimal(0),
    }},
    color: "#f53d63",
    nodeStyle() {return {
        "background": (player.f.unlocked||canReset("f"))?"radial-gradient(#d5a776, #f53d63)":"#bf8f8f" ,
    }},
    componentStyles: {
        "prestige-button"() {return { "background": canReset("f")?"radial-gradient(#d5a776, #f53d63)":"#bf8f8f" }},
    },
    requires: new Decimal("e10450"),
    resource: "fatality",
    baseResource: "deaths",
    baseAmount() { return player.d.points },
    type: "custom",
    exponent: 0.3,
    branches: ["d","s","u"],
    row: "3",
    hotkeys: [
            {key:"f", description: "F:Reset for fatality", onPress() {
                if (canReset(this.layer) && !hasMilestone("f",9)) doReset(this.layer)}
            },
            {key:"m", description: "M:Buy max Fatality Dimensions", onPress() {
                if (hasMilestone("f",6)) layers.f.clickables[11].onClick()
                if (hasMilestone("f",16)) layers.f.clickables[51].onClick()}
            },
            {key:"c", description: "C:Reset for casualty", onPress() {
                if (hasMilestone("f",12) && player.f.points.gte("5.095e5095")) layers.f.clickables[12].onClick()}
            },
    ],
    powergain() {
        let pgain = tmp.f.buyables[11].gain
        return pgain
    },
    cpowergain() {
        let pgain = tmp.f.buyables[71].gain
        return pgain
    },
    fDimMult() {
        let mult = new Decimal(1)
        if (hasFUpg(35)) mult = mult.mul(getFUpgEff(35))
        if (hasFUpg(41)) mult = mult.mul(getFUpgEff(41))
        if (hasFUpg(52)) mult = mult.mul(getFUpgEff(52))
        if (hasFUpg(55)) mult = mult.mul(getFUpgEff(55))
        if (hasFUpg(61)) mult = mult.mul(getFUpgEff(61))
        if (hasFUpg(81)) mult = mult.mul(getFUpgEff(81))
        if (hasFUpg(103)) mult = mult.mul(getFUpgEff(103))
        mult = mult.mul(tmp.f.buyables[31].effect)
        mult = mult.mul(tmp.f.buyables[32].effect)
        mult = mult.mul(this.cpeffect())
        if (inChallenge("f",61)) mult = tmp.f.buyables[32].effect
        if (inChallenge("f",62)) mult = this.cpeffect()
        if (hasAchievement("a",54)) mult = mult.mul(2)
        if (hasAchievement("a",65)) mult = mult.mul(tmp.a.effect)
        return mult
    },
    cDimMult() {
        let mult = new Decimal(1)
        if (hasChallenge("f",31)) mult = mult.mul(challengeEffect("f",31))
        if (hasChallenge("f",52)) mult = mult.mul(challengeEffect("f",52))
        mult = mult.mul(this.caseffect())
        return mult
    },
    update(diff) {
        player.f.p = player.f.p.add(this.powergain().mul(diff))
        player.f.cp = player.f.cp.add(this.cpowergain().mul(diff))
        player.f.casualtyTotal = player.f.casualtyTotal.max(player.f.casualty)
        player.f.resettime = player.f.resettime.add(diff)
        if (hasMilestone("f",7)) generatePoints("f",diff/100)
        if (hasMilestone("f",9)) generatePoints("f",diff)
        if (hasMilestone("f",18)) {
            player.f.casualty = player.f.casualty.add(tmp.f.clickables[12].gain.mul(diff/100))
            player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.clickables[12].gain.mul(diff/100))
        }
        if (hasFUpg(113)) {
            player.f.casualty = player.f.casualty.add(getFUpgEff(113).mul(diff))
            player.f.casualtyTotal = player.f.casualtyTotal.add(getFUpgEff(113).mul(diff))
        }
        player.f.buyables[11] = player.f.buyables[11].add(tmp.f.buyables[12].gain.mul(diff))
        player.f.buyables[12] = player.f.buyables[12].add(tmp.f.buyables[13].gain.mul(diff))
        player.f.buyables[13] = player.f.buyables[13].add(tmp.f.buyables[14].gain.mul(diff))
        player.f.buyables[14] = player.f.buyables[14].add(tmp.f.buyables[21].gain.mul(diff))
        player.f.buyables[21] = player.f.buyables[21].add(tmp.f.buyables[22].gain.mul(diff))
        player.f.buyables[22] = player.f.buyables[22].add(tmp.f.buyables[23].gain.mul(diff))
        player.f.buyables[23] = player.f.buyables[23].add(tmp.f.buyables[24].gain.mul(diff))
        player.f.buyables[71] = player.f.buyables[71].add(tmp.f.buyables[72].gain.mul(diff))
        player.f.buyables[72] = player.f.buyables[72].add(tmp.f.buyables[73].gain.mul(diff))
        player.f.buyables[73] = player.f.buyables[73].add(tmp.f.buyables[74].gain.mul(diff))
        player.f.buyables[74] = player.f.buyables[74].add(tmp.f.buyables[81].gain.mul(diff))
        player.f.buyables[81] = player.f.buyables[81].add(tmp.f.buyables[82].gain.mul(diff))
        player.f.buyables[82] = player.f.buyables[82].add(tmp.f.buyables[83].gain.mul(diff))
        player.f.buyables[83] = player.f.buyables[83].add(tmp.f.buyables[84].gain.mul(diff))
        for (i = 0; i < player.f.t.length; i++) {
            let t = tmp.f.buyables[player.f.buy[i]].speed.mul(diff)
            player.f.t[i] = Decimal.add(player.f.t[i], t)
            if (player.f.t[i].gte(1)) {
                player.f.times[i] = Decimal.floor(player.f.t[i]).mul(-1)
                player.f.t[i] = Decimal.add(player.f.t[i], player.f.times[i])
                player.f.times[i] = player.f.times[i].mul(-1)
                if (tmp.f.buyables[player.f.buy[i]].on) layers.f.buyables[player.f.buy[i]-30].buyMax(tmp.f.buyables[player.f.buy[i]].bulk)
            }
        }
        let st = tmp.f.buyables[64].speed.mul(diff)
        player.f.sact = Decimal.add(player.f.sact, st)
        if (player.f.sact.gte(1)) {
            player.f.sactimes = Decimal.floor(player.f.sact).mul(-1)
            player.f.sact = Decimal.add(player.f.sact, player.f.sactimes)
            player.f.sactimes = player.f.sactimes.mul(-1)
            if (tmp.f.buyables[64].on && tmp.f.clickables[13].effectnext.gte(100)) layers.f.clickables[13].onClick()
        }
        let m = tmp.f.buyables[91].effect.pow(diff)
        if (tmp.f.buyables[92].effect.gte(0.1)) {
        player.f.rt = Decimal.add(player.f.rt, diff)
            if (player.f.rt.gte(tmp.f.buyables[92].effect) && hasMilestone("f",17)) {
                player.f.rtimes = player.f.rt.mul(-1)
                player.f.rt = Decimal.add(player.f.rt, player.f.rtimes)
                player.f.rtimes = player.f.rtimes.mul(-1)
                player.f.casuals = player.f.casuals.mul(tmp.f.buyables[91].effect).min("1.798e308")
            }
        } 
        else player.f.casuals = player.f.casuals.mul(m.pow(tmp.f.buyables[92].effect.pow(-1))).min("1.798e308")
        if (player.f.cmultauto) layers.f.clickables[14].onClick()
    },
    canReset() {return player.d.points.gte("e10450") && !hasMilestone("f",9)},
    gainMult() {
        let mult = new Decimal(1)
        if (hasFUpg(12)) mult = mult.mul(getFUpgEff(12))
        if (hasFUpg(14)) mult = mult.mul(getFUpgEff(14))
        if (hasFUpg(22)) mult = mult.mul(getFUpgEff(22))
        if (hasFUpg(24)) mult = mult.mul(getFUpgEff(24))
        mult = mult.mul(this.peffect())
        return mult
    },
    gainExp() {
        let exp = new Decimal(1)
        if (hasFUpg(25)) exp = exp.add(1)
        if (hasFUpg(32)) exp = exp.add(getFUpgEff(32))
        if (hasFUpg(42)) exp = exp.add(getFUpgEff(42))
        if (hasFUpg(51)) exp = exp.add(getFUpgEff(51))
        return exp
    },
    getResetGain() {
        let f = tmp["f"].baseAmount
        if (inChallenge("f",31)) f = new Decimal("e10450")
        if (f.lt(tmp["f"].requires)) return new Decimal(0)
        let gain = f.div(tmp["f"].requires).mul(10).log10().pow(tmp["f"].exponent).pow(this.gainExp()).mul(this.gainMult())
        if (inChallenge("f",42)) gain = gain.pow(0.1)
        if (inChallenge("f",51)) gain = Decimal.pow(10,gain.log10().pow(0.75))
        if (hasChallenge("f",42)) gain = gain.pow(1.05)
        return gain.floor()
    },
    getNextAt() {
        let next = layers.f.getResetGain().add(1)
		if (next.gte(tmp["f"].softcap)) next = next.div(tmp["f"].softcap.pow(decimalOne.sub(tmp["f"].softcapPower))).pow(decimalOne.div(tmp["f"].softcapPower))
		next = Decimal.pow(10,(next.div(this.gainMult()).root(tmp["f"].exponent).root(this.gainExp()))).mul(tmp["f"].requires).div(10).max(tmp["f"].requires)
		return next;
    },
    prestigeButtonText() {
        let text =  `${ player["f"].points.lt(1e3) ? (tmp["f"].resetDescription !== undefined ? tmp["f"].resetDescription : "Reset for ") : ""}+<b>${formatWhole(tmp["f"].resetGain)}</b> ${tmp["f"].resource} ${tmp["f"].getResetGain.lt(100) && player["f"].points.lt(1e3) ? `<br><br>Next at ${ (tmp["f"].roundUpCost ? formatWhole(tmp["f"].nextAt) : format(tmp["f"].nextAt))} ${ tmp["f"].baseResource }` : ""}` + "<br>"
        let gain = this.getResetGain().div(player.f.resettime)
        if (gain.gte(10)) text += format(gain) + "/s"
        else text += format(gain.mul(60)) + "/min"
        return text
    },
    layerShown() {
        return hasSUpg(55) || player.f.unlocked
    },
    doReset() {
        player.d.points = new Decimal(0)
        player.d.best = new Decimal(0)
        player.d.total = new Decimal(0)
        player.d.upgrades = []
        player.d.milestones = []
        player.f.resettime = new Decimal(0.001)
    },
    multpd() {
        let base = new Decimal(2)
        if (hasFUpg(53)) base = base.add(getFUpgEff(53))
        if (hasFUpg(82)) base = base.add(0.3)
        if (inChallenge("f",12)) base = new Decimal(1)
        return base
    },
    cmultpd() {
        let base = new Decimal(5)
        return base
    },
    effect() {
        let eff = player.f.best.add(1)
        eff = eff.pow(eff.log10().add(1).pow(1.7)).pow(15)
        if (hasFUpg(15)) eff = eff.pow(getFUpgEff(15))
        if (hasFUpg(124)) eff = eff.pow(getFUpgEff(124))
        if (eff.gte("e2e6")) eff = Decimal.pow(10,eff.div("e2e6").log10().pow(0.85)).mul("e2e6")
        return eff
    },
    effect2() {
        let eff = player.f.best.add(1)
        eff = eff.pow(eff.log10().add(1).pow(1.2)).pow(2)
        if (hasFUpg(124)) eff = eff.pow(getFUpgEff(124))
        return eff
    },
    peffect() {
        let eff = player.f.p.add(1)
        eff = eff.pow(0.6)
        if (hasFUpg(62)) eff = eff.pow(getFUpgEff(62))
        if (inChallenge("f",52)) eff = new Decimal(1)
        return eff
    },
    cpeffect() {
        let eff = player.f.cp.add(1)
        eff = eff.pow(50)
        if (hasChallenge("f",42)) eff = eff.pow(1.5)
        if (hasChallenge("f",62)) eff = eff.pow(challengeEffect("f",62))
        return eff
    },
    caseffect() {
        let eff = player.f.casuals
        eff = eff.log10().add(1).pow(30) 
        if (eff.gte(1e30)) eff = eff.div(1e30).pow(0.2).mul(1e30)
        return eff
    },
    DimScaling() {
        let scale = new Decimal(10)
        if (inChallenge("f",21)) scale = new Decimal(100)
        if (inChallenge("f",41)) scale = new Decimal("1.8e308")
        if (hasFUpg(65)) scale = scale.sub(1)
        if (hasFUpg(73)) scale = scale.sub(1)
        if (hasFUpg(111)) scale = scale.sub(1)
        if (hasFUpg(84)) scale = scale.sub(1)
        if (hasFUpg(115)) scale = scale.sub(1)
        if (hasFUpg(122)) scale = scale.sub(1)
        if (hasFUpg(134)) scale = scale.sub(0.5)
        if (hasChallenge("f",41)) scale = scale.sub(1)
        return scale
    },
    effectDescription() {
        return "which boost cases, VP, infectivity, severity by " + layerText("h2", "f", format(this.effect())) + ", and death gain by " +layerText("h2", "f", format(this.effect2())) + " (based on best)."
    },
    tabFormat: {
        "Milestones": {
            content: [
                "main-display",
                ["raw-html", function() {if (hasMilestone("f",9)) return "You are gaining " + layerText("h2", "f", format(tmp.f.getResetGain)) + " fatality per second"}],
                function() {if (!hasMilestone("f",9)) return "prestige-button"},
                "resource-display",
                ["display-text", 
                function() {
                    if (!hasMilestone("f",9)) return "Fatality time: " + formatTime(player.f.resettime)
                }
                ],
                "blank",
                "milestones",
            ]
        },
        "Upgrades": {
            content: [
                "main-display",
                ["raw-html", function() {if (hasMilestone("f",9)) return "You are gaining " + layerText("h2", "f", format(tmp.f.getResetGain)) + " fatality per second"}],
                function() {if (!hasMilestone("f",9)) return "prestige-button"},
                "resource-display",
                ["display-text", 
                function() {
                    if (!hasMilestone("f",9)) return "Fatality time: " + formatTime(player.f.resettime)
                }
                ],
                "blank",
                ["column", [["row", [["upgrade", 11], ["upgrade", 12], ["upgrade", 13], ["upgrade", 14], ["upgrade", 15]]]]],
                ["column", [["row", [["upgrade", 21], ["upgrade", 22], ["upgrade", 23], ["upgrade", 24], ["upgrade", 25]]]]],
                ["column", [["row", [["upgrade", 31], ["upgrade", 32], ["upgrade", 33], ["upgrade", 34], ["upgrade", 35]]]]],
                ["column", [["row", [["upgrade", 41], ["upgrade", 42], ["upgrade", 43], ["upgrade", 44], ["upgrade", 45]]]]],
                ["column", [["row", [["upgrade", 51], ["upgrade", 52], ["upgrade", 53], ["upgrade", 54], ["upgrade", 55]]]]],
                ["column", [["row", [["upgrade", 61], ["upgrade", 62], ["upgrade", 63], ["upgrade", 64], ["upgrade", 65]]]]],
                ["column", [["row", [["upgrade", 71], ["upgrade", 72], ["upgrade", 73], ["upgrade", 74], ["upgrade", 75]]]]],
            ]
        },
        "Dimensions": {
            content: [
                "main-display",
                ["raw-html", function() {if (hasMilestone("f",9)) return "You are gaining " + layerText("h2", "f", format(tmp.f.getResetGain)) + " fatality per second"}],
                function() {if (!hasMilestone("f",9)) return "prestige-button"},
                "resource-display",
                ["raw-html", function() {return "You have " + layerText("h2", "f", format(player.f.p)) + " fatality power, which boosts fatality gain by " + layerText("h2", "f", format(tmp.f.peffect))}],
                ["display-text", 
                function() {
                    return "You are gaining " + format(tmp.f.powergain) + " fatality power per second."
                }
                ],
                ["display-text", 
                function() {
                    return "You are gaining " + format(tmp.f.buyables[12].gain) + " Fatality Dimension 1 per second."
                }
                ],
                ["display-text", 
                function() {
                    return "You are gaining " + format(tmp.f.buyables[13].gain) + " Fatality Dimension 2 per second."
                }
                ],
                ["display-text", 
                function() {
                    return "You are gaining " + format(tmp.f.buyables[14].gain) + " Fatality Dimension 3 per second."
                }
                ],
                ["display-text", 
                function() {
                    return "You are gaining " + format(tmp.f.buyables[21].gain) + " Fatality Dimension 4 per second."
                }
                ],
                ["display-text", 
                function() {
                    return "You are gaining " + format(tmp.f.buyables[22].gain) + " Fatality Dimension 5 per second."
                }
                ],
                ["display-text", 
                function() {
                    if (getBuyableAmount("f",32).gte(1)) return "You are gaining " + format(tmp.f.buyables[23].gain) + " Fatality Dimension 6 per second."
                }
                ],
                ["display-text", 
                function() {
                    if (getBuyableAmount("f",32).gte(2)) return "You are gaining " + format(tmp.f.buyables[24].gain) + " Fatality Dimension 7 per second."
                }
                ],
                "blank",
                ["column", [["row", [["clickable", 11],["clickable", 13]]]]],
                ["column", [["row", [["buyable", 11], ["buyable", 12], ["buyable", 13], ["buyable", 14]]]]],
                ["column", [["row", [["buyable", 21], ["buyable", 22], ["buyable", 23], ["buyable", 24]]]]],
                ["column", [["row", [["buyable", 31], ["buyable", 32], ["buyable", 33]]]]],
            ],
            unlocked() {return hasMilestone("f", 6)}
        },
        "Casualty": {
            content: [
                "main-display",
                function() {if (!hasMilestone("f",9)) return "prestige-button"},
                ["display-text", 
                function() {
                    if (!hasMilestone("f",9)) return "Fatality time: " + formatTime(player.f.resettime)
                }
                ],
                "blank",
                ["raw-html", function() {return "You have <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(player.f.casualty) +"</h2> casualty"}],
                "blank",
                function() {if (!hasMilestone("f",18)) return ["row", [["clickable", 12]]]},
                ["display-text", 
                function() {
                    if (hasMilestone("f",18)) return "You are gaining <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(tmp.f.clickables[12].gain.div(100)) + "</h2> casualty per second."
                }
                ],
                "blank",
                ["display-text", 
                function() {
                    return "You have made a total of " + formatWhole(player.f.casualtyTotal) + " casualty."
                }
                ],
                ["display-text", 
                function() {
                    if (!hasMilestone("f",18)) return "Casualty time: " + formatTime(player.f.resettime)
                }
                ],
                ["display-text", 
                function() {
                    let dis = "Best Casualty/min: "
                    if (player.f.cpm.lt(10)) dis += format(player.f.cpm.mul(60)) + "/min"
                    else dis += format(player.f.cpm) + "/s"
                    if (!hasMilestone("f",18)) return dis
                }
                ],
                ["raw-html", "<br><h2>Casualty Upgrades</h2><br>"],
                ["row", [["upgrade", 81], ["upgrade", 82], ["upgrade", 83], ["upgrade", 84], ["upgrade", 85]]],
                ["row", [["upgrade", 91], ["upgrade", 92], ["upgrade", 93], ["upgrade", 94], ["upgrade", 95]]],
                ["row", [["upgrade", 101], ["upgrade", 102], ["upgrade", 103], ["upgrade", 104], ["upgrade", 105]]],
                ["row", [["upgrade", 111], ["upgrade", 112], ["upgrade", 113], ["upgrade", 114], ["upgrade", 115]]],
                ["row", [["upgrade", 121], ["upgrade", 122], ["upgrade", 123], ["upgrade", 124], ["upgrade", 125]]],
                ["row", [["upgrade", 131], ["upgrade", 132], ["upgrade", 133], ["upgrade", 134], ["upgrade", 135]]],
            ],
            buttonStyle: {"border-color": "#3d2963"},
            unlocked() {return hasMilestone("f", 12)},
        },
        "Multiplier": {
            content: [
                ["raw-html", function() {return "You have <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(player.f.casualty) +"</h2> casualty"}],
                "blank",
                function() {if (!hasMilestone("f",18)) return ["row", [["clickable", 12]]]},
                ["display-text", 
                function() {
                    if (hasMilestone("f",18)) return "You are gaining <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(tmp.f.clickables[12].gain.div(100)) + "</h2> casualty per second."
                }
                ],
                "blank",
                ["column", [["row", [["clickable", 14]]]]],
                ["row", [["buyable", 34]]],
            ],
            buttonStyle: {"border-color": "#3d2963"},
            unlocked() {return hasMilestone("f", 12)},
        },
        "Challenges": {
            content: [
                ["raw-html", function() {return "You have <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(player.f.casualty) +"</h2> casualty"}],
                "blank",
                function() {if (!hasMilestone("f",18)) return ["row", [["clickable", 12]]]},
                ["display-text", 
                function() {
                    if (hasMilestone("f",18)) return "You are gaining <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(tmp.f.clickables[12].gain.div(100)) + "</h2> casualty per second."
                }
                ],
                "blank",
                ["display-text", 
                function() {
                    return "You have made a total of " + formatWhole(player.f.casualtyTotal) + " casualty."
                }
                ],
                ["display-text", 
                function() {
                    return "Starting a challenge does a casualty reset. Completing a challenge gives " + formatWhole(tmp.f.buyables[34].effect) + " casualty"
                }
                ],
                ["bar", "NextCC"],
                "challenges"
            ],
            buttonStyle: {"border-color": "#3d2963"},
            unlocked() {return hasMilestone("f", 12)},
        },
        "Autobuyers": {
            content: [
                ["raw-html", function() {return "You have <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(player.f.casualty) +"</h2> casualty"}],
                "blank",
                function() {if (!hasMilestone("f",18)) return ["row", [["clickable", 12]]]},
                ["display-text", 
                function() {
                    if (hasMilestone("f",18)) return "You are gaining <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(tmp.f.clickables[12].gain.div(100)) + "</h2> casualty per second."
                }
                ],
                "blank",
                ["display-text", 
                function() {
                    return "You have made a total of " + formatWhole(player.f.casualtyTotal) + " casualty."
                }
                ],
                ["row",[["column", [["buyable", 41],["clickable", 21]]],["column", [["buyable", 42],["clickable", 22]]],["column", [["buyable", 43],["clickable", 23]]],["column", [["buyable", 44],["clickable", 24]]]]],
                ["row",[["column", [["buyable", 51],["clickable", 31]]],["column", [["buyable", 52],["clickable", 32]]],["column", [["buyable", 53],["clickable", 33]]],["column", [["buyable", 54],["clickable", 34]]]]],
                ["row",[["column", [["buyable", 61],["clickable", 41]]],["column", [["buyable", 62],["clickable", 42]]],["column", [["buyable", 63],["clickable", 43]]],["column", [["buyable", 64],["clickable", 44]]]]],
            ],
            buttonStyle: {"border-color": "#3d2963"},
            unlocked() {return hasChallenge("f", 11)},
        },
        "Casualty Dimensions": {
            content: [
                ["raw-html", function() {return "You have <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(player.f.casualty) +"</h2> casualty"}],
                "blank",
                function() {if (!hasMilestone("f",18)) return ["row", [["clickable", 12]]]},
                ["display-text", 
                function() {
                    if (hasMilestone("f",18)) return "You are gaining <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(tmp.f.clickables[12].gain.div(100)) + "</h2> casualty per second."
                }
                ],
                "blank",
                ["display-text", 
                function() {
                    return "You have made a total of " + formatWhole(player.f.casualtyTotal) + " casualty."
                }
                ],
                ["raw-html", function() {return "You have <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + format(player.f.cp) + "</h2> casualty power, which boosts Fatality Dimensions by <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + format(tmp.f.cpeffect) +"</h2>"}],
                ["display-text", 
                function() {
                    return "You are gaining " + format(tmp.f.cpowergain) + " casualty power per second."
                }
                ],
                ["display-text", 
                function() {
                    return "You are gaining " + format(tmp.f.buyables[72].gain) + " Fatality Dimension 1 per second."
                }
                ],
                ["display-text", 
                function() {
                    if (tmp.f.buyables[73].unlocked) return "You are gaining " + format(tmp.f.buyables[73].gain) + " Fatality Dimension 2 per second."
                }
                ],
                ["display-text", 
                function() {
                    if (tmp.f.buyables[74].unlocked) return "You are gaining " + format(tmp.f.buyables[74].gain) + " Fatality Dimension 3 per second."
                }
                ],
                ["display-text", 
                function() {
                    if (tmp.f.buyables[81].unlocked) return "You are gaining " + format(tmp.f.buyables[81].gain) + " Fatality Dimension 4 per second."
                }
                ],
                ["display-text", 
                function() {
                    if (tmp.f.buyables[82].unlocked) return "You are gaining " + format(tmp.f.buyables[82].gain) + " Fatality Dimension 5 per second."
                }
                ],
                ["display-text", 
                function() {
                    if (tmp.f.buyables[83].unlocked) return "You are gaining " + format(tmp.f.buyables[83].gain) + " Fatality Dimension 6 per second."
                }
                ],
                ["display-text", 
                function() {
                    if (tmp.f.buyables[84].unlocked) return "You are gaining " + format(tmp.f.buyables[84].gain) + " Fatality Dimension 7 per second."
                }
                ],
                ["bar", "NextCD"],
                "blank",
                ["column", [["row", [["clickable", 51]]]]],
                ["row", [["buyable", 71],["buyable", 72],["buyable", 73],["buyable", 74]]],
                ["row", [["buyable", 81],["buyable", 82],["buyable", 83],["buyable", 84]]],
                
            ],
            buttonStyle: {"border-color": "#3d2963"},
            unlocked() {return hasMilestone("f", 16)},
        },
        "Casuals": {
            content: [
                ["raw-html", function() {return "You have <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(player.f.casualty) +"</h2> casualty"}],
                "blank",
                function() {if (!hasMilestone("f",18)) return ["row", [["clickable", 12]]]},
                ["display-text", 
                function() {
                    if (hasMilestone("f",18)) return "You are gaining <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(tmp.f.clickables[12].gain.div(100)) + "</h2> casualty per second."
                }
                ],
                "blank",
                ["display-text", 
                function() {
                    return "You have made a total of " + formatWhole(player.f.casualtyTotal) + " casualty."
                }
                ],
                ["raw-html", function() {return "You have <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + formatWhole(player.f.casuals) +"</h2> casuals, which boost Casualty Dimensions by <h2 style='color:#3d2963;text-shadow:0px 0px 10px;'>" + format(tmp.f.caseffect) +"</h2>"}],
                ["row", [["buyable", 91], ["buyable", 92], ["buyable", 93]]],
                ["row", [["clickable", 52]]]
            ],
            buttonStyle: {"border-color": "#3d2963"},
            unlocked() {return hasMilestone("f", 17)},
        },
    },
    
    milestones: {
        0: {
            requirementDescription() { return "2 total fatality" },
            effectDescription() { return "Keep first 5 death milestones on reset." },
            done() { return player.f.total.gte(2) }
        },
        1: {
            requirementDescription() { return "3 total fatality" },
            effectDescription() { return "Keep next 6 death milestones on reset." },
            done() { return player.f.total.gte(3) }
        },
        3: {
            requirementDescription() { return "10 total fatality" },
            effectDescription() { return "Keep previous upgrades on reset." },
            done() { return player.f.total.gte(10) }
        },
        4: {
            requirementDescription() { return "25 total fatality" },
            effectDescription() { return "Keep symptom challenges on reset." },
            done() { return player.f.total.gte(25) }
        },
        5: {
            requirementDescription() { return "3,000,000 total fatality" },
            effectDescription() { return "Unlock death buyables." },
            done() { return player.f.total.gte(3e6) }
        },
        6: {
            requirementDescription() { return "1e11 total fatality" },
            effectDescription() { return "Unlock fatality dimensions and death buyables cost nothing." },
            done() { return player.f.total.gte(1e11) }
        },
        7: {
            requirementDescription() { return "3e33 total fatality" },
            effectDescription() { return "Gain 1% of fatality gain per second." },
            done() { return player.f.total.gte(3e33) },
            unlocked() {return hasMilestone("f",6)}
        },
        8: {
            requirementDescription() { return "4.44e44 total fatality" },
            effectDescription() { return "Unlock Dimension Multiplier and autobuyers buy 100x more." },
            done() { return player.f.total.gte(4.44e44) },
            unlocked() {return hasMilestone("f",6)}
        },
        9: {
            requirementDescription() { return format(Decimal.pow(2,512)) + " total fatality" },
            effectDescription() { return "Gain 100% of fatality gain per second and disable prestige." },
            done() { return player.f.total.gte(Decimal.pow(2,512)) },
            unlocked() {return hasMilestone("f",6)}
        },
        10: {
            requirementDescription() { return "6.969e420 total fatality" },
            effectDescription() { return "Unlock Dimension Shifts and dimensions cost nothing." },
            done() { return player.f.total.gte("6.969e420") },
            unlocked() {return hasMilestone("f",9)}
        },
        11: {
            requirementDescription() { return "1.337e1,337 total fatality" },
            effectDescription() { return "Unlock Multiplier Boosts and buy max Dimension Boosts." },
            done() { return player.f.total.gte("1.337e1337") },
            unlocked() {return player.f.points.gte("e1000") || hasMilestone("f",11)}
        },
        12: {
            requirementDescription() { return "5.095e5,095 total fatality" },
            effectDescription() { return "Unlock Casualty and buy max Multiplier Boosts." },
            done() { return player.f.total.gte("5.095e5095") },
            unlocked() {return player.f.points.gte("e4000") || hasMilestone("f",12)}
        },
        13: {
            requirementDescription() { return "50 total casualty" },
            effectDescription() { return "Multiplier Boosts don't reset Dimension Boosts and unlock Auto Sacrifice." },
            done() { return player.f.casualtyTotal.gte(50) },
            unlocked() {return player.f.casualtyTotal.gte(1)}
        },
        14: {
            requirementDescription() { return "10,000,000 total casualty" },
            effectDescription() { return "Dimension Boosts and Sacrifice reset nothing." },
            done() { return player.f.casualtyTotal.gte(1e7) },
            unlocked() {return player.f.casualtyTotal.gte(1e6)}
        },
        15: {
            requirementDescription() { return "1e12 total casualty" },
            effectDescription() { return "Multiplier Boosts reset nothing." },
            done() { return player.f.casualtyTotal.gte(1e12) },
            unlocked() {return player.f.casualtyTotal.gte(1e9)}
        },
        16: {
            requirementDescription() { return "1e14 total casualty" },
            effectDescription() { return "Unlock Casualty Dimensions." },
            done() { return player.f.casualtyTotal.gte(1e14) },
            unlocked() {return player.f.casualtyTotal.gte(1e12)}
        },
        17: {
            requirementDescription() { return "4.70e470 total casualty" },
            effectDescription() { return "Unlock Casuals." },
            done() { return player.f.casualtyTotal.gte("4.70e470") },
            unlocked() {return player.f.casualtyTotal.gte(1e100)}
        },
        18: {
            requirementDescription() { return "1e1000 total casualty" },
            effectDescription() { return "Gain 1% of casualty gain per second, autobuy Casualty Multiplier, Casualty Multiplier costs nothing, and disable prestige." },
            done() { return player.f.casualtyTotal.gte("e1000") },
            toggles: [["f", "cmultauto"]],
            unlocked() {return player.f.casualtyTotal.gte("e500")}
        },
    },
    clickables: {
        rows: 5,
        cols: 4,
        11: {
            display() {
                return "<h2>Max All (M)</h2>"
            },
            canClick() {return true},
            onClick() {
                layers.f.buyables[11].buyMax(Decimal.tetrate(10,1.79e308))
                layers.f.buyables[12].buyMax(Decimal.tetrate(10,1.79e308))
                layers.f.buyables[13].buyMax(Decimal.tetrate(10,1.79e308))
                layers.f.buyables[14].buyMax(Decimal.tetrate(10,1.79e308))
                layers.f.buyables[21].buyMax(Decimal.tetrate(10,1.79e308))
                layers.f.buyables[22].buyMax(Decimal.tetrate(10,1.79e308))
                if (getBuyableAmount("f",32).gte(1)) layers.f.buyables[23].buyMax(Decimal.tetrate(10,1.79e308))
                if (getBuyableAmount("f",32).gte(2)) layers.f.buyables[24].buyMax(Decimal.tetrate(10,1.79e308))
                layers.f.buyables[31].buyMax(Decimal.tetrate(10,1.79e308))
            },
            style: {'height':'130px', 'width':'130px'},
        },
        12: {
            gain() { 
                let f = player.f.points.add(1)
                f = Decimal.pow(10,f.log10().div(5095).sub(1)).max(1).mul(this.gainmult())
                return f.floor()
            },
            next() {
                let gain = this.gain().add(1)
                let next = Decimal.pow(10,gain.div(this.gainmult()).log10().add(1).mul(5095))
                return next
            },
            gainmult() {
                let mult = tmp.f.buyables[34].effect 
                if (hasFUpg(94)) mult = mult.mul(getFUpgEff(94))
                if (hasFUpg(104)) mult = mult.mul(getFUpgEff(104))
                if (hasFUpg(114)) mult = mult.mul(getFUpgEff(114))
                if (hasFUpg(85)) mult = mult.mul(getFUpgEff(85))
                return mult
            },
            display() {
                let dis = "Reset Dimensions for +<h3>" + formatWhole(this.gain()) + "</h3> casualty<br>"
                if (this.gain().lt(1000)) {
                if (player.f.points.gte("5.095e5095")) dis += "Next at " + format(this.next()) + " fatality"
                else dis += "Req: 5.095e5,095 fatality"
                }
                if (this.gain().div(player.f.resettime).gte(10)) dis += "<br>" + format(this.gain().div(player.f.resettime)) + "/s"
                else dis += "<br>" + format(this.gain().div(player.f.resettime).mul(60)) + "/min"
                return dis
            },
            canClick() {
                return player.f.points.gte("5.095e5095") && !hasMilestone("f",18)
            },
            onClick() {
                player.f.casualty = player.f.casualty.add(this.gain())
                player.f.casualtyTotal = player.f.casualtyTotal.add(this.gain())
                player.f.cpm = player.f.cpm.max(this.gain().div(player.f.resettime))
                startCChallenge(0)
            },
            style: {'height':'130px', 'width':'175px', 'font-size':'13px',
            'background-color'() {
                let points = player.f.points
                let color = "#bf8f8f"
                if (points.gte("5.095e5095")) color = "#3d2963"
                return color
            }
        }
        },
        14: {
            display() {
                return "<h2>Buy Max</h2>"
            },
            canClick() {return true},
            onClick() {
                layers.f.buyables[34].buyMax()
            },
            style: {'height':'130px', 'width':'130px',
                "background-color"() {
                    let color = "#3d2963"
                    return color
                }
            },
        },
        13: {
            display() {
                let dis = "<h2>Sacrifice</h2><br>Multiply Fatality Dimension 8 by " + format(this.effectnext().max(1)) + "."
                dis += "<br>Multiplier: " + format(this.effect()) + "x"
                return dis
            },
            effect() {
                let eff = player.f.sac.add(1).pow(0.025)
                if (hasChallenge("f",32)) eff = eff.pow(3)
                return eff
            },
            effectnext() {
                let eff = player.f.buyables[11].pow(0.025)
                if (hasChallenge("f",32)) eff = eff.pow(3)
                return eff.div(this.effect())
            },
            canClick() {return this.effectnext().gte(1) && player.f.buyables[24].gte(1)},
            onClick() {
                player.f.sac = player.f.sac.add(player.f.buyables[11])
                if (!hasMilestone("f",14)) {
                player.f.buyables[11] = new Decimal(0)
                player.f.buyables[12] = new Decimal(0)
                player.f.buyables[13] = new Decimal(0)
                player.f.buyables[14] = new Decimal(0)
                player.f.buyables[21] = new Decimal(0)
                player.f.buyables[22] = new Decimal(0)
                player.f.buyables[23] = new Decimal(0)
                }
            },
            unlocked() {return hasFUpg(83)},
            style: {'height':'130px', 'width':'130px'},
        },
        21: {
            display() {
                if (player.f.d1auto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.d1auto) player.f.d1auto = false 
                else player.f.d1auto = true
            },
            unlocked() {
                return hasChallenge("f",11)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        22: {
            display() {
                if (player.f.d2auto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.d2auto) player.f.d2auto = false 
                else player.f.d2auto = true
            },
            unlocked() {
                return hasChallenge("f",11)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        23: {
            display() {
                if (player.f.d3auto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.d3auto) player.f.d3auto = false 
                else player.f.d3auto = true
            },
            unlocked() {
                return hasChallenge("f",11)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        24: {
            display() {
                if (player.f.d4auto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.d4auto) player.f.d4auto = false 
                else player.f.d4auto = true
            },
            unlocked() {
                return hasChallenge("f",12)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        31: {
            display() {
                if (player.f.d5auto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.d5auto) player.f.d5auto = false 
                else player.f.d5auto = true
            },
            unlocked() {
                return hasChallenge("f",12)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        32: {
            display() {
                if (player.f.d6auto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.d6auto) player.f.d6auto = false 
                else player.f.d6auto = true
            },
            unlocked() {
                return hasChallenge("f",12)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        33: {
            display() {
                if (player.f.d7auto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.d7auto) player.f.d7auto = false 
                else player.f.d7auto = true
            },
            unlocked() {
                return hasChallenge("f",21)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        34: {
            display() {
                if (player.f.d8auto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.d8auto) player.f.d8auto = false 
                else player.f.d8auto = true
            },
            unlocked() {
                return hasChallenge("f",21)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        41: {
            display() {
                if (player.f.multauto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.multauto) player.f.multauto = false 
                else player.f.multauto = true
            },
            unlocked() {
                return hasChallenge("f",21)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        42: {
            display() {
                if (player.f.boostauto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.boostauto) player.f.boostauto = false 
                else player.f.boostauto = true
            },
            unlocked() {
                return hasChallenge("f",22)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        43: {
            display() {
                if (player.f.multbauto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.multbauto) player.f.multbauto = false 
                else player.f.multbauto = true
            },
            unlocked() {
                return hasChallenge("f",22)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        44: {
            display() {
                if (player.f.sacauto) return "<h2>ON</h2>"
                else return "<h2>OFF</h2>"
            },
            canClick() {return true},
            onClick() {
                if (player.f.sacauto) player.f.sacauto = false 
                else player.f.sacauto = true
            },
            unlocked() {
                return hasMilestone("f",13)
            },
            style: {'height':'50px', 'width':'50px', 'background-color':"#3d2963"},
        },
        51: {
            display() {
                return "<h2>Max All (M)</h2>"
            },
            canClick() {return true},
            onClick() {
                layers.f.buyables[71].buyMax(Decimal.tetrate(10,1.79e308))
                layers.f.buyables[72].buyMax(Decimal.tetrate(10,1.79e308))
                if (tmp.f.buyables[73].unlocked) layers.f.buyables[73].buyMax(Decimal.tetrate(10,1.79e308))
                if (tmp.f.buyables[74].unlocked) layers.f.buyables[74].buyMax(Decimal.tetrate(10,1.79e308))
                if (tmp.f.buyables[81].unlocked) layers.f.buyables[81].buyMax(Decimal.tetrate(10,1.79e308))
                if (tmp.f.buyables[82].unlocked) layers.f.buyables[82].buyMax(Decimal.tetrate(10,1.79e308))
                if (tmp.f.buyables[83].unlocked) layers.f.buyables[83].buyMax(Decimal.tetrate(10,1.79e308))
                if (tmp.f.buyables[84].unlocked) layers.f.buyables[84].buyMax(Decimal.tetrate(10,1.79e308))
            },
            style: {'height':'130px', 'width':'130px', 'background-color':"#3d2963"},
        },
        52: {
            display() {
                let dis = "Reset casuals for a Replicated Boost.<br>"
                dis += "Replicated Boosts: " + formatWhole(player.f.cboosts) + "/" + formatWhole(tmp.f.buyables[93].effect)
                return dis
            },
            canClick() {return player.f.casuals.gte("1.798e308") && player.f.cboosts.lt(tmp.f.buyables[93].effect) },
            onClick() {
                player.f.casuals = new Decimal(1)
                player.f.cboosts = player.f.cboosts.add(1)
            },
            style: {'height':'130px', 'width':'175px', 'font-size':'13px',
            'background-color'() {
                let color = "#bf8f8f"
                if (tmp.f.clickables[52].canClick) color = "#3d2963"
                return color
            }}
        },
    },
    buyables: {
		rows: 9,
        cols: 4,
        11: {
			title: "Fatality Dimension 1",
			cost(x=player.f.d1) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e3, x).mul(1e11)
                let scale = x.sub(330)
                if (cost.gte("e1000")) cost = cost.mul(this.multInc().pow(scale.mul(scale.add(1).div(2))))
                return cost.floor()
            },
            multInc() {
                return tmp.f.DimScaling
            },
            base() { 
                let base = tmp.f.multpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 11)
                return total
            },
            bought() {
                let bought = player.f.d1
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                let eff = Decimal.pow(base, x).mul(tmp.f.fDimMult)
                if (hasFUpg(91) && !inChallenge("f",61) && !inChallenge("f",62)) eff = eff.mul(getFUpgEff(91))
                if (hasFUpg(34) && !inChallenge("f",61) && !inChallenge("f",62)) eff = eff.mul(getFUpgEff(34))
                if (inChallenge("f", 11)) eff = eff.div("1.8e308")
                return eff;
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces fatality power.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" fatality\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return hasMilestone("f", 6) }, 
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d1 = player.f.d1.add(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(b) { //log10(cost/1e1001)/log10(Inc) = (x^2+x)/2+3x
                let cost = this.cost()
                let f = player.f.points
                let z = this.multInc().log10()
                let s = f.div("e1001").log10()
                let max = f.div(1e11).log10().div(3).ceil().min(330)
                if (max.gte(330)) max = max.add(s.mul(2).add(3).mul(4).mul(z).add(z.pow(2)).add(36).pow(0.5).sub(z).sub(6).div(z.mul(2))).ceil()
                let diff = max.sub(player.f.d1).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e3,max)).div(-999).mul(1e11)
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d1 = player.f.d1.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',},
        },
        12: {
			title: "Fatality Dimension 2",
			cost(x=player.f.d2) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e4, x).mul(1e14)
                let scale = x.sub(247)
                if (cost.gte("e1000")) cost = cost.mul(this.multInc().pow(scale.mul(scale.add(1).div(2))))
                return cost.floor()
            },
            multInc() {
                return tmp.f.DimScaling
            },
            base() { 
                let base = tmp.f.multpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 12)
                return total
            },
            bought() {
                let bought = player.f.d2
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                let eff = Decimal.pow(base, x).mul(tmp.f.fDimMult)
                if (hasFUpg(92) && !inChallenge("f",61) && !inChallenge("f",62)) eff = eff.mul(getFUpgEff(92))
                return eff;
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces Fatality Dimension 1.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" fatality\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return hasMilestone("f", 6) }, 
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)
                    player.f.d2 = player.f.d2.add(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.points
                let z = this.multInc().log10()
                let s = f.div("e1001").log10()
                let max = f.div(1e14).log10().div(4).ceil().min(247)
                if (max.gte(247)) max = max.add(s.mul(2).add(4).mul(4).mul(z).add(z.pow(2)).add(64).pow(0.5).sub(z).sub(8).div(z.mul(2))).ceil()
                let diff = max.sub(player.f.d2).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e4,max)).div(-9999).mul(1e14)
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d2 = player.f.d2.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        13: {
			title: "Fatality Dimension 3",
			cost(x=player.f.d3) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e5, x).mul(1e15)
                let scale = x.sub(197)
                if (cost.gte("e1000")) cost = cost.mul(this.multInc().pow(scale.mul(scale.add(1).div(2))))
                return cost.floor()
            },
            multInc() {
                return tmp.f.DimScaling
            },
            base() { 
                let base = tmp.f.multpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 13)
                return total
            },
            bought() {
                let bought = player.f.d3
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                let eff = Decimal.pow(base, x).mul(tmp.f.fDimMult)
                if (hasFUpg(101) && !inChallenge("f",61) && !inChallenge("f",62)) eff = eff.mul(getFUpgEff(101))
                return eff;
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces Fatality Dimension 2.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" fatality\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return hasMilestone("f", 6) }, 
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)
                    player.f.d3 = player.f.d3.add(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.points
                let z = this.multInc().log10()
                let s = f.div("e1000").log10()
                let max = f.div(1e15).log10().div(5).ceil().min(197)
                if (max.gte(197)) max = max.add(s.mul(2).add(5).mul(4).mul(z).add(z.pow(2)).add(100).pow(0.5).sub(z).sub(10).div(z.mul(2))).ceil()
                let diff = max.sub(player.f.d3).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e5,max)).div(-99999).mul(1e15)
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d3 = player.f.d3.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        14: {
			title: "Fatality Dimension 4",
			cost(x=player.f.d4) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e6, x).mul(1e18)
                let scale = x.sub(164)
                if (cost.gte("e1000")) cost = cost.mul(this.multInc().pow(scale.mul(scale.add(1).div(2))))
                return cost.floor()
            },
            multInc() {
                return tmp.f.DimScaling
            },
            base() { 
                let base = tmp.f.multpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 14)
                return total
            },
            bought() {
                let bought = player.f.d4
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                let eff = Decimal.pow(base, x).mul(tmp.f.fDimMult)
                if (hasFUpg(102) && !inChallenge("f",61) && !inChallenge("f",62)) eff = eff.mul(getFUpgEff(102))
                return eff;
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces Fatality Dimension 3.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" fatality\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return hasMilestone("f", 6) }, 
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)
                    player.f.d4 = player.f.d4.add(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.points
                let z = this.multInc().log10()
                let s = f.div("e1002").log10()
                let max = f.div(1e18).log10().div(6).ceil().min(164)
                if (max.gte(164)) max = max.add(s.mul(2).add(6).mul(4).mul(z).add(z.pow(2)).add(144).pow(0.5).sub(z).sub(12).div(z.mul(2))).ceil()
                let diff = max.sub(player.f.d4).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e6,max)).div(-999999).mul(1e18)
                if (this.canAfford()) { 
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d4 = player.f.d4.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        21: {
			title: "Fatality Dimension 5",
			cost(x=player.f.d5) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e8, x).mul(1e21)
                let scale = x.sub(123)
                if (cost.gte("e1000")) cost = cost.mul(this.multInc().pow(scale.mul(scale.add(1).div(2))))
                return cost.floor()
            },
            multInc() {
                return tmp.f.DimScaling
            },
            base() { 
                let base = tmp.f.multpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 21)
                return total
            },
            bought() {
                let bought = player.f.d5
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                let eff = Decimal.pow(base, x).mul(tmp.f.fDimMult)
                if (hasFUpg(102) && !inChallenge("f",61) && !inChallenge("f",62)) eff = eff.mul(getFUpgEff(102))
                return eff;
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces Fatality Dimension 4.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" fatality\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return hasMilestone("f", 6) }, 
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)
                    player.f.d5 = player.f.d5.add(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.points
                let z = this.multInc().log10()
                let s = f.div("e1005").log10()
                let max = f.div(1e21).log10().div(8).ceil().min(123)
                if (max.gte(123)) max = max.add(s.mul(2).add(8).mul(4).mul(z).add(z.pow(2)).add(256).pow(0.5).sub(z).sub(16).div(z.mul(2))).ceil()
                let diff = max.sub(player.f.d5).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e8,max)).div(-99999999).mul(1e21)
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d5 = player.f.d5.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        22: {
			title: "Fatality Dimension 6",
			cost(x=player.f.d6) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e10, x).mul(1e26)
                let scale = x.sub(98)
                if (cost.gte("e1000")) cost = cost.mul(this.multInc().pow(scale.mul(scale.add(1).div(2))))
                return cost.floor()
            },
            multInc() {
                return tmp.f.DimScaling
            },
            base() { 
                let base = tmp.f.multpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 22)
                return total
            },
            bought() {
                let bought = player.f.d6
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                let eff = Decimal.pow(base, x).mul(tmp.f.fDimMult)
                if (hasFUpg(101) && !inChallenge("f",61) && !inChallenge("f",62)) eff = eff.mul(getFUpgEff(101))
                return eff;
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces Fatality Dimension 5.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" fatality\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return hasMilestone("f", 6) }, 
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)
                    player.f.d6 = player.f.d6.add(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.points
                let z = this.multInc().log10()
                let s = f.div("e1006").log10()
                let max = f.div(1e26).log10().div(10).ceil().min(98)
                if (max.gte(98)) max = max.add(s.mul(2).add(10).mul(4).mul(z).add(z.pow(2)).add(400).pow(0.5).sub(z).sub(20).div(z.mul(2))).ceil()
                let diff = max.sub(player.f.d6).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e10,max)).div(-9999999999).mul(1e26)
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d6 = player.f.d6.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        23: {
			title: "Fatality Dimension 7",
			cost(x=player.f.d7) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e12, x).mul("e435")
                let scale = x.sub(48)
                if (cost.gte("e1000")) cost = cost.mul(this.multInc().pow(scale.mul(scale.add(1).div(2))))
                return cost.floor()
            },
            multInc() {
                return tmp.f.DimScaling
            },
            base() { 
                let base = tmp.f.multpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 23)
                return total
            },
            bought() {
                let bought = player.f.d7
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                let eff = Decimal.pow(base, x).mul(tmp.f.fDimMult)
                if (hasFUpg(92) && !inChallenge("f",61) && !inChallenge("f",62)) eff = eff.mul(getFUpgEff(92))
                return eff;
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces Fatality Dimension 6.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" fatality\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return player.f.buyables[32].gte(1) }, 
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost) && !inChallenge("f",22)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)
                    player.f.d7 = player.f.d7.add(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.points
                let z = this.multInc().log10()
                let s = f.div("e1011").log10()
                let max = f.div("e435").log10().div(12).ceil().min(48)
                if (max.gte(48)) max = max.add(s.mul(2).add(12).mul(4).mul(z).add(z.pow(2)).add(576).pow(0.5).sub(z).sub(24).div(z.mul(2))).ceil()
                let diff = max.sub(player.f.d7).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e12,max)).div(-1e12).mul("e435")
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d7 = player.f.d7.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        24: {
			title: "Fatality Dimension 8",
			cost(x=player.f.d8) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e15, x).mul("e560")
                let scale = x.sub(30)
                if (cost.gte("e1000")) cost = cost.mul(this.multInc().pow(scale.mul(scale.add(1).div(2))))
                return cost.floor()
            },
            multInc() {
                return tmp.f.DimScaling
            },
            base() { 
                let base = tmp.f.multpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 24)
                return total
            },
            bought() {
                let bought = player.f.d8
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                let eff = Decimal.pow(base, x).mul(tmp.f.fDimMult)
                if (hasFUpg(91) && !inChallenge("f",61) && !inChallenge("f",62)) eff = eff.mul(getFUpgEff(91))
                if (!inChallenge("f",61)) eff = eff.mul(tmp.f.clickables[13].effect)
                return eff;
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces Fatality Dimension 7.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" fatality\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return player.f.buyables[32].gte(2) }, 
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost) && !inChallenge("f",22)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)
                    player.f.d8 = player.f.d8.add(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.points
                let z = this.multInc().log10()
                let s = f.div("e1010").log10()
                let max = f.div("e560").log10().div(15).ceil().min(30)
                if (max.gte(30)) max = max.add(s.mul(2).add(15).mul(4).mul(z).add(z.pow(2)).add(900).pow(0.5).sub(z).sub(30).div(z.mul(2))).ceil()
                let diff = max.sub(player.f.d8).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e15,max)).div(-1e15).mul("e560")
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.d8 = player.f.d8.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        31: {
			title: "Fatality Dimension Multiplier",
			cost(x=player.f.mult) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(10, x).mul(1e45)
                let scale = x.sub(955)
                if (cost.gte("e1000")) cost = cost.mul(this.multInc().pow(scale.mul(scale.add(1).div(2))))
                return cost.floor()
            },
            multInc() {
                return tmp.f.DimScaling
            },
            base() { 
                let base = new Decimal(1.1)
                if (hasFUpg(63)) base = base.add(getFUpgEff(63))
                if (hasFUpg(64)) base = base.add(getFUpgEff(64))
                base = base.mul(layers.f.buyables[33].effect())
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 31)
                return total
            },
            bought() {
                let bought = player.f.mult
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Multiply fatality dimensions by " + format(this.base()) + "\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" fatality\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return hasMilestone("f", 8) }, 
            canAfford() {
                    return player.f.points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)
                    player.f.mult = player.f.mult.add(1)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.points
                let z = this.multInc().log10()
                let s = f.div("e1000").log10()
                let max = player.f.points.div(1e45).log10().ceil().min(955)
                if (max.gte(955)) max = max.add(s.mul(2).add(1).mul(4).mul(z).add(z.pow(2)).add(4).pow(0.5).sub(z).sub(2).div(z.mul(2))).ceil()
                let diff = max.sub(player.f.mult).min(b)
                cost = Decimal.sub(1,Decimal.pow(10,diff)).div(-9).mul(cost)
                if (this.canAfford()) {
                    if (!hasMilestone("f",10)) player.f.points = player.f.points.sub(cost).max(0)	
                    player.f.mult = player.f.mult.add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        32: {
			title() {
                let dim = "Fatality Dimension Shift"
                if (this.total().gte(2)) dim = "Fatality Dimension Boost"
                return dim
            },
			cost() { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = new Decimal(40)
                if (this.total().gte(1)) cost = new Decimal(10)
                if (this.total().gte(2)) cost = Decimal.add(10,this.total().sub(2).mul(this.scale()))
                return cost.floor()
            },
            scale() {
                let scale = new Decimal(4)
                if (hasFUpg(65)) scale = scale.sub(1)
                if (hasFUpg(74)) scale = scale.sub(0.5)
                if (hasFUpg(84)) scale = scale.sub(0.5)
                if (hasFUpg(122)) scale = scale.sub(0.5)
                if (hasFUpg(134)) scale = scale.sub(0.5)
                return scale
            },
            base() { 
                let base = new Decimal(10)
                if (hasFUpg(72)) base = base.mul(2)
                if (hasFUpg(75)) base = base.mul(5)
                if (hasFUpg(93)) base = base.mul(5)
                if (hasFUpg(122)) base = base.mul(getFUpgEff(122))
                if (hasChallenge("f",61)) base = base.mul(challengeEffect("f",61))
                return base
            },
            total() {
                let total = getBuyableAmount("f", 32)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.total()
                let base = this.base()
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                let req = Decimal.add(6,this.total()).min(8)
                let dim = "Unlock a new Dimension, and multiply fatality dimensions by "
                if (this.total().gte(2)) dim = "Multiply fatality dimensions by "
                return dim + format(this.base()) +".\n\
                Requires: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" Fatality Dimension " + formatWhole(req) + "\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total())
            },
            unlocked() { return hasMilestone("f", 10) }, 
            canAfford() {
                let req = getBuyableAmount("f", 22)
                if (this.total().gte(2)) req = getBuyableAmount("f", 24)
                else if (this.total().gte(1)) req = getBuyableAmount("f", 23)
                return req.gte(tmp[this.layer].buyables[this.id].cost) && !inChallenge("f",22)},
            buy() { //x=(cost-10)/s+2
                let d6 = getBuyableAmount("f", 24)
                let max = d6.sub(10).div(this.scale()).add(3).floor()
                let diff = max.sub(this.total()).max(1)
                if (this.total().lt(2)) diff = new Decimal(1)
                if (this.canAfford()) {
                    if (!hasMilestone("f",14)) {
                    player.f.p = new Decimal(0)
                    player.f.points = new Decimal(0)
                    player.f.sac = new Decimal(0)
                    player.f.d1 = new Decimal(0)
                    player.f.d2 = new Decimal(0)
                    player.f.d3 = new Decimal(0)
                    player.f.d4 = new Decimal(0)
                    player.f.d5 = new Decimal(0)
                    player.f.d6 = new Decimal(0)
                    player.f.d7 = new Decimal(0)
                    player.f.d8 = new Decimal(0)
                    player.f.mult = new Decimal(0)
                    player.f.buyables[11] = new Decimal(0)
                    player.f.buyables[12] = new Decimal(0)
                    player.f.buyables[13] = new Decimal(0)
                    player.f.buyables[14] = new Decimal(0)
                    player.f.buyables[21] = new Decimal(0)
                    player.f.buyables[22] = new Decimal(0)
                    player.f.buyables[23] = new Decimal(0)
                    player.f.buyables[24] = new Decimal(0)
                    player.f.buyables[31] = new Decimal(0)
                    }
                    if (hasMilestone("f",11)) player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                    else player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(b) { //x=(cost-10)/s+2
                let d6 = getBuyableAmount("f", 24)
                let max = d6.sub(10).div(this.scale()).add(3).floor().min(b)
                let diff = max.sub(this.total()).max(1)
                if (this.total().lt(2)) diff = new Decimal(1)
                if (this.canAfford()) {
                    if (!hasMilestone("f",14)) {
                        player.f.p = new Decimal(0)
                        player.f.points = new Decimal(0)
                        player.f.sac = new Decimal(0)
                        player.f.d1 = new Decimal(0)
                        player.f.d2 = new Decimal(0)
                        player.f.d3 = new Decimal(0)
                        player.f.d4 = new Decimal(0)
                        player.f.d5 = new Decimal(0)
                        player.f.d6 = new Decimal(0)
                        player.f.d7 = new Decimal(0)
                        player.f.d8 = new Decimal(0)
                        player.f.mult = new Decimal(0)
                        player.f.buyables[11] = new Decimal(0)
                        player.f.buyables[12] = new Decimal(0)
                        player.f.buyables[13] = new Decimal(0)
                        player.f.buyables[14] = new Decimal(0)
                        player.f.buyables[21] = new Decimal(0)
                        player.f.buyables[22] = new Decimal(0)
                        player.f.buyables[23] = new Decimal(0)
                        player.f.buyables[24] = new Decimal(0)
                        player.f.buyables[31] = new Decimal(0)
                        }
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        33: {
			title() {
                let dim = "Fatality Multiplier Boost"
                if (this.total().gte(100)) dim = "Distant Fatality Multiplier Boost"
                return dim
            },
			cost() { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = new Decimal(45)
                let distant = this.distantStart()
                if (inChallenge("f",22)) cost = cost = new Decimal(100)
                cost = cost.add(this.total().mul(this.scale()))
                if (this.total().gte(distant)) cost = cost.add(this.total().sub(distant).pow(2).add(this.total()).sub(distant).div(10))
                return cost.floor()
            },
            scale() {
                let scale = new Decimal(7)
                if (inChallenge("f",22)) scale = new Decimal(11)
                if (hasFUpg(111)) scale = scale.sub(1)
                if (hasFUpg(115)) scale = scale.sub(1)
                return scale
            },
            distantStart() {
                let distant = new Decimal(100)
                if (hasFUpg(133)) distant = distant.add(20)
                return distant
            },
            distantScale() {
                let distant = new Decimal(10)
                return distant
            },
            base() { 
                let base = new Decimal(1.032)
                if (hasFUpg(75)) base = base.pow(1.125)
                if (hasFUpg(112)) base = base.pow(1.3)
                if (hasFUpg(105)) base = base.pow(getFUpgEff(105))
                if (hasFUpg(121)) base = base.pow(1.35)
                if (hasFUpg(132)) base = base.pow(tmp.f.upgrades[132].effect2)
                if (hasChallenge("f",51)) base = base.pow(1.2)
                if (inChallenge("f",22)) base = base.pow(1.5)
                if (inChallenge("f",32)) base = new Decimal(1)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 33)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.total().add(player.f.cboosts.mul(5))
                let base = this.base()
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                let dim = "Reset Dimension Boosts, and multiply Fatality Dimension Multiplier base by "
                let req = "8"
                if (inChallenge("f",22)) req = "6"
                return dim + format(this.base()) +".\n\
                Requires: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" Fatality Dimension " +req+"\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total())
            },
            unlocked() { return hasMilestone("f", 11) }, 
            canAfford() {
                let req = getBuyableAmount("f", 24)
                if (inChallenge("f",22)) req = getBuyableAmount("f", 22)
                return req.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { //cost = 45+sx+((x-y)^2+x-y)/10         cost-45 = sx+((x-y)^2+x-y)/10
                let d8 = getBuyableAmount("f", 24)
                let sub = new Decimal(45)
                let d = this.distantStart()
                let b = this.distantScale()
                let s = this.scale()
                if (inChallenge("f",22)) {
                    d8 = getBuyableAmount("f", 22)
                    sub = new Decimal(100)
                }
                let max = d8.sub(sub).div(this.scale()).add(1).floor()
                if (max.gte(d)) max = b.pow(2).mul(s.pow(2)).add(d8.mul(2).sub(s.mul(2).mul(d)).add(s).sub(90).mul(b.mul(2))).add(1).pow(0.5).sub(b.mul(s)).add(d.mul(2)).sub(1).div(2).add(1).floor()
                let diff = max.sub(this.total()).max(1)
                if (this.canAfford()) {
                    if (!hasMilestone("f",15)) {
                    player.f.p = new Decimal(0)
                    player.f.points = new Decimal(0)
                    player.f.sac = new Decimal(0)
                    player.f.d1 = new Decimal(0)
                    player.f.d2 = new Decimal(0)
                    player.f.d3 = new Decimal(0)
                    player.f.d4 = new Decimal(0)
                    player.f.d5 = new Decimal(0)
                    player.f.d6 = new Decimal(0)
                    player.f.d7 = new Decimal(0)
                    player.f.d8 = new Decimal(0)
                    player.f.mult = new Decimal(0)
                    player.f.buyables[11] = new Decimal(0)
                    player.f.buyables[12] = new Decimal(0)
                    player.f.buyables[13] = new Decimal(0)
                    player.f.buyables[14] = new Decimal(0)
                    player.f.buyables[21] = new Decimal(0)
                    player.f.buyables[22] = new Decimal(0)
                    player.f.buyables[23] = new Decimal(0)
                    player.f.buyables[24] = new Decimal(0)
                    player.f.buyables[31] = new Decimal(0)
                    if (!hasMilestone("f",13)) player.f.buyables[32] = (hasFUpg(84) && !inChallenge("f", 22)) ? new Decimal(2) : new Decimal(0)
                    }
                    if (hasMilestone("f",12)) player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                    else player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(m) { //(cost-45)/s = x
                let d8 = getBuyableAmount("f", 24)
                let sub = new Decimal(45)
                let d = this.distantStart()
                let b = this.distantScale()
                let s = this.scale()
                if (inChallenge("f",22)) {
                    d8 = getBuyableAmount("f", 22)
                    sub = new Decimal(100)
                }
                let max = d8.sub(sub).div(this.scale()).add(1).floor()
                if (max.gte(d)) max = b.pow(2).mul(s.pow(2)).add(d8.mul(2).sub(s.mul(2).mul(d)).add(s).sub(90).mul(b.mul(2))).add(1).pow(0.5).sub(b.mul(s)).add(d.mul(2)).sub(1).div(2).add(1).floor()
                max = max.min(m)
                let diff = max.sub(this.total()).max(1)
                if (this.canAfford()) {
                    if (!hasMilestone("f",15)) {
                        player.f.p = new Decimal(0)
                        player.f.points = new Decimal(0)
                        player.f.sac = new Decimal(0)
                        player.f.d1 = new Decimal(0)
                        player.f.d2 = new Decimal(0)
                        player.f.d3 = new Decimal(0)
                        player.f.d4 = new Decimal(0)
                        player.f.d5 = new Decimal(0)
                        player.f.d6 = new Decimal(0)
                        player.f.d7 = new Decimal(0)
                        player.f.d8 = new Decimal(0)
                        player.f.mult = new Decimal(0)
                        player.f.buyables[11] = new Decimal(0)
                        player.f.buyables[12] = new Decimal(0)
                        player.f.buyables[13] = new Decimal(0)
                        player.f.buyables[14] = new Decimal(0)
                        player.f.buyables[21] = new Decimal(0)
                        player.f.buyables[22] = new Decimal(0)
                        player.f.buyables[23] = new Decimal(0)
                        player.f.buyables[24] = new Decimal(0)
                        player.f.buyables[31] = new Decimal(0)
                        if (!hasMilestone("f",13)) player.f.buyables[32] = (hasFUpg(84) && !inChallenge("f", 22)) ? new Decimal(2) : new Decimal(0)
                        }
                    if (hasMilestone("f",12)) player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px'},
        },
        34: {
			title: "Casualty Multiplier",
			cost(x=this.total()) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(10, x).mul(5)
                return cost.floor()
            },
            base() { 
                let base = new Decimal(2)
                if (hasFUpg(135)) base = base.add(0.1)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 34)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.total()
                let base = this.base()
                return Decimal.pow(base, x);
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Multiply Casualty gain by " + format(this.base()) + "\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total())
            },
            unlocked() { return hasMilestone("f", 8) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    if (!hasMilestone("f",18)) player.f.casualty = player.f.casualty.sub(cost).max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax() { 
                let cost = this.cost()
                let f = player.f.casualty
                let max = f.div(5).log10().ceil()
                let diff = max.sub(this.total())
                cost = Decimal.sub(1,Decimal.pow(10,diff)).div(-9).mul(cost)
                if (this.canAfford()) {
                    if (!hasMilestone("f",18)) player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[34].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        41: {
			title() {
                let dim = "Fatality Dimension 1 Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(2.8,x)
                return cost.floor()
            },
            on() {
                return player.f.d1auto
            },
            speedbase() { 
                let base = new Decimal(2.5)
                return base
            },
            bulkbase() { 
                let base = new Decimal(2)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 41)
                return total
            },
			speed() { 
                let x = this.total()
                let base = this.speedbase()
                return Decimal.pow(base, x).div(1.25).min(10);
            },
            bulk() { 
                let x = this.total()
                let base = this.bulkbase()
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                let dim = "Autobuys Fatality Dimension 1."
                if (this.total().gte(15)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))+"\n\
                Bulk: " + formatWhole(this.bulk())
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.total().lt(15)},
            unlocked() { return hasChallenge("f", 11) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[41].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        42: {
			title() {
                let dim = "Fatality Dimension 2 Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(2.8,x)
                return cost.floor()
            },
            on() {
                return player.f.d2auto
            },
            speedbase() { 
                let base = new Decimal(2.5)
                return base
            },
            bulkbase() { 
                let base = new Decimal(2)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 42)
                return total
            },
			speed() { 
                let x = this.total()
                let base = this.speedbase()
                return Decimal.pow(base, x).div(1.5).min(10);
            },
            bulk() { 
                let x = this.total()
                let base = this.bulkbase()
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                let dim = "Autobuys Fatality Dimension 2."
                if (this.total().gte(15)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))+"\n\
                Bulk: " + formatWhole(this.bulk())
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.total().lt(15)},
            unlocked() { return hasChallenge("f", 11) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[42].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        43: {
			title() {
                let dim = "Fatality Dimension 3 Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(2.8,x)
                return cost.floor()
            },
            on() {
                return player.f.d3auto
            },
            speedbase() { 
                let base = new Decimal(2.5)
                return base
            },
            bulkbase() { 
                let base = new Decimal(2)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 43)
                return total
            },
			speed() { 
                let x = this.total()
                let base = this.speedbase()
                return Decimal.pow(base, x).div(1.75).min(10);
            },
            bulk() { 
                let x = this.total()
                let base = this.bulkbase()
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                let dim = "Autobuys Fatality Dimension 3."
                if (this.total().gte(15)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))+"\n\
                Bulk: " + formatWhole(this.bulk())
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.total().lt(15)},
            unlocked() { return hasChallenge("f", 11) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[43].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        44: {
			title() {
                let dim = "Fatality Dimension 4 Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(2.8,x)
                return cost.floor()
            },
            on() {
                return player.f.d4auto
            },
            speedbase() { 
                let base = new Decimal(2.5)
                return base
            },
            bulkbase() { 
                let base = new Decimal(2)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 44)
                return total
            },
			speed() { 
                let x = this.total()
                let base = this.speedbase()
                return Decimal.pow(base, x).div(2).min(10);
            },
            bulk() { 
                let x = this.total()
                let base = this.bulkbase()
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                let dim = "Autobuys Fatality Dimension 4."
                if (this.total().gte(15)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))+"\n\
                Bulk: " + formatWhole(this.bulk())
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.total().lt(15)},
            unlocked() { return hasChallenge("f", 12) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[44].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        51: {
			title() {
                let dim = "Fatality Dimension 5 Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(2.8,x)
                return cost.floor()
            },
            on() {
                return player.f.d5auto
            },
            speedbase() { 
                let base = new Decimal(2.5)
                return base
            },
            bulkbase() { 
                let base = new Decimal(2)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 51)
                return total
            },
			speed() { 
                let x = this.total()
                let base = this.speedbase()
                return Decimal.pow(base, x).div(2.25).min(10);
            },
            bulk() { 
                let x = this.total()
                let base = this.bulkbase()
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                let dim = "Autobuys Fatality Dimension 5."
                if (this.total().gte(15)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))+"\n\
                Bulk: " + formatWhole(this.bulk())
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.total().lt(15)},
            unlocked() { return hasChallenge("f", 12) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[51].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        52: {
			title() {
                let dim = "Fatality Dimension 6 Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(2.8,x)
                return cost.floor()
            },
            on() {
                return player.f.d6auto
            },
            speedbase() { 
                let base = new Decimal(2.5)
                return base
            },
            bulkbase() { 
                let base = new Decimal(2)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 52)
                return total
            },
			speed() { 
                let x = this.total()
                let base = this.speedbase()
                return Decimal.pow(base, x).div(2.5).min(10);
            },
            bulk() { 
                let x = this.total()
                let base = this.bulkbase()
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                let dim = "Autobuys Fatality Dimension 6."
                if (this.total().gte(15)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))+"\n\
                Bulk: " + formatWhole(this.bulk())
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.total().lt(15)},
            unlocked() { return hasChallenge("f", 12) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[52].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        53: {
			title() {
                let dim = "Fatality Dimension 7 Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(2.8,x)
                return cost.floor()
            },
            on() {
                return player.f.d7auto
            },
            speedbase() { 
                let base = new Decimal(2.5)
                return base
            },
            bulkbase() { 
                let base = new Decimal(2)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 53)
                return total
            },
			speed() { 
                let x = this.total()
                let base = this.speedbase()
                return Decimal.pow(base, x).div(2.75).min(10);
            },
            bulk() { 
                let x = this.total()
                let base = this.bulkbase()
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                let dim = "Autobuys Fatality Dimension 7."
                if (this.total().gte(15)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))+"\n\
                Bulk: " + formatWhole(this.bulk())
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.total().lt(15)},
            unlocked() { return hasChallenge("f", 21) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[53].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        54: {
			title() {
                let dim = "Fatality Dimension 8 Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(2.8,x)
                return cost.floor()
            },
            on() {
                return player.f.d8auto
            },
            speedbase() { 
                let base = new Decimal(2.5)
                return base
            },
            bulkbase() { 
                let base = new Decimal(2)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 54)
                return total
            },
			speed() { 
                let x = this.total()
                let base = this.speedbase()
                return Decimal.pow(base, x).div(3).min(10);
            },
            bulk() { 
                let x = this.total()
                let base = this.bulkbase()
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                let dim = "Autobuys Fatality Dimension 8."
                if (this.total().gte(15)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))+"\n\
                Bulk: " + formatWhole(this.bulk())
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.total().lt(15)},
            unlocked() { return hasChallenge("f", 21) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[54].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        61: {
			title() {
                let dim = "Fatality Dimension Multiplier Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(2.8,x)
                return cost.floor()
            },
            on() {
                return player.f.multauto
            },
            speedbase() { 
                let base = new Decimal(2.5)
                return base
            },
            bulkbase() { 
                let base = new Decimal(2)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 61)
                return total
            },
			speed() { 
                let x = this.total()
                let base = this.speedbase()
                return Decimal.pow(base, x).div(1.5).min(10);
            },
            bulk() { 
                let x = this.total()
                let base = this.bulkbase()
                return Decimal.pow(base, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                let dim = "Autobuys Fatality Dimension Multiplier."
                if (this.total().gte(15)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))+"\n\
                Bulk: " + formatWhole(this.bulk())
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.total().lt(15)},
            unlocked() { return hasChallenge("f", 21) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[61].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        62: {
			title() {
                let dim = "Fatality Dimension Boost Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(3.5,x)
                return cost.floor()
            },
            on() {
                return player.f.boostauto
            },
            speedbase() { 
                let base = new Decimal(1.8)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 62)
                return total
            },
			speed() { 
                let x = this.total()
                let base = this.speedbase()
                return Decimal.pow(base, x).div(15).min(10);
            },
            bulk() { 
                return Decimal.pow(10, 10);
            },
            display() { // Everything else displayed in the buyable button after the title
                let dim = "Autobuys Fatality Dimension Boost."
                if (this.speed().gte(10)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.speed().lt(10)},
            unlocked() { return hasChallenge("f", 22) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[62].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        63: {
			title() {
                let dim = "Fatality Multiplier Boost Autobuyer"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(3.5,x)
                return cost.floor()
            },
            on() {
                return player.f.multbauto
            },
            speedbase() { 
                let base = new Decimal(1.7)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 63)
                return total
            },
			speed() { 
                let x = this.total()
                let base = this.speedbase()
                return Decimal.pow(base, x).div(60).min(10);
            },
            bulk() { 
                return Decimal.pow(10, 10);
            },
            display() { // Everything else displayed in the buyable button after the title
                let dim = "Autobuys Fatality Multiplier Boost."
                if (this.speed().gte(10)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.speed().lt(10)},
            unlocked() { return hasChallenge("f", 22) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[63].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        64: {
			title() {
                let dim = "Automatic Sacrifice"
                return dim
            },
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(3.5,x)
                return cost.floor()
            },
            on() {
                return player.f.sacauto
            },
            speedbase() { 
                let base = new Decimal(1.7)
                return base
            },
            total() {
                let total = getBuyableAmount("f", 64)
                return total
            },
			speed() { 
                let x = this.total()
                let base = this.speedbase()
                return Decimal.pow(base, x).div(10).min(10);
            },
            display() { // Everything else displayed in the buyable button after the title
                let dim = "Automatically Sacrifice at 100x."
                if (this.speed().gte(10)) dim += "(MAXED)"
                return dim + "\n\
                Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTime(Decimal.div(1,this.speed()))
            },
            canAfford() {
                return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.speed().lt(10)},
            unlocked() { return hasMilestone("f", 13) }, 
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[64].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        71: {
			title: "Casualty Dimension 1",
			cost(x=player.f.cd[0]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e5, x).mul(1e14)
                return cost.floor()
            },
            base() { 
                let base = tmp.f.cmultpd.mul(15)
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 71)
                return total
            },
            bought() {
                let bought = player.f.cd[0]
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                let eff = Decimal.pow(base, x).mul(tmp.f.cDimMult)
                return eff;
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces casualty power.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return hasMilestone("f", 16) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[0] = player.f.cd[0].add(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.casualty
                let max = f.div(1e14).log10().div(5).ceil()
                let diff = max.sub(player.f.cd[0]).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e5,max)).div(-99999).mul(1e14)
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[0] = player.f.cd[0].add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[71].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        72: {
			title: "Casualty Dimension 2",
			cost(x=player.f.cd[1]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e9, x).mul(1e16)
                return cost.floor()
            },
            base() { 
                let base = tmp.f.cmultpd.mul(10)
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 72)
                return total
            },
            bought() {
                let bought = player.f.cd[1]
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                let eff = Decimal.pow(base, x).mul(tmp.f.cDimMult)
                return eff;
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces Casualty Dimension 1.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return hasMilestone("f", 16) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[1] = player.f.cd[1].add(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.casualty
                let max = f.div(1e16).log10().div(9).ceil()
                let diff = max.sub(player.f.cd[1]).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e9,max)).div(-999999999).mul(1e16)
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[1] = player.f.cd[1].add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[72].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        73: {
			title: "Casualty Dimension 3",
			cost(x=player.f.cd[2]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e13, x).mul(1e29)
                return cost.floor()
            },
            base() { 
                let base = tmp.f.cmultpd.mul(4)
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 73)
                return total
            },
            bought() {
                let bought = player.f.cd[2]
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                let eff = Decimal.pow(base, x).mul(tmp.f.cDimMult)
                return eff;
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces Casualty Dimension 2.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return player.f.best.gte("e120000") || getBuyableAmount("f", 74).gte(1) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[2] = player.f.cd[2].add(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.casualty
                let max = f.div(1e29).log10().div(13).ceil()
                let diff = max.sub(player.f.cd[2]).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e13,max)).div(-1e13).mul(1e29)
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[2] = player.f.cd[2].add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[73].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        74: {
			title: "Casualty Dimension 4",
			cost(x=player.f.cd[3]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e17, x).mul(1e50)
                return cost.floor()
            },
            base() { 
                let base = tmp.f.cmultpd.mul(2)
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 74)
                return total
            },
            bought() {
                let bought = player.f.cd[3]
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                let eff = Decimal.pow(base, x).mul(tmp.f.cDimMult)
                return eff;
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces Casualty Dimension 3.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return player.f.best.gte("e300000") || getBuyableAmount("f", 74).gte(1) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[3] = player.f.cd[3].add(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.casualty
                let max = f.div(1e50).log10().div(17).ceil()
                let diff = max.sub(player.f.cd[3]).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e17,max)).div(-1e17).mul(1e50)
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[3] = player.f.cd[3].add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[74].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        81: {
			title: "Casualty Dimension 5",
			cost(x=player.f.cd[4]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e20, x).mul("1e460")
                return cost.floor()
            },
            base() { 
                let base = tmp.f.cmultpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 81)
                return total
            },
            bought() {
                let bought = player.f.cd[4]
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                let eff = Decimal.pow(base, x).mul(tmp.f.cDimMult)
                return eff;
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces Casualty Dimension 4.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return player.f.best.gte("e1600000") || getBuyableAmount("f", 81).gte(1) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[4] = player.f.cd[4].add(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.casualty
                let max = f.div("1e460").log10().div(20).ceil()
                let diff = max.sub(player.f.cd[4]).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e20,max)).div(-1e20).mul("1e460")
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[4] = player.f.cd[4].add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[81].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        82: {
			title: "Casualty Dimension 6",
			cost(x=player.f.cd[5]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e25, x).mul("1e575")
                return cost.floor()
            },
            base() { 
                let base = tmp.f.cmultpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 82)
                return total
            },
            bought() {
                let bought = player.f.cd[5]
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                let eff = Decimal.pow(base, x).mul(tmp.f.cDimMult)
                return eff;
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces Casualty Dimension 5.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return player.f.best.gte("e2000000") || getBuyableAmount("f", 82).gte(1) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[5] = player.f.cd[5].add(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.casualty
                let max = f.div("1e575").log10().div(25).ceil()
                let diff = max.sub(player.f.cd[5]).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e25,max)).div(-1e25).mul("1e575")
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[5] = player.f.cd[5].add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[82].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        83: {
			title: "Casualty Dimension 7",
			cost(x=player.f.cd[6]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e30, x).mul("1e790")
                return cost.floor()
            },
            base() { 
                let base = tmp.f.cmultpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 83)
                return total
            },
            bought() {
                let bought = player.f.cd[6]
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                let eff = Decimal.pow(base, x).mul(tmp.f.cDimMult)
                return eff;
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces Casualty Dimension 6.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return player.f.best.gte("e2830000") || getBuyableAmount("f", 83).gte(1) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[6] = player.f.cd[6].add(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.casualty
                let max = f.div("1e790").log10().div(30).ceil()
                let diff = max.sub(player.f.cd[6]).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e30,max)).div(-1e30).mul("1e790")
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[6] = player.f.cd[6].add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[83].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        84: {
			title: "Casualty Dimension 8",
			cost(x=player.f.cd[7]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e40, x).mul("1e1905")
                return cost.floor()
            },
            base() { 
                let base = tmp.f.cmultpd
                return base
            },
            gain(x=player[this.layer].buyables[this.id]) {
                let gain = this.effect().mul(x).div(10)
                return gain
            },
            total() {
                let total = getBuyableAmount("f", 84)
                return total
            },
            bought() {
                let bought = player.f.cd[7]
                return bought
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.bought()
                let base = this.base()
                let eff = Decimal.pow(base, x).mul(tmp.f.cDimMult)
                return eff;
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Produces Casualty Dimension 7.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total()) + "(" + formatWhole(this.bought()) + ")"
            },
            unlocked() { return player.f.best.gte("e6750000") || getBuyableAmount("f", 84).gte(1) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[7] = player.f.cd[7].add(1)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            buyMax(b) { 
                let cost = this.cost()
                let f = player.f.casualty
                let max = f.div("1e1905").log10().div(40).ceil()
                let diff = max.sub(player.f.cd[7]).min(b)
                cost = Decimal.sub(1,Decimal.pow(1e40,max)).div(-1e40).mul("1e1905")
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player.f.cd[7] = player.f.cd[7].add(diff)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(diff)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[84].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        91: {
			title: "Casual Replicate Multiplier",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e25, x).mul("1e470")
                return cost.floor()
            },
            total() {
                let total = getBuyableAmount("f", 91)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.total().div(20).add(1)
                let eff = x
                return eff;
            },
			display() { // Everything else displayed in the buyable button after the title
                return "Increase the replicate multiplier.\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Multiplier: " + format(tmp[this.layer].buyables[this.id].effect)+"x\n\
                Amount: " + formatWhole(this.total())
            },
            unlocked() { return hasMilestone("f",17) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[91].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        92: {
			title: "Casual Replicate Interval",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e15, x).mul("1e475")
                return cost.floor()
            },
            max() {
                let max = new Decimal(0.02)
                if (hasFUpg(133)) max = max.div(20)
                return max
            },
            total() {
                let total = getBuyableAmount("f", 92)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.total()
                let eff = Decimal.pow(0.9,x)
                if (hasFUpg(131)) eff = eff.div(getFUpgEff(131))
                if (hasFUpg(132)) eff = eff.div(getFUpgEff(132))
                return eff.max(this.max());
            },
            display() { // Everything else displayed in the buyable button after the title
                let dis = "Reduce the replicate interval."
                if (this.effect().lte(this.max())) dis += " (MAXED)"
                return dis + "\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Interval: " + formatTimeLong(tmp[this.layer].buyables[this.id].effect)+"\n\
                Amount: " + formatWhole(this.total())
            },
            unlocked() { return hasMilestone("f",17) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) && this.effect().gt(this.max()) },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[92].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
        93: {
			title: "Casual Replicated Boosts",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(1e25, x).mul(Decimal.pow(1e5,(x.pow(2).add(x).div(2)))).mul("1e750")
                return cost.floor()
            },
            total() {
                let total = getBuyableAmount("f", 93)
                return total
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = this.total()
                let eff = x
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let dis = "Increase the max Replicated Boosts."
                return dis + "\n\
                Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" casualty\n\
                Max: " + formatWhole(tmp[this.layer].buyables[this.id].effect)+"\n\
                Amount: " + formatWhole(this.total())
            },
            unlocked() { return hasMilestone("f",17) }, 
            canAfford() {
                    return player.f.casualty.gte(tmp[this.layer].buyables[this.id].cost) },
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.f.casualty = player.f.casualty.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                }
            },
            style: {'height':'180px', 'width':'180px',
                "background-color"() {
                    let color = "#bf8f8f"
                    if (tmp.f.buyables[93].canAfford) color = "#3d2963"
                    return color
                }
            },
        },
    },
    upgrades: {
        rows: 13,
        cols: 7,
        11: {
            title: "Lethality",
            description: "Symptoms boost severity after softcap at reduced effect.",
            cost: new Decimal(4),
            effect() {
                let eff = Decimal.pow(10,tmp.s.effbase.pow(player.s.points).log10().pow(0.75))
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(11)) + "x"
            }
        },
        12: {
            title: "Deadliness",
            description: "Deaths boost fatality gain.",
            cost: new Decimal(25),
            effect() {
                let eff = player.d.points.add(10)
                eff = eff.log10().pow(0.2)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(12)) + "x"
            },
            unlocked() {
                return hasFUpg(11)
            }
        },
        13: {
            title: "Mortality",
            description: "'Asymptomatic' reward is applied after softcap at reduced effect.",
            cost: new Decimal(200),
            effect() {
                let eff = challengeEffect("s", 11)
                eff = eff.pow(0.2)
                if (eff.gte("e5e12")) eff = Decimal.pow(10,eff.div("e5e12").log10().pow(0.9)).mul("e5e12")
                if (eff.gte("ee19")) eff = Decimal.pow(10,eff.div("ee19").log10().pow(0.9)).mul("ee19")
                if (eff.gte("ee24")) eff = Decimal.pow(10,eff.div("ee24").log10().pow(0.88)).mul("ee24")
                return eff
            },
            effectDisplay() {
                let dis = format(getFUpgEff(13)) + "x"
                if (this.effect().gte("e5e12")) dis += " (softcapped)"
                return dis
            },
            unlocked() {
                return hasFUpg(12)
            }
        },
        14: {
            title: "Fatally",
            description: "Cases boost fatality gain.",
            cost: new Decimal(500),
            effect() {
                let eff = player.points.add(10)
                eff = eff.log10().pow(0.075)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(14)) + "x"
            },
            unlocked() {
                return hasFUpg(13)
            }
        },
        15: {
            title: "Fatalness",
            description: "Fatality 1st effect is applied after softcap and is stronger based on deaths.",
            cost: new Decimal(2500),
            effect() {
                let eff = player.d.points.add(10)
                eff = eff.log10().add(10)
                eff = eff.log10().pow(2.5)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(15))
            },
            unlocked() {
                return hasFUpg(14)
            }
        },
        21: {
            title: "Severely",
            description: "Fatality boosts severity gain exponent and unlock 3 more symptom buyables.",
            cost: new Decimal(5000),
            effect() {
                let eff = player.f.points.add(10)
                eff = eff.log10().add(10)
                eff = eff.log10().pow(0.25)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(21))
            },
            unlocked() {
                return hasFUpg(15)
            }
        },
        22: {
            title: "Severer",
            description: "Severity boosts fatality gain.",
            cost: new Decimal(8000),
            effect() {
                let eff = player.s.severity.add(10)
                eff = eff.pow("3e-7")
                if (eff.gte(1e30)) eff = Decimal.pow(10,eff.div(1e30).log10().pow(0.4)).mul(1e30)
                if (eff.gte("e40000")) eff = Decimal.pow(10,eff.div("e40000").log10().pow(0.8)).mul("e40000")
                if (eff.gte("e100000")) eff = eff.log10().pow(2e4)
                return eff
            },
            effectDisplay() {
                let dis = format(getFUpgEff(22))+"x"
                if (getFUpgEff(22).gte(1e30)) dis += " (softcapped)"
                return dis
            },
            unlocked() {
                return hasFUpg(21)
            }
        },
        23: {
            title: "Deadlier",
            description: "Fatality boosts death gain.",
            cost: new Decimal(30000),
            effect() {
                let eff = player.f.points.add(1)
                eff = Decimal.pow(10,eff.log10().pow(1.75)).pow(15)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(23))+"x"
            },
            unlocked() {
                return hasFUpg(22)
            }
        },
        24: {
            title: "Infectious",
            description: "Infectivity boosts fatality gain.",
            cost: new Decimal(55555),
            effect() {
                let eff = player.i.points.add(1)
                eff = Decimal.pow(10,eff.log10().pow(0.2)).pow(0.005)
                if (eff.gte("e1000")) eff = Decimal.pow(10,eff.div("e1000").log10().pow(0.7)).mul("e1000")
                if (eff.gte("e30000")) eff = Decimal.pow(10,eff.div("e30000").log10().pow(0.8)).mul("e30000")
                if (eff.gte("e100000")) eff = eff.log10().pow(2e4)
                return eff
            },
            effectDisplay() {
                let dis = format(getFUpgEff(24))+"x"
                if (getFUpgEff(24).gte("e1000")) dis += " (softcapped)"
                return dis
            },
            unlocked() {
                return hasFUpg(23)
            }
        },
        25: {
            title: "More Fatal",
            description: "Add 1 to base fatality gain exponent and autobuy death buyables 100 per second.",
            cost: new Decimal(6e6),
            unlocked() {
                return hasFUpg(24)
            }
        },
        31: {
            title: "Fataler",
            description: "Infectivity boosts 'Fatal'.",
            cost: new Decimal(1e8),
            effect() {
                let eff = player.i.points.add(10)
                eff = eff.log10().pow(0.13)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(31))
            },
            unlocked() {
                return hasFUpg(25)
            }
        },
        32: {
            title: "Fatalest",
            description: "Cases add to the fatality exponent.",
            cost: new Decimal(1e9),
            effect() {
                let eff = player.points.add(10)
                eff = eff.log10().add(10)
                eff = eff.log10().pow(0.175)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(32))
            },
            unlocked() {
                return hasFUpg(31)
            }
        },
        33: {
            title: "Fatal Infection",
            description: "Fatality power boosts 'Infection'.",
            cost: new Decimal(3e13),
            effect() {
                let eff = player.f.p.max(0).add(10)
                eff = eff.log10().pow(0.75)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(33))
            },
            unlocked() {
                return hasMilestone("f", 6)
            }
        },
        34: {
            title: "Powerful Fatalities",
            description: "Fatality boosts fatality power gain.",
            cost: new Decimal(2e14),
            effect() {
                let eff = player.f.points.add(1)
                eff = eff.pow(0.07)
                if (eff.gte("e15000")) eff = eff.div("e15000").pow(0.2).mul("e15000")
                return eff
            },
            effectDisplay() {
                let dis = format(getFUpgEff(34))+"x"
                if (getFUpgEff(34).gte("e15000")) dis += " (softcapped)"
                return dis
            },
            unlocked() {
                return hasFUpg(33)
            }
        },
        35: {
            title: "Death Dimension",
            description: "Deaths boost fatality dimensions.",
            cost: new Decimal(4e16),
            effect() {
                let eff = player.d.points.add(10)
                eff = eff.log10().pow(0.13)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(35))+"x"
            },
            unlocked() {
                return hasFUpg(34)
            }
        },
        41: {
            title: "Case Dimension",
            description: "Cases boost fatality dimensions.",
            cost: new Decimal(1e23),
            effect() {
                let eff = player.points.add(10)
                eff = eff.log10().add(10)
                eff = eff.log10()
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(41))+"x"
            },
            unlocked() {
                return hasFUpg(35)
            }
        },
        42: {
            title: "Powerful Power",
            description: "Fatality power boosts fatality exponent.",
            cost: new Decimal(3.5e35),
            effect() {
                let eff = player.f.p.add(10)
                eff = eff.log10().pow(0.2)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(42))
            },
            unlocked() {
                return hasFUpg(41)
            }
        },
        43: {
            title: "Powerful Cases",
            description: "Fatality power boosts cases gain.",
            cost: new Decimal(4e40),
            effect() {
                let eff = player.f.p.add(10)
                eff = eff.log10().pow(0.14)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(43))
            },
            unlocked() {
                return hasFUpg(42)
            }
        },
        44: {
            title: "Fatal Fatalities",
            description: "Fatality boosts cases gain.",
            cost: new Decimal(5.05e50),
            effect() {
                let eff = player.f.points.add(10)
                eff = eff.log10().pow(0.2)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(44))
            },
            unlocked() {
                return hasFUpg(43)
            }
        },
        45: {
            title: "Deadly Power",
            description: "Fatality power boosts death gain.",
            cost: new Decimal(6.06e60),
            effect() {
                let eff = player.f.p.add(1)
                eff = eff.pow(1000)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(45))+"x"
            },
            unlocked() {
                return hasFUpg(44)
            }
        },
        51: {
            title: "Fatal Deaths",
            description: "Deaths add to the fatality exponent.",
            cost: new Decimal(7.07e70),
            effect() {
                let eff = player.d.points.add(1)
                eff = eff.log10().pow(0.197)
                if (eff.gte(1e6)) eff = eff.log10().add(4).pow(6)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(51))
            },
            unlocked() {
                return hasFUpg(45)
            }
        },
        52: {
            title: "Severity Dimension",
            description: "Severity boosts fatality dimensions.",
            cost: new Decimal(1.62e162),
            effect() {
                let eff = player.s.severity.add(10)
                eff = eff.log10().pow(0.6)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(52))+"x"
            },
            unlocked() {
                return hasFUpg(51)
            }
        },
        53: {
            title: "Infected Dimension",
            description: "Infectivity increases multiplier per dimension.",
            cost: new Decimal(2.06e206),
            effect() {
                let eff = player.i.points.add(10)
                eff = eff.log10().add(10)
                eff = eff.log10().pow(0.1).div(2)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(53))
            },
            unlocked() {
                return hasFUpg(52)
            }
        },
        54: {
            title: "Uncoated Fatalities",
            description: "Fatality boosts uncoaters 1st effect.",
            cost: new Decimal(2.626e262),
            effect() {
                let eff = player.f.points.add(10)
                eff = eff.log10().pow(2.35)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(54))
            },
            unlocked() {
                return hasFUpg(53)
            }
        },
        55: {
            title: "Uncoated Dimension",
            description: "Uncoaters boost fatality dimensions.",
            cost: new Decimal(2.75e275),
            effect() {
                let eff = player.u.points.add(1)
                eff = eff.pow(1.7)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(55))+"x"
            },
            unlocked() {
                return hasFUpg(54)
            }
        },
        61: {
            title: "Replicated Dimension",
            description: "Replicators boost fatality dimensions.",
            cost: new Decimal("3.535e353"),
            effect() {
                let eff = player.r.points.add(1).pow(0.75)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(61))+"x"
            },
            unlocked() {
                return hasFUpg(55)
            }
        },
        62: {
            title: "Replicated Power",
            description: "Replicators boost fatality power effect.",
            cost: new Decimal("5.05e505"),
            effect() {
                let eff = player.r.points.add(10).log10().div(7.45)
                if (eff.gte(1.2)) eff = eff.div(1.1).pow(0.5).mul(1.2)
                return eff.max(1)
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(62))
            },
            unlocked() {
                return hasFUpg(61)
            }
        },
        63: {
            title: "Multiplied Fatalities",
            description: "Fatality adds to the Dimension Multiplier base.",
            cost: new Decimal("9.111e911"),
            effect() {
                let eff = player.f.points.add(10)
                eff = eff.log10().pow(0.05).div(50)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(63))
            },
            unlocked() {
                return hasFUpg(62)
            }
        },
        64: {
            title: "Multiplied Cases",
            description: "Cases add to the Dimension Multiplier base.",
            cost: new Decimal("1.158e1158"),
            effect() {
                let eff = player.points.add(10)
                eff = eff.log10().pow(0.07).div(930)
                if (eff.gte(0.115)) eff = eff.div(0.115).pow(0.4).mul(0.115)
                if (eff.gte(0.3)) eff = eff.div(0.3).pow(0.1).mul(0.3)
                return eff
            },
            effectDisplay() {
                return "+"+format(getFUpgEff(64))
            },
            unlocked() {
                return hasFUpg(63)
            }
        },
        65: {
            title: "Scaling Reduction",
            description: "Reduce the Dimension and Dimension Boost cost scaling by 1.",
            cost: new Decimal("1.515e1515"),
            unlocked() {
                return hasFUpg(64)
            }
        },
        71: {
            title: "8 Dimension Cases",
            description: "Fatality Dimension 8 gives 2 free 'Cases Boost'.",
            cost: new Decimal("1.731e1731"),
            unlocked() {
                return hasFUpg(65)
            }
        },
        72: {
            title: "Boosted Boosts",
            description: "Multiply the Dimension Boost base by 2.",
            cost: new Decimal("2.092e2092"),
            unlocked() {
                return hasFUpg(71)
            }
        },
        73: {
            title: "BULK",
            description: "Reduce the Dimension cost scaling by 1 and autobuyers buy 1,000x more and 2x faster.",
            cost: new Decimal("2.888e2888"),
            unlocked() {
                return hasFUpg(72)
            }
        },
        74: {
            title: "Boost Scaling",
            description: "Reduce the Dimension Boost cost scaling by 0.5.",
            cost: new Decimal("3.222e3222"),
            unlocked() {
                return hasFUpg(73)
            }
        },
        75: {
            title: "Boost Boosters",
            description: "Multiply Dimension Boost base by 5 and Multiplier Boost is 1.125x stronger.",
            cost: new Decimal("4.134e4134"),
            unlocked() {
                return hasFUpg(74)
            }
        },
        81: {
            title: "Virus Dimension",
            description: "VP boosts fatality dimensions.",
            cost: new Decimal(1),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.v.points.add(10)
                eff = eff.log10().pow(0.5)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(81))+"x"
            },
            unlocked() {
                return hasMilestone("f",12)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(81)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(1)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        82: {
            title: "Stronger Dimensions",
            description: "Increase the multiplier per Dimension by +0.3.",
            cost: new Decimal(1),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasMilestone("f",12)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(82)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(1)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        91: {
            title: "Casualty 18",
            description: "Total casualty boosts Fatality Dimension 1 and 8.",
            cost: new Decimal(1),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualtyTotal.add(1)
                eff = eff.pow(15)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(91))+"x"
            },
            unlocked() {
                return hasFUpg(81)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(91)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(1)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        92: {
            title: "Casualty 27",
            description: "Total casualty boosts Fatality Dimension 2 and 7.",
            cost: new Decimal(1),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualtyTotal.add(1)
                eff = eff.pow(15)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(92))+"x"
            },
            unlocked() {
                return hasFUpg(82)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(92)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(1)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        101: {
            title: "Casualty 36",
            description: "Total casualty boosts Fatality Dimension 3 and 6.",
            cost: new Decimal(1),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualtyTotal.add(1)
                eff = eff.pow(15)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(101))+"x"
            },
            unlocked() {
                return hasFUpg(91)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(101)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(1)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        102: {
            title: "Casualty 45",
            description: "Total casualty boosts Fatality Dimension 4 and 5.",
            cost: new Decimal(1),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualtyTotal.add(1)
                eff = eff.pow(15)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(92))+"x"
            },
            unlocked() {
                return hasFUpg(92)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(102)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(1)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        111: {
            title: "Scaled Dimension",
            description: "Reduce the Dimension, and Multiplier Boost scaling by 1.",
            cost: new Decimal(3),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasFUpg(101)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(111)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(3)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        112: {
            title: "Stronger Multipliers",
            description: "Multiplier Boosts are 1.3x stronger.",
            cost: new Decimal(3),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasFUpg(102)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(112)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(3)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        83: {
            title: "Sacrificed Fatality",
            description: "Unlock Sacrifice.",
            cost: new Decimal(5),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasMilestone("f",12)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(83)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(5)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        93: {
            title: "Dimension 55555",
            description: "Multiply Dimension Boost base by 5.",
            cost: new Decimal(7),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasFUpg(83)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(93)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(7)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        103: {
            title: "Casualty Boost",
            description: "Casualty boosts Fatality Dimensions.",
            cost: new Decimal(10),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualty.add(1)
                eff = eff.pow(20)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(103))+"x"
            },
            unlocked() {
                return hasFUpg(93)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(103)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(10)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        113: {
            title: "Casualty Auto Gain",
            description: "Gain 50% of best casualty/min.",
            cost: new Decimal(15),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.cpm.mul(0.5)
                return eff
            },
            effectDisplay() {
                let dis = format(getFUpgEff(113))+"/s"
                if (getFUpgEff(113).lt(10)) dis = format(getFUpgEff(113).mul(60))+"/min"
                return dis
            },
            unlocked() {
                return hasFUpg(103)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(113)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(15)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        84: {
            title: "Scaled",
            description: "You start with 2 Dimension Shifts, Reduce Dimension scaling by 1, Dimension Boost scaling by 0.5.",
            cost: new Decimal(30),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasMilestone("f",12)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(84)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(30)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        94: {
            title: "Powerful Casualties",
            description: "Fatality power boosts casualty gain.",
            cost: new Decimal(110),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.p.add(10)
                eff = eff.log10().pow(0.2)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(94))+"x"
            },
            unlocked() {
                return hasFUpg(84)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(94)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(110)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        104: {
            title: "Casual Cases",
            description: "Cases boost casualty gain.",
            cost: new Decimal(2000),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.points.add(10)
                eff = eff.log10().pow(0.02)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(104))+"x"
            },
            unlocked() {
                return hasFUpg(94)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(104)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(2000)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        114: {
            title: "Severe Casualties",
            description: "Severity boosts casualty gain.",
            cost: new Decimal(15e3),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.s.severity.add(10)
                eff = eff.log10().pow(0.1)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(114))+"x"
            },
            unlocked() {
                return hasFUpg(104)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(114)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(15e3)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        85: {
            title: "Deadly Casualties",
            description: "Deaths boost casualty gain.",
            cost: new Decimal(5e6),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.d.points.add(10)
                eff = eff.log10().pow(0.15)
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(85))+"x"
            },
            unlocked() {
                return hasFUpg(114)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(85)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(5e6)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        95: {
            title: "Casual Casualties",
            description: "Casualty boosts cases gain.",
            cost: new Decimal(3e9),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualty.add(10)
                eff = eff.log10().add(10)
                eff = eff.log10().pow(5)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(95))
            },
            unlocked() {
                return hasFUpg(85)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(95)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(3e9)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        105: {
            title: "Casual Multipliers",
            description: "Casualty boosts Multiplier Boosts.",
            cost: new Decimal(8e9),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualty.add(10)
                eff = eff.log10().add(10)
                eff = eff.log10().pow(1.2)
                if (eff.gte(1.7)) eff = eff.div(1.7).pow(0.3).mul(1.7)
                return eff
            },
            effectDisplay() {
                let dis = format(getFUpgEff(105))+"x"
                if (getFUpgEff(105).gte(1.7)) dis += " (softcapped)"
                return dis
            },
            unlocked() {
                return hasFUpg(95)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(105)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(8e9)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        115: {
            title: "Casual Scaling",
            description: "Reduce the Dimension, and Multiplier Boost scaling by 1.",
            cost: new Decimal(1e11),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasFUpg(105)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(115)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(1e11)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        121: {
            title: "Stronger Casualties",
            description: "Multiplier Boosts are 1.35x stronger.",
            cost: new Decimal(2e19),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasFUpg(115)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(121)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(2e19)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        122: {
            title: "Casual Boosts",
            description: "Casualty boosts Dimension Boost base, Reduce Dimension scaling by 1, Dimension Boost scaling by 0.5.",
            cost: new Decimal(2.828e28),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualty.add(10)
                eff = eff.log10()
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(122))+"x"
            },
            unlocked() {
                return hasFUpg(121)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(122)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(2.828e28)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        123: {
            title: "Case-ual Boosts",
            description: "Casualty gives free 'Cases Boost' and buyable autobuyers buy ^2 more.",
            cost: new Decimal(4.141e41),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualty.add(10)
                eff = eff.log10().pow(0.3).mul(400)
                return eff.floor()
            },
            effectDisplay() {
                return "+"+formatWhole(getFUpgEff(123))
            },
            unlocked() {
                return hasFUpg(122)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(123)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(4.141e41)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        124: {
            title: "Fatal Casualties",
            description: "Casualty boosts fatality effect.",
            cost: new Decimal(9.393e93),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualty.add(10)
                eff = eff.log10().mul(50)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(124))
            },
            unlocked() {
                return hasFUpg(123)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(124)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte(9.393e93)) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        125: {
            title: "Case PoWeR",
            description: "Casualty power boosts cases gain.",
            cost: new Decimal("3.69e369"),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.cp.add(10)
                eff = eff.log10().add(10)
                eff = eff.log10().pow(5)
                return eff
            },
            effectDisplay() {
                return "^"+format(getFUpgEff(125))
            },
            unlocked() {
                return hasFUpg(124)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(125)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte("3.69e369")) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        131: {
            title: "Casual Replication",
            description: "Casualty reduces replicate interval.",
            cost: new Decimal("5e500"),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.f.casualty.add(10)
                eff = eff.log10().add(10)
                eff = eff.log10()
                return eff
            },
            effectDisplay() {
                return format(getFUpgEff(131))+"x"
            },
            unlocked() {
                return hasMilestone("f",17)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(131)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte("5e500")) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        132: {
            title: "Replicated Replication",
            description: "Replicators reduce interval and boost Multiplier Boosts.",
            cost: new Decimal("6.06e606"),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            effect() {
                let eff = player.r.points.add(10)
                eff = eff.log10().add(10)
                eff = eff.log10().pow(3)
                return eff
            },
            effect2() {
                let eff = player.r.points.add(10)
                eff = eff.log10().add(10)
                eff = eff.log10().pow(0.5)
                return eff
            },
            effectDisplay() {
                return "Interval:" + format(this.effect())+"x, Boosts:" + format(this.effect2())+"x"
            },
            unlocked() {
                return hasFUpg(131)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(132)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte("6.06e606")) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        133: {
            title: "Distance",
            description: "Divide the max interval by 20 and Distant scaling starts 20 later.",
            cost: new Decimal("7.92e792"),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasFUpg(132)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(133)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte("7.92e792")) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        134: {
            title: "Replicated Scaling",
            description: "Reduce the Dimension and Dimension Boost scaling by 0.5.",
            cost: new Decimal("1.107e1107"),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasFUpg(133)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(134)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte("1.107e1107")) color = "#3d2963"
                    return color
                    }
                }
            }
        },
        135: {
            title: "Casual Casual",
            description: "Increase the Casualty Multiplier base by +0.1.",
            cost: new Decimal("2.1e2100"),
            currencyDisplayName: "casualty",
            currencyInternalName: "casualty",
            currencyLayer: "f",
            unlocked() {
                return hasFUpg(134)
            },
            style: {
                "background-color"() {
                    if (!hasFUpg(135)) {
                    let color = "#bf8f8f"
                    if (player.f.casualty.gte("2.1e2100")) color = "#3d2963"
                    return color
                    }
                }
            }
        },
    },
    
    challenges: { 
        rows: 6,
        cols: 2,
        11: {
            name: "Fatality Challenge 1",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            challengeDescription: function() {
                let c11 = "Fatality power/1.8e308."
                if (inChallenge("f", 11)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 11) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal("5.095e5095")
            },
            rewardDescription: "Unlock Fatality Dimension 1,2,3 Autobuyer.",
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(11)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return hasMilestone("f", 12)
            }
        },
        12: {
            name: "Fatality Challenge 2",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            challengeDescription: function() {
                let c11 = "Multiplier per Fatality Dimension is 1."
                if (inChallenge("f", 12)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 12) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal("5.095e5095")
            },
            rewardDescription: "Unlock Fatality Dimension 4,5,6 Autobuyer.",
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(12)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return hasMilestone("f", 12)
            }
        },
        21: {
            name: "Fatality Challenge 3",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            challengeDescription: function() {
                let c11 = "Dimension cost scaling is 100x."
                if (inChallenge("f", 21)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 21) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal("5.095e5095")
            },
            rewardDescription: "Unlock Fatality Dimension 7,8, Multiplier Autobuyer.",
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(21)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return hasMilestone("f", 12)
            }
        },
        22: {
            name: "Fatality Challenge 4",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            challengeDescription: function() {
                let c11 = "You can't buy Dimension Boosts. Multiplier Boosts cost Fatality Dimension 6 and they are 1.5x stronger."
                if (inChallenge("f", 22)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 22) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal("5.095e5095")
            },
            rewardDescription: "Unlock Dimension and Multiplier Boost Autobuyer.",
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(22)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return hasMilestone("f", 12)
            }
        },
        31: {
            name: "Casualty Challenge 1",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            countsAs: [11,12,21,22],
            challengeDescription: function() {
                let c11 = "All Fatality Challenges are applied at once. You can't gain deaths. Fatality gain is gain from 1.000e10,450 deaths"
                if (inChallenge("f", 31)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 31) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal("e26000")
            },
            rewardDescription() {
                let des =  "Casualty boosts Casualty Dimensions."
                return des
            },
            rewardEffect() {
                 let c12 = player.f.casualty.add(10)
                 c12 = c12.log10().pow(1.5)
                 return c12
            },
            rewardDisplay() {return format(this.rewardEffect()) + 'x'},
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(31)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return player.f.best.gte("1e155000")
            }
        },
        32: {
            name: "Casualty Challenge 2",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            challengeDescription: function() {
                let c11 = "Multiplier Boosts are useless."
                if (inChallenge("f", 32)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 32) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal("e61000")
            },
            rewardDescription() {
                let des =  "More powerful Sacrifice."
                return des
            },
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(32)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return player.f.best.gte("1e177000")
            }
        },
        41: {
            name: "Casualty Challenge 3",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            challengeDescription: function() {
                let c11 = "Dimension scaling is 1.8e308x"
                if (inChallenge("f", 41)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 41) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal("e175500")
            },
            rewardDescription() {
                let des =  "Reduce the Dimension scaling by 1."
                return des
            },
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(41)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return player.f.best.gte("1e350000")
            }
        },
        42: {
            name: "Casualty Challenge 4",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            challengeDescription: function() {
                let c11 = "Fatality gain is ^0.1."
                if (inChallenge("f", 42)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 42) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal("e20000")
            },
            rewardDescription() {
                let des =  "Fatality gain is ^1.05 and casualty power effect is ^1.5."
                return des
            },
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(42)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return player.f.best.gte("1e410000")
            }
        },
        51: {
            name: "Casualty Challenge 5",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            challengeDescription: function() {
                let c11 = "Fatality gain exp is ^0.75."
                if (inChallenge("f", 51)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 51) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal("e11850")
            },
            rewardDescription() {
                let des =  "Multiplier Boosts are 1.2x stronger."
                return des
            },
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(51)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return player.f.best.gte("1e550000")
            }
        },
        52: {
            name: "Casualty Challenge 6",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            challengeDescription: function() {
                let c11 = "Fatality power is useless."
                if (inChallenge("f", 52)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 52) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal("e130000")
            },
            rewardDescription() {
                let des =  "Fatality Dimension Multiplier boosts Casualty Dimensions."
                return des
            },
            rewardEffect() {
                let c12 = tmp.f.buyables[31].effect
                c12 = c12.pow(2e-4)
                return c12
           },
           rewardDisplay() {return format(this.rewardEffect()) + 'x'},
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(52)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return player.f.best.gte("1e720000")
            }
        },
        61: {
            name: "Casualty Challenge 7",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            countsAs: [12],
            challengeDescription: function() {
                let c11 = "Dimension Boosts are the only thing that boosts dimensions."
                if (inChallenge("f", 61)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 61) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal("e157630")
            },
            rewardDescription() {
                let des =  "Fatality boosts Dimension Boosts."
                return des
            },
            rewardEffect() {
                let c12 = player.f.points.add(10)
                c12 = c12.log10().pow(0.7)
                return c12
           },
           rewardDisplay() {return format(this.rewardEffect()) + 'x'},
            onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(61)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return player.f.best.gte("1e800000")
            }
        },
        62: {
            name: "Casualty Challenge 8",
            currencyDisplayName: "fatality",
            currencyInternalName: "points",
            currencyLayer: "f",
            countsAs: [12],
            challengeDescription: function() {
                let c11 = "Casualty power is the only thing that boosts dimensions."
                if (inChallenge("f", 62)) c11 = c11 + " (In Challenge)"
                if (challengeCompletions("f", 62) == 1) c11 = c11 + " (Completed)"
                return c11
            },
            goal(){
                return new Decimal("e360000")
            },
            rewardDescription() {
                let des =  "Fatality boosts casualty power effect."
                return des
            },
            rewardEffect() {
                let c12 = player.f.points.add(10)
                c12 = c12.log10().add(10)
                c12 = c12.log10().pow(0.1)
                return c12
           },
           rewardDisplay() {return "^"+format(this.rewardEffect())},
           onStart(testInput=false) { 
                if (testInput) {
                    startCChallenge(62)
                }
            },
            onComplete() {
                player.f.casualty = player.f.casualty.add(tmp.f.buyables[34].effect)
                player.f.casualtyTotal = player.f.casualtyTotal.add(tmp.f.buyables[34].effect)
            },
            unlocked(){
                return player.f.best.gte("1e1137000")
            }
        },
    },
    bars: {
        NextCD: {
            direction: RIGHT,
            width: 700,
            height: 30,
            fillStyle: {'background-color' : "#3d2963"},
            req() {
                let req =tmp.f.buyables[84].unlocked ? new Decimal("10")
                :tmp.f.buyables[83].unlocked ? new Decimal("e6750000")
                :tmp.f.buyables[82].unlocked ? new Decimal("e2830000")
                :tmp.f.buyables[81].unlocked ? new Decimal("e2000000")  
                :tmp.f.buyables[74].unlocked ? new Decimal("e1600000") 
                :tmp.f.buyables[73].unlocked ? new Decimal("e300000")
                :new Decimal("e120000")
                return req
            },
            display() {
                let f = player.f.points.add(1)
                let r = "Get " + format(this.req()) + " fatality to unlock a new Dimension. (" + format(f.log10().div(this.req().log10()).mul(100).min(100)) + "%)"
                if (tmp.f.buyables[84].unlocked ) r = "All Dimensions Unlocked"
                return r
            },
            progress() { 
                let f = player.f.points.add(1)
                let p = tmp.f.buyables[84].unlocked ? 1 :f.log10().div(this.req().log10())
                return p
            },
        },
        NextCC: {
            direction: RIGHT,
            width: 700,
            height: 30,
            fillStyle: {'background-color' : "#3d2963"},
            req() {
                let req = tmp.f.challenges[62].unlocked ? new Decimal("10")
                :tmp.f.challenges[61].unlocked ? new Decimal("e1137000") 
                :tmp.f.challenges[52].unlocked ? new Decimal("e800000") 
                :tmp.f.challenges[51].unlocked ? new Decimal("e720000")
                :tmp.f.challenges[42].unlocked ? new Decimal("e550000") 
                :tmp.f.challenges[41].unlocked ? new Decimal("e410000")
                :tmp.f.challenges[32].unlocked ? new Decimal("e350000") 
                :tmp.f.challenges[31].unlocked ? new Decimal("e177000") 
                :new Decimal("e155000")
                return req
            },
            display() {
                let f = player.f.points.add(1)
                let r = "Get " + format(this.req()) + " fatality to unlock a new Challenge. (" + format(f.log10().div(this.req().log10()).mul(100).min(100)) + "%)"
                if (tmp.f.challenges[62].unlocked) r = "All Challenges Unlocked"
                return r
            },
            progress() { 
                let f = player.f.points.add(1)
                let p = tmp.f.challenges[62].unlocked ? 1 : f.log10().div(this.req().log10())
                return p
            },
        },
    }
})
