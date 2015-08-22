define(function(require) {
	// imports
	var inherits = require("../utils/inherits");
	var constants = require("../utils/constants");
	var Interval = require("../utils/interval");

	// module vars
	var jumpInterval = new Interval(2000);

	var Player = function(game, x, y, frame) {
		// phaser related stuff
		Phaser.Sprite.call(this, game, x, y, "troll", frame);

		// set physics and game specific stuff
		game.physics.arcade.enable(this);
		game.add.existing(this);

		//this.animations.add("walk", null, 10);

		this.body.allowRotation = false;
		this.body.collideWorldBounds = false;
		this.body.gravity.y = constants.GRAVITY_PLAYER;
		this.anchor.setTo(0.5, 1);
	};

	inherits(Player, Phaser.Sprite);

	// jump the player and change the animation
	Player.prototype.jump = function(time) {
		if(this.body.velocity.y == 0) {
			this.body.velocity.y = -constants.MAX_JUMP;
			//this.setAnimation(Player.STATE.JUMPING);
		}

		// TODO if the player is behind their regular y position then they've tripped
		// TODO jumping shakes the ground, slowing the villagers but also slows the troll

		/*else if(this.velocity.y > 0 && !this.doubleJump) {
			this.doubleJump = true;
			this.velocity.y = -Player.MAX_VELOCITY / 2;
		}*/

		/*this.body.velocity.x = vector.x * SPEED;
		this.body.velocity.y = vector.y * SPEED;

		if(vector.x !== 0 || vector.y !== 0) {
			//this.animations.play("walk");

		}
		else {
			//this.animations.stop("walk");
			this.frame = 0;
		}*/
	};

	Player.prototype.isDead = function() {
		return false;
	};

	return Player;
});