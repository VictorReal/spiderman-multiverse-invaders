function preload() {
  this.load.image('miles', '../general/miles.svg');
  this.load.image('spiderReweb', '../general/spiderReweb.png');  
  this.load.image('rightButton', '../general/btn-right.svg');
  this.load.image('leftButton', '../general/btn-left.svg');
  this.load.image('spaceButton','../general/btn-space.svg');
  this.load.image('platform', '../general/platform.png');


  this.load.image('spider-man2099', './media/level4/spot.png');
  this.load.image('spiderWeb', './media/level4/spot-web.png');
  this.load.image('portal', './media/level4/portal.png')
  this.load.image('bg', './media/level4/bg.png');




  
  this.load.image('spidy1', './media/level1/enemy1.svg');
  this.load.image('spidy2', './media/level1/enemy2.svg');
  this.load.image('spidy3', './media/level1/enemy3.svg');
  
  this.load.image('spider-woman', './media/level1/spider-woman.svg');
  this.load.image('scarlet-spider', './media/level1/scarlet-spider.svg');
};

function sortedEnemies() {
  const orderedByXCoord = gameState.enemies.getChildren().sort((a, b) => a.x - b.x);
  return orderedByXCoord;
};

function numOfTotalEnemies() {
  const totalEnemies = gameState.enemies.getChildren().length;
  return totalEnemies;
};

const gameState = {
  score: 0,
  enemyIndex: 0
};

function create() {

  gameState.active = true;
  this.input.on('pointerup', () => {
    if (gameState.active === false) {
      this.scene.restart();
    }
  });

  const background = this.add.image(0, -10, 'bg');
  background.setOrigin(0, 0);
  background.setScale(0.6);

  const platforms = this.physics.add.staticGroup();
  platforms.create(225, 470, 'platform').setScale(1, 0.3).refreshBody();
  gameState.scoreText = this.add.text(5, 463, `Score: ${gameState.score}`, { fontSize: '14px', fill: '#ffffff' });

  gameState.player = this.physics.add.sprite(200, 420, 'miles').setScale(0.2);

  gameState.player.setCollideWorldBounds(true);
  this.physics.add.collider(gameState.player, platforms);

  gameState.cursors = this.input.keyboard.createCursorKeys();

  gameState.enemies = this.physics.add.group();
  gameState.spiderReweb = this.physics.add.group();

  const leftButton = this.add.image(40, 515, 'leftButton')
    .setInteractive()
    .setAlpha(0.5);
  leftButton.on('pointerover', () => {
    gameState.player.setVelocityX(-1300);
  });
  leftButton.on('pointerup', () => {
    if (gameState.player.body.velocity.x < 0) {
      gameState.player.setVelocityX(0);
    }
  });

  const rightButton = this.add.image(110, 515, 'rightButton')
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
  
  const buttonX = window.innerWidth - 90;
  const spaceButton = this.add.image(buttonX, 512, 'spaceButton')
    .setInteractive()
    .setAlpha(0.5);
  spaceButton.on('pointerdown', () => {
    gameState.spiderReweb.create(gameState.player.x, gameState.player.y, 'spiderReweb').setGravityY(-400);
  });



  const spidermen = ['spider-man2099'];
  let enemyCount = 1;

  function addEnemy() {
    if (enemyCount < 55) {
      const randomX = Math.random() * 300 + 25;
      const randomY = Math.random() * 270 + 45;
  
      if (gameState.active) {
        let availableEnemies = spidermen.slice();
        gameState.enemies.getChildren().forEach(enemy => {
          const index = availableEnemies.indexOf(enemy.texture.key);
          if (index !== -1) {
            availableEnemies.splice(index, 1);
          }
        });
        if (availableEnemies.length > 0) {
 
            const randomSpiderman = Phaser.Utils.Array.GetRandom(availableEnemies);const portal = this.add.image(randomX, randomY, 'portal').setScale(0.08).setAlpha(0.8);
              this.time.delayedCall(800, () => {
                portal.destroy();
              });
            gameState.enemies.create(randomX, randomY, randomSpiderman).setScale(0.1).setGravityY(-198);

          
              
            
          }      
        enemyCount++;  
      }
    }
  }

  for (let i = 0; i < enemyCount; i++) {
    let randomX, randomY;  
    do {
      randomX = Math.random() * 300 + 25;
      randomY = Math.random() * 170 + 55;
      const proximityThreshold = 40;
  
      const isTooClose = gameState.enemies.getChildren().some(enemy => {
        const distance = Phaser.Math.Distance.Between(randomX, randomY, enemy.x, enemy.y);
        return distance < proximityThreshold;
      });
      if (!isTooClose) {
        const randomSpiderman = Phaser.Utils.Array.GetRandom(spidermen);
        gameState.enemies.create(randomX, randomY, randomSpiderman).setScale(0.1).setGravityY(-197);
        break;
      }
    } while (true);
  }

  const webs = this.physics.add.group();
  const genWeb = () => {
    let randomSpider = Phaser.Utils.Array.GetRandom(gameState.enemies.getChildren());
    if (randomSpider) {
      const web = webs.create(randomSpider.x, randomSpider.y, 'spiderWeb').setGravityY(-75).setGravityX(-30);
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

  this.physics.add.collider(gameState.player, webs, () => {
    gameState.active = false;
    gameState.websLoop.destroy();
    this.physics.pause();
    gameState.enemyVelocity = 1;
    const canonText = this.add.text(80, 250, 'It was a canon event', { fontSize: '18px', fill: '#ffffff' });
    canonText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
    const fightText = this.add.text(65, 270, 'Stand up and fight!', { fontSize: '22px', fill: '#ffffff' });
    fightText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
  });  

  gameState.enemyVelocity = 0.7;
}



function update() {
  if (gameState.active) {
    if (gameState.cursors.left.isDown) {
      gameState.player.setVelocityX(-160);
    } else if (gameState.cursors.right.isDown) {
      gameState.player.setVelocityX(160);
    } else {
      gameState.player.setVelocityX(0);
    }

    if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space)) {
      gameState.spiderReweb.create(gameState.player.x, gameState.player.y, 'spiderReweb').setGravityY(-400);
    }

    this.physics.add.collider(gameState.enemies, gameState.spiderReweb, (spider, reweb) => {
      spider.destroy();
      reweb.destroy();
      gameState.score += 1;
      gameState.scoreText.setText(`Score: ${gameState.score}`);
    });

    this.physics.add.collider(gameState.enemies, gameState.player, () => {
      gameState.active = false;
      gameState.websLoop.destroy();
      this.physics.pause();
      gameState.enemyVelocity = 1;
      gameState.score = 0;
      gameState.scoreText.setText(`Score: ${gameState.score}`);
      const catchedText = this.add.text(80, 250, 'They catched you!', { fontSize: '24px', fill: '#ffffff' });
      catchedText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
      const restartText = this.add.text(100, 280, 'Click to restart', { fontSize: '20px', fill: '#ffffff' });
      restartText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
    });

    if (numOfTotalEnemies() === 0) {
    } else if (gameState.score === 10) {
      gameState.active = false;
      this.physics.pause();
      const winText = this.add.text(120, 240, 'You won!', { fontSize: '28px' });
      winText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
      const restartText = this.add.text(70, 30, 'click "Restart" to play again', { fontSize: '12px', fill: '#ffffff' });
      restartText.setStyle({ backgroundColor: '#000000', padding: 5 });
      const nextLevelText = this.add.text(70, 50, 'click ">" to play next level', { fontSize: '12px', fill: '#ffffff' });
      nextLevelText.setStyle({ backgroundColor: '#000000', padding: 5 });
    
    } else {
      gameState.enemies.getChildren().forEach(spider => {
        spider.x += gameState.enemyVelocity;
        if (spider.y >= 470) {
          gameState.active = false;
          gameState.websLoop.destroy();
          this.physics.pause();
          gameState.enemyVelocity = 1;
          gameState.score = 0;
          gameState.scoreText.setText(`Score: ${gameState.score}`);
          const catchedText = this.add.text(80, 250, 'They catched you!', { fontSize: '24px', fill: '#ffffff' });
          catchedText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
          const restartText = this.add.text(100, 280, 'Click to restart', { fontSize: '20px', fill: '#ffffff' });
          restartText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
        }
      });

      gameState.leftMostSpider = sortedEnemies()[0];
      gameState.rightMostSpider = sortedEnemies()[sortedEnemies().length - 1];

      if (gameState.leftMostSpider.x < 15 || gameState.rightMostSpider.x > 340) {
        gameState.enemyVelocity *= -1;
      }
    } 
  }
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth - 50,
  height: 630,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      enableBody: true,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
  scale: {
    mode: Phaser.Scale.FIT,
  },
  render: {
    antialias: true,
  },
  
};
/*
const game = new Phaser.Game(config);
*/