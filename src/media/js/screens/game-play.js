
define(function(require) {
	// object imports
	var Player = require("../objects/player");
	var Ground = require("../objects/ground");
	var Huts = require("../objects/huts");
	var Stages = require("../objects/stages");
	var Enemies = require("../objects/enemies");

	// util imports
	var constants = require("../utils/constants");
	var Interval = require("../utils/interval");
	var _ = require("underscore");

	// objects
	var player, ground, huts, stage, enemies;

	// scores
	var killed = 0, score = 0;
	var killedPrefix = "Squishy humans killed: ", scorePrefix = "Score: ";
	var killedText, scoreText;

	// camera shake
	var shake = false, shaker = new Interval(1000);

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
		this.game.world.setBounds(-20, -20, constants.SCREEN_WIDTH + 20, constants.SCREEN_HEIGHT + 20);

		// set up the score
		scoreText = this.game.add.text(constants.SCREEN_WIDTH - 100, 10, scorePrefix + "0", constants.STYLE_HUD);
		killedText = this.game.add.text(10, 10, killedPrefix + "0", constants.STYLE_HUD);

		var z = 0;

		// add the ground
		ground = new Ground(this.game);
		ground.set();
		ground.z = ++z;

		// hut generator
		huts = new Huts(this.game);
		huts.z = ++z;

		// set up the player
		player = new Player(this.game, constants.TILE_WIDTH, constants.SCREEN_HEIGHT - constants.TILE_HEIGHT / 2);
		player.z = ++z;
		player.onpowerlanding = function() {
			enemies.slow();
			shake = true;
			shaker.reset();
		};

		// enemy group
		enemies = new Enemies(this.game, undefined, _.bind(this.addScore, this));
		enemies.z = ++z;

		// set up the current stage
		stage = new Stages.Village();

		// set up player controls
		jump = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		// TODO the player should walk onto the screen while the ground is motionless
	};

	GamePlay.prototype.addScore = function(newScore) {
		killed++;
		killedText.text = killedPrefix + killed;

		score += newScore;
		scoreText.text = scorePrefix + score;

	};

	GamePlay.prototype.shake = function() {
		var min = -10;
		var max = 10;

		this.game.camera.x += Math.floor(Math.random() * (max - min + 1)) + min;
		this.game.camera.y += Math.floor(Math.random() * (max - min + 1)) + min;
	};

	GamePlay.prototype.update = function(game) {
		var ELAPSED = game.time.elapsed;

		// PREPARE COLLISIONS
		this.physics.arcade.collide(player, ground);
		this.physics.arcade.collide(enemies, ground);

		// collisions between the player and the enemies
		this.game.physics.arcade.collide(player, enemies, function(player, enemy) {
			enemies.remove(enemy);
			enemy.destroy();

			// TODO add a splat
			this.addScore(constants.SCORE_KILL);


		}, null, this);

		// STAGE ACTIVITY
		var stageStarted = stage.started;

		stage.update(ELAPSED);

		// add hut offscreen
		if(stage.addHut()) {
			huts.addHut(constants.SCREEN_WIDTH + 5 /* offset */, constants.SCREEN_HEIGHT - constants.TILE_HEIGHT / 2);
		}

		// adding a chasm signifies the end of the stage
		if(stage.addChasm()) {
			ground.createChasm();

			// TODO select a new stage
			stage = new Stages.Village();
		}

		var addedEnemy = false;

		huts.forEach(function(hut) {
			if(hut.canSpawn(ELAPSED)) {
				var result = stage.getEnemy(hut, player);

				if(result != null && enemies["add" + result]) {
					enemies["add" + result](hut.x, constants.SCREEN_HEIGHT - constants.TILE_HEIGHT / 2);
					addedEnemy = true;
				}
			}
		}, this, true);

		// stage wasn't started but now is and an enemy has been added, so increase the player speed
		if(!stageStarted && stage.started && addedEnemy) {
			enemies.faster(constants.SPEED_INCREMENT);
			ground.faster(constants.SPEED_INCREMENT);
			huts.faster(constants.SPEED_INCREMENT);
		}

		// SHAKE CAMERA
		if(shake) {
			this.shake();

			if(shaker.next(ELAPSED)) {
				shake = false;

				this.game.camera.x = 0;
				this.game.camera.y = 0;
			}
		}

		// PLAYER ACTIVITY

		// handle jump
		if(jump.isDown) {
			player.jump();
		}

		// player has fallen down a chasm
		if(player.y > constants.SCREEN_HEIGHT) {
			this.game.state.start("gameover");
		}
	};

	GamePlay.prototype.render = function() {
		//this.game.debug.cameraInfo(this.game.camera, 32, 32);
	};

	return GamePlay;
});