define(function(require) {
	// imports
	var inherits = require("../utils/inherits");
	var _ = require("underscore");

	// module vars
	var SPEED = 400, MAX_CARRY = 10;

	var Player = function(game, x, y, frame) {
		// phaser related stuff
		Phaser.Sprite.call(this, game, x, y, "player", frame);

		// set physics and game specific stuff
		game.physics.arcade.enable(this);
		game.add.existing(this);

		this.animations.add("walk", null, 10);

		this.body.collideWorldBounds = true;
		this.anchor.setTo(0.5, 0.5);
		this.facing = "left";
	};

	inherits(Player, Phaser.Sprite);

	Player.prototype.stop = function() {
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;
	};

	Player.prototype.move = function(vector) {
		this.body.velocity.x = vector.x * SPEED;
		this.body.velocity.y = vector.y * SPEED;

		if(vector.x !== 0 || vector.y !== 0) {
			this.animations.play("walk");

			if(vector.x > 0) {
				this.scale.setTo(-1, 1);
				this.facing = "right";
			}
			else if(vector.x < 0) {
				this.scale.setTo(1, 1);
				this.facing = "left";
			}
		}
		else {
			this.animations.stop("walk");
			this.frame = 0;
		}
	};

	Player.prototype.isDead = function() {
		return false;
	};

	return Player;
});