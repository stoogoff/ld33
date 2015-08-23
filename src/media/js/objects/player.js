define(function(require) {
	// imports
	var inherits = require("../utils/inherits");
	var constants = require("../utils/constants");
	var Interval = require("../utils/interval");
	var _ = require("underscore");

	// jump related
	var jumpInterval = new Interval(3000);
	var canPowerJump = true;
	var PlayerState = {
		"None": 0,
		"Jump": 1,
		"Power": 2,
		"Smash": 3
	};

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
		this.anchor.setTo(0, 1);

		this.animations.add("run");
		this.animations.play("run", 3, true);

		this.actionState = PlayerState.None;
	};

	inherits(Player, Phaser.Sprite);

	// jump the player and change the animation
	Player.prototype.jump = function() {
		if(this.actionState != PlayerState.None) {
			return;
		}

		if(canPowerJump) {
			this.actionState = PlayerState.Power;
			this.body.velocity.y = -constants.JUMP_FULL;
		}
		else {
			this.actionState = PlayerState.Jump;
			this.body.velocity.y = -constants.JUMP_SMALL;
		}

		// change to jumping animation
		this.loadTexture("troll-jump");
	};

	// smash whatever is infront of the player
	Player.prototype.smash = function() {
		if(this.actionState != PlayerState.None) {
			return;
		}

		this.actionState = PlayerState.Smash;

		this.loadTexture("troll-smash");
		this.animations.add("smash");

		var anim = this.animations.play("smash", 10, false);

		anim.onComplete.add(_.bind(function() {
			this.loadTexture("troll-run");
			this.animations.play("run", 3, true);

			this.actionState = PlayerState.None;
		}, this));
	};

	Player.prototype.update = function() {
		// were jumping, have now landed
		if(this.actionState != PlayerState.None && this.actionState != PlayerState.Smash && this.body.velocity.y == 0) {
			if(this.actionState == PlayerState.Power) {
				this.onpowerlanding();
			}

			this.actionState = PlayerState.None;
			canPowerJump = false;
			jumpInterval.reset();

			// revert to walking animation
			this.loadTexture("troll-run");
			this.animations.play("run", 3, true);
		}

		var elapsed = this.game.time.elapsed;

		if(this.actionState == PlayerState.None && jumpInterval.next(elapsed)) {
			canPowerJump = true;
		}
	};

	Player.prototype.onpowerlanding = function() {};

	return Player;
});