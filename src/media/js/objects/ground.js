
define(function(require) {
	// imports
	var Parallax = require("./parallax");
	var inherits = require("../utils/inherits");
	var helpers = require("../utils/helpers");
	var constants = require("../utils/constants");

	// graphics
	var gfx = ["ground1", "ground1", "ground2", "ground3"];

	var Ground = function(game, x, y) {
		Phaser.Sprite.call(this, game, x, y, Phaser.ArrayUtils.getRandomItem(gfx));

		// set physics and game specific stuff
		game.physics.arcade.enable(this);
		game.add.existing(this);

		this.anchor.setTo(0, 0.5);
		this.body.allowGravity = false;
		this.body.allowRotation = false;
		this.body.immovable = true;
		this.body.friction.x = 0;
	};

	inherits(Ground, Phaser.Sprite);

	// groups the aliens together
	var GroundGroup = function(game, parent) {
		Parallax.call(this, game, parent);
	};

	inherits(GroundGroup, Parallax);

	// create a tile of ground objects
	GroundGroup.prototype.set = function() {
		var tilesNeeded = Math.ceil(constants.SCREEN_WIDTH / constants.TILE_WIDTH) + 2;

		for(var i = 0; i < tilesNeeded; ++i) {
			this.add(new Ground(this.game, constants.TILE_WIDTH * i, constants.SCREEN_HEIGHT));
		}
	};

	// return the y position of the tile at x
	GroundGroup.prototype.isChasmAtX = function(x) {
		var tile = null;

		this.forEach(function(child) {
			if(child.x > x && child.x + child.width < x) {
				tile = child;
			}
		}, this, true);

		if(tile) {
			return tile.y > constants.SCREEN_HEIGHT;
		}

		return false;
	};

	// push the next offscreen tile down so it's off screen leaving a gap in the ground
	GroundGroup.prototype.createChasm = function() {
		// this should be offscreen
		var last = this.getLast();

		last.y += constants.TILE_HEIGHT;
	};

	// push the next offscreen tile up a bit
	GroundGroup.prototype.createLedge = function() {
		// this should be offscreen
		var last = this.getLast();

		last.y -= constants.TILE_HEIGHT / 4;
	};

	// override onloop to create seamless ground
	GroundGroup.prototype.onloop = function(child) {
		// get last tile and reposition child based on it 
		var last = this.getLast();

		child.x = last.x + constants.TILE_WIDTH;

		// going too fast, start leaving tiles down
		if(this.speed < 400 || Math.random() < 0.5) {
			child.y = constants.SCREEN_HEIGHT;
		}

		if(this.speed > 800 && Math.random() < 0.3) {
			last.y += constants.TILE_HEIGHT;
		}
	};

	return GroundGroup;
});