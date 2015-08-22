
define(function(require) {
	// imports
	var Parallax = require("./parallax");
	var Interval = require("../utils/interval");
	var inherits = require("../utils/inherits");

	var Hut = function(game, x, y) {
		// phaser related stuff
		Phaser.Sprite.call(this, game, x, y, "hut");

		// set physics and game specific stuff
		game.physics.arcade.enable(this);
		game.add.existing(this);

		this.anchor.setTo(0.5, 1);
		this.body.allowGravity = false;
		this.body.allowRotation = false;
		this.body.immovable = true;
		this.body.friction.x = 0;

		this.interval = new Interval(1000);
	};

	inherits(Hut, Phaser.Sprite);

	// see if this hut can spawn a person
	// TODO may need to speed this up when Troll gets near
	// TODO may need to put a max on how may can be spawned
	// TODO but the max may be stage related
	Hut.prototype.canSpawn = function(time) {
		return this.interval.next(time);
	};

	// group the huts together
	var Huts = function(game, parent) {
		Parallax.call(this, game, parent);
	};

	inherits(Huts, Parallax);

	// override onloop to clean up huts
	Huts.prototype.onloop = function(child) {
		this.remove(child);
		child.destroy();
	};

	Huts.prototype.addHut = function(x, y) {
		this.add(new Hut(this.game, x, y));
	};

	return Huts;
});