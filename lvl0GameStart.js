class lvl0GameStart extends Phaser.Scene {
	constructor() {
		super({ key: 'lvl0GameStart' });
	}

	preload() {
		this.load.image('poster', './media/general/poster.jpg');
		this.load.audio('backgroundMusic0', './media/sounds/theme opening.mp3');   
    this.load.image('musicButton', './media/general/btn-music.svg'); 		
	}

	create() {
		this.backgroundMusic = this.sound.add('backgroundMusic0', { loop: true });
    this.backgroundMusic.play();

    const background = this.add.image(0, 90, 'poster');
		background.setOrigin(0, 0);
		background.setScale(1.21);

    const pauseText = this.add.text(110, 1170, '', { fontSize: '45px'});
    pauseText.setStyle({ backgroundColor: '#000000', fill: '#ffffff' });
    pauseText.setInteractive();
    pauseText.setPadding(3, 5);
    pauseText.setAlign('center');
    pauseText.setText([
      'Click here',
      'to Start Your Adventure'
    ]);
	  pauseText.on('pointerdown', () => {
      this.backgroundMusic.stop();
			this.musicPosition === 0;
			this.scene.stop()
			this.scene.start('lvl1GameStart')
    });

    const musicButton = this.add.image(60, 40, 'musicButton')
    .setInteractive()
    .setAlpha(0.9)
    .setScale(0.5);
    musicButton.on('pointerdown', () => {
      if (this.backgroundMusic.isPaused) {
        this.backgroundMusic.resume();
      } else {
        this.backgroundMusic.pause();
      }
    });
	}
}
