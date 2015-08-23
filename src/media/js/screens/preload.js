
define(function(require) {
	var Preload = function() {
		Phaser.State.call(this);
	};

	Preload.prototype.preload = function() {
		var self = this;

		// load graphics
		var keys = [
			"troll-jump",
			"sky", "overlay", "moon",
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
		this.load.spritesheet("troll-smash", "media/img/troll-smash.png", 180, 120);

		// load audio
		this.load.audio("intro", ["media/audio/for-whom-the-bell-trolls.mp3", "media/audio/for-whom-the-bell-trolls.ogg"]);
		this.load.audio("theme", ["media/audio/hammer-troll.mp3", "media/audio/hammer-troll.ogg"]);
	};
	
	Preload.prototype.create = function() {
		this.game.state.start("start");
	};

	return Preload;
});