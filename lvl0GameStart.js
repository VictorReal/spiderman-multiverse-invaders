class lvl0GameStart extends Phaser.Scene {
	constructor() {
		super({ key: 'lvl0GameStart' });
	}

	preload() {
		this.load.image('poster', './media/general/poster.jpg');
		this.load.audio('backgroundMusic0', './media/sounds/thememenu.mp3');    		
	}

	create() {
		this.backgroundMusic = this.sound.add('backgroundMusic0', { loop: true });
    this.backgroundMusic.play();
    const background = this.add.image(-10, 40, 'poster');
		background.setOrigin(0, 0);
		background.setScale(0.5);

   
  

   this.add.text( 150, 250, 'Click to start!', {fill: '#000000', fontSize: '20px'})
		this.input.on('pointerdown', () => {
      this.backgroundMusic.stop();
			this.musicPosition === 0;
			this.scene.stop()
			this.scene.start('lvl1GameStart')
    });

    this.pauseText = this.add.text(40, 520, 'Click to Start Your Adventure', { fontSize: '16px'});
    this.pauseText.setStyle({ backgroundColor: '#000000', fill: '#ffffff', padding: 10 });
		
   
   /*
    const screenWidth = this.scale.width / 2;
    const videoSprite = this.add.video(screenWidth, 300, 'opening1').setScale(0.7);
    videoSprite.play(true);
    videoSprite.setLoop(false);

    videoSprite.on('complete', function () {
      this.backgroundMusic.pause();
    musicPosition = this.backgroundMusic.seek;
        this.scene.stop(); 
        this.scene.start('lvl1GameScene');
    }, this);*/
	}
}
