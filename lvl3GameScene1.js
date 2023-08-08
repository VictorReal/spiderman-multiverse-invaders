class lvl3GameScene1 extends Phaser.Scene {
	constructor() {
		super({ key: 'lvl3GameScene1' });
    this.heights = [7, 8, 6, null, 5, 7, null, 6, 6];
    this.weather = 'afternoon';
	}

  
  preload() {
    this.load.image('platform3', './media/general/lvl3-platform3-1.png');
    this.load.spritesheet('milesanim', './media/skins/miles-anim.png', { frameWidth: 128, frameHeight: 128});
    this.load.spritesheet('gwen-anim', './media/skins/gwen-anim.png', { frameWidth: 288, frameHeight: 330})
  
    this.load.image('bg31', './media/general/lvl3-sun.png');      
    this.load.image('bg32', './media/general/lvl3-town.png');
    this.load.image('bg33', './media/general/lvl3-details.png');

    this.load.image('spaceButton', './media/general/btn-space.svg');
    this.load.image('restartButton', './media/general/btn-restart.svg');
    this.load.image('pauseButton', './media/general/btn-pause.svg');
    this.load.image('musicButton', './media/general/btn-music.svg');
    this.load.image('platformlvl3', './media/general/lvl3-platform.png');

    this.load.audio('backgroundMusic3', './media/sounds/theme-lvl3.mp3');
    let url;
    url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
    this.load.plugin('rexvirtualjoystickplugin', url, true);
  }
  
  create() {
    gameState.active = true;
    this.backgroundMusic = this.sound.add('backgroundMusic3', { loop: true });
    if (musicPosition === 0) {
      this.backgroundMusic.play();
    } else {
      this.backgroundMusic.play({ seek: musicPosition });
    }
  
    gameState.bgColor = this.add.rectangle(0, 90, config.width, config.height, 0x00ffbb).setOrigin(0, 0);
  
    this.createParallaxBackgrounds();
  
    gameState.player = this.physics.add.sprite(100, 800, 'gwen-anim').setScale(0.4).setGravityY(200);
  
    gameState.platforms = this.physics.add.staticGroup();      
  
    this.cameras.main.setBounds(0, 0, gameState.bg3.width, gameState.bg3.height);
    this.physics.world.setBounds(0, 0, gameState.width, gameState.bg3.height + gameState.player.height);
  
    this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5)
    gameState.player.setCollideWorldBounds(true);
    this.levelSetup();
    const platforms = this.physics.add.staticGroup();
    platforms.create(2000, 1600, 'platformlvl3').setScale(1, 0.8).refreshBody();
    this.createAnimations();
    this.physics.add.collider(gameState.player, gameState.platforms);
    this.physics.add.collider(gameState.goal, gameState.platforms);
  
    gameState.cursors = this.input.keyboard.createCursorKeys();

    this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 130,
      y: 1460,
      radius: 80,
      base: this.add.circle(0, 0, 80, 0x888888),
      thumb: this.add.circle(0, 0, 40, 0xcccccc),
    }).on('update', this.handleJoystickInput, this);

    this.rbLayer = this.add.group();
    this.mbLayer = this.add.group();
    this.pbLayer = this.add.group();
    this.ptLayer = this.add.group();
      
    const restartButton = this.rbLayer.create(200, 40, 'restartButton')
    .setInteractive()
    .setAlpha(0.9)
    .setScale(0.14);
    restartButton.on('pointerdown', () => {
      this.time.delayedCall(1000, () => {  
        this.backgroundMusic.pause();
        musicPosition = this.backgroundMusic.seek;  	
        this.scene.restart('');
      });     
    });
    
    const musicButton = this.mbLayer.create(60, 40, 'musicButton')
    .setInteractive()
    .setAlpha(0.9)
    .setScale(0.5);
    musicButton.on('pointerdown', () => {
      if (this.backgroundMusic.isPaused) {
        this.backgroundMusic.resume();
      } else {
        this.backgroundMusic.pause();
      }
    });

    const pauseButton = this.pbLayer.create( config.width - 60, 40, 'pauseButton')
    .setInteractive()
    .setAlpha(0.9)
    .setScale(0.5);
    pauseButton.on('pointerdown', () => {
      if (gameState.isPaused) {
        this.resumeGame();
      } else {
        this.pauseGame();
      }
    });
  
  }
  
  createPlatform(xIndex, yIndex) {
    if (typeof yIndex === 'number' && typeof xIndex === 'number') {
      gameState.platforms.create((440 * xIndex),  yIndex * 200, 'platform3').setOrigin(0, 0.5).setScale(2.0).refreshBody();
    }
  }
  
  createAnimations() {
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('gwen-anim', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    });
  
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('gwen-anim', { start: 4, end: 5 }),
      frameRate: 10,
      repeat: -1
    });
  
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('gwen-anim', { start: 2, end: 3 }),
      frameRate: 10,
      repeat: -1
    })
  
    this.anims.create({
      key: 'miles',
      frames: this.anims.generateFrameNumbers('milesanim'),
      frameRate: 10,
      repeat: -1
    })
  }
  
  createParallaxBackgrounds() {
    gameState.bg1 = this.add.image(200, 0, 'bg31');
    gameState.bg2 = this.add.image(0, 350, 'bg32');
    gameState.bg3 = this.add.image(0, 0, 'bg33');
  
    gameState.bg1.setOrigin(0, 0);
    gameState.bg2.setOrigin(0, 0);
    gameState.bg3.setOrigin(0, 0);
  
    const game_width = parseFloat(gameState.bg3.getBounds().width)
    gameState.width = game_width;
    const window_width = config.width
  
    const bg1_width = gameState.bg1.getBounds().width
    const bg2_width = gameState.bg2.getBounds().width
  
    gameState.bgColor .setScrollFactor(0);
    gameState.bg1.setScrollFactor((bg1_width - window_width) / (game_width - window_width));
    gameState.bg2.setScrollFactor((bg2_width - window_width) / (game_width - window_width));
  }
  
  levelSetup() {
    for (const [xIndex, yIndex] of this.heights.entries()) {
      this.createPlatform(xIndex, yIndex);
    } 

    gameState.goal = this.physics.add.sprite(gameState.width - 80, 100, 'milesanim');
  
    this.physics.add.overlap(gameState.player, gameState.goal, function() {
      this.cameras.main.fade(800, 0, 0, 0, false, function(camera, progress) {
        if (progress > .9) {
          this.backgroundMusic.pause();
          musicPosition = this.backgroundMusic.seek;
          this.scene.stop(); 
          this.scene.start('lvl3GameScene2');
        }
      });
    }, null, this);
    this.setWeather(this.weather);
  }
  
  update() {
    if(gameState.active){
      gameState.goal.anims.play('miles', true);
      if (gameState.cursors.right.isDown) {
        gameState.player.flipX = false;
        gameState.player.setVelocityX(gameState.speed * 2);
        gameState.player.anims.play('run', true);
      } else if (gameState.cursors.left.isDown) {
        gameState.player.flipX = true;
        gameState.player.setVelocityX(-gameState.speed * 2);
        gameState.player.anims.play('run', true);
      } else {
        gameState.player.setVelocityX(0);
        gameState.player.anims.play('idle', true);
      }
  
      if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space) && gameState.player.body.touching.down) {
        gameState.player.anims.play('jump', true);
        gameState.player.setVelocityY(-410);
      }
  
      if (!gameState.player.body.touching.down){
        gameState.player.anims.play('jump', true);
      }
  
      if (gameState.player.y > gameState.bg3.height) {
        this.cameras.main.shake(240, .01, false, function(camera, progress) {
          if (progress > .9) {
            this.backgroundMusic.pause();
            musicPosition = this.backgroundMusic.seek;
            this.scene.restart(this.levelKey);
          }
        });
      }
      this.handleJoystickInput();
      this.pbLayer.setX(this.cameras.main.scrollX + config.width - 60);
      this.mbLayer.setX(this.cameras.main.scrollX + 60);
      this.rbLayer.setX(this.cameras.main.scrollX + 200);  
    }
  }
  
  setWeather(weather) {
    const weathers = {
      'afternoon': {
        'color': 0xffffff,
        'bgColor': 0x0571FF,
      },   
    }
    let { color, bgColor } = weathers[weather];
    gameState.bgColor.fillColor = bgColor;
    gameState.bg2.setTint(color);
    gameState.bg3.setTint(color);
    gameState.player.setTint(color);
    gameState.goal.setTint(color);
    for (let platform of gameState.platforms.getChildren()) {
      platform.setTint(color);
    }
  }

  pauseGame() {
    gameState.isPaused = true;  
    this.physics.pause();
    const pauseText = this.add.text(300, 600, 'Pause', { fontSize: '75px', fill: '#ffffff' });
    pauseText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
    this.ptLayer.add(pauseText);
    this.ptLayer.setX(this.cameras.main.scrollX + 300);
  }

  resumeGame() {
    gameState.isPaused = false;    
    this.physics.resume();
    this.ptLayer.clear(true, true);
  }

  handleJoystickInput() {
    let cursorKeys = this.joyStick.createCursorKeys();
    const isKeyboardInput = gameState.cursors.left.isDown || gameState.cursors.right.isDown;
    
    if (!isKeyboardInput) {
      gameState.goal.anims.play('miles', true);
      if (cursorKeys.left.isDown) {
        gameState.player.flipX = true;
          gameState.player.setVelocityX(-gameState.speed * 2);
          gameState.player.anims.play('run', true);
      } else if (cursorKeys.right.isDown) {gameState.player.flipX = false;
          gameState.player.setVelocityX(gameState.speed * 2);
          gameState.player.anims.play('run', true);
      } else {
        gameState.player.setVelocityX(0);
        gameState.player.anims.play('idle', true);
      }
      if(cursorKeys.up.isDown && gameState.player.body.touching.down){
      gameState.player.anims.play('jump', true);
      gameState.player.setVelocityY(-410);
      }
    }
  }
}  
