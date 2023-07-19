class lvl3GameStart extends Phaser.Scene {
	constructor() {
		super({ key: 'lvl3GameStart' });
	}

	preload() {
		this.load.video('opening3', './media/videos/opening-lvl3.mp4');
		this.load.audio('backgroundMusic3', './media/sounds/theme-lvl3.mp3');    		
	} 

	create() {
		this.backgroundMusic = this.sound.add('backgroundMusic3', { loop: true });    
    this.backgroundMusic.play();   
   
    const screenWidth = this.scale.width / 2;
    const videoSprite = this.add.video(screenWidth, 300, 'opening3').setScale(0.25);
    videoSprite.play(true);
    videoSprite.setLoop(false);

    videoSprite.on('complete', function () {
      this.backgroundMusic.pause();
      musicPosition = this.backgroundMusic.seek;
      this.scene.stop(); 
      this.scene.start('lvl3GameScene1');
    }, this);
	}
}
