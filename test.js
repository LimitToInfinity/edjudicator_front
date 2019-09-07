class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene',
      active: true
    });
  }

  preload() {
    // map tiles
    this.load.image('tiles', 'assets/map/spritesheet-extruded.png');
    // map in json format
    this.load.tilemapTiledJSON('map', 'assets/map/map.json');
    // our two characters
    this.load.spritesheet('player', 'assets/RPG_assets.png', {
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.image('golem', 'assets/images/coppergolem.png');
    this.load.image('ent', 'assets/images/dark-ent.png');
    this.load.image('demon', 'assets/images/demon.png');
    this.load.image('worm', 'assets/images/giant-worm.png');
    this.load.image('wolf', 'assets/images/wolf.png');
    this.load.image('sword', 'assets/images/attack-icon.png');
  }

  create() {
    this.scene.start('WorldScene');
  }
}

class WorldScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'WorldScene'
    });
  }

  create() {
    // create map
    this.createMap();

    // create player animations
    this.createAnimations();

    // user input
    this.cursors = this.input.keyboard.createCursorKeys();

    // create enemies
    this.createEnemies();
  }

  createMap() {
    // create the map
    this.map = this.make.tilemap({
      key: 'map'
    });

    // first parameter is the name of the tilemap in tiled
    var tiles = this.map.addTilesetImage('spritesheet', 'tiles', 16, 16, 1, 2);

    // creating the layers
    this.map.createStaticLayer('Grass', tiles, 0, 0);
    this.map.createStaticLayer('Obstacles', tiles, 0, 0);

    // don't go out of the map
    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;
  }

  createAnimations() {
    //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [1, 7, 1, 13]
      }),
      frameRate: 10,
      repeat: -1
    });

    // animation with key 'right'
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [1, 7, 1, 13]
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [2, 8, 2, 14]
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [0, 6, 0, 12]
      }),
      frameRate: 10,
      repeat: -1
    });
  }

  createPlayer(playerInfo) {
    // our player sprite created through the physics system
    this.player = this.add.sprite(0, 0, 'player', 6);

    this.container = this.add.container(playerInfo.x, playerInfo.y);
    this.container.setSize(16, 16);
    this.physics.world.enable(this.container);
    this.container.add(this.player);

    // add weapon
    this.weapon = this.add.sprite(10, 0, 'sword');
    this.weapon.setScale(0.5);
    this.weapon.setSize(8, 8);
    this.physics.world.enable(this.weapon);

    this.container.add(this.weapon);
    this.attacking = false;

    // update camera
    this.updateCamera();

    // don't go out of the map
    this.container.body.setCollideWorldBounds(true);

    this.physics.add.overlap(this.weapon, this.spawns, this.onMeetEnemy, false, this);
    this.physics.add.collider(this.container, this.spawns);
  }

  getValidLocation() {
    var validLocation = false;
    var x, y;
    while (!validLocation) {
      x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
      y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

      var occupied = false;
      this.spawns.getChildren().forEach((child) => {
        if (child.getBounds().contains(x, y)) {
          occupied = true;
        }
      });
      if (!occupied) validLocation = true;
    }
    return { x, y };
  }

  update() {
    if (this.container) {
      this.container.body.setVelocity(0);

      // Horizontal movement
      if (this.cursors.left.isDown) {
        this.container.body.setVelocityX(-80);
      } else if (this.cursors.right.isDown) {
        this.container.body.setVelocityX(80);
      }

      // Vertical movement
      if (this.cursors.up.isDown) {
        this.container.body.setVelocityY(-80);
      } else if (this.cursors.down.isDown) {
        this.container.body.setVelocityY(80);
      }

      // Update the animation last and give left/right animations precedence over up/down animations
      if (this.cursors.left.isDown) {
        this.player.anims.play('left', true);
        this.player.flipX = true;

        this.weapon.flipX = true;
        this.weapon.setX(-10);
      } else if (this.cursors.right.isDown) {
        this.player.anims.play('right', true);
        this.player.flipX = false;

        this.weapon.flipX = false;
        this.weapon.setX(10);
      } else if (this.cursors.up.isDown) {
        this.player.anims.play('up', true);
      } else if (this.cursors.down.isDown) {
        this.player.anims.play('down', true);
      } else {
        this.player.anims.stop();
      }

      if (Phaser.Input.Keyboard.JustDown(this.cursors.space) && !this.attacking && document.activeElement !== inputMessage) {
        this.attacking = true;
        setTimeout(() => {
          this.attacking = false;
          this.weapon.angle = 0;
        }, 150);
      }

      if (this.attacking) {
        if (this.weapon.flipX) {
          this.weapon.angle -= 10;
        } else {
          this.weapon.angle += 10;
        }
      }

      // emit player movement
      var x = this.container.x;
      var y = this.container.y;
      var flipX = this.player.flipX;
      if (this.container.oldPosition && (x !== this.container.oldPosition.x || y !== this.container.oldPosition.y || flipX !== this.container.oldPosition.flipX)) {
        this.socket.emit('playerMovement', { x, y, flipX });
      }
      // save old position data
      this.container.oldPosition = {
        x: this.container.x,
        y: this.container.y,
        flipX: this.player.flipX
      };
    }
  }
}

var config = {
  type: Phaser.AUTO,
  parent: 'content',
  width: 320,
  height: 240,
  zoom: 3,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0
      },
      debug: false // set to true to view zones
    }
  },
  scene: [
    BootScene,
    WorldScene
  ]
};
var game = new Phaser.Game(config);

