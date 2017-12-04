import Boot from 'states/boot';
import Preload from 'states/preload';
import GameTitle from 'states/gametitle';
import Main from 'states/Main';
import GameOver from 'states/gameover';

class Game extends Phaser.Game {

	constructor() {

		super(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO);

		// super(320,320, Phaser.CANVAS)

		this.state.add('boot', Boot, false);
		this.state.add('preload', Preload, false);
		this.state.add('gameTitle', GameTitle, false);
		this.state.add('main', Main, false);
		this.state.add('gameover', GameOver, false);

		this.state.start('boot');
	}

}

new Game();