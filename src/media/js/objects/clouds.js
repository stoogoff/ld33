
define(function(require) {
	// imports
	var Parallax = require("./parallax");
	var inherits = require("../utils/inherits");
	var helpers = require("../utils/helpers");
	var constants = require("../utils/constants");

	// graphics
	var gfx = ["cloud1", "cloud2", "cloud3", "cloud4"];

	var Cloud = function(game, x, y) {
		Phaser.Sprite.call(this, game, x, y, Phaser.ArrayUtils.getRandomItem(gfx));

		// set physics and game specific stuff
		game.physics.arcade.enable(this);
		game.add.existing(this);

		this.anchor.setTo(0, 0);
		this.body.allowGravity = false;
		this.body.allowRotation = false;
		this.body.immovable = true;

		this.alpha = game.rnd.realInRange(0.5, 1);
		this.speed = game.rnd.integerInRange(3, 10);
	};

	inherits(Cloud, Phaser.Sprite);

	// groups the aliens together
	var CloudGroup = function(game, parent) {
		Parallax.call(this, game, parent);

		this.fixedToCamera = true;
	};

	inherits(CloudGroup, Parallax);

	// create a tile of ground objects
	CloudGroup.prototype.set = function() {
		var amount = this.game.rnd.integerInRange(5, 12);

		while(amount-- > 0) {
			this.add(new Cloud(this.game, this.game.rnd.integerInRange(0, constants.SCREEN_WIDTH), this.game.rnd.integerInRange(0, constants.SCREEN_HEIGHT / 4)));
		}
	};

	// override update to move based on the object's speed
	CloudGroup.prototype.update = function() {
		this.forEach(function(child) {
			child.body.velocity.x = -child.speed;

			if(child.x + child.width < 0) {
				this.onloop(child);
			}
		}, this, true);
	};

	// override onloop to delete splats
	CloudGroup.prototype.onloop = function(child) {
		// position it offscreen at random co-ordinates
		child.x = constants.SCREEN_WIDTH + this.game.rnd.integerInRange(5, 20);
		child.y = this.game.rnd.integerInRange(-child.height / 2, child.height);
	};

	return CloudGroup;
});