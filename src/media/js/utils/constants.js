
define(function(require) {
	return {
		// dimensions
		SCREEN_WIDTH: 956,
		SCREEN_HEIGHT: 350,

		TILE_WIDTH: 160,
		TILE_HEIGHT: 160,

		PLAYER_WIDTH: 120,
		PLAYER_HEIGHT: 120,

		// game constants
		FEAR_RANGE: 400,
		JUMP_SMALL: 275,
		JUMP_FULL: 400,
		GRAVITY_WORLD: 400,
		GRAVITY_PLAYER: 400,

		SPEED_START: 180,
		SPEED_INCREMENT: 40,

		SCORE_KILL: 10,
		SCORE_FALL: 1,

		// HUD ???
		BACKGROUND_COLOUR: "rgba(0, 0, 0, 0.9)",

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
		},
		STYLE_HUD: {
			font: "bold 16px Arial",
			fill: "#114ea7"
		}
	};
});