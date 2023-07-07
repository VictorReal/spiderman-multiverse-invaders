function preload() {
  this.load.image('miles', '../miles-test.png');
  /* this.load.image('spiderReweb', '../general/spiderReweb.png');  */
  this.load.image('rightButton', '../general/btn-right.svg');
  this.load.image('leftButton', '../general/btn-left.svg');
  this.load.image('spaceButton','../general/btn-space.svg');
  this.load.image('platform', '../general/platform.png');
/*
  this.load.image('spidy1', './media/level1/enemy1.svg');
  this.load.image('spidy2', './media/level1/enemy2.svg');
  this.load.image('spidy3', './media/level1/enemy3.svg');
  this.load.image('spiderWeb', './media/level1/spiderWeb.png');
  this.load.image('spider-woman', './media/level1/spider-woman.svg');
  this.load.image('scarlet-spider', './media/level1/scarlet-spider.svg');
  this.load.image('spider-man2099', './media/level1/spider-man2099.svg');
  */
  this.load.image('bg', './bg.png');


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
  score: 0
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

  gameState.player = this.physics.add.sprite(200, 420, 'miles').setScale(0.12);

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
  
  const buttonX = newWidth();
  const spaceButton = this.add.image(buttonX-50, 512, 'spaceButton')
    .setInteractive()
    .setAlpha(0.5);
  spaceButton.on('pointerdown', () => {
    gameState.spiderReweb.create(gameState.player.x, gameState.player.y, 'spiderReweb').setGravityY(-400);
  });

/*
  const nextLevelButton = this.add.image(110, 570, 'rightButton')
    .setInteractive();
  if (gameState.score > 2) {
    nextLevelButton.setAlpha(0.1);
  }else if (gameState.score === 10) {
    nextLevelButton.setAlpha(1.0);
  }

  nextLevelButton.on('pointerdown', () => {
    gameState.player.setVelocityX(1300);
  });

  nextLevelButton.on('pointerup', () => {
    if (gameState.player.body.velocity.x > 0) {
      gameState.player.setVelocityX(0);
    }
  });

*/





  const spidermen = ['spidy1', 'spidy2', 'spidy3', 'spidy1', 'spidy2', 'spidy3'];
  let enemyCount = 7;

  function addEnemy() {
    if (enemyCount < 55) {
      const randomX = Math.random() * 300 + 25;
      const randomY = Math.random() * 40 + 25;
  
      if (gameState.active) {
        let availableEnemies = spidermen.slice();
        gameState.enemies.getChildren().forEach(enemy => {
          const index = availableEnemies.indexOf(enemy.texture.key);
          if (index !== -1) {
            availableEnemies.splice(index, 1);
          }
        });
        if (availableEnemies.length > 0) {
          if (gameState.score > 19 && !gameState.spawnedEnemy1) {
            const newEnemy1 = 'spider-woman';
            availableEnemies.push(newEnemy1);
            gameState.enemies.create(randomX, randomY, newEnemy1).setScale(0.6).setGravityY(-199);
            gameState.spawnedEnemy1 = true;
          } else if (gameState.score > 29 && !gameState.spawnedEnemy2) {
            const newEnemy2 = 'scarlet-spider';
            availableEnemies.push(newEnemy2);
            gameState.enemies.create(randomX, randomY, newEnemy2).setScale(0.6).setGravityY(-197);
            gameState.spawnedEnemy2 = true;
          } else if (gameState.score > 39 && !gameState.spawnedEnemy3) {
            const newEnemy3 = 'spider-man2099';
            availableEnemies.push(newEnemy3);
            gameState.enemies.create(randomX, randomY, newEnemy3).setScale(0.6).setGravityY(-196);
            gameState.spawnedEnemy3 = true;
          } else  {
            const randomSpiderman = Phaser.Utils.Array.GetRandom(availableEnemies);
            gameState.enemies.create(randomX, randomY, randomSpiderman).setScale(0.06).setGravityY(-198);
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
      randomY = Math.random() * 70 + 25;
      const proximityThreshold = 40;
  
      const isTooClose = gameState.enemies.getChildren().some(enemy => {
        const distance = Phaser.Math.Distance.Between(randomX, randomY, enemy.x, enemy.y);
        return distance < proximityThreshold;
      });
      if (!isTooClose) {
        const randomSpiderman = Phaser.Utils.Array.GetRandom(spidermen);
        gameState.enemies.create(randomX, randomY, randomSpiderman).setScale(0.06).setGravityY(-197);
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

  gameState.enemyVelocity = 0.4;
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

    this.physics.add.collider(gameState.enemies, gameState.player, (enemy, player) => {
      gameState.active = false;
      gameState.websLoop.destroy();
      this.physics.pause();
      gameState.enemyVelocity = 1;
      gameState.score = 0;
      gameState.scoreText.setText(`Score: ${gameState.score}`);
      const catchedText = this.add.text(80, 250, 'They caught you!', { fontSize: '24px', fill: '#ffffff' });
      catchedText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
      const restartText = this.add.text(100, 280, 'Click to restart', { fontSize: '20px', fill: '#ffffff' });
      restartText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
    });

    if (numOfTotalEnemies() === 0) {
     /* const powerUpText = this.add.text(140, 250, 'Power Up!', { fontSize: '15px', fill: '#ffffff' });
      this.time.delayedCall(1000, () => {
        powerUpText.destroy(); // Destroy the text object 
        }); */
    } else if (gameState.score === 50) {
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
          const catchedText = this.add.text(80, 250, 'They caught you!', { fontSize: '24px', fill: '#ffffff' });
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

function newWidth(){
  if(window.innerWidth < 850){
    return window.innerWidth - 50
  }else{
    return 350
  } 
}


const config = {
  type: Phaser.AUTO,
  width: newWidth(),
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