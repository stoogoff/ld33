
define(function(require) {
	var constants = require("../utils/constants");
	var inherits = require("../utils/inherits");

	var Moon = function(game) {
		Phaser.Image.call(this, game, constants.SCREEN_WIDTH - 150, 30, "moon");

		game.add.existing(this);

		this.alpha = 0.5;
		this.fixedToCamera = true;
	};

	inherits(Moon, Phaser.Image);

	return Moon;
});