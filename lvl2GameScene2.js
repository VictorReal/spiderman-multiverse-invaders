class lvl2GameScene2 extends Phaser.Scene {
	constructor() {
		super({ key: 'lvl2GameScene2' });
	}

	preload() {
		this.load.image('gwen', './media/skins/gwen.png');
		this.load.image('spiderReweb', './media/general/spiderReweb.png');
		this.load.image('rightButton', './media/general/btn-right.svg');
		this.load.image('leftButton', './media/general/btn-left.svg');
		this.load.image('spaceButton', './media/general/btn-space.svg');
    this.load.image('pauseButton', './media/general/btn-pause.svg');
    this.load.image('musicButton', './media/general/btn-music.svg');
		this.load.image('platform', './media/general/platform.png');
		this.load.image('spiderWeb', './media/general/web2099.png'); 
		this.load.image('bg2', './media/general/bg-lvl2.png');

		this.load.image('spider-man2099', './media/skins/spider-man2099.png');	
		this.load.image('portal', './media/skins/spider-man2099-portal.png')

		this.load.audio('backgroundMusic2-1', './media/sounds/theme-lvl2-1.mp3');

    let url;
    url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
    this.load.plugin('rexvirtualjoystickplugin', url, true);
	}

	sortedEnemies() {
    const orderedByXCoord = gameState.enemies.getChildren().sort((a, b) => a.x - b.x);
  	return orderedByXCoord;
	};
	
	numOfTotalEnemies() {
  	const totalEnemies = gameState.enemies.getChildren().length;
  	return totalEnemies;
  };

  create() {
    gameState.active = true;
    this.input.on('pointerup', () => {
      if (gameState.active === false && gameState.score < 10) {
				this.scene.restart();
      }
    });

    this.backgroundMusic = this.sound.add('backgroundMusic2-1', { loop: true });
    if (musicPosition === 0) {
      this.backgroundMusic.play();
    } else {
      this.backgroundMusic.play({ seek: musicPosition });
    }

    const background = this.add.image(0, 90, 'bg2');
    background.setOrigin(0, 0);
    background.setScale(1.48);

    const buttonX = newWidth();

    const platforms = this.physics.add.staticGroup();
		platforms.create(450, 1310, 'platform').setScale(2.2, 0.6).refreshBody();
		gameState.scoreText = this.add.text(20, 1300, `Score: ${gameState.score}`, { fontSize: '38px', fill: '#ffffff' });
		gameState.livesText = this.add.text(buttonX - 200, 1300, `Lives: ${gameState.lives}`, { fontSize: '38px', fill: '#ffffff' });

    gameState.player = this.physics.add.sprite(400, 1200,'gwen').setScale(0.2);

    gameState.player.setCollideWorldBounds(true);
    this.physics.add.collider(gameState.player, platforms);

    gameState.enemies = this.physics.add.group();
    gameState.spiderReweb = this.physics.add.group(); 

    gameState.cursors = this.input.keyboard.createCursorKeys();
    
    this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 130,
      y: 1460,
      radius: 80,
      base: this.add.circle(0, 0, 80, 0x888888),
      thumb: this.add.circle(0, 0, 40, 0xcccccc),
    }).on('update', this.handleJoystickInput, this);

		const spaceButton = this.add.image(buttonX - 110, 1450, 'spaceButton')
			.setInteractive()
			.setAlpha(0.9)
      .setScale(2.5);
		spaceButton.on('pointerdown', () => {
      if (!gameState.isPaused) {
			gameState.spiderReweb.create(gameState.player.x, gameState.player.y, 'spiderReweb').setGravityY(-400);
      }
		});
    
    const musicButton = this.add.image(60, 40, 'musicButton')
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

    const pauseButton = this.add.image(buttonX - 60, 40, 'pauseButton')
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


    const spidermen = ['spider-man2099'];
    let enemyCount = 1;

    function addEnemy() {
      if (enemyCount < 55) {
        const randomX = Math.random() * 700 + 35;
        const randomY = Math.random() * 600 + 200;
  
        if (gameState.active) {
          let availableEnemies = spidermen.slice();
          gameState.enemies.getChildren().forEach(enemy => {
            const index = availableEnemies.indexOf(enemy.texture.key);
            if (index !== -1) {
              availableEnemies.splice(index, 1);
            }
          });
          if (availableEnemies.length > 0) {
            const randomSpiderman = Phaser.Utils.Array.GetRandom(availableEnemies);
            const portal = this.add.image(randomX, randomY, 'portal').setScale(0.2).setAlpha(0.8);
            this.time.delayedCall(800, () => {
              portal.destroy();
            });
            gameState.enemies.create(randomX, randomY, randomSpiderman).setScale(0.3).setGravityY(-199);  
          }      
          enemyCount++;  
        }
      }
    }

    for (let i = 0; i < enemyCount; i++) {
      let randomX, randomY;  
      do {
        randomX = Math.random() * 700 + 35;
        randomY = Math.random() * 600 + 200;
        const proximityThreshold = 40;
  
        const isTooClose = gameState.enemies.getChildren().some(enemy => {
          const distance = Phaser.Math.Distance.Between(randomX, randomY, enemy.x, enemy.y);
          return distance < proximityThreshold;
        });
        if (!isTooClose) {
          const randomSpiderman = Phaser.Utils.Array.GetRandom(spidermen);
          const portal = this.add.image(randomX, randomY, 'portal').setScale(0.2).setAlpha(0.8);
            this.time.delayedCall(800, () => {
              portal.destroy();
            });
          gameState.enemies.create(randomX, randomY, randomSpiderman).setScale(0.3).setGravityY(-199);
          break;
        }
      } while (true);
    }

    const webs = this.physics.add.group();
    const genWeb = () => {
      let randomSpider = Phaser.Utils.Array.GetRandom(gameState.enemies.getChildren());
      if (randomSpider) {
        const chaosX = (Math.random() < 0.5 ? -1 : 1)* Math.random() * 200;
        const web = webs.create(randomSpider.x, randomSpider.y, 'spiderWeb').setGravityY(-75).setGravityX(chaosX);
        web.setCollideWorldBounds(true); 
        this.physics.add.collider(webs, platforms, (web) => {
          web.destroy();
        });
      }
    };
  
    gameState.websLoop = this.time.addEvent({
      delay: 750,
      callback: genWeb,
      callbackScope: this,
      loop: true,
    });

    const increaseEnemyCount = this.time.addEvent({
      delay: 1000,
      callback: addEnemy,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(gameState.player, webs, (player, web) => {
      if (gameState.lives === 1) {
				this.caught()
			} else {
				web.destroy();
				gameState.lives -= 1;
				gameState.livesText.setText(`Lives: ${gameState.lives}`);
			}
		});

    gameState.enemyVelocity = 1.5;
  }



  update() {
    if (gameState.active) {
      if (gameState.cursors.left.isDown) {
        gameState.player.setVelocityX(-320);
        gameState.player.flipX = true;
      } else if (gameState.cursors.right.isDown) {
        gameState.player.setVelocityX(320);
        gameState.player.flipX = false;
      } else {
        gameState.player.setVelocityX(0);
      }

      if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space)) {
        if (!gameState.isPaused) {
				  gameState.spiderReweb.create(gameState.player.x, gameState.player.y, 'spiderReweb').setGravityY(-400);
        }
			}
      this.handleJoystickInput();

      this.physics.add.collider(gameState.enemies, gameState.spiderReweb, (spider, reweb) => {
        spider.destroy();
        reweb.destroy();
        gameState.score += 1;
        gameState.scoreText.setText(`Score: ${gameState.score}`);
      });

      this.physics.add.collider(gameState.enemies, gameState.player, (enemy, player) => {
        this.caught()
      });

      if (gameState.score === 10) {
				gameState.active = false;
				this.physics.pause();
        gameState.websLoop.destroy();

				const winText = this.add.text(300, 600, 'You won!', { fontSize: '62px'});
				winText.setStyle({ backgroundColor: '#000000', fill: '#ffffff'});
				winText.setPadding(3, 5);
        const readyText = this.add.text(220, 660, 'Get ready for \nthe next level', { fontSize: '52px'});
				readyText.setStyle({ backgroundColor: '#000000', fill: '#ffffff' }); 
				readyText.setPadding(3, 5);

        this.time.delayedCall(3000, () => {   	
					gameState.score = 0;
					gameState.lives = 1;
					gameState.scoreText.setText(`Score: ${gameState.score}`);				
    			gameState.livesText.setText(`Lives: ${gameState.lives}`);      
					this.backgroundMusic.stop();
					this.musicPosition === 0;
        	this.scene.stop('lvl2GameScene')
					this.scene.start('lvl3GameStart')  
        });   
			} else if (this.numOfTotalEnemies() === 0) {
      } else {
				gameState.enemies.getChildren().forEach(spider => {
					spider.x += gameState.enemyVelocity;
					if (spider.y >= 1300) {
            this.caught()
					}
				});

        gameState.enemies.getChildren().forEach(spider => {
          if (spider.x < 30 || spider.x > 870) {
            gameState.enemyVelocity *= -1;
            spider.flipX = (spider.x >= 870);
          }
        });
    } 
  }
}
  pauseGame() {
    gameState.isPaused = true;
    gameState.websLoop.paused = true;
    gameState.enemyVelocity = 0
    gameState.player.setVelocity(0);
    this.physics.pause();
    this.pauseText = this.add.text(300, 600, 'Pause', { fontSize: '75px', fill: '#ffffff' });
    this.pauseText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
  }

  resumeGame() {
    gameState.isPaused = false;
    gameState.websLoop.paused = false;
    gameState.enemyVelocity = 1.5
    gameState.player.setVelocity(0);
    this.physics.resume();
    if (this.pauseText) {
      this.pauseText.destroy();
      this.pauseText = null;
    }
  }

  caught(){
    gameState.active = false;
		gameState.websLoop.destroy();
		this.physics.pause();
    this.backgroundMusic.pause();
    musicPosition = this.backgroundMusic.seek;
		gameState.score = 0;
		gameState.lives = 5;
		gameState.scoreText.setText(`Score: ${gameState.score}`);				
    	gameState.livesText.setText(`Lives: ${gameState.lives}`);
      	const catchedText = this.add.text(150, 600, '', { fontSize: '62px'});
		catchedText.setStyle({ backgroundColor: '#000000', fill: '#ffffff' });
		catchedText.setPadding(3, 5);
		catchedText.setAlign('center');
		catchedText.setText([
			'They caught you!',
			'Click to restart'
		]);
  }

  handleJoystickInput() {
    let cursorKeys = this.joyStick.createCursorKeys();
    const isKeyboardInput = gameState.cursors.left.isDown || gameState.cursors.right.isDown;
    
    if (!isKeyboardInput) {
      if (cursorKeys.left.isDown) {
        gameState.player.setVelocityX(-320);
        gameState.player.flipX = true;
      } else if (cursorKeys.right.isDown) {
        gameState.player.setVelocityX(320);
        gameState.player.flipX = false;
      } else {
        gameState.player.setVelocityX(0);
      }
    }
  }
}
