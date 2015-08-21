define(function(require) {
	// Phaser is going to be global
	var game = new Phaser.Game(800, 800, Phaser.AUTO, "ABC Worriers");

	// Game States
	game.state.add("preload", require("./screens/preload"));
	game.state.add("menu", require("./screens/menu"));
	game.state.add("play", require("./screens/game-play"));

	game.state.start("preload");

});