document.addEventListener('DOMContentLoaded', () => {
  const myAudio = document.getElementById('myAudio');


  myAudio.muted = false;


const musicToggleBtn = document.getElementById('music-btn');

musicToggleBtn.addEventListener('click', function() {
  if (myAudio.paused) {
      myAudio.play();
      musicToggleBtn.textContent = 'Pause Music';
  } else {
      myAudio.pause();
      musicToggleBtn.textContent = 'Play Music';
  }
});

myAudio.addEventListener('ended', function() {
  myAudio.currentTime = 0;
  myAudio.play();
});
});
