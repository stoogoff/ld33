
define(function(require) {
	var constants = require("../utils/constants");
	var inherits = require("../utils/inherits");
	var Ground = require("../objects/ground");
	var Moon = require("../objects/moon");
	var Clouds = require("../objects/clouds");
	var Troll = require("../objects/troll");

	var Menu = function(title, messages) {
		this.title = title;
		this.messages = messages;

		Phaser.State.call(this);
	};

	Menu.prototype.create = function() {
		// start music
		this.music = this.game.add.audio("intro", 1, true);
		this.music.play("", 0, 1, true);

		this.game.stage.backgroundColor = "black";
		this.game.add.image(0, 0, "sky");
		
		var moon = new Moon(this.game);

		// add random clouds
		var clouds = new Clouds(this.game);
		clouds.set();

		// add the ground
		var ground = new Ground(this.game);
		ground.set();
		ground.stop();

		// add the idle troll animation
		var troll = new Troll(this.game, constants.TILE_WIDTH, constants.SCREEN_HEIGHT - constants.TILE_HEIGHT / 2);

		this.game.add.image(0, 0, "overlay");

		this.titleText = this.game.add.text(this.game.world.centerX, 20, this.title, constants.STYLE_TITLE);
		this.titleText.anchor.setTo(0.5, 0);

		this.infoText = this.game.add.text(this.game.world.centerX, 100, this.messages.join("\n\n"), constants.STYLE_BODY);
		this.infoText.anchor.setTo(0.5, 0);
		this.infoText.wordWrap = true;
		this.infoText.wordWrapWidth = 400;
	};
	
	Menu.prototype.update = function() {
		if(this.game.input.activePointer.justPressed()) {
			this.game.state.start("play");
		}
	};

	Menu.prototype.shutdown = function() {
		this.music.stop();
	};

	var Start = function() {
		Menu.call(this, "Trollhammer", ["Troll need food! Smash squishy humans with hammer or jump on soft heads.", "X - Smash\nSpacebar - Jump", "Click anywhere to start"]);
	};

	inherits(Start, Menu);

	var GameOver = function() {
		Menu.call(this, "Game Over!", ["Troll fell down a hole <sniff>. Poor Troll.", "Troll sad now.", "But you did kill enough squishy humans to feed Troll for $ days.", "Click anywhere to play again"]);
	};

	inherits(GameOver, Menu);

	GameOver.prototype.init = function(score, killed) {
		this.messages[this.messages.length - 2] = this.messages[this.messages.length - 2].replace("$", Math.floor(killed / 5));
	};

	return {
		"Start": Start,
		"GameOver": GameOver
	};
});