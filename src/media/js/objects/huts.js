
define(function(require) {
	// imports
	var Parallax = require("./parallax");
	var inherits = require("../utils/inherits");

	var Hut = function(game, x, y) {
		// phaser related stuff
		Phaser.Sprite.call(this, game, x, y, "hut");

		// set physics and game specific stuff
		game.physics.arcade.enable(this);
		game.add.existing(this);

		this.anchor.setTo(0, 1);
		this.body.allowGravity = false;
		this.body.allowRotation = false;
		this.body.immovable = true;
		this.body.friction.x = 0;
	};

	inherits(Hut, Phaser.Sprite);

	// TODO huts need to create 1-6 people every second they're on screen

	// groups the aliens together
	var Huts = function(game, parent) {
		Parallax.call(this, game, parent);
	};

	inherits(Huts, Parallax);

	Huts.prototype.addHut = function(x, y) {
		// TODO reuse existing offscreen huts
		this.add(new Hut(this.game, x, y));
	};

	return Huts;
});