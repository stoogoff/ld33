define(function(require) {
	// imports
	var inherits = require("../utils/inherits");
	var constants = require("../utils/constants");
	var Interval = require("../utils/interval");

	// jump related
	var jumpInterval = new Interval(3000);
	var canPowerJump = true;
	var Jumping = {
		"None": 0,
		"Jump": 1,
		"Power": 2
	};
	var jumpState = Jumping.None;

	var Player = function(game, x, y, frame) {
		// phaser related stuff
		Phaser.Sprite.call(this, game, x, y, "troll-run", frame);

		// set physics and game specific stuff
		game.physics.arcade.enable(this);
		game.add.existing(this);

		this.body.allowRotation = false;
		this.body.collideWorldBounds = false;
		this.body.gravity.y = constants.GRAVITY_PLAYER;
		this.body.checkCollision.left = false;
		this.body.checkCollision.right = false;
		this.anchor.setTo(0.5, 1);

		this.animations.add("idle");
		this.animations.play("idle", 3, true);
	};

	inherits(Player, Phaser.Sprite);

	// jump the player and change the animation
	Player.prototype.jump = function() {
		if(jumpState != Jumping.None) {
			return;
		}

		if(canPowerJump) {
			jumpState = Jumping.Power;
			this.body.velocity.y = -constants.JUMP_FULL;
		}
		else {
			jumpState = Jumping.Jump;
			this.body.velocity.y = -constants.JUMP_SMALL;
		}

		// TODO revert to jumping animation
	};


	Player.prototype.update = function() {
		// were jumping, have now landed
		if(jumpState != Jumping.None && this.body.velocity.y == 0) {
			if(jumpState == Jumping.Power) {
				this.onpowerlanding();
			}

			jumpState = Jumping.None;
			canPowerJump = false;
			jumpInterval.reset();

			// TODO revert to walking animation
		}

		var elapsed = this.game.time.elapsed;

		if(jumpState == Jumping.None && jumpInterval.next(elapsed)) {
			canPowerJump = true;
		}
	};

	Player.prototype.onpowerlanding = function() {};

	Player.prototype.isDead = function() {
		return false;
	};

	return Player;
});