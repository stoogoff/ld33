
define(function(require) {
	// object imports
	var Player = require("../objects/player");

	// objects
	var player;

	var GamePlay = function() {
		Phaser.State.call(this);
	};

	GamePlay.prototype.create = function() {
		// basic world stuff
		this.game.stage.backgroundColor = "#584838";
		this.game.add.tileSprite(0, 0, constants.WORLD_WIDTH, constants.WORLD_HEIGHT, "background");
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.world.setBounds(0, 0, constants.WORLD_WIDTH, constants.WORLD_HEIGHT);

		var x = this.game.world.centerX;
		var y = this.game.world.centerY;

		// set up the player
		player = new Player(this.game, x, y);
		this.game.camera.follow(player);
	};

	GamePlay.prototype.update = function() {
		// handle player movement
		if(!player.isDead()) {
			// handle player movement
			var vector = new Phaser.Point();

			if(cursors.left.isDown) {
				vector.x = -1;
			}
			else if(cursors.right.isDown) {
				vector.x = 1;
			}

			if(cursors.up.isDown) {
				vector.y = -1;
			}
			else if(cursors.down.isDown) {
				vector.y = 1;
			}

			player.move(vector);
		}
	};

	GamePlay.prototype.render = function() {
		//this.game.debug.cameraInfo(this.game.camera, 32, 32);
		//this.game.debug.spriteCoords(this.inventory.getAt(0), 32, 750);
	};

	return GamePlay;
});