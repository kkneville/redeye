
class Main extends Phaser.State {

	// cursors = []
	// map = []
	// tileset = []
	// player = []
	// backgroundLayer = []
	// groundLayer = []
	// sprite = []
	// stars = []
	// acid = []
	// water = []
	// bubbles = []
	// dying = []

	create() {

		//Enable Arcade Physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.map = this.game.add.tilemap('map');
		this.map.addTilesetImage('simplebackground', 'simplebackground');

		this.backgroundLayer = this.map.createLayer('backgroundLayer');
		this.groundLayer = this.map.createLayer('groundLayer');
		this.groundLayer.resizeWorld();

		this.map.setCollisionBetween(1, 2000, true, groundLayer, true);

		this.player = this.game.add.sprite(0, 500, 'player');
		this.player.frame = 1;

		this.player.animations.add('left', [47, 48], 10, false);
		this.player.animations.add('right', [42, 43], 10, false);
		this.player.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 52, 59, 60, 61, 62, 63, 64, 65], 5, false);
		this.player.animations.add('jump', [56, 57], 10, false);
		this.player.animations.add('sleep', [66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81], 5, false);

		function getObjects(spritename) {
			var results = [];
			console.log(this.map.objects.objectsLayer);
			for (var a = 0; a < this.map.objects.objectsLayer.length; a++) {
				if (this.map.objects.objectsLayer[a].properties.sprite == spritename) {
					this.map.objects.objectsLayer[a].y -= this.map.tileHeight;
					results.push(this.map.objects.objectsLayer[a]);
					console.log(this.map.objects.objectsLayer[a]);
				}
			}
			console.log("these are the stars ", results);
			return results;
		}

		this.stars = this.game.add.group();

		var findStars = getObjects("star");

		for (var a = 0; a < findStars.length; a++) {
			var s = this.stars.create(findStars[a].x, findStars[a].y, 'star');
		}
		this.stars.callAll("animations.add", "animations", "hover", [1, 2, 3, 4, 5], 8, true);

		this.acid = this.game.add.physicsGroup();

		var findAcid = getObjects("acid");

		for (var a = 0; a < findAcid.length; a++) {
			var c = this.acid.create(findAcid[a].x, findAcid[a].y, 'acid');
			c.body.mass = -100;
			c.body.allowGravity = false;
			console.log("c.body ", c.body);
		}

		this.acid.callAll("animations.add", "animations", "bubble", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 10, true);

		this.water = this.game.add.physicsGroup();

		var findWater = getObjects("water");

		for (var a = 0; a < findWater.length; a++) {
			var c = this.water.create(findWater[a].x, findWater[a].y, 'water');
			c.body.mass = -100;
			c.body.allowGravity = false;
			console.log("c.body ", c.body);
		}

		this.water.callAll("animations.add", "animations", "bubble", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 7, true);

		this.game.physics.arcade.gravity.y = 250;

		// enable physics on objects

		this.game.physics.enable(this.player);
		this.game.physics.enable(this.stars);
		this.game.physics.arcade.enable(this.acid);

		// define player movement

		this.player.body.bounce.y = 0.2;
		this.player.body.linearDamping = 1;
		this.player.body.collideWorldBounds = true;

		// exempt acid from game gravity

		// acid_group = game.add.physicsGroup()

		this.game.camera.follow(this.player);

		this.cursors = game.input.keyboard.createCursorKeys();
	}

	update() {

		this.game.world.bringToTop(this.player);
		this.game.world.bringToTop(this.water);

		this.game.physics.arcade.overlap(this.player, this.stars, collectStar, null);

		function collectStar(player, stars) {
			console.log('overlap with bubble');
			var x = stars.x;
			var y = stars.y;
			stars.kill();
			var bubble = game.add.sprite(x, y, "star");
			bubble.animations.add('pop', [6, 7, 8, 9, 10], 5, false);
			bubble.animations.play('pop', 20, false, true);
		}

		this.game.physics.arcade.overlap(this.player, this.acid, fallIn, null);

		function fallIn(player, acid) {
			var x = player.x;
			var y = player.y;
			player.kill();
			var dying = game.add.sprite(x, y, 'player');
			dying.animations.add('die', [71, 72, 75, 76, 76, 76, 76, 76, 76], 10, false);
			dying.animations.play('die', 10, false, true);
			// setTimeout(function(){restartGame()},2000, false)
		}

		this.stars.callAll("play", null, 'hover');
		this.acid.callAll("play", null, 'bubble');
		this.water.callAll("play", null, 'bubble');

		this.game.physics.arcade.collide(stars, groundLayer);
		this.game.physics.arcade.collide(player, groundLayer);

		this.player.body.velocity.x = 0;

		if (this.cursors.up.isDown) {
			if (this.player.body.onFloor()) {
				this.player.body.velocity.y = -300;
				this.player.animations.play('jump');
			}
		} else if (this.cursors.left.isDown) {
			this.player.body.velocity.x = -150;
			this.player.animations.play('left');
		} else if (this.cursors.right.isDown) {
			this.player.body.velocity.x = 150;
			this.player.animations.play('right');
		} else {
			this.player.animations.play('idle');
		}
	}

}

// export default Main;