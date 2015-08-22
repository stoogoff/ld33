
define(function(require) {
	var constants = require("../utils/constants");
	var inherits = require("../utils/inherits");

	var Menu = function(title, messages) {
		this.title = title;
		this.messages = messages;

		Phaser.State.call(this);
	};

	Menu.prototype.create = function() {
		// start music
		//var music = this.game.add.audio("doom-upon-us", 1, true);

		//music.play("", 0, 1, true);

		//this.game.stage.background = this.game.add.image(0, 0, 'sea');
		this.game.stage.backgroundColor = "black";

		this.titleText = this.game.add.text(this.game.world.centerX, 50, this.title, constants.STYLE_TITLE);
		this.titleText.anchor.setTo(0.5, 0);

		this.infoText = this.game.add.text(this.game.world.centerX, 150, this.messages.join("\n\n"), constants.STYLE_BODY);
		this.infoText.anchor.setTo(0.5, 0);
		this.infoText.wordWrap = true;
		this.infoText.wordWrapWidth = 500;
	};
	
	Menu.prototype.update = function() {
		if(this.game.input.activePointer.justPressed()) {
			this.game.state.start("play");
		}
	};

	var Start = function() {
		Menu.call(this, "Trollhammer", ["Get ready", "Game info"]);
	};

	inherits(Start, Menu);

	var GameOver = function() {
		Menu.call(this, "Game Over!", ["Troll died <sniff>", "Poor Troll", "Troll sad now"]);
	};

	inherits(GameOver, Menu);

	return {
		"Start": Start,
		"GameOver": GameOver
	};
});