const gameState = {
  score: 0,
  lives: 3,
  isPaused: false,
  
  speed: 240,
  ups: 380,
};
let musicPosition = 0;


  
function newWidth(){
  if(window.innerWidth < 850){
    return 884
  }else{
    return 350
  } 
}


const config = {
  type: Phaser.AUTO,
  width: newWidth(),
  height: 1830,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      enableBody: true,
    },
  },
  scene: [/*lvl0GameStart, lvl1GameStart,*/ lvl1GameScene, lvl2GameStart1, lvl2GameScene1, lvl2GameStart2, lvl2GameScene2,lvl3GameStart, lvl3GameScene1, lvl3GameScene2, lvl3GameScene3, lvl4GameStart, lvl4GameScene,lvlEnding],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.LEFT_TOP,
  },
  render: {
    antialias: true,
  },
  input: {
    activePointers: 2,
  },  
};

const game = new Phaser.Game(config);
