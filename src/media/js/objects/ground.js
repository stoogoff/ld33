
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

	// push the next offscreen tile down so it's off screen leaving a gap in the ground
	GroundGroup.prototype.createChasm = function() {
		// this should be offscreen
		var last = this.getLast();

		last.y += constants.TILE_HEIGHT;
	};

	// override onloop to create seamless ground
	GroundGroup.prototype.onloop = function(child) {
		// get last tile and reposition child based on it 
		var last = this.getLast();

		child.x = last.x + constants.TILE_WIDTH;
		child.y = constants.SCREEN_HEIGHT;
	};

	return GroundGroup;
});