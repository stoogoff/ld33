
define(function(require) {
	// imports
	var inherits = require("../utils/inherits");
	var Interval = require("../utils/interval");

	// 'abstract' class
	var Stage = function() {
		this.intervals = {};
		this.updates = {};

		this.started = false;
		this.intervals.started = new Interval(3000);

		this.chasmChance = 0;
	};

	// update all timers
	Stage.prototype.update = function(time) {
		for(var i in this.intervals) {
			this.updates[i] = this.intervals[i].next(time);
		}

		if(this.updates.started) {
			this.started = true;
			delete this.updates.started;
			delete this.intervals.started;
		}
	};

	Stage.prototype.next = function(interval) {
		return this.updates[interval];
	};

	// methods for determining if the game screen should add objects
	/*Stage.prototype.addVillager = function() {
		// this may not be right as villagers should *only* appear from huts
		return // number to add, position is up to caller
	};*/
	Stage.prototype.addHut = function() {
		return false;
	};

	// adding a chasm signifies the end of the stage
	Stage.prototype.addChasm = function() {
		return Math.random() <= this.chasmChance;
	};
	/*Stage.prototype.addEnemy = function() {
		return // enemy class to add or null
	};*/

	// concrete instances
	var VillageStage = function() {
		Stage.call(this);

		this.intervals.hut = new Interval(1000);
		this.intervals.slowHut = new Interval(7000);
		this.intervals.end = new Interval(15000);

		this.chasmChance = 0;
		this.hutChance = 0.7;
	};

	inherits(VillageStage, Stage);

	VillageStage.prototype.addHut = function() {
		// this should return false to start with
		// then return true so 5-10 huts are returned in a cluster
		// then return true so 1-2 huts per screen are returned
		// then return false until the chasm

		// haven't started yet, do nothing
		if(!this.started) {
			return false;
		}

		// ending, so no more huts but 100% chasm
		if(this.next("end")) {
			this.hutChance = 0;
			this.chasmChance = 1;
			this.started = false;
		}

		// reduce the chance of the hut
		if(this.next("slowHut")) {
			this.hutChance = 0.3;
		}

		return this.next("hut") && Math.random() <= this.hutChance;
	};

	var PitchforkStage = function() {
		Stage.call(this);
	};

	inherits(PitchforkStage, Stage);

	var CastleStage = function() {
		Stage.call(this);
	};

	inherits(CastleStage, Stage);

	var TerrainStage = function() {
		Stage.call(this);
	};

	inherits(TerrainStage, Stage);

	return {
		"Village": VillageStage,
		"Pitchfork": PitchforkStage,
		"Terrain": TerrainStage,
		"Castle": CastleStage
	};
});