setTimeout(function() {
  const openingGifContainer = document.getElementById('opening-gif');
  openingGifContainer.remove();
  
  const gameContainer = document.getElementById('game-container');

  const gameScript = document.createElement('script');
  gameScript.src = 'game-lvl4.js';

  gameContainer.appendChild(gameScript);
}, 71);

document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('myAudio');
  audio.muted = false;
});


const musicToggleBtn = document.getElementById('music-btn');
const myAudio = document.getElementById('myAudio');

musicToggleBtn.addEventListener('click', function() {
  if (myAudio.paused) {
      myAudio.play();
      musicToggleBtn.textContent = 'Pause Music';
  } else {
      myAudio.pause();
      musicToggleBtn.textContent = 'Play Music';
  }
});
