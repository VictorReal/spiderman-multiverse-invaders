class lvl1GameScene extends Phaser.Scene {
	constructor() {
		super({ key: 'lvl1GameScene' });
	}

	preload() {
		this.load.image('miles', './media/skins/smiles.png');
		this.load.image('spiderReweb', './media/general/spiderReweb.png');
		this.load.image('rightButton', './media/general/btn-right.svg');
		this.load.image('leftButton', './media/general/btn-left.svg');
		this.load.image('spaceButton', './media/general/btn-space.svg');
    this.load.image('pauseButton', './media/general/btn-pause.svg');
    this.load.image('musicButton', './media/general/btn-music.svg');
		this.load.image('platform', './media/general/platform.png');
		this.load.image('spiderWeb', './media/general/spiderWeb.png');
    this.load.image('bg1', './media/general/bg-lvl1.png');

		this.load.image('spidy1', './media/skins/enemy1.png');
		this.load.image('spidy2', './media/skins/enemy2.png');
		this.load.image('spidy3', './media/skins/enemy3.png');
		this.load.image('spider-woman', './media/skins/spider-woman.png');
		this.load.image('scarlet-spider', './media/skins/scarlet-spider.png');
		this.load.image('spider-man2099', './media/skins/spider-man2099.png');

    this.load.audio('backgroundMusic1', './media/sounds/theme-lvl1.mp3');	
    
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
			if (gameState.active === false && gameState.score < 20) {
				this.scene.restart();
			}
		});

    this.backgroundMusic = this.sound.add('backgroundMusic1', { loop: true });
    if (musicPosition === 0) {
      this.backgroundMusic.play();
    } else {
      this.backgroundMusic.play({ seek: musicPosition });
    }

		const background = this.add.image(0, 90, 'bg1');
		background.setOrigin(0, 0);
		background.setScale(1.48);

		const buttonX = newWidth();

		const platforms = this.physics.add.staticGroup();
		platforms.create(450, 1310, 'platform').setScale(2.2, 0.6).refreshBody();
		gameState.scoreText = this.add.text(20, 1300, `Score: ${gameState.score}`, { fontSize: '38px', fill: '#ffffff' });
		gameState.livesText = this.add.text(buttonX - 200, 1300, `Lives: ${gameState.lives}`, { fontSize: '38px', fill: '#ffffff' });

		gameState.player = this.physics.add.sprite(400, 1200, 'miles').setScale(0.2);

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


		const spidermen = ['spidy1', 'spidy2', 'spidy3', 'spidy1', 'spidy2', 'spidy3'];
		let enemyCount = 4;

		function addEnemy() {
			if (enemyCount < 65) {
				if (gameState.active) {
					let availableEnemies = spidermen.slice();
					gameState.enemies.getChildren().forEach(enemy => {
						const index = availableEnemies.indexOf(enemy.texture.key);
						if (index !== -1) {
							availableEnemies.splice(index, 1);
						}
					});
					if (availableEnemies.length > 0) {
						let randomX, randomY;
						let isTooClose;
						do {
							randomX = Math.random() * 700 + 25;
							randomY = Math.random() * 150 + 200;
							const proximityThreshold = 100;

							isTooClose = gameState.enemies.getChildren().some(enemy => {
								const distance = Phaser.Math.Distance.Between(randomX, randomY, enemy.x, enemy.y);
								return distance < proximityThreshold;
							});
						} while (isTooClose);

						if (gameState.score > 4 && !gameState.spawnedEnemy1) {
							const newEnemy1 = 'spider-woman';
							availableEnemies.push(newEnemy1);
							gameState.enemies.create(randomX, randomY, newEnemy1).setScale(0.2).setGravityY(-195);
							gameState.spawnedEnemy1 = true;
						} else if (gameState.score > 9 && !gameState.spawnedEnemy2){
							const newEnemy2 = 'scarlet-spider';
							availableEnemies.push(newEnemy2);
							gameState.enemies.create(randomX, randomY, newEnemy2).setScale(0.2).setGravityY(-194);
							gameState.spawnedEnemy2 = true;
						} else if (gameState.score > 14 && !gameState.spawnedEnemy3) {
							const newEnemy3 = 'spider-man2099';
							availableEnemies.push(newEnemy3);
							gameState.enemies.create(randomX, randomY, newEnemy3).setScale(0.3).setGravityY(-190);
							gameState.spawnedEnemy3 = true;
						} else {
							const randomSpiderman = Phaser.Utils.Array.GetRandom(availableEnemies);
							gameState.enemies.create(randomX, randomY, randomSpiderman).setScale(0.2).setGravityY(-200);
						}
					}
					enemyCount++;
				}
			}
		}

		for (let i = 0; i < enemyCount; i++) {
			let randomX, randomY;
			do {
				randomX = Math.random() * 700 + 25;
				randomY = Math.random() * 150 + 200;
				const proximityThreshold = 100;

				const isTooClose = gameState.enemies.getChildren().some(enemy => {
					const distance = Phaser.Math.Distance.Between(randomX, randomY, enemy.x, enemy.y);
					return distance < proximityThreshold;
				});
				if (!isTooClose) {
					const randomSpiderman = Phaser.Utils.Array.GetRandom(spidermen);
					gameState.enemies.create(randomX, randomY, randomSpiderman).setScale(0.2).setGravityY(-200);
					break;
				}
			} while (true);
		}

		const webs = this.physics.add.group();
		const genWeb = () => {
			let randomSpider = Phaser.Utils.Array.GetRandom(gameState.enemies.getChildren());
			if (randomSpider) {
				const web = webs.create(randomSpider.x, randomSpider.y, 'spiderWeb').setGravityY(-75);
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

		gameState.enemyVelocity = 0.6;
	}

	update() {
		if (gameState.active) {
			if (gameState.cursors.left.isDown) {
				gameState.player.setVelocityX(-320);
			} else if (gameState.cursors.right.isDown) {
				gameState.player.setVelocityX(320);
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

			if (gameState.score === 20) {
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
					gameState.lives = 5;
					gameState.scoreText.setText(`Score: ${gameState.score}`);				
    			gameState.livesText.setText(`Lives: ${gameState.lives}`);      
					this.backgroundMusic.stop();
					this.musicPosition === 0;
        	this.scene.stop('lvl1GameScene')
					this.scene.start('lvl2GameStart1')  
        });   
			} else if (this.numOfTotalEnemies() === 0) {
			} else {
				gameState.enemies.getChildren().forEach(spider => {
					spider.x += gameState.enemyVelocity;
					if (spider.y >= 1300) {
            this.caught()
					}
				});

				gameState.leftMostSpider = this.sortedEnemies()[0];
				gameState.rightMostSpider = this.sortedEnemies()[this.sortedEnemies().length - 1];

				if (gameState.leftMostSpider.x < 30 || gameState.rightMostSpider.x > 870) {
					gameState.enemyVelocity *= -1;
				}
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
    gameState.enemyVelocity = 0.6
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
		gameState.lives = 3;
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
      } else if (cursorKeys.right.isDown) {
        gameState.player.setVelocityX(320);
      } else {
        gameState.player.setVelocityX(0);
      }
    }
  }
}
