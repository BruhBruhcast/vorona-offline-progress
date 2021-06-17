function powExp(n, exp){
	if (n.lt(10)) return n
	return Decimal.pow(10,n.log10().pow(exp))
}

function powExp2(n, exp){
	if (n.lt(1e10)) return n
	return Decimal.pow(10,Decimal.pow(10,n.log10().log10().pow(exp)))
}

function powExp3(n, exp){
	if (n.lt(Decimal.pow(10,1e10))) return n
	return Decimal.pow(10,Decimal.pow(10,Decimal.pow(10,n.log10().log10().log10().pow(exp))))
}

function powSlog(n, exp){
	if (n.lt(10)) return n
	return tet10(slog(n).pow(exp))
}

function slog(n){
	n = new Decimal(n)
	return Decimal.add(n.layer,new Decimal(n.mag).slog())
}

function slogadd(n,add){
	n = new Decimal(n)
	return Decimal.tetrate(10,slog(n).add(add))
}

function tet10(n){
	n = new Decimal(n)
	return Decimal.tetrate(10,n)
}

// ************ Big Feature related ************
function getTimesRequired(chance, r1){
	chance = new Decimal(chance)
	if (chance.gte(1)) return 1
	if (chance.lte(0)) return Infinity
	if (r1 == undefined) r1 = Math.random()
	//we want (1-chance)^n < r1
	let n
	if (chance.log10().gt(-5)){
			n = Decimal.ln(r1).div(Math.log(1-chance))
	} else {
			n = Decimal.ln(1/r1).div(chance)
	}
	//log(1-chance) of r2
	return n.floor().add(1)
}
function bulkRoll(chance,ms) {
	let c = getTimesRequired(Decimal.sub(1,Decimal.sub(1,chance).pow(ms/50))).mul(ms/50)
	return c.floor()
}

function recurse(func, startingValue, times){
	if (times <= 0) return startingValue
	return recurse(func, func(startingValue), times-1)
}