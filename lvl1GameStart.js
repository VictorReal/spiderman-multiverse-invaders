class lvl1GameStart extends Phaser.Scene {
	constructor() {
		super({ key: 'lvl1GameStart' });
	}

	preload() {
		this.load.video('opening1', './media/general/opening-lvl1.mp4');
		this.load.audio('backgroundMusic1', './media/sounds/theme-lvl1.mp3');    		
	}

	create() {
		this.backgroundMusic = this.sound.add('backgroundMusic1', { loop: true });
    if (musicPosition === 0) {
      this.backgroundMusic.play();
    } else {
      this.backgroundMusic.play({ seek: musicPosition });
    }
   
    const screenWidth = this.scale.width / 2;
    const videoSprite = this.add.video(screenWidth, 300, 'opening1').setScale(0.7);
    videoSprite.play(true);
    videoSprite.setLoop(false);

    videoSprite.on('complete', function () {
      this.backgroundMusic.pause();
    musicPosition = this.backgroundMusic.seek;
        this.scene.stop(); 
        this.scene.start('lvl1GameScene');
    }, this);
	}
}
