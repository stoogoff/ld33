
define(function(require) {
	var Preload = function() {
		Phaser.State.call(this);
	};

	Preload.prototype = {
		preload: function() {
			var self = this;

			// load graphics
			var keys = [
				"background", "cave"
			];

			keys.forEach(function(key) {
				self.load.image(key, "media/img/" + key + ".png");
			});

			// animations
			this.load.spritesheet("alien", "media/img/alien.png", 24, 24);

			// load json data
			this.load.json("objects", "media/data/objects.json");

			// load audio
			this.load.audio("doom-upon-us", ["media/audio/doom-upon-us.mp3", "media/audio/doom-upon-us.ogg"]);
		},
		create: function() {
			this.game.state.start("menu");
		}
	};

	return Preload;
});