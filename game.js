const gameState = {
  score: 0,
  lives: 5,
  isPaused: false,
};
let musicPosition = 0;


  
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
  height: 680,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      enableBody: true,
    },
  },
  scene: [ lvl1GameScene, lvl2GameStart, lvl2GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
  },
  render: {
    antialias: true,
  },
  
};

const game = new Phaser.Game(config);
