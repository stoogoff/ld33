
define(function(require) {
	var constants = require("./constants");

	return {
		clamp: function(num, min, max) {
			if(num < min) {
				return min;
			}

			if(num > max) {
				return max;
			}

			return num;
		},

		// get a random point on the game world
		getRandomPoint: function(game, point, offset) {
			if(point) {
				return {
					x: game.math.clamp(game.rnd.integerInRange(point.x - offset, point.x + offset), 0, constants.GAME_WIDTH),
					y: game.math.clamp(game.rnd.integerInRange(point.y - offset, point.y + offset), 0, constants.GAME_HEIGHT)
				};
			}

			var offsetWidth = constants.WORLD_WIDTH / 8;
			var offsetHeight = constants.WORLD_HEIGHT / 8;

			return {
				x: game.rnd.integerInRange(offsetWidth, constants.WORLD_WIDTH - offsetWidth),
				y: game.rnd.integerInRange(offsetHeight, constants.WORLD_HEIGHT - offsetHeight),
			};
		},

		createSolid: function(game, width, height, colour) {
			var fill = game.add.bitmapData(width, height);

			fill.context.fillStyle = colour;
			fill.context.beginPath();
			fill.context.rect(0, 0, width, height);
			fill.context.fill();

			return fill;
		},

		createOutline: function(game, width, height, colour, stroke) {
			var outline = game.add.bitmapData(width, height);

			outline.context.beginPath();
			outline.context.rect(0, 0, width, height);
			outline.context.strokeStyle = colour;
			outline.context.lineWidth = stroke;
			outline.context.stroke();

			return outline;
		}
	};
});