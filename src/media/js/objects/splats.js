
define(function(require) {
	// imports
	var Parallax = require("./parallax");
	var inherits = require("../utils/inherits");
	var helpers = require("../utils/helpers");
	var constants = require("../utils/constants");

	// graphics
	var gfx = ["splat1", "splat2", "splat3"];

	var Splat = function(game, x, y) {
		Phaser.Sprite.call(this, game, x, y, Phaser.ArrayUtils.getRandomItem(gfx));

		// set physics and game specific stuff
		game.physics.arcade.enable(this);
		game.add.existing(this);

		this.anchor.setTo(0.5, 0.5);
		this.body.allowGravity = false;
		this.body.allowRotation = false;
		this.body.immovable = true;
		this.body.friction.x = 0;
	};

	inherits(Splat, Phaser.Sprite);

	// groups the aliens together
	var SplatGroup = function(game, parent) {
		Parallax.call(this, game, parent);
	};

	inherits(SplatGroup, Parallax);

	// add a splat
	SplatGroup.prototype.addSplat = function(x) {
		this.add(new Splat(this.game, x, constants.SCREEN_HEIGHT - constants.TILE_HEIGHT / 2));
	};

	// override onloop to delete splats
	SplatGroup.prototype.onloop = function(child) {
		this.remove(child);
		child.destroy();
	};

	return SplatGroup;
});