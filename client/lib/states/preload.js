class Preload extends Phaser.State {

	preload() {
		this.load.tilemap('map', 'maps/small2.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('simplebackground', 'img/simplebackground.png');
		this.load.spritesheet('player', 'img/redeye.png', 32, 32);
		this.load.spritesheet('star', 'img/bubble1.png', 32, 32);
		this.load.spritesheet('acid', 'img/acid.png', 32, 32);
		this.load.spritesheet('water', 'img/water.png', 32, 32);
	}

	create() {
		//NOTE: Change to GameTitle if required
		this.game.state.start("Main");
	}

}

// export default Preload;