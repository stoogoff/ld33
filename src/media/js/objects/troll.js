
define(function(require) {
	// imports
	var inherits = require("../utils/inherits");

	var Troll = function(game, x, y) {
		// phaser related stuff
		Phaser.Sprite.call(this, game, x, y, "troll-idle");

		// set physics and game specific stuff
		game.add.existing(this);

		this.anchor.setTo(0, 1);

		// animate
		this.animations.add("idle");
		this.animations.play("idle", 3, true);
	};

	inherits(Troll, Phaser.Sprite);

	return Troll;
});