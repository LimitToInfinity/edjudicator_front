document.addEventListener("DOMContentLoaded", postLoad)

function postLoad() {

// fetch('/user/data', {
//     method: 'GET',
//     headers: {
//       'Authorization': 'Bearer' + authToken
//     }
//   })
//   .then(res => res.json())
//   .then(data => { console.log(data) })
//   .catch(err => { console.log(err) })

// function getAllClients() {
//     const myHeaders = new Headers({
//         'Content-Type': 'application/json',
//         'Authorization': 'your-token'
//     });

//     return fetch('http://localhost:8080/clients', {
//       method: 'GET',
//       headers: myHeaders,
//     })

//     .then(response => {
//         if (response.status === 200) {
//           return response.json();
//         } else {
//           throw new Error('Something went wrong on api server!');
//         }
//       })
//       .then(response => {
//         console.debug(response);
//       }).catch(error => {
//         console.error(error);
//       });
//     }

//     getAllClients();

// if (this.state.logged_in) {
//     fetch('http://localhost:8000/core/current_user/', {
//     headers: {
//         Authorization: `JWT ${localStorage.getItem('token')}`
//     }
//     })
//     .then(res => res.json())
//     .then(json => {
//         this.setState({ username: json.username });
//     });
// }

//   handle_login = (e, data) => {
//     e.preventDefault();
//     fetch('http://localhost:8000/token-auth/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(data)
//     })
//       .then(res => res.json())
//       .then(json => {
//         localStorage.setItem('token', json.token);
//         this.setState({
//           logged_in: true,
//           displayed_form: '',
//           username: json.user.username
//         });
//       });
//   };

//   handle_signup = (e, data) => {
//     e.preventDefault();
//     fetch('http://localhost:8000/core/users/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(data)
//     })
//       .then(res => res.json())
//       .then(json => {
//         localStorage.setItem('token', json.token);
//         this.setState({
//           logged_in: true,
//           displayed_form: '',
//           username: json.username
//         });
//       });
//   };

//   handle_logout = () => {
//     localStorage.removeItem('token');
//     this.setState({ logged_in: false, username: '' });
//   };

  const loginURL = "http://127.0.0.1:8000/api/v1/auth/login/";
  const registerURL = "http://127.0.0.1:8000/api/v1/auth/register/";

  const loginForm = document.querySelector(".login-form");

  loginForm.addEventListener("submit", login);

  function login(event)
  {
    event.preventDefault();

    loginFormData = new FormData(loginForm);

    const username = loginFormData.get("username");
    const password = loginFormData.get("password");

    const loginBody =
    {
      username,
      password,
    }

    fetch(`${loginURL}`,
    {
      method: 'POST',
      headers:
      {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginBody)
    })
      .then(res => res.json())
      .then(json =>
      {
        localStorage.setItem('token', json.token);
        console.log(localStorage.getItem("token"));
      });
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
      debug: false,
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
var bench;
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

  bench = platforms.create(213, 534, 'empty'); //bench platform
  bench.setSize(222, 2);
  bench.body.checkCollision.down = false;
  bench.body.checkCollision.left = false;
  bench.body.checkCollision.right = false;

  trashCan = platforms.create(58, 509, 'empty'); //trash can platform
  trashCan.setSize(56, 4);
  trashCan.body.checkCollision.down = false;
  trashCan.body.checkCollision.left = false;
  // trashCan.body.checkCollision.right = false;

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
  sword = game.add.zone(0, 0, 37, 10);

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
    score += 10;
    scoreText.setText('score: ' + score);
  }

  enemies = game.physics.add.group({
    key: 'minotaur',
    repeat: 2,
    setXY: { x: 310, y: 0, stepX: 200, stepY: 50 }
  });

  enemies.children.iterate(function (child)
  {
    child.flipX = true;
    child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.3));
    child.body.setOffset(27, 25)
    // child.body.offset.x = 27;
    // child.body.offset.y = 25;
    child.setSize(38, 40, false);
  });

  // set speeds
  Phaser.Actions.Call(enemies.getChildren(), function(minotaur) {
    minotaur.speed = - (Math.floor(Math.random() * 100 + 80));
  }, game);

  game.physics.add.collider(enemies, platforms);
  game.physics.add.overlap(playerContainer, enemies, onEnemyOverlap, null, game);

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
    
    score = 0;
    scoreText.setText('score: ' + score); 
  }

  game.physics.add.overlap(sword, enemies, slashEnemy, null, game);
  // sword.on('enterzone', () => console.log('enterzone'));
  // sword.on('leavezone', () => console.log('leavezone'));

  function slashEnemy(sword, enemy)
  {
    // if (sword.state.attacking)
    // {
      enemy.disableBody(true, true);
      score += 20;
      scoreText.setText('score: ' + score);
    // }
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
    frameRate: 14,
    repeat: 0
  });

  game.anims.create({
    key: 'horizontalSlash',
    frames: game.anims.generateFrameNumbers('dude', { start: 53, end: 58 }),
    frameRate: 12,
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
      bench.body.checkCollision.up = true;
      trashCan.body.checkCollision.up = true;
    }
  });

  // game.input.keyboard.on('keyup_UP', function (event) {
  //     if (player.body.onFloor())
  //     {
  //         player.body.setOffset(18, 10);
  //         player.body.offset.x = 18;
  //         player.body.offset.y = 10;
  //         player.setSize(14, 26, false);
  //     }
  // });

  game.input.keyboard.on('keyup_C', function (event) {
    if (c.isUp)
    {
      playerContainer.body.offset.y = -8;
      playerContainer.body.setSize(14, 26, false);
      bench.body.checkCollision.up = true;
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
      setTimeout(horizontalAttack, 500);
    }
    // sword.setInteractive();
    // sword.input.hitArea.setTo(0, 0, 37, 10);
    // game.input.enableDebug(sword);
  });

  function horizontalAttack()
  {
    player.setState(0);
    game.physics.world.disable(sword); // (0) DYNAMIC (1) STATIC        
  }

  // game.input.keyboard.on('keyup_A', function(event) {
  // game.physics.world.disable(sword); // (0) DYNAMIC (1) STATIC
  // sword.disableInteractive();
  // game.input.removeDebug(sword);
  // });

  game.input.keyboard.on('keydown_S', function(event) {
    if (player.flipX) { sword.x = playerContainer.x - 32; }
    else { sword.x = playerContainer.x + 32; }
    game.physics.world.enable(sword); // (0) DYNAMIC (1) STATIC
    sword.body.setAllowGravity(false);
  });

  game.input.keyboard.on('keyup_S', function(event) {
    game.physics.world.disable(sword); // (0) DYNAMIC (1) STATIC        
  });

  game.input.on('pointerdown', function(pointer, currentlyOver) { console.log("x", pointer.x, "y", pointer.y) });

  // // Phaser 2 hitboxes
  // // create a group for all the player's hitboxes
  // hitboxes = game.add.group();
  // // give all the hitboxes a physics body (I'm using arcade physics btw)
  // hitboxes.enableBody = true;
  // // make the hitboxes children of the player. They will now move with the player
  // player.addChild(hitboxes);
  // // create a "hitbox" (really just an empty sprite with a physics body)
  // var verticalSwing = hitboxes.create(0, 0, null);
  // // set the size of the hitbox, and its position relative to the player
  // verticalSwing.body.setSize(50, 50, player.width, player.height / 2);
  // // add some properties to the hitbox. These can be accessed later for use in calculations
  // verticalSwing.name = "verticalSwing";
  // verticalSwing.damage = 1;
  // verticalSwing.knockbackDirection = 0.5;
  // verticalSwing.knockbackAmt = 600;
  // // activate a hitbox by namefunction
  // function enableHitbox(hitboxName) {
  //     // search all the hitboxes
  //     for(var i = 0; i < hitboxes.children.length; i++)
  //     {
  //         // if we find the hitbox with the "name" specified
  //         if(hitboxes.children[i].name === hitboxName)
  //         {
  //             // reset it
  //             hitboxes.children[i].reset(0, 0);
  //         }
  //     }
  // }
  // // disable all active hitboxes
  // function disableAllHitboxes()
  // {
  //     hitboxes.forEachExists(
  //         function(hitbox)
  //         {
  //             hitbox.kill();
  //         }
  //     );
  // }

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
  if (score === 80)
  {
    scoreText.setText("You Win!");
    scoreText.setPosition(323, 283);
  }

  sword.y = playerContainer.y + 10;
  if (player.flipX) { sword.x = playerContainer.x - 32; }
  else { sword.x = playerContainer.x + 32; }

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
      bench.body.checkCollision.up = false;
      trashCan.body.checkCollision.up = false;
    }
  }
  else if (s.isDown) // Phaser.Input.Keyboard.JustDown(s)
  {
    sword.y = playerContainer.y + 10;
    if (player.flipX) { sword.x = playerContainer.x - 32; }
    else { sword.x = playerContainer.x + 32; }
    player.anims.play('verticalSlash', true);
  }
  else if (a.isDown)
  {

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

  minotaurs.forEach(minotaur => {
    if (minotaur.body.onFloor())
    {
      minotaur.anims.play('minotaurRunning', true)

      //move enemies
      minotaur.setVelocityX(minotaur.speed);

      // endLocationLeft = minotaur.x - 100;
      // endLocationRight = minotaur.x + 100;
      // console.log(minotaur.x, endLocationLeft, endLocationRight);

      if (minotaur.x <= 200 && minotaur.speed < 0)
      {
        minotaur.speed *= -1;
        minotaur.flipX = false;
      }
      else if (minotaur.x >= 700 && minotaur.speed > 0)
      {
        minotaur.speed *= -1;
        minotaur.flipX = true;
      }
    }

    // if (Phaser.Geom.Intersects.RectangleToRectangle(playerContainer.getBounds(), minotaur.getBounds()))
    // {
    //     // gameOver();
    // }
  });
}