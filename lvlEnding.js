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
    const videoSprite1 = this.add.video(screenWidth, 650, 'ending1').setScale(0.48);
    videoSprite1.play(true);
    videoSprite1.setLoop(false);
    gameState.thankText = this.add.text(150, 220, `Thanks for playing!`, { fontSize: '56px', fill: '#ffffff' });
    gameState.finelText = this.add.text(300, 1000, `The End!  `, { fontSize: '72px', fill: '#ffffff' });

    videoSprite1.on('complete', function () {
      this.endingTheme1.pause();
      musicPosition = this.endingTheme1.seek;
      videoSprite1.destroy();
      this.endingTheme2.play({ seek: musicPosition });
      
      const videoSprite2 = this.add.video(screenWidth, 650, 'ending2').setScale(1.8);
      videoSprite2.play(true);
      videoSprite2.setLoop(true);
      gameState.finelText = this.add.text(300, 1000, `The End!??`, { fontSize: '72px', fill: '#ffffff' });
    }, this);
	}
}
