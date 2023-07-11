class lvl1GameScene extends Phaser.Scene {
	constructor() {
		super({ key: 'lvl1GameScene' });
	}

	preload() {
		this.load.image('miles', './media/skins/miles.png');
		this.load.image('spiderReweb', './media/general/spiderReweb.png');
		this.load.image('rightButton', './media/general/btn-right.svg');
		this.load.image('leftButton', './media/general/btn-left.svg');
		this.load.image('spaceButton', './media/general/btn-space.svg');
    this.load.image('pauseButton', './media/general/btn-pause.svg');
		this.load.image('platform', './media/general/platform.png');
		this.load.image('spiderWeb', './media/general/spiderWeb.png');
    this.load.image('bg', './media/general/bg-lvl1.png');

		this.load.image('spidy1', './media/skins/enemy1.png');
		this.load.image('spidy2', './media/skins/enemy2.png');
		this.load.image('spidy3', './media/skins/enemy3.png');
		this.load.image('spider-woman', './media/skins/spider-woman.png');
		this.load.image('scarlet-spider', './media/skins/scarlet-spider.png');
		this.load.image('spider-man2099', './media/skins/spider-man2099-.png');

    this.load.audio('backgroundMusic', './media/sounds/theme-lvl1.mp3');		
	}

	sortedEnemies() {
		const orderedByXCoord = gameState.enemies.getChildren().sort((a, b) => a.x - b.x);
		return orderedByXCoord;
	}

	numOfTotalEnemies() {
		const totalEnemies = gameState.enemies.getChildren().length;
		return totalEnemies;
	}

	create() {


		gameState.active = true;
		this.input.on('pointerup', () => {
			if (gameState.active === false) {
				this.scene.restart();
			}
		});
    this.backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
    if (musicPosition === 0) {
      this.backgroundMusic.play();
    } else {
      this.backgroundMusic.play({ seek: musicPosition });
    }



		const background = this.add.image(0, 40, 'bg');
		background.setOrigin(0, 0);
		background.setScale(0.6);

		const buttonX = newWidth();

		const platforms = this.physics.add.staticGroup();
		platforms.create(225, 520, 'platform').setScale(1, 0.3).refreshBody();
		gameState.scoreText = this.add.text(5, 513, `Score: ${gameState.score}`, { fontSize: '14px', fill: '#ffffff' });
		gameState.livesText = this.add.text(buttonX - 75, 513, `Lives: ${gameState.lives}`, { fontSize: '14px', fill: '#ffffff' });
		gameState.player = this.physics.add.sprite(200, 460, 'miles').setScale(0.12);

		gameState.player.setCollideWorldBounds(true);
		this.physics.add.collider(gameState.player, platforms);

		gameState.cursors = this.input.keyboard.createCursorKeys();

		gameState.enemies = this.physics.add.group();
		gameState.spiderReweb = this.physics.add.group();

		const leftButton = this.add.image(40, 570, 'leftButton')
			.setInteractive()
			.setAlpha(0.5);
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
			.setAlpha(0.5);
		rightButton.on('pointerdown', () => {
			gameState.player.setVelocityX(1300);
		});
		rightButton.on('pointerup', () => {
			if (gameState.player.body.velocity.x > 0) {
				gameState.player.setVelocityX(0);
			}
		});

const pauseButton = this.add.image(buttonX - 30, 20, 'pauseButton')
  .setInteractive()
  .setScale(0.2);
pauseButton.on('pointerdown', () => {
  if (gameState.isPaused) {
    this.resumeGame();
  } else {
    this.pauseGame();
  }
});


		const spaceButton = this.add.image(buttonX - 50, 565, 'spaceButton')
			.setInteractive()
			.setAlpha(0.5);
		spaceButton.on('pointerdown', () => {
      if (!gameState.isPaused) {
			gameState.spiderReweb.create(gameState.player.x, gameState.player.y, 'spiderReweb').setGravityY(-400);
      }
		});

		const spidermen = ['spidy1', 'spidy2', 'spidy3', 'spidy1', 'spidy2', 'spidy3'];
		let enemyCount = 6;

		function addEnemy() {
			if (enemyCount < 55) {
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
							randomX = Math.random() * 300 + 25;
							randomY = Math.random() * 70 + 75;
							const proximityThreshold = 50;

							isTooClose = gameState.enemies.getChildren().some(enemy => {
								const distance = Phaser.Math.Distance.Between(randomX, randomY, enemy.x, enemy.y);
								return distance < proximityThreshold;
							});
						} while (isTooClose);

						if (gameState.score > 19 && !gameState.spawnedEnemy1) {
							const newEnemy1 = 'spider-woman';
							availableEnemies.push(newEnemy1);
							gameState.enemies.create(randomX, randomY, newEnemy1).setScale(0.09).setGravityY(-199);
							gameState.spawnedEnemy1 = true;
						} else if (gameState.score > 29 && !gameState.spawnedEnemy2) {
							const newEnemy2 = 'scarlet-spider';
							availableEnemies.push(newEnemy2);
							gameState.enemies.create(randomX, randomY, newEnemy2).setScale(0.09).setGravityY(-197);
							gameState.spawnedEnemy2 = true;
						} else if (gameState.score > 39 && !gameState.spawnedEnemy3) {
							const newEnemy3 = 'spider-man2099';
							availableEnemies.push(newEnemy3);
							gameState.enemies.create(randomX, randomY, newEnemy3).setScale(0.09).setGravityY(-196);
							gameState.spawnedEnemy3 = true;
						} else {
							const randomSpiderman = Phaser.Utils.Array.GetRandom(availableEnemies);
							gameState.enemies.create(randomX, randomY, randomSpiderman).setScale(0.08).setGravityY(-198);
						}
					}
					enemyCount++;
				}
			}
		}

		for (let i = 0; i < enemyCount; i++) {
			let randomX, randomY;
			do {
				randomX = Math.random() * 300 + 25;
				randomY = Math.random() * 70 + 75;
				const proximityThreshold = 50;

				const isTooClose = gameState.enemies.getChildren().some(enemy => {
					const distance = Phaser.Math.Distance.Between(randomX, randomY, enemy.x, enemy.y);
					return distance < proximityThreshold;
				});
				if (!isTooClose) {
					const randomSpiderman = Phaser.Utils.Array.GetRandom(spidermen);
					gameState.enemies.create(randomX, randomY, randomSpiderman).setScale(0.08).setGravityY(-198);
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
				gameState.active = false;
				gameState.websLoop.destroy();
				this.physics.pause();
        this.backgroundMusic.pause();
        musicPosition = this.backgroundMusic.seek;
				gameState.score = 0;
				gameState.lives = 5;
				gameState.scoreText.setText(`Score: ${gameState.score}`);
				gameState.livesText.setText(`Lives: ${gameState.lives}`);
				const catchedText = this.add.text(80, 250, 'They caught you!', { fontSize: '24px', fill: '#ffffff' });
				catchedText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
				const restartText = this.add.text(100, 280, 'Click to restart', { fontSize: '20px', fill: '#ffffff' });
				restartText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
			} else {
				web.destroy();
				gameState.lives -= 1;
				gameState.livesText.setText(`Lives: ${gameState.lives}`);
			}
		});

		gameState.enemyVelocity = 0.4;
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
				gameState.active = false;
				gameState.websLoop.destroy();
				this.physics.pause();
        this.backgroundMusic.pause();
				gameState.enemyVelocity = 1;
				gameState.score = 0;
				gameState.scoreText.setText(`Score: ${gameState.score}`);
				const catchedText = this.add.text(80, 250, 'They caught you!', { fontSize: '24px', fill: '#ffffff' });
				catchedText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
				const restartText = this.add.text(100, 280, 'Click to restart', { fontSize: '20px', fill: '#ffffff' });
				restartText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
			});

			if (gameState.score === 50) {
				gameState.active = false;
				this.physics.pause();
				const winText = this.add.text(120, 240, 'You won!', { fontSize: '28px' });
				winText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
				const restartText = this.add.text(70, 30, 'click "Restart" to play again', { fontSize: '12px', fill: '#ffffff' });
				restartText.setStyle({ backgroundColor: '#000000', padding: 5 });
				const nextLevelText = this.add.text(70, 50, 'click ">" to play next level', { fontSize: '12px', fill: '#ffffff' });
				nextLevelText.setStyle({ backgroundColor: '#000000', padding: 5 });

			} else if (this.numOfTotalEnemies() === 0) {
			} else {
				gameState.enemies.getChildren().forEach(spider => {
					spider.x += gameState.enemyVelocity;
					if (spider.y >= 480) {
						gameState.active = false;
						gameState.websLoop.destroy();
						this.physics.pause();
						gameState.enemyVelocity = 0.4;
						gameState.score = 0;
						gameState.scoreText.setText(`Score: ${gameState.score}`);
						const catchedText = this.add.text(80, 250, 'They caught you!', { fontSize: '24px', fill: '#ffffff' });
						catchedText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
						const restartText = this.add.text(100, 280, 'Click to restart', { fontSize: '20px', fill: '#ffffff' });
						restartText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
					}
				});

				gameState.leftMostSpider = this.sortedEnemies()[0];
				gameState.rightMostSpider = this.sortedEnemies()[this.sortedEnemies().length - 1];

				if (gameState.leftMostSpider.x < 18 || gameState.rightMostSpider.x > 340) {
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
    this.backgroundMusic.pause();
		this.physics.pause();
    this.pauseText = this.add.text(150, 250, 'Pause', { fontSize: '24px', fill: '#ffffff' });
    this.pauseText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
	}

	resumeGame() {
		gameState.isPaused = false;
		gameState.websLoop.paused = false;
    gameState.enemyVelocity = 0.4
		gameState.player.setVelocity(0);
    this.backgroundMusic.resume();
		this.physics.resume();
    if (this.pauseText) {
			this.pauseText.destroy();
			this.pauseText = null;
		}
	}
}

function newWidth() {
	const buttonX = 400;
	return buttonX;
}