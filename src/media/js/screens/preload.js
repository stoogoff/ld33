
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
		var people = ["black", "brown", "red", "white", "yellow"];

		people.forEach(function(key) {
			self.load.spritesheet("people-" + key, "media/img/people-" + key + ".png", 24, 32);
		});

		this.load.spritesheet("troll-idle", "media/img/troll-idle.png", 120, 120);
		this.load.spritesheet("troll-run", "media/img/troll-run.png", 120, 120);


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