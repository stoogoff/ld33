
define(function(require) {
	// object imports
	var Player = require("../objects/player");
	var Ground = require("../objects/ground");
	var Huts = require("../objects/huts");
	var Stages = require("../objects/stages");
	var Enemies = require("../objects/enemies");
	var Enemies = require("../objects/enemies");
	var Splats = require("../objects/splats");
	var Moon = require("../objects/moon");
	var Clouds = require("../objects/clouds");

	// util imports
	var constants = require("../utils/constants");
	var Interval = require("../utils/interval");
	var _ = require("underscore");

	// objects
	var player, ground, huts, stage, enemies, splats, moon, clouds;

	// scores
	var killed = 0, score = 0;
	var killedPrefix = "Squishy humans killed: ", scorePrefix = "Score: ";
	var killedText, scoreText;

	// camera shake
	var shake = false, shaker = new Interval(1000);
	var PAD = 20;

	// keyboard
	var jump, smash;

	// audio
	var music;

	var GamePlay = function() {
		Phaser.State.call(this);
	};

	GamePlay.prototype.create = function() {
		// start music
		music = this.game.add.audio("theme", 1, true);
		//music.fadeIn(constants.MUSIC_FADE, true);
		music.play("", 0, 1, true);

		// basic world stuff
		this.game.stage.backgroundColor = "#05baf0";
		//this.game.add.tileSprite(-PAD, -PAD, constants.SCREEN_WIDTH + PAD, constants.SCREEN_HEIGHT + PAD, "sky");
		this.game.stage.background = this.game.add.image(0, 0, "sky"); // this needs to be static and not shake with the rest of the screen
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = constants.GRAVITY_WORLD;
		this.game.world.setBounds(-PAD, -PAD, constants.SCREEN_WIDTH + PAD, constants.SCREEN_HEIGHT + PAD);

		// sky related
		moon = new Moon(this.game);

		// add random clouds
		clouds = new Clouds(this.game);
		clouds.set();

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

		// blood splats
		splats = new Splats(this.game);
		splats.z = ++z;

		// set up the score
		scoreText = this.game.add.text(constants.SCREEN_WIDTH - 100, constants.SCREEN_HEIGHT - 30, scorePrefix + "0", constants.STYLE_HUD);
		killedText = this.game.add.text(10, constants.SCREEN_HEIGHT - 30, killedPrefix + "0", constants.STYLE_HUD);

		scoreText.z = ++z;
		killedText.z = ++z;

		// set up the current stage
		stage = new Stages.Village();
		//stage = new Stages.Empty();

		// set up player controls
		jump  = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		smash = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
	};

	GamePlay.prototype.addScore = function(newScore) {
		killed++;
		killedText.text = killedPrefix + killed;

		score += newScore;
		scoreText.text = scorePrefix + score;

	};

	GamePlay.prototype.shake = function() {
		var min = -PAD / 2;
		var max = PAD / 2;

		this.game.camera.x += Math.floor(Math.random() * (max - min + 1)) + min;
		this.game.camera.y += Math.floor(Math.random() * (max - min + 1)) + min;
	};

	GamePlay.prototype.update = function(game) {
		var ELAPSED = game.time.elapsed;

		// PREPARE COLLISIONS
		this.physics.arcade.collide(player, ground);
		this.physics.arcade.collide(enemies, ground);

		// collisions between the player and the enemies
		this.game.physics.arcade.collide(player, enemies, this.customCollision, null, this);

		// collision between the player's hammer and the enemies
		hitArea = player.smashCollision();

		if(hitArea) {
			enemies.hitTest(hitArea);
		}

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

			// TODO select a new stage and speed up
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
			this.speedUp();
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

		// handle smash!
		if(smash.isDown) {
			player.smash();
		}

		// player has fallen down a chasm
		if(player.y > constants.SCREEN_HEIGHT) {
			this.game.state.start("gameover");
		}
	};

	GamePlay.prototype.speedUp = function() {
		enemies.faster(constants.SPEED_INCREMENT);
		ground.faster(constants.SPEED_INCREMENT);
		huts.faster(constants.SPEED_INCREMENT);
		splats.faster(constants.SPEED_INCREMENT);
	};

	GamePlay.prototype.customCollision = function(obj, enemy) {
		splats.addSplat(enemy.x);

		// squish enemy before adding the splat and before removing the enemy completely
		enemy.smashed(function() {
			enemies.remove(enemy);
		});

		this.addScore(constants.SCORE_KILL);
	};

	GamePlay.prototype.shutdown = function() {
		console.log("GamePlay.shutdown")
		//music.fadeOut(constants.MUSIC_FADE);
		music.stop();
	};

	GamePlay.prototype.render = function() {
		//this.game.debug.cameraInfo(this.game.camera, 32, 32);
	};

	return GamePlay;
});