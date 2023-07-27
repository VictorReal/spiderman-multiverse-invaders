class lvl2GameStart1 extends Phaser.Scene {
	constructor() {
		super({ key: 'lvl2GameStart1' });
	}

	preload() {
		this.load.video('opening2', './media/videos/opening-lvl2.mp4');
		this.load.audio('backgroundMusic2', './media/sounds/theme-lvl2.mp3');    		
	}

	create() {
		this.backgroundMusic = this.sound.add('backgroundMusic2', { loop: true });    
    this.backgroundMusic.play();   
   
    const screenWidth = this.scale.width / 2;
    const videoSprite = this.add.video(screenWidth, 650, 'opening2').setScale(1.7);
    videoSprite.play(true);
    videoSprite.setLoop(false);

    videoSprite.on('complete', function () {
      this.backgroundMusic.pause();
      musicPosition = this.backgroundMusic.seek;
      this.scene.stop(); 
      this.scene.start('lvl2GameScene1');
    }, this);
	}
}
