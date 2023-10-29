let modInfo = {
	name: "The Fame Tree",
	id: "jezzacozziefametree",
	author: "jezzacozzie",
	pointsName: "popularity",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (1), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.2.0",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h2>v0.2.0</h2><br>
		- Added interactions.<br>
		- Added 5 upgrades.<br>
		- Added 2 achievements.<br>
		- Added 1 milestone.<br>
		- Added 1 advertisement.<br>
	<h3>v0.1.3</h3><br>
		- Added 6 upgrades.<br>
		- Added 1 achievement.<br>
	<h3>v0.1.2</h3><br>
		- Added 2 upgrades.<br>
		- Added 1 milestone.<br>
	<h3>v0.1.1</h3><br>
		- Added 3 upgrades.<br>
		- Added 2 milestones.<br>
		- Added 1 achievement.<br>
		- Rebalanced 'Loyal Viewers'.<br>
		- Rebalanced an upgrade.<br>
	<h2>v0.1.0</h2><br>
		- Added viewers.<br>
		- Added 3 upgrades.<br>
		- Added 2 achievements.<br>
		- Added 1 buyable.<br>
		- Added 1 milestone.<br>
	<h3>v0.0.2</h3><br>
		- Added 5 upgrades.<br>
		- Added 1 achievement.<br>
		- Balanced fame upgrades.<br>
	<h3>v0.0.1</h3><br>
		- Added fame.<br>
		- Added 5 upgrades.<br>
		- Added 3 achievements.<br>
	<h3>v0.0.0</h3><br>
		- Created this changelog.<br>
		- Updated this mod's name.<br>
		- Updated the name of points.<br>`
	

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	if (hasUpgrade('f', 11)) gain = gain.add(0.1)
	if (hasUpgrade('f', 12)) gain = gain.times(upgradeEffect ('f', 12))
	if (hasUpgrade('f', 14)) gain = gain.times(upgradeEffect ('f', 14))
	if (hasUpgrade('f', 21)) gain = gain.add(0.1)
	if (hasUpgrade('v', 21)) gain = gain.times(upgradeEffect ('v', 21))
	if (hasUpgrade('v', 23)) gain = gain.pow(upgradeEffect('v', 23))
	if (player.v.unlocked) gain = gain.times(tmp.v.effect)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	`<h3><a>Endgame: 30 interactions.</a></h3>`
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}