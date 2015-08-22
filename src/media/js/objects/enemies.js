
define(function(require) {
	// imports
	var Interval = require("../utils/interval");
	var inherits = require("../utils/inherits");
	var constants = require("../utils/constants");
	var Parallax = require("./parallax");

	var Villager = function(game, x, y) {
		// phaser related stuff
		Phaser.Sprite.call(this, game, x, y, "villager");

		// set physics and game specific stuff
		game.physics.arcade.enable(this);
		game.add.existing(this);

		this.anchor.setTo(0.5, 1);
		this.body.allowGravity = true;
		this.body.allowRotation = false;
		this.body.immovable = false;

		this.speed = game.rnd.integerInRange(1, 8);
	};

	inherits(Villager, Phaser.Sprite);

	/*var PitchforkVillager = function(game, x, y) {
		Villager.call(this, game, x, y);
	};

	inherits(PitchforkVillager, Villager);*/

	// group enemies together
	var Enemies = function(game, parent, callback) {
		Parallax.call(this, game, parent);

		this.updateScore = callback || function(score) {};
		this.speedModifier = 1;
		this.speedTimer = new Interval(2500);
	};

	inherits(Enemies, Parallax);

	// TODO max number of enemies to add at any one time (around 20)

	// override update to move enemies at their actual speed rather than the world speed
	Enemies.prototype.update = function() {
		this.forEach(function(child) {
			//child.body.velocity.x = child.speed * this.speedModifier;
			child.body.velocity.x = -30;

			// if child is out of bounds destroy it
			if(child.x < 0 || child.y - child.height > constants.SCREEN_HEIGHT || child.x > constants.SCREEN_WIDTH) {
				// the enemy is within the screen width so the death was by falling
				// Troll gets a small score
				if(child.x > 0 && child.x < constants.SCREEN_WIDTH) {
					this.updateScore(constants.SCORE_FALL);
				}

				this.remove(child);
				child.destroy();
			}
		}, this, true);

		if(this.speedTimer.next(this.game.time.elapsed)) {
			this.speedModifier = 1;
		}
	};

	// reduce all enemies in the group to a speed of 1
	Enemies.prototype.slow = function() {
		this.speedModifier = -2;
		this.speedTimer.reset();
	};

	// methods for adding different enemy types

	Enemies.prototype.addVillager = function(x, y) {
		this.add(new Villager(this.game, x, y));
	};

	return Enemies;
});