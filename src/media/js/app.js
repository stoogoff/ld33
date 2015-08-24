define(function(require) {
	var constants = require("./utils/constants");

	// Phaser is going to be global
	var game = new Phaser.Game(constants.SCREEN_WIDTH, constants.SCREEN_HEIGHT, Phaser.AUTO, "game");

	// Game States
	game.state.add("preload", require("./screens/preload"));
	game.state.add("start", require("./screens/menus").Start);
	game.state.add("gameover", require("./screens/menus").GameOver);
	game.state.add("play", require("./screens/game-play"));

	game.state.start("preload");

});