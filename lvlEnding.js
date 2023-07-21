class lvlEnding extends Phaser.Scene {
	constructor() {
		super({ key: 'lvlEnding' });
	}

	preload() {
    this.load.video('ending1', './media/videos/ending-1.mp4');
    this.load.video('ending2', './media/videos/ending-2.mp4');
		this.load.audio('endingTheme1', './media/sounds/theme-lvl2-1.mp3');  
    this.load.audio('endingTheme2', './media/sounds/theme-lvl4.mp3');  
	}

	create() {
		this.endingTheme1 = this.sound.add('endingTheme1', { loop: true });    
    this.endingTheme1.play();

    this.endingTheme2 = this.sound.add('endingTheme2', { loop: true });     
   
    const screenWidth = this.scale.width / 2;
    const videoSprite1 = this.add.video(screenWidth, 300, 'ending1').setScale(0.19);
    videoSprite1.play(true);
    videoSprite1.setLoop(false);
    gameState.thankText = this.add.text(80, 120, `Thanks for playing!`, { fontSize: '20px', fill: '#ffffff' });
    gameState.finelText = this.add.text(120, 420, `The End!  `, { fontSize: '30px', fill: '#ffffff' });

    videoSprite1.on('complete', function () {
      this.endingTheme1.pause();
      musicPosition = this.endingTheme1.seek;
      videoSprite1.destroy();
      this.endingTheme2.play({ seek: musicPosition });
      
      const videoSprite2 = this.add.video(screenWidth, 280, 'ending2').setScale(0.8);
      videoSprite2.play(true);
      videoSprite2.setLoop(true);
      gameState.finelText = this.add.text(120, 420, `The End!??`, { fontSize: '30px', fill: '#ffffff' });
    }, this);
	}
}
