document.addEventListener("DOMContentLoaded", postLoad)

function postLoad() {

    // const highScoresURL = "127.0.0.1:8000/api/v1/highscores/";
    
    const highScoresURL = "https://edjudicatorback.herokuapp.com/api/v1/highscores/";
    const token = localStorage.getItem("token");
    
    getAllHighScores();

    const logoutButton = document.querySelector(".logout-button");
    
    logoutButton.addEventListener("click", logout);

    function logout()
    {
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('token');
        goToHomepage();
    }

    function goToHomepage()
    {
        window.location.replace("index.html");
    }

    function getAllHighScores()
    {
        const myHeaders = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        
        return fetch(`${highScoresURL}`, {
            method: 'GET',
            headers: myHeaders,
        })
        .then(response => {
            if (response.status === 200) { return response.json(); }
            else
            {
                showNotLoggedInModal();
                throw new Error('Log in or register, yo!');
            }
        })
            .then(highScores => {
                console.log(highScores);
            })
            .catch(error => {
                console.error(error);
            });
    }

    function showNotLoggedInModal()
    {
        body = document.querySelector("body");
    
        notLoggedInModal = document.createElement("div");
        notLoggedInModal.classList.add("not-logged-in-modal");
        notLoggedInModal.textContent = "Login to slay!"

        homepageButton = document.createElement("button");
        homepageButton.classList.add("homepage-button");
        homepageButton.textContent = "Login!"
        homepageButton.addEventListener("click", goToHomepage);

        notLoggedInModal.append(homepageButton);

        body.prepend(notLoggedInModal);
    }
}

var config =
{
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 650 },
            debug: true,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    scale: {
        parent: 'world-map',
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY, //or CENTER_BOTH or CENTER_VERTICALLY
        width: 800,
        height: 600
    }
};

var game;
var playerContainer;
var player;
var sword;
var bird;
var platforms;
var ground;
// var bench;
var trashCan;
var avocados;
var enemies;
var cursors;
var c;
var s;
var a;
var d;
var score = 0;
var scoreText;

var game = new Phaser.Game(config);

function preload ()
{
    game = this;

    game.load.image('sky', 'assets/bench_scene.jpg');
    // game.load.image('bench', 'assets/bench.png');
    // game.load.image('trashCan', 'assets/trash_can.png');
    game.load.image('empty', 'assets/empty.png');
    game.load.image('avocado', 'assets/avocado.png');
    game.load.spritesheet('bird', 'assets/bird_robin.png',
    {
        frameWidth: 240, frameHeight: 314
    });
    game.load.spritesheet('dude', 'assets/adventurer.png',
    {
        frameWidth: 50, frameHeight: 37
    });
    game.load.spritesheet('minotaur', 'assets/minotaur.png',
    {
        frameWidth: 96, frameHeight: 96
    });
}

function create ()
{
    game = this;
    
    game.add.image(400, 300, 'sky');
    
    score = 0;
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' }).setDepth(1);

    bird = game.add.sprite(100, 100, 'bird', 0).setScale(0.5);
    bird.flipX = true;
    
    var birdTween = game.tweens.add({
        targets: bird,
        x: 700,
        duration: 7000,
        ease: 'Power5',
        flipX: true,
        yoyo: true,
        repeat: -1,
        hold: 0
    });

    platforms = game.physics.add.staticGroup();
    
    // platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    
    ground = platforms.create(400, 597, 'empty'); // ground
    ground.setSize(800, 5);
    
    // bench = platforms.create(213, 534, 'empty'); //bench platform
    // bench.setSize(222, 2);
    // bench.body.checkCollision.down = false;
    // bench.body.checkCollision.left = false;
    // bench.body.checkCollision.right = false;

    trashCan = platforms.create(58, 509, 'empty'); //trash can platform
    trashCan.setSize(56, 4);
    trashCan.body.checkCollision.down = false;
    trashCan.body.checkCollision.left = false;
    trashCan.body.checkCollision.right = false;
    
    playerContainer = game.add.container(59, 50).setDepth(1).setScale(2);
    game.physics.world.enable(playerContainer);
    playerContainer.body.setCollideWorldBounds(true);
    playerContainer.body.setBounce(0.2);
    playerContainer.body.setOffset(-7, -8);
    playerContainer.body.setSize(14, 26, false);
    
    game.physics.add.collider(playerContainer, platforms);
    
    player = game.add.sprite(0, 0, 'dude', 105);    // game.physics.add.sprite(0, 0, 'dude', 105);
    
    playerContainer.add( player );
    
    // add weapon hit box
    sword = game.add.zone(0, 0, 25, 10);
    
    // sword.body.moves = false;
    //new Phaser.Geom.Rectangle(playerContainer.x, playerContainer.y, 20, 20), Phaser.Geom.Rectangle.Contains);
    // game.input.setHitAreaRectangle(sword, 50, 0, 100, 100, Phaser.Geom.Rectangle.Contains);
    // sword.enableBody = true;
    
    // var hitArea = new Phaser.Geom.Circle(0, 0, 60);
    // playerContainer.setInteractive(hitArea, Phaser.Geom.Circle.Contains);

    avocados = game.physics.add.group({
        key: 'avocado',
        repeat: 1,
        setXY: { x: 15, y: 0, stepX: 770 }
    });
    
    avocados.children.iterate(function (child)
    {
        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.6));    
        child.setScale(0.05);
        child.setSize(600, 400, false);
    });

    game.physics.add.collider(avocados, platforms);
    game.physics.add.overlap(playerContainer, avocados, collectAvocado, null, game);

    function collectAvocado (playerContainer, avocado)
    {
        avocado.disableBody(true, true);
        addScore(10);
    }

    enemies = game.physics.add.group({
        key: 'minotaur',
        repeat: 0,
        setXY: { x: 310, y: 0, stepX: 200, stepY: 50 }
    });
    
    enemies.children.iterate(function (child)
    {
        child.flipX = true;
        child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.3));
        child.body.setOffset(27, 25)
        child.setSize(38, 40, false);
    });
    
    // set speeds
    Phaser.Actions.Call(enemies.getChildren(), function(minotaur) {
        minotaur.speed = - (Math.floor(Math.random() * 100 + 130));
    }, game);
    
    game.physics.add.collider(enemies, platforms);
    game.physics.add.overlap(playerContainer, enemies, onEnemyOverlap, null, game);

    game.physics.add.overlap(sword, enemies, slashEnemy, null, game);
    // sword.on('enterzone', () => console.log('enterzone'));
    // sword.on('leavezone', () => console.log('leavezone'));

    function slashEnemy(sword, enemy)
    {
        // if (sword.state.attacking)
        // {
            enemy.disableBody(true, true);
            addScore(20);
        // }

        if (enemies.countActive(true) === 0)
        {
            let randomNumber;
            enemies.children.iterate(function (child)
            {
                randomNumber = Math.floor(Math.random() * 100 + 350);
                child.enableBody(true, randomNumber, 0, true, true);
            });

            var newEnemy = enemies.create(randomNumber, 50, 'minotaur');
            newEnemy.flipX = true;
            newEnemy.setCollideWorldBounds(true);
            newEnemy.setBounceY(Phaser.Math.FloatBetween(0.1, 0.3));
            newEnemy.body.setOffset(27, 25)
            newEnemy.setSize(38, 40, false);
            newEnemy.speed = - (Math.floor(Math.random() * 100 + 180));
        }
    }
    
    function addScore(points)
    {
        score += points;
        scoreText.setText('score: ' + score);
        didYouWin();
    }
    
    didYouWin = () => {
        if (score % 100 === 0)
        {
            scoreText.setText("You Win!");
            scoreText.setPosition(323, 283);
        }
    }
    
    function onEnemyOverlap (playerContainer, enemy)
    {
        gameOver();
    }

    gameOver = () => {
 
        // flag to set player is dead
        game.isPlayerContainerAlive = false;
       
        // shake the camera
        game.time.delayedCall(100, function() {
            game.cameras.main.shake(1100);
        }, [], game);
       
        // fade camera
        game.time.delayedCall(300, function() {
          game.cameras.main.fade(900);
        }, [], game);
       
        // restart game
        game.time.delayedCall(1200, function() {
          game.scene.restart();
        }, [], game);
    }

    game.anims.create({
        key: 'running',
        frames: game.anims.generateFrameNumbers('dude', { start: 8, end: 13 }),
        frameRate: 9,
        repeat: -1
    });

    game.anims.create({
        key: 'standing',
        frames: game.anims.generateFrameNumbers('dude', { start: 38, end: 41 } ),
        frameRate: 6,
        repeat: -1
    });

    game.anims.create({
        key: 'jumping',
        frames: game.anims.generateFrameNumbers('dude', { start: 14, end: 23 }),
        frameRate: 18,
        repeat: 0
    });

    game.anims.create({
        key: 'crouching',
        frames: game.anims.generateFrameNumbers('dude', { start: 4, end: 7 }),
        frameRate: 6,
        repeat: -1
    });

    game.anims.create({
        key: 'verticalSlash',
        frames: game.anims.generateFrameNumbers('dude', { start: 47, end: 52 }),
        frameRate: 12,
        repeat: 0
    });

    game.anims.create({
        key: 'horizontalSlash',
        frames: game.anims.generateFrameNumbers('dude', { start: 53, end: 58 }),
        frameRate: 24,
        repeat: 0
    });

    game.anims.create({
        key: 'blocking',
        frames: game.anims.generateFrameNumbers('dude', { start: 59, end: 63 }),
        frameRate: 6,
        repeat: 0
    });

    game.anims.create({
        key: 'dying',
        frames: [ { key: 'dude', frame: 67 } ],
        framerate: 20,
    })

    game.anims.create({
        key: 'minotaurRunning',
        frames: game.anims.generateFrameNumbers('minotaur', { start: 10, end: 17 }),
        frameRate: 10,
        repeat: -1
    });

    game.anims.create({
        key: 'flying',
        frames: game.anims.generateFrameNumbers('bird', { start: 0, end: 21 } ),
        frameRate: 12,
        repeat: -1
    });

    cursors = game.input.keyboard.createCursorKeys();
    c = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    s = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    a = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    d = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    game.input.keyboard.on('keydown_RIGHT', function (event) {
        player.setState(0);
        game.physics.world.enable(sword);
        game.physics.world.disable(sword);
    });

    game.input.keyboard.on('keyup_RIGHT', function (event) {
        if (cursors.right.isUp)
        {
            setTimeout(() => playerContainer.body.setVelocityX(0), 150);
        }
    });

    game.input.keyboard.on('keydown_LEFT', function (event) {
        player.setState(0);
        game.physics.world.enable(sword);
        game.physics.world.disable(sword);
    });

    game.input.keyboard.on('keyup_LEFT', function (event) {
        if (cursors.left.isUp)
        {
            setTimeout(() => playerContainer.body.setVelocityX(0), 150);
        }
    });

    game.input.keyboard.on('keyup_DOWN', function (event) {
        if (cursors.down.isUp)
        {
            playerContainer.body.offset.y = -8;
            playerContainer.body.setSize(14, 26, false);
            // bench.body.checkCollision.up = true;
            trashCan.body.checkCollision.up = true;
        }
    });

    game.input.keyboard.on('keyup_C', function (event) {
        if (c.isUp)
        {
            playerContainer.body.offset.y = -8;
            playerContainer.body.setSize(14, 26, false);
            // bench.body.checkCollision.up = true;
            trashCan.body.checkCollision.up = true;
        }
    });

    game.input.keyboard.on('keydown_A', function(event) {
        if (player.state === 0 && !(cursors.left.isDown || cursors.right.isDown))
        {
            game.physics.world.enable(sword); // (0) DYNAMIC (1) STATIC
            sword.body.setAllowGravity(false);
            player.setState(1);
            player.anims.play('horizontalSlash');
            setTimeout(endAttack, 250);
        }
    });

    game.input.keyboard.on('keydown_S', function(event) {
        if (player.state === 0 && !(cursors.left.isDown || cursors.right.isDown))
        {
            game.physics.world.enable(sword); // (0) DYNAMIC (1) STATIC
            sword.body.setAllowGravity(false);
            player.setState(1);
            player.anims.play('verticalSlash');
            setTimeout(endAttack, 500);
        }
    });

    function endAttack()
    {
        player.setState(0);
        game.physics.world.disable(sword); // (0) DYNAMIC (1) STATIC        
    }

    game.input.on('pointerdown', function(pointer, currentlyOver) { console.log("x", pointer.x, "y", pointer.y) });

    game.isPlayerContainerAlive = true;

    // reset camera effects
    game.cameras.main.resetFX();

    // actionKeys = game.input.keyboard.addKeys({
    //     "crouch": Phaser.Input.Keyboard.KeyCodes.C,
    //     "punch": Phaser.Input.Keyboard.KeyCodes.P,
    // })
}

function update ()
{
    sword.y = playerContainer.y + 10;
    if (player.flipX) { sword.x = playerContainer.x - 28; }
    else { sword.x = playerContainer.x + 28; }

    game = this;

    if (!game.isPlayerContainerAlive)
    {
        player.anims.play('dying', true);
        return; 
    }

    if (cursors.left.isDown && playerContainer.body.onFloor())
    {
        player.flipX = true; // or player.setFlip(true, false); (x, y)

        playerContainer.body.setVelocityX(-180);

        player.anims.play('running', true);
    }
    else if (cursors.right.isDown &&  playerContainer.body.onFloor())
    {
        player.flipX = false; // or player.setFlip(false, false); (x, y)

        playerContainer.body.setVelocityX(180);

        player.anims.play('running', true);
    }
    else if (cursors.down.isDown || c.isDown)
    {
        playerContainer.body.offset.y = 0;
        playerContainer.body.setSize(14, 18, false);
        player.anims.play('crouching', true);
        if (playerContainer.body.onFloor()
            && (cursors.down.getDuration() > 500 || c.getDuration() > 500))
        {
            // playerContainer.body.offset.y = 5;
            // playerContainer.body.setSize(14, 20, false);
            // bench.body.checkCollision.up = false;
            trashCan.body.checkCollision.up = false;
        }
    }
    else if (d.isDown)
    {
        player.anims.play('blocking');
    }
    else
    {
        if (playerContainer.body.onFloor() && player.state === 0)
        {
            player.anims.play('standing', true);
        }
        else if (playerContainer.body.velocity.y < -1.81)
        {
            player.anims.play('jumping', true);
        }
    }

    if ((cursors.up.isDown || cursors.space.isDown) &&  playerContainer.body.onFloor()) // or .body.touching.down if platforms
    {
        playerContainer.body.setVelocityY(-360);
    }

    bird.anims.play("flying", true);

    let minotaurs = enemies.getChildren();

    // var touching = sword.body.touching;
    // var wasTouching = sword.body.wasTouching;
  
    // if (touching.none && !wasTouching.none)
    // {
    //     sword.emit('leavezone');
    // }
    // else if (!touching.none && wasTouching.none)
    // {
    //     sword.emit('enterzone');
    // }

    minotaurs.forEach(minotaur => 
        {
            if (minotaur.body.onFloor())
            {
                minotaur.anims.play('minotaurRunning', true)

                //move enemies
                minotaur.setVelocityX(minotaur.speed);

                // endLocationLeft = minotaur.x - 100;
                // endLocationRight = minotaur.x + 100;
                // console.log(minotaur.x, endLocationLeft, endLocationRight);

                if (minotaur.x <= 60 && minotaur.speed < 0)
                {
                    minotaur.speed *= -1;
                    minotaur.flipX = false;
                }
                else if (minotaur.x >= 730 && minotaur.speed > 0)
                {
                    minotaur.speed *= -1;
                    minotaur.flipX = true;
                }
            }

            // if (Phaser.Geom.Intersects.RectangleToRectangle(playerContainer.getBounds(), minotaur.getBounds()))
            // {
            //     // gameOver();
            // }
        }
    );

    function authFetchCall(url, method, header, body)
    {
        const myHeaders = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${header}`
        });

        return fetch(url,
        {
            method,
            headers: myHeaders,
            body: JSON.stringify(body)
        });
    }
}