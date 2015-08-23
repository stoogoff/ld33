
define(function(require) {
	var Preload = function() {
		Phaser.State.call(this);
	};

	Preload.prototype.preload = function() {
		var self = this;

		// load graphics
		var keys = [
			"troll", "villager", "sky", "overlay", "moon",
			"hut1", "hut2", "hut3",
			"ground1", "ground2", "ground3",
			"splat1", "splat2", "splat3",
			"cloud1", "cloud2", "cloud3", "cloud4"
		];

		keys.forEach(function(key) {
			self.load.image(key, "media/img/" + key + ".png");
		});

		// animations
		//this.load.spritesheet("alien", "media/img/alien.png", 24, 24);

		// load json data
		//this.load.json("objects", "media/data/objects.json");

		// load audio
		//this.load.audio("doom-upon-us", ["media/audio/doom-upon-us.mp3", "media/audio/doom-upon-us.ogg"]);
	};
	
	Preload.prototype.create = function() {
		this.game.state.start("start");
	};

	return Preload;
});