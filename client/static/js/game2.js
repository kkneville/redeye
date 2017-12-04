var gameProperties = {
    screenWidth: 320,
    screenHeight: 320,
};
 
var states = {
    game: "game",
};
 
var gameState = function(game){
    
};
 
gameState.prototype = {
    
    preload: function () {

    game.load.tilemap('map', 'maps/small2.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('simplebackground', 'img/simplebackground.png');
	game.load.spritesheet('player', 'img/redeye.png', 32,32 );
    game.load.spritesheet('star', 'img/bubble1.png', 32,32 )
    game.load.spritesheet('acid', 'img/acid.png', 32,32 )
    game.load.spritesheet('water', 'img/water.png', 32,32 )
        
    },
    
    
var cursors;
var map;
var tileset;
var player;
var backgroundLayer;
var groundLayer;
var sprite;
var stars;
var acid;
var water;
var bubbles;
var dying;

    
    create: function () {
        
    },
 
    update: function () {
        
    },
};
 
var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);
