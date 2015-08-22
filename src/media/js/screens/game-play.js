
define(function(require) {
	// object imports
	var Player = require("../objects/player");
	var Ground = require("../objects/ground");
	var Huts = require("../objects/huts");
	var Stages = require("../objects/stages");

	// util imports
	var constants = require("../utils/constants");

	// objects
	var player, ground, huts, stage;

	// keyboard
	var jump, hit, block;

	var GamePlay = function() {
		Phaser.State.call(this);
	};

	GamePlay.prototype.create = function() {
		// basic world stuff
		this.game.stage.backgroundColor = "#05baf0";
		//this.game.add.tileSprite(0, 0, constants.WORLD_WIDTH, constants.WORLD_HEIGHT, "background");
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = constants.GRAVITY_WORLD;
		this.game.speed = constants.SPEED_START;

		var x = constants.TILE_WIDTH;
		var y = constants.SCREEN_HEIGHT - constants.TILE_HEIGHT;

		// add the ground
		ground = new Ground(this.game);
		ground.set();
		ground.z = 1;

		// hut generator
		huts = new Huts(this.game);
		huts.z = 2;

		// set up the player
		player = new Player(this.game, x, y);
		player.z = 3;

		// set up the current stage
		stage = new Stages.Village();

		// set up player controls
		jump = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		// TODO the player should walk onto the screen while the ground is motionless
	};

	GamePlay.prototype.update = function(game) {
		this.physics.arcade.collide(player, ground);

		var stageStarted = stage.started;

		stage.update(game.time.elapsed);

		// stage wasn't started but now is, so increase the player speed
		if(!stageStarted && stage.started) {
			game.speed += constants.SPEED_INCREMENT;
		}

		if(stage.addHut()) {
			// add hut offscreen
			huts.addHut(constants.SCREEN_WIDTH + 5 /* offset */, constants.SCREEN_HEIGHT - constants.TILE_HEIGHT / 2); // TODO ground.getY(x);
		}

		// this signifies the end of the stage
		if(stage.addChasm()) {
			console.log("adding chasm and loading new stage")
			ground.createChasm();

			stage = new Stages.Village();
		}

		// handle jump
		if(jump.isDown) {
			player.jump();
		}

		// TODO handle player death
	};

	GamePlay.prototype.render = function() {
		//this.game.debug.cameraInfo(this.game.camera, 32, 32);
		//this.game.debug.spriteCoords(this.inventory.getAt(0), 32, 750);
	};

	return GamePlay;
});