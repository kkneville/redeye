

var game = new Phaser.Game(320, 320, Phaser.CANVAS, 'redeye', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('map', 'maps/small2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('simplebackground', 'img/simplebackground.png');
    game.load.spritesheet('player', 'img/redeye.png', 32, 32);
    game.load.spritesheet('star', 'img/bubble1.png', 32, 32);
    game.load.spritesheet('acid', 'img/acid.png', 32, 32);
    game.load.spritesheet('water', 'img/water.png', 32, 32);
}

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

function create() {

    // start game physics

    game.physics.startSystem(Phaser.Physics.ARCADE);

    // add tilemap and tileset image

    map = game.add.tilemap('map');
    map.addTilesetImage('simplebackground', 'simplebackground');

    //add bg and ground layers, resize world to fit ground layer

    backgroundLayer = map.createLayer('backgroundLayer');
    groundLayer = map.createLayer('groundLayer');
    groundLayer.resizeWorld();

    // set collision with ground layer

    map.setCollisionBetween(1, 2000, true, groundLayer, true);

    // add player sprite, set default frame, add player animations
    player = game.add.sprite(0, 500, 'player');
    player.frame = 1;

    player.animations.add('left', [47, 48], 10, false);
    player.animations.add('right', [42, 43], 10, false);
    player.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 52, 59, 60, 61, 62, 63, 64, 65], 5, false);
    player.animations.add('jump', [56, 57], 10, false);
    player.animations.add('sleep', [66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81], 5, false);

    // function to find other objects on tilemap objects layer by spritename
    function getObjects(spritename) {
        var results = [];
        console.log(map.objects.objectsLayer);
        for (var a = 0; a < map.objects.objectsLayer.length; a++) {
            if (map.objects.objectsLayer[a].properties.sprite == spritename) {
                map.objects.objectsLayer[a].y -= map.tileHeight;
                results.push(map.objects.objectsLayer[a]);
                console.log(map.objects.objectsLayer[a]);
            }
        }
        console.log("these are the stars ", results);
        return results;
    }

    // create bubbles ('star') group, create instances, add animations

    stars = game.add.group();

    var findStars = getObjects("star");

    for (var a = 0; a < findStars.length; a++) {
        var s = stars.create(findStars[a].x, findStars[a].y, 'star');
    }
    stars.callAll("animations.add", "animations", "hover", [1, 2, 3, 4, 5], 8, true);

    // create acid group, create instances, add animations

    acid = game.add.physicsGroup();

    var findAcid = getObjects("acid");

    for (var a = 0; a < findAcid.length; a++) {
        var c = acid.create(findAcid[a].x, findAcid[a].y, 'acid');
        c.body.mass = -100;
        c.body.allowGravity = false;
        console.log("c.body ", c.body);
    }

    acid.callAll("animations.add", "animations", "bubble", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 10, true);

    water = game.add.physicsGroup();

    var findWater = getObjects("water");

    for (var a = 0; a < findWater.length; a++) {
        var c = water.create(findWater[a].x, findWater[a].y, 'water');
        c.body.mass = -100;
        c.body.allowGravity = false;
        console.log("c.body ", c.body);
    }

    water.callAll("animations.add", "animations", "bubble", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 7, true);

    // add gravity to game

    game.physics.arcade.gravity.y = 250;

    // enable physics on objects

    game.physics.enable(player);
    game.physics.enable(stars);
    game.physics.arcade.enable(acid);

    // define player movement

    player.body.bounce.y = 0.2;
    player.body.linearDamping = 1;
    player.body.collideWorldBounds = true;

    // exempt acid from game gravity

    // acid_group = game.add.physicsGroup()

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
}

// set player in front of acid but behind water

function update() {

    game.world.bringToTop(player);
    game.world.bringToTop(water);

    game.physics.arcade.overlap(player, stars, collectStar, null);

    function collectStar(player, stars) {
        console.log('overlap with bubble');
        var x = stars.x;
        var y = stars.y;
        stars.kill();
        bubble = game.add.sprite(x, y, "star");
        bubble.animations.add('pop', [6, 7, 8, 9, 10], 5, false);
        bubble.animations.play('pop', 20, false, true);
    }

    game.physics.arcade.overlap(player, acid, fallIn, null);

    function fallIn(player, acid) {
        var x = player.x;
        var y = player.y;
        player.kill();
        // player = {}
        dying = game.add.sprite(x, y, 'player');
        dying.animations.add('die', [71, 72, 75, 76, 76, 76, 76, 76, 76], 10, false);
        dying.animations.play('die', 10, false, true);
        setTimeout(function () {
            restartGame();
        }, 2000, false);
    }

    if (!game.physics.arcade.overlap(player, acid)) {
        stars.callAll("play", null, 'hover');
    }

    acid.callAll("play", null, 'bubble');
    water.callAll("play", null, 'bubble');

    game.physics.arcade.collide(stars, groundLayer);
    game.physics.arcade.collide(player, groundLayer);

    player.body.velocity.x = 0;

    if (cursors.up.isDown) {
        if (player.body.onFloor()) {
            player.body.velocity.y = -300;
            player.animations.play('jump');
        }
    } else if (cursors.left.isDown) {
        player.body.velocity.x = -150;
        player.animations.play('left');
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 150;
        player.animations.play('right');
    } else {
        player.animations.play('idle');
    }
}

function restartGame() {
    console.log("restart");

    // kill stars from earlier game
    stars.callAll('kill');

    // function to find other objects on tilemap objects layer by spritename
    function getObjects(spritename) {
        var results = [];
        console.log(map.objects.objectsLayer);
        for (var a = 0; a < map.objects.objectsLayer.length; a++) {
            if (map.objects.objectsLayer[a].properties.sprite == spritename) {
                map.objects.objectsLayer[a].y -= map.tileHeight;
                results.push(map.objects.objectsLayer[a]);
                console.log(map.objects.objectsLayer[a]);
            }
        }
        return results;
    }

    // create bubbles ('star') group, create instances, add animations

    stars = game.add.group();

    var findStars = getObjects("star");

    for (var a = 0; a < findStars.length; a++) {
        var s = stars.create(findStars[a].x, findStars[a].y, 'star');
    }
    stars.callAll("animations.add", "animations", "hover", [1, 2, 3, 4, 5], 8, true);

    player = game.add.sprite(0, 500, 'player');
    console.log("adding player");

    var helper = game.add.sprite(0, 550, 'player');
    player.animations.add('left', [47, 48], 10, false);
    player.animations.add('right', [42, 43], 10, false);
    player.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 52, 59, 60, 61, 62, 63, 64, 65], 5, false);
    player.animations.add('jump', [56, 57], 10, false);
    player.animations.add('sleep', [66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81], 5, false);

    game.physics.arcade.gravity.y = 250;

    game.physics.enable(player);
    game.physics.enable(stars);

    player.body.bounce.y = 0.2;
    player.body.linearDamping = 1;
    player.body.collideWorldBounds = true;
}

game.update();

function render() {

    // game.debug.body(p);
    game.debug.bodyInfo(player, 0, 0);
}