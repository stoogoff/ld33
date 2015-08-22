
define(function(require) {
	return {
		// dimensions
		SCREEN_WIDTH: 956,
		SCREEN_HEIGHT: 350,

		TILE_WIDTH: 160,
		TILE_HEIGHT: 160,

		PLAYER_WIDTH: 120,
		PLAYER_HEIGHT: 120,

		//
		MAX_JUMP: 275,
		GRAVITY_WORLD: 400,
		GRAVITY_PLAYER: 400,

		SPEED_START: 140,
		SPEED_INCREMENT: 40,

		// HUD
		BACKGROUND_COLOUR: "rgba(0, 0, 0, 0.9)",

		// target keys
		PLAYER: "player",

		// font styles
		STYLE_TITLE: {
			font: "65px Arial",
			fill: "#ffffff",
			align: "center"
		},
		STYLE_BODY: {
			font: "16px Arial",
			fill: "#ffffff",
			align: "left"
		}
	};
});