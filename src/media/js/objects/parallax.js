
define(function(require) {
	// imports
	var inherits = require("../utils/inherits");
	var helpers = require("../utils/helpers");
	var constants = require("../utils/constants");
	var helpers = require("../utils/helpers");

	// parallax scrolling
	var Parallax = function(game, parent) {
		Phaser.Group.call(this, game, parent);

		this.enableBody = true;
		this.speed = constants.SPEED_START;
	};

	inherits(Parallax, Phaser.Group);

	// increase speed
	Parallax.prototype.faster = function(adjust) {
		this.speed = helpers.clamp(this.speed + adjust, 0, 1500);
	};

	Parallax.prototype.stop = function() {
		this.speed = 0;
	};

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
			child.body.velocity.x = -this.speed;

			if(child.x + child.width < 0) {
				this.onloop(child);
			}
		}, this, true);
	};

	Parallax.prototype.onloop = function(child) {};

	return Parallax;
});