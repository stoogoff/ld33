
define(function(require) {
	// imports
	var inherits = require("../utils/inherits");
	var constants = require("../utils/constants");
	var helpers = require("../utils/helpers");
	var Interval = require("../utils/interval");

	// 'abstract' class
	var Stage = function() {
		this.intervals = {};
		this.updates = {};

		this.started = false;
		this.finished = false;
		this.intervals.started = new Interval(3000);
		this.intervals.chasm = new Interval(3000);

		this.chasmChance = 0;
		this.ledgeChance = 0;
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

	// check to see if a timer has updated
	Stage.prototype.next = function(interval) {
		return this.updates[interval];
	};

	// methods for determining if the game screen should add objects

	Stage.prototype.getEnemy = function(hut, player) {
		// villagers spawn if Troll is within x of hut
		// a villager can spawn each second
		// the chance of a villager spawning goes down every time a villager spawns
		// once the hut is passed Troll no more villagers spawn
		var distance = hut.x - player.x;

		if(distance < 0) {
			return false;
		}

		// TODO different types of villager depending on stage
		return distance <= constants.FEAR_RANGE ? "Villager" : null;
	};
	Stage.prototype.addHut = function() {
		return false;
	};

	Stage.prototype.addChasm = function() {
		if(!this.next("chasm")) {
			return;
		}

		return Math.random() <= this.chasmChance;
	};

	Stage.prototype.addLedge = function() {
		return Math.random() <= this.ledgeChance;
	};

	// CONCRETE INSTANCES

	// basic village stage which starts everything off
	var VillageStage = function(speed) {
		Stage.call(this);

		if(!speed) {
			speed = 0;
		}

		this.intervals.hut = new Interval(helpers.clamp(1000 - speed, 500, 1000));
		this.intervals.slowHut = new Interval(helpers.clamp(7000 - speed, 5000, 7000));
		this.intervals.end = new Interval(15000);

		this.hutChance = 0.7;
		this.chasmChance = 0.3;
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

	VillageStage.prototype.getEnemy = function(hut, player) {
		// villagers spawn if Troll is within x of hut
		// a villager can spawn each second
		// the chance of a villager spawning goes down every time a villager spawns
		// once the hut is passed Troll no more villagers spawn
		var distance = hut.x - player.x;

		if(distance < 0) {
			return false;
		}

		// TODO different types of villager depending on stage
		return distance <= constants.FEAR_RANGE ? "Villager" : null;
	};

	VillageStage.prototype.addChasm = function() {
		var result = Stage.prototype.addChasm.call(this);

		if(result) {
			this.finished = true;
		}

		return result;
	};

	// terrain stage with many chasms
	var TerrainStage = function() {
		VillageStage.call(this);

		this.intervals.chasm = new Interval(2000);
		this.intervals.ledge = new Interval(2500);
		this.chasmChance = 0.5;
		this.ledgeChance = 0.5;
		this.chasms = 5;
		this.hutChance = 0.3;
	};

	inherits(TerrainStage, VillageStage);

	TerrainStage.prototype.addChasm = function() {
		if(!this.started) {
			return false;
		}

		// reduce the chance of the chasm
		if(!this.next("chasm")) {
			return false;
		}

		var result = Stage.prototype.addChasm.call(this);

		if(--this.chasms == 0) {
			this.finished = true;
		}

		return result;
	};

	TerrainStage.prototype.addLedge = function() {
		if(!this.started) {
			return false;
		}

		// reduce the chance of the ledge
		if(!this.next("ledge")) {
			return false;
		}

		return Stage.prototype.addLedge.call(this);
	};

	// Demo stage just spawns a succession of enemies
	var EmptyStage = function() {
		Stage.call(this);
	};

	inherits(EmptyStage, Stage);

	/////////////////
	// TODO
	/////////////////

	var PitchforkStage = function() {
		Stage.call(this);
	};

	inherits(PitchforkStage, Stage);

	var CastleStage = function() {
		Stage.call(this);
	};

	inherits(CastleStage, Stage);

	return {
		"Village": VillageStage,
		"Pitchfork": PitchforkStage,
		"Terrain": TerrainStage,
		"Castle": CastleStage,
		"Empty": EmptyStage
	};
});