
define(function(require) {
	// imports
	var inherits = require("../utils/inherits");
	var helpers = require("../utils/helpers");
	var constants = require("../utils/constants");

	// parallax scrolling
	var Parallax = function(game, parent) {
		Phaser.Group.call(this, game, parent);

		this.enableBody = true;
	};

	inherits(Parallax, Phaser.Group);

	// return the furthest right ground object
	Parallax.prototype.getLast = function() {
		var last = null;

		this.forEach(function(child) {
			if(!last) {
				last = child;
				return;
			}

			if(child.x > last.x) {
				last = child;
			}
		}, this, true);

		return last;
	};

	Parallax.prototype.update = function() {
		this.forEach(function(child) {
			child.body.velocity.x = -this.game.speed;

			if(child.x + constants.TILE_WIDTH < 0) {
				this.onloop(child);
			}
		}, this, true);
	};

	Parallax.prototype.onloop = function(child) {};

	return Parallax;
});