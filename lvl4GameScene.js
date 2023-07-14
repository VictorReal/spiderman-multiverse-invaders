class lvl4GameScene extends Phaser.Scene {
	constructor() {
		super({ key: 'lvl4GameScene' });
	}

	preload() {
		this.load.image('miles', './media/skins/miles.png');
		this.load.image('spiderReweb', './media/general/spiderReweb.png');
		this.load.image('rightButton', './media/general/btn-right.svg');
		this.load.image('leftButton', './media/general/btn-left.svg');
		this.load.image('spaceButton', './media/general/btn-space.svg');
    this.load.image('pauseButton', './media/general/btn-pause.svg');
    this.load.image('musicButton', './media/general/btn-music.svg');
		this.load.image('platform', './media/general/platform.png');
		this.load.image('spotWeb', './media/general/spot-web.png'); 
		this.load.image('bg4', './media/general/bg-lvl4.png');

		this.load.image('spot', './media/skins/spot.png');	
		this.load.image('spotPortal', './media/skins/spot-portal.png')

		this.load.audio('backgroundMusic4', './media/sounds/theme-lvl4.mp3');
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

    this.backgroundMusic = this.sound.add('backgroundMusic4', { loop: true });
    if (musicPosition === 0) {
      this.backgroundMusic.play();
    } else {
      this.backgroundMusic.play({ seek: musicPosition });
    }

    const background = this.add.image(0, 40, 'bg4');
    background.setOrigin(0, 0);
    background.setScale(0.6);

    const buttonX = newWidth();

    const platforms = this.physics.add.staticGroup();
    platforms.create(225, 520, 'platform').setScale(1, 0.3).refreshBody();
    gameState.scoreText = this.add.text(5, 513, `Score: ${gameState.score}`, { fontSize: '14px', fill: '#ffffff' });
    gameState.livesText = this.add.text(buttonX-75, 513, `Lives: ${gameState.lives}`, { fontSize: '14px', fill: '#ffffff' });

    gameState.player = this.physics.add.sprite(200, 460, 'miles').setScale(0.12);

    gameState.player.setCollideWorldBounds(true);
    this.physics.add.collider(gameState.player, platforms);

    gameState.cursors = this.input.keyboard.createCursorKeys();

    gameState.enemies = this.physics.add.group();
    gameState.spiderReweb = this.physics.add.group();

    const leftButton = this.add.image(40, 570, 'leftButton')
			.setInteractive()
			.setAlpha(0.9);
		leftButton.on('pointerdown', () => {
			gameState.player.setVelocityX(-1300);
		});
		leftButton.on('pointerup', () => {
			if (gameState.player.body.velocity.x < 0) {
				gameState.player.setVelocityX(0);
			}
		});

		const rightButton = this.add.image(110, 570, 'rightButton')
			.setInteractive()
			.setAlpha(0.9);
		rightButton.on('pointerdown', () => {
			gameState.player.setVelocityX(1300);
		});
		rightButton.on('pointerup', () => {
			if (gameState.player.body.velocity.x > 0) {
				gameState.player.setVelocityX(0);
			}
		});

		const spaceButton = this.add.image(buttonX - 50, 565, 'spaceButton')
			.setInteractive()
			.setAlpha(0.9);
		spaceButton.on('pointerdown', () => {
      if (!gameState.isPaused) {
			gameState.spiderReweb.create(gameState.player.x, gameState.player.y, 'spiderReweb').setGravityY(-400);
      }
		});
    
    const musicButton = this.add.image(30, 20, 'musicButton')
    .setInteractive()
    .setAlpha(0.9)
    .setScale(0.2);
    musicButton.on('pointerdown', () => {
      if (this.backgroundMusic.isPaused) {
        this.backgroundMusic.resume();
      } else {
        this.backgroundMusic.pause();
      }
    });

    const pauseButton = this.add.image(buttonX - 30, 20, 'pauseButton')
    .setInteractive()
    .setAlpha(0.9)
    .setScale(0.2);
    pauseButton.on('pointerdown', () => {
      if (gameState.isPaused) {
        this.resumeGame();
      } else {
        this.pauseGame();
      }
    });


    const spidermen = ['spot'];
    let enemyCount = 1;

    function addEnemy() {
      if (enemyCount < 25) {
        const randomX = Math.random() * 300 + 25;
        const randomY = Math.random() * 100 + 85;
  
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
            const portal = this.add.image(randomX, randomY, 'spotPortal').setScale(0.08).setAlpha(1);
            this.time.delayedCall(800, () => {
              portal.destroy();
            });
            gameState.enemies.create(randomX, randomY, randomSpiderman).setScale(0.13).setGravityY(-196);  
          }      
          enemyCount++;  
        }
      }
    }

    for (let i = 0; i < enemyCount; i++) {
      let randomX, randomY;  
      do {
        randomX = Math.random() * 300 + 25;
        randomY = Math.random() * 100 + 85;
        const proximityThreshold = 40;
  
        const isTooClose = gameState.enemies.getChildren().some(enemy => {
          const distance = Phaser.Math.Distance.Between(randomX, randomY, enemy.x, enemy.y);
          return distance < proximityThreshold;
        });
        if (!isTooClose) {
          const randomSpiderman = Phaser.Utils.Array.GetRandom(spidermen);
          const portal = this.add.image(randomX, randomY, 'spotPortal').setScale(0.08).setAlpha(1);
            this.time.delayedCall(800, () => {
              portal.destroy();
            });
          gameState.enemies.create(randomX, randomY, randomSpiderman).setScale(0.13).setGravityY(-199);
          break;
        }
      } while (true);
    }

    const webs = this.physics.add.group();
    const genWeb = () => {
      let randomSpider = Phaser.Utils.Array.GetRandom(gameState.enemies.getChildren());
      if (randomSpider) {
        const web = webs.create(randomSpider.x, randomSpider.y, 'spotWeb').setGravityY(-85);
        web.setCollideWorldBounds(true); 
        this.physics.add.collider(webs, platforms, (web) => {
          web.destroy();
        });
      }
    };
  
    gameState.websLoop = this.time.addEvent({
      delay: 1500,
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

    gameState.enemyVelocity = 1.2;
  }



  update() {
    if (gameState.active) {
      if (gameState.cursors.left.isDown) {
        gameState.player.setVelocityX(-160);
      } else if (gameState.cursors.right.isDown) {
        gameState.player.setVelocityX(160);
      } else {
        gameState.player.setVelocityX(0);
      }

      if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space)) {
        if (!gameState.isPaused) {
				  gameState.spiderReweb.create(gameState.player.x, gameState.player.y, 'spiderReweb').setGravityY(-400);
        }
			}

      this.physics.add.collider(gameState.enemies, gameState.spiderReweb, (spider, reweb) => {
        spider.destroy();
        reweb.destroy();
        gameState.score += 1;
        gameState.scoreText.setText(`Score: ${gameState.score}`);
      });

      this.physics.add.collider(gameState.enemies, gameState.player, (enemy, player) => {
        this.caught()
      });

      if (gameState.score === 1) {
				gameState.active = false;
				this.physics.pause();
        gameState.websLoop.destroy();

				const winText = this.add.text(70, 240, 'You won the game!', { fontSize: '22px', fill: '#ffffff'  });
				winText.setStyle({ backgroundColor: '#000000', fill: '#ffffff'});
				winText.setPadding(3, 5);

        this.time.delayedCall(3000, () => {   	
					gameState.score = 0;
					gameState.lives = 3;
					gameState.scoreText.setText(`Score: ${gameState.score}`);				
    			gameState.livesText.setText(`Lives: ${gameState.lives}`);      
					this.backgroundMusic.stop();
					this.musicPosition === 0;
        	this.scene.stop('lvl4GameScene')
					this.scene.start('lvl0GameStart')  
        });   
			} else if (this.numOfTotalEnemies() === 0) {
      } else {
        gameState.enemies.getChildren().forEach(spider => {
          spider.x += gameState.enemyVelocity;
          let finalY = Math.random() * 100 + 300;    
          if (spider.y >= finalY) {
            const portalIn = this.add.image(spider.x, spider.y, 'spotPortal').setScale(0.08).setAlpha(1);
        
            const moveSpider = Math.random() * 120 + 100;
            this.time.delayedCall(600, () => {
              portalIn.destroy();
            });
            spider.y = moveSpider;
            spider.x = moveSpider;
        
            const portalOut = this.add.image(spider.x, spider.y, 'spotPortal').setScale(0.08).setAlpha(1);
            this.time.delayedCall(600, () => {
              portalOut.destroy();
            });
        
            spider.setGravityY(-200);
            gameState.enemyVelocity = 1;
          }
				});

        gameState.enemies.getChildren().forEach(spider => {
          if (spider.x < 15 || spider.x > 340) {
            gameState.enemyVelocity *= -1;
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
    this.pauseText = this.add.text(150, 250, 'Pause', { fontSize: '24px', fill: '#ffffff' });
    this.pauseText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
  }

  resumeGame() {
    gameState.isPaused = false;
    gameState.websLoop.paused = false;
    gameState.enemyVelocity = 0.4
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
    const catchedText = this.add.text(60, 250, 'They caught you!', { fontSize: '24px', fill: '#ffffff' });
    catchedText.setStyle({ backgroundColor: '#000000', fill: '#ffffff' });
    catchedText.setPadding(3, 5);
    const restartText = this.add.text(80, 280, 'Click to restart', { fontSize: '20px', fill: '#ffffff' });
    restartText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
    restartText.setPadding(3, 5);
  }
}
