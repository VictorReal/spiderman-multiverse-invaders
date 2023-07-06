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
