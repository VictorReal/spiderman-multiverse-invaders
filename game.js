const gameState = {
  score: 0,
  lives: 3,
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
  scene: [/*lvl0GameStart, lvl1GameStart, lvl1GameScene, lvl2GameStart, lvl2GameScene, lvl4GameStart,*/ lvl4GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
  },
  render: {
    antialias: true,
  },
  input: {
    activePointers: 2, // Set the maximum number of touch points
  },
  
};

const game = new Phaser.Game(config);
