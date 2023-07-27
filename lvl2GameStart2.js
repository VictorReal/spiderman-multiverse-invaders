class lvl2GameStart2 extends Phaser.Scene {
	constructor() {
		super({ key: 'lvl2GameStart2' });
	}

	preload() {
		this.load.video('opening2-1', './media/videos/opening-lvl2-1.mp4');
		this.load.audio('backgroundMusic2', './media/sounds/theme-lvl2.mp3');    		
	}

	create() {
		this.backgroundMusic = this.sound.add('backgroundMusic2', { loop: true });
    if (musicPosition === 0) {
      this.backgroundMusic.play();
    } else {
      this.backgroundMusic.play({ seek: musicPosition });
    } 
   
    const screenWidth = this.scale.width / 2;
    const videoSprite = this.add.video(screenWidth, 650, 'opening2-1').setScale(0.48);
    videoSprite.play(true);
    videoSprite.setLoop(false);

    videoSprite.on('complete', function () {
      this.backgroundMusic.stop();
					this.musicPosition === 0;
      
      this.scene.stop(); 
      this.scene.start('lvl2GameScene2');
    }, this);
	}
}
