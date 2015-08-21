
define(function(require) {
	var Menu = function() {
		Phaser.State.call(this);
	};

	Menu.prototype = {
		create: function() {
			// start music
			var music = this.game.add.audio("doom-upon-us", 1, true);

			music.play("", 0, 1, true);

			//this.game.stage.background = this.game.add.image(0, 0, 'sea');

			var message = [
				"How",
				"To",
				"Play"
			];

			this.titleText = this.game.add.text(this.game.world.centerX, 50, "Title", { font: "65px Arial", fill: "#ffffff", align: "center" });
			this.titleText.anchor.setTo(0.5, 0);

			this.infoText = this.game.add.text(this.game.world.centerX, 150, message.join("\n\n"), { font: "16px Arial", fill: "#ffffff", align: "left"});
			this.infoText.anchor.setTo(0.5, 0);
			this.infoText.wordWrap = true;
			this.infoText.wordWrapWidth = 500;
		},
		update: function() {
			if(this.game.input.activePointer.justPressed()) {
				this.game.state.start("play");
			}
		}
	};

	return Menu;
});