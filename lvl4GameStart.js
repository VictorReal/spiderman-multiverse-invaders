class lvl4GameStart extends Phaser.Scene {
	constructor() {
		super({ key: 'lvl4GameStart' });
	}

	preload() {
		this.load.video('opening4', './media/videos/opening-lvl4.mp4');
		this.load.audio('backgroundMusic4', './media/sounds/theme-lvl4.mp3');    		
	}

	create() {
		this.backgroundMusic = this.sound.add('backgroundMusic4', { loop: true });    
    this.backgroundMusic.play();   
   
    const screenWidth = this.scale.width / 2;
    const videoSprite = this.add.video(screenWidth, 650, 'opening4').setScale(0.62);
    videoSprite.play(true);
    videoSprite.setLoop(false);

    videoSprite.on('complete', function () {
      this.backgroundMusic.pause();
      musicPosition = this.backgroundMusic.seek;
      this.scene.stop(); 
      this.scene.start('lvl4GameScene');
    }, this);
	}
}
